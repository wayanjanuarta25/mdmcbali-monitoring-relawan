import type { Metadata } from "next";
import { Users, UserCheck, UserX } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shell/page-header";
import { StatCard } from "@/components/dashboard/ui/stat-card";
import { AdminTable } from "@/components/dashboard/organization/AdminTable";
import type { MockAdminProfile } from "@/data/mock/organization";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Manajemen Admin Daerah - MDMC Bali",
};

export default async function AdminsPage() {
  await requireAuth(["ADMIN_WILAYAH_BALI"]);
  const supabase = await createClient();

  // Query profiles where role = 'ADMIN_DAERAH'
  const { data: dbAdmins } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      phone,
      is_active,
      district_id,
      created_at,
      districts (
        id,
        name,
        code
      )
    `)
    .eq("role", "ADMIN_DAERAH")
    .order("created_at", { ascending: false });

  const admins: MockAdminProfile[] = (dbAdmins || []).map((item) => {
    const districtInfo = item.districts as { name?: string } | null;
    return {
      id: item.id,
      full_name: item.full_name,
      email: item.email,
      phone: item.phone || "-",
      is_active: item.is_active,
      district_id: item.district_id,
      district_name: districtInfo?.name || "Daerah Bali",
      created_at: item.created_at,
    };
  });

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter((a) => a.is_active).length;
  const inactiveAdmins = admins.filter((a) => !a.is_active).length;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* HEADER */}
      <PageHeader
        eyebrow="MDMC PROVINSI BALI"
        title="Manajemen Admin Daerah"
        description="Kelola akun dan status penugasan administrator daerah seluruh Bali"
        scopeBadge="Scope: Bali"
        breadcrumbs={[
          { label: "Dashboard Wilayah", href: "/admin/wilayah" },
          { label: "Admin Daerah" },
        ]}
      />

      {/* 3 SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Admin"
          value={totalAdmins}
          icon={<Users className="size-5 text-[#124E8C]" />}
          subtitle="Administrator terdaftar di sistem"
        />

        <StatCard
          title="Admin Aktif"
          value={activeAdmins}
          icon={<UserCheck className="size-5 text-emerald-600" />}
          subtitle="Memiliki hak akses operasional"
          badge="Aktif"
        />

        <StatCard
          title="Admin Nonaktif"
          value={inactiveAdmins}
          icon={<UserX className="size-5 text-slate-500" />}
          subtitle="Akun dinonaktifkan / ditangguhkan"
          trend={inactiveAdmins > 0 ? "Perlu Ditinjau" : "Semua Aktif"}
          trendDirection={inactiveAdmins > 0 ? "down" : "up"}
        />
      </div>

      {/* TABLE */}
      <AdminTable admins={admins} />
    </div>
  );
}
