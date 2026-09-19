import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { CreateVolunteerForm } from "@/components/dashboard/volunteers/CreateVolunteerForm";
import { requireAuth } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Tambah Relawan Baru - MDMC Daerah",
};

export default async function CreateVolunteerPage() {
  const profile = await requireAuth(["ADMIN_DAERAH", "ADMIN_WILAYAH_BALI"]);

  const district = profile.district || profile.districts;
  const districtName = district?.name || "Daerah";
  const typeLabel = district?.type === "KOTA" ? "Kota" : "Kabupaten";

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <PageHeader
        eyebrow="PORTAL MDMC DAERAH"
        title="Tambah Relawan Baru"
        description={`Pendaftaran anggota relawan kesiapsiagaan bencana baru di ${typeLabel} ${districtName}`}
        scopeBadge={`${typeLabel} ${districtName}`}
        breadcrumbs={[
          { label: "Dashboard Daerah", href: "/admin/daerah" },
          { label: "Data Relawan", href: "/admin/daerah/volunteers" },
          { label: "Tambah Relawan" },
        ]}
      />

      <div className="max-w-3xl">
        <CreateVolunteerForm districtName={`${typeLabel} ${districtName}`} />
      </div>
    </div>
  );
}
