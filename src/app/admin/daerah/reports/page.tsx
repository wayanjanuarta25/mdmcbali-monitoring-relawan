import type { Metadata } from "next";
import { Users, Activity, ShieldCheck, FileText } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shell/page-header";
import { StatCard } from "@/components/dashboard/ui/stat-card";
import { OrganizationEmptyState } from "@/components/dashboard/organization/OrganizationEmptyState";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Laporan Daerah - MDMC Daerah",
};

export default async function DaerahReportsPage() {
  const profile = await requireAuth(["ADMIN_DAERAH", "ADMIN_WILAYAH_BALI"]);
  const supabase = await createClient();

  // Volunteer count for current district
  let volunteerCount = 0;
  if (profile.district_id) {
    const { count } = await supabase
      .from("volunteers")
      .select("id", { count: "exact", head: true })
      .eq("district_id", profile.district_id);

    if (count !== null && count !== undefined) {
      volunteerCount = count;
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <PageHeader
        eyebrow="PORTAL MDMC DAERAH"
        title="Laporan Daerah"
        description="Rekapitulasi berkala kegiatan, personil, dan kesiapsiagaan bencana daerah"
        scopeBadge="Laporan Daerah"
        breadcrumbs={[
          { label: "Dashboard Daerah", href: "/admin/daerah" },
          { label: "Laporan" },
        ]}
      />

      {/* 3 CARDS: JUMLAH RELAWAN, AKTIVITAS, KESIAPSIAGAAN */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Jumlah Relawan"
          value={volunteerCount}
          icon={<Users className="size-5 text-sky-600" />}
          subtitle="Personil relawan terdata di daerah"
        />

        <StatCard
          title="Aktivitas"
          value="3 Kegiatan"
          icon={<Activity className="size-5 text-[#124E8C]" />}
          subtitle="Giat operasi & mitigasi bulan ini"
          trend="Stabil"
          trendDirection="up"
        />

        <StatCard
          title="Kesiapsiagaan"
          value="Siaga 1"
          icon={<ShieldCheck className="size-5 text-emerald-600" />}
          subtitle="Status Posko Darurat Normal"
          badge="Aman"
        />
      </div>

      {/* EMPTY STATE */}
      <OrganizationEmptyState
        icon={<FileText className="size-8" />}
        title="Modul laporan sedang dalam pengembangan"
        description="Fitur pelaporan bulanan otomatis, cetak rekap logistik kebencanaan, dan integrasi laporan insiden darurat ke MDMC Wilayah Bali sedang disiapkan pada fase berikutnya."
        badge="IN DEVELOPMENT"
        actionButtonText="Coming Soon"
      />
    </div>
  );
}
