import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shell/page-header";
import { OrganizationEmptyState } from "@/components/dashboard/organization/OrganizationEmptyState";
import { requireAuth } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Laporan MDMC Bali - MDMC Wilayah",
};

export default async function WilayahReportsPage() {
  await requireAuth(["ADMIN_WILAYAH_BALI"]);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <PageHeader
        eyebrow="MDMC PROVINSI BALI"
        title="Laporan MDMC Bali"
        description="Pusat pelaporan berkala kegiatan kemanusiaan dan mitigasi bencana wilayah Bali"
        scopeBadge="Scope: Bali"
        breadcrumbs={[
          { label: "Dashboard Wilayah", href: "/admin/wilayah" },
          { label: "Laporan" },
        ]}
      />

      <OrganizationEmptyState
        icon={<FileText className="size-8" />}
        title="Modul Reporting tersedia pada Phase 6"
        description="Fitur rekapitulasi data relawan, laporan kejadian darurat bencana, evaluasi tanggap kebencanaan daerah, dan ekspor laporan PDF/Excel resmi akan dihadirkan pada Phase 6."
        badge="PHASE 6"
        actionButtonText="Coming Soon"
      />
    </div>
  );
}
