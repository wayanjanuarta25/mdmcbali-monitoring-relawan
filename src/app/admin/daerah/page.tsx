import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import {
  DaerahDashboardView,
  type DaerahVolunteerStats,
} from "@/components/dashboard/daerah/daerah-dashboard-view";
import type { DistrictInfo } from "@/types/auth";
import type { NotificationItem } from "@/types/notification";
import type { GenderRatio, AgeDistribution } from "@/data/mock/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await requireAuth(["ADMIN_WILAYAH_BALI", "ADMIN_DAERAH"]);
  const district = profile.district || profile.districts;
  if (district?.name) {
    const typeLabel = district.type === "KOTA" ? "Kota" : "Kabupaten";
    return {
      title: `MDMC ${typeLabel} ${district.name} - Dashboard`,
    };
  }
  return {
    title: "Dashboard Daerah - MDMC Bali",
  };
}

export default async function DaerahPage() {
  const profile = await requireAuth(["ADMIN_WILAYAH_BALI", "ADMIN_DAERAH"]);
  const supabase = await createClient();

  let district: DistrictInfo | null = profile.district || profile.districts || null;

  // Fallback query if district relation was not automatically resolved
  if (!district && profile.district_id) {
    const { data: districtData } = await supabase
      .from("districts")
      .select("id, name, code, type")
      .eq("id", profile.district_id)
      .maybeSingle();

    if (districtData) {
      district = districtData as DistrictInfo;
    }
  }

  // Fetch real volunteer stats from DB
  let stats: DaerahVolunteerStats | null = null;
  let activeNotification: NotificationItem | null = null;
  const targetDistrictId = profile.district_id || district?.id;

  if (targetDistrictId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // 1. Concurrent queries for counts, details, and notification
    const [
      { count: totalCount },
      { count: activeCount },
      { count: newCount },
      { data: recentData },
      { data: allVolunteers },
      { data: activeNotifData },
    ] = await Promise.all([
      supabase
        .from("volunteers")
        .select("id", { count: "exact", head: true })
        .eq("district_id", targetDistrictId),

      supabase
        .from("volunteers")
        .select("id", { count: "exact", head: true })
        .eq("district_id", targetDistrictId)
        .eq("status", "ACTIVE"),

      supabase
        .from("volunteers")
        .select("id", { count: "exact", head: true })
        .eq("district_id", targetDistrictId)
        .gte("created_at", startOfMonth),

      supabase
        .from("volunteers")
        .select("id, name, gender, age, status, phone, created_at")
        .eq("district_id", targetDistrictId)
        .order("created_at", { ascending: false })
        .limit(6),

      supabase
        .from("volunteers")
        .select("gender, age")
        .eq("district_id", targetDistrictId),

      supabase
        .from("notifications")
        .select("id, title, message, type, priority, target_type, target_district_id, is_active, created_at, expires_at, deleted_at")
        .eq("is_active", true)
        .is("deleted_at", null)
        .or(`expires_at.is.null,expires_at.gt.${now.toISOString()}`)
        .or(`target_type.eq.ALL,target_type.eq.ADMIN_DAERAH,and(target_type.eq.DISTRICT,target_district_id.eq.${targetDistrictId})`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    activeNotification = (activeNotifData as unknown as NotificationItem) || null;

    // Calculate real gender stats
    const vols = allVolunteers || [];
    const totalVols = vols.length;
    let genderRatio: GenderRatio[] = [];
    let ageDistribution: AgeDistribution[] = [];

    if (totalVols > 0) {
      const male = vols.filter((v) => v.gender === "L" || v.gender === "Laki-laki").length;
      const female = vols.filter((v) => v.gender === "P" || v.gender === "Perempuan").length;
      const malePct = Math.round((male / totalVols) * 100);
      const femalePct = 100 - malePct;

      genderRatio = [
        { name: "Laki-laki", percentage: malePct, count: male, color: "#124E8C" },
        { name: "Perempuan", percentage: femalePct, count: female, color: "#0EA5E9" },
      ];

      // Calculate real age stats
      let age18to25 = 0;
      let age26to40 = 0;
      let age40plus = 0;

      for (const v of vols) {
        const age = v.age;
        if (!age) continue;
        if (age <= 25) age18to25++;
        else if (age <= 40) age26to40++;
        else age40plus++;
      }

      ageDistribution = [
        {
          range: "18-25 Tahun",
          percentage: totalVols > 0 ? Math.round((age18to25 / totalVols) * 100) : 0,
          count: age18to25,
          color: "#0EA5E9",
        },
        {
          range: "26-40 Tahun",
          percentage: totalVols > 0 ? Math.round((age26to40 / totalVols) * 100) : 0,
          count: age26to40,
          color: "#124E8C",
        },
        {
          range: "40+ Tahun",
          percentage: totalVols > 0 ? Math.round((age40plus / totalVols) * 100) : 0,
          count: age40plus,
          color: "#0B1F3A",
        },
      ];
    }

    stats = {
      totalVolunteers: totalCount ?? 0,
      activeVolunteers: activeCount ?? 0,
      newVolunteers: newCount ?? 0,
      genderRatio,
      ageDistribution,
      recentVolunteers: (recentData || []).map((v) => ({
        id: v.id,
        name: v.name,
        gender: v.gender || "Laki-laki",
        age: v.age || null,
        status: v.status || "Aktif",
        role: "Relawan Kesiapsiagaan",
        phone: v.phone || "-",
      })),
    };
  }

  return (
    <DaerahDashboardView
      profile={profile}
      district={district}
      stats={stats}
      activeNotification={activeNotification}
    />
  );
}
