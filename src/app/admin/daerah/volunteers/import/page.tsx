import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { ImportVolunteerView } from "@/components/dashboard/volunteers/ImportVolunteerView";
import { requireAuth } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Import Data Relawan - MDMC Daerah",
  description: "Import data relawan massal dari file spreadsheet Excel ke database MDMC Daerah",
};

export default async function ImportVolunteersPage() {
  const profile = await requireAuth(["ADMIN_DAERAH", "ADMIN_WILAYAH_BALI"]);

  // Only ADMIN_DAERAH can import volunteers
  if (profile.role !== "ADMIN_DAERAH") {
    redirect("/admin/daerah/volunteers");
  }

  const district = profile.district || profile.districts;
  const districtName = district?.name || "Daerah";
  const typeLabel = district?.type === "KOTA" ? "Kota" : "Kabupaten";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MANAJEMEN RELAWAN"
        title="Import Data Relawan"
        description={`Unggah berkas spreadsheet Excel untuk mendaftarkan personil relawan secara massal di ${typeLabel} ${districtName}.`}
        scopeBadge={`${typeLabel} ${districtName}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/daerah" },
          { label: "Data Relawan", href: "/admin/daerah/volunteers" },
          { label: "Import Excel" },
        ]}
      />

      <ImportVolunteerView districtName={`${typeLabel} ${districtName}`} />
    </div>
  );
}
