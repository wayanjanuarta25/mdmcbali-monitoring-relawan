import type { Metadata } from "next";
import Link from "next/link";
import { Building2, UserCheck, UserX, Users, Plus } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shell/page-header";
import { StatCard } from "@/components/dashboard/ui/stat-card";
import { DistrictTable } from "@/components/dashboard/organization/DistrictTable";
import { buttonVariants } from "@/components/ui/button";
import type { MockDistrictItem } from "@/data/mock/organization";
import { getCachedDistricts } from "@/lib/data/districts";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Kabupaten/Kota MDMC Bali - MDMC System",
};

type ProfileItem = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  is_active: boolean;
  district_id?: string | null;
};

export default async function DistrictsPage() {
  await requireAuth(["ADMIN_WILAYAH_BALI"]);
  const supabase = await createClient();

  // 1. Fetch cached districts from database
  const rawDistricts = await getCachedDistricts();

  // 2. Query admin profiles for districts
  const { data: rawProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, is_active, district_id")
    .eq("role", "ADMIN_DAERAH");

  // 3. Query volunteer counts per district
  const { data: rawVolunteers } = await supabase
    .from("volunteers")
    .select("district_id");

  const volunteerCountMap = new Map<string, number>();
  (rawVolunteers || []).forEach((v) => {
    if (v.district_id) {
      volunteerCountMap.set(
        v.district_id,
        (volunteerCountMap.get(v.district_id) || 0) + 1,
      );
    }
  });

  const profileMap = new Map<string, ProfileItem>();
  (rawProfiles || []).forEach((p: ProfileItem) => {
    if (p.district_id) {
      profileMap.set(p.district_id, p);
    }
  });

  // Map database districts to table items (no mock fallback)
  const districts: MockDistrictItem[] = (rawDistricts || []).map((d) => {
    const admin = profileMap.get(d.id) || null;
    const count = volunteerCountMap.get(d.id) || 0;
    return {
      id: d.id,
      name: d.name,
      code: d.code,
      type: d.type as "KABUPATEN" | "KOTA",
      created_at: d.created_at,
      adminProfile: admin
        ? {
            id: admin.id,
            full_name: admin.full_name,
            email: admin.email,
            phone: admin.phone || "",
            is_active: admin.is_active,
            district_id: d.id,
            district_name: d.name,
          }
        : null,
      volunteerCount: count,
      status: admin ? "ACTIVE" : "BELUM DIKELOLA",
    };
  });

  // Summary statistics
  const totalDistricts = districts.length;
  const kabupatenCount = districts.filter((d) => d.type === "KABUPATEN").length;
  const kotaCount = districts.filter((d) => d.type === "KOTA").length;

  const activeAdmins = districts.filter(
    (d) => d.adminProfile && d.adminProfile.is_active,
  ).length;
  const unassignedDistricts = districts.filter((d) => !d.adminProfile).length;
  const totalVolunteers = districts.reduce(
    (acc, curr) => acc + (curr.volunteerCount || 0),
    0,
  );

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* HEADER */}
      <PageHeader
        eyebrow="MDMC PROVINSI BALI"
        title="Kabupaten/Kota MDMC Bali"
        description="Kelola wilayah kerja dan administrator daerah"
        scopeBadge="Scope: Bali"
        breadcrumbs={[
          { label: "Dashboard Wilayah", href: "/admin/wilayah" },
          { label: "Kabupaten/Kota" },
        ]}
        actions={
          <Link
            href="/admin/wilayah/districts/create"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "bg-[#0B1F3A] hover:bg-[#124E8C] text-white font-semibold text-xs px-4 h-9 shadow-xs",
            })}
          >
            <Plus className="mr-1.5 size-4 text-amber-300" />
            Tambah Daerah
          </Link>
        }
      />

      {/* 4 SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Kabupaten/Kota"
          value={totalDistricts}
          icon={<Building2 className="size-5" />}
          subtitle={
            totalDistricts > 0
              ? `${kabupatenCount} Kabupaten, ${kotaCount} Kota`
              : "Belum ada wilayah terdaftar"
          }
          trend={totalDistricts > 0 ? `${totalDistricts} Wilayah` : "Kosong"}
          trendDirection={totalDistricts > 0 ? "up" : "down"}
        />

        <StatCard
          title="Admin Daerah Aktif"
          value={activeAdmins}
          icon={<UserCheck className="size-5 text-emerald-600" />}
          subtitle="Pengurus daerah aktif bertugas"
          badge="Aktif"
        />

        <StatCard
          title="Belum Memiliki Admin"
          value={unassignedDistricts}
          icon={<UserX className="size-5 text-amber-600" />}
          subtitle="Memerlukan penugasan admin"
          trend={unassignedDistricts > 0 ? "Perlu Penugasan" : "Lengkap"}
          trendDirection={unassignedDistricts > 0 ? "down" : "up"}
        />

        <StatCard
          title="Total Relawan Bali"
          value={totalVolunteers}
          icon={<Users className="size-5 text-sky-600" />}
          subtitle="Relawan terdata se-Bali"
        />
      </div>

      {/* DISTRICT TABLE */}
      <DistrictTable districts={districts} />
    </div>
  );
}

