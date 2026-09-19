import type { Metadata } from "next";

import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import type {
  DistrictDistribution,
  GenderRatio,
  DistrictStatusItem,
  ActivityItem,
} from "@/data/mock/dashboard";
import type { NotificationItem } from "@/types/notification";

export const metadata: Metadata = { title: "Dashboard Wilayah Bali" };

function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Baru saja";
    if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  } catch {
    return "Baru saja";
  }
}

export default async function WilayahPage() {
  const profile = await requireAuth(["ADMIN_WILAYAH_BALI"]);
  const supabase = await createClient();

  // 1. Fetch live data concurrently from Supabase
  const [
    districtsRes,
    adminsRes,
    volunteersRes,
    activeNotifRes,
    auditLogsRes,
  ] = await Promise.all([
    // All districts
    supabase
      .from("districts")
      .select("id, name, code, type, status, created_at")
      .order("name", { ascending: true }),

    // Active Admin Daerah profiles
    supabase
      .from("profiles")
      .select("id, full_name, email, district_id")
      .eq("role", "ADMIN_DAERAH")
      .eq("is_active", true),

    // All volunteers (id, district_id, gender)
    supabase
      .from("volunteers")
      .select("id, district_id, gender, status"),

    // Latest active, non-deleted, unexpired notification for header
    supabase
      .from("notifications")
      .select("id, title, message, type, priority, target_type, target_district_id, is_active, created_at, expires_at, deleted_at")
      .eq("is_active", true)
      .is("deleted_at", null)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    // Latest audit logs
    supabase
      .from("audit_logs")
      .select("id, user_id, action, target_type, description, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const districts = districtsRes.data || [];
  const admins = adminsRes.data || [];
  const volunteers = volunteersRes.data || [];
  const activeNotification = (activeNotifRes.data as unknown as NotificationItem) || null;
  const auditLogs = auditLogsRes.data || [];

  const districtCount = districts.length;
  const adminCount = admins.length;
  const volunteerCount = volunteers.length;

  // Map volunteers count per district
  const volunteerCountByDistrict: Record<string, number> = {};
  for (const v of volunteers) {
    if (v.district_id) {
      volunteerCountByDistrict[v.district_id] = (volunteerCountByDistrict[v.district_id] || 0) + 1;
    }
  }

  // Map admin by district
  const adminByDistrict: Record<string, string> = {};
  for (const adm of admins) {
    if (adm.district_id) {
      adminByDistrict[adm.district_id] = adm.full_name || adm.email;
    }
  }

  // Build districtStatuses table data (empty array if 0 districts)
  const districtStatuses: DistrictStatusItem[] = districts.map((d) => {
    const adminName = adminByDistrict[d.id] || "Belum Ada Admin";
    const count = volunteerCountByDistrict[d.id] || 0;
    return {
      id: d.id,
      district: d.name,
      districtCode: d.code,
      admin: adminName,
      relawan: count,
      status: adminByDistrict[d.id] ? "Aktif" : "Belum Aktif",
    };
  });

  // Build volunteerDistribution for BarChart (empty array if 0 districts)
  const volunteerDistribution: DistrictDistribution[] = districts.map((d) => ({
    district: d.name,
    count: volunteerCountByDistrict[d.id] || 0,
  }));

  // Build genderStats for DonutChart (empty array if 0 volunteers)
  let genderStats: GenderRatio[] = [];
  if (volunteers.length > 0) {
    const male = volunteers.filter(
      (v) => v.gender === "L" || v.gender === "Laki-laki"
    ).length;
    const female = volunteers.filter(
      (v) => v.gender === "P" || v.gender === "Perempuan"
    ).length;
    const malePct = Math.round((male / volunteers.length) * 100);
    const femalePct = 100 - malePct;

    genderStats = [
      { name: "Laki-laki", percentage: malePct, count: male, color: "#124E8C" },
      { name: "Perempuan", percentage: femalePct, count: female, color: "#0B1F3A" },
    ];
  }

  // Build recentActivities from audit_logs (empty array if 0 logs)
  const recentActivities: ActivityItem[] = auditLogs.map((log) => {
    let type: ActivityItem["type"] = "update";
    if (log.action?.includes("ADMIN")) type = "admin";
    else if (log.action?.includes("VOLUNTEER")) type = "volunteer";
    else if (log.action?.includes("NOTIFICATION")) type = "alert";

    return {
      id: log.id,
      title: log.action ? log.action.replace(/_/g, " ") : "Aktivitas Sistem",
      description: log.description || `Tindakan ${log.action} pada ${log.target_type}`,
      timestamp: formatTimeAgo(log.created_at),
      type,
    };
  });

  return (
    <RoleDashboard
      description="Ruang kerja pengurus wilayah Bali untuk mengawasi kabupaten/kota dan relawan."
      eyebrow="MDMC Wilayah Bali"
      profile={profile}
      scopeLabel="Provinsi Bali"
      title="Dashboard Wilayah Bali"
      districtCount={districtCount}
      adminCount={adminCount}
      volunteerCount={volunteerCount}
      districtStatuses={districtStatuses}
      volunteerDistribution={volunteerDistribution}
      genderStats={genderStats}
      activeNotification={activeNotification}
      recentActivities={recentActivities}
    />
  );
}


