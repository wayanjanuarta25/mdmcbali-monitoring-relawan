import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/current-user";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { CreateDistrictForm } from "@/components/dashboard/districts/create-district-form";

export const metadata: Metadata = {
  title: "Tambah Daerah - MDMC Wilayah Bali",
  description: "Formulir pendaftaran daerah otonomi / wilayah kerja baru MDMC Bali",
};

export default async function CreateDistrictPage() {
  await requireAuth(["ADMIN_WILAYAH_BALI"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MANAJEMEN WILAYAH"
        title="Tambah Daerah Baru"
        description="Daftarkan Kabupaten atau Kota baru dalam struktur organisasi MDMC Wilayah Bali."
        scopeBadge="Wilayah Bali"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/wilayah" },
          { label: "Daftar Wilayah", href: "/admin/wilayah/districts" },
          { label: "Tambah Daerah" },
        ]}
      />

      <CreateDistrictForm />
    </div>
  );
}
