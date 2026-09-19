import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CreateAdminForm } from "@/components/dashboard/districts/create-admin-form";
import { getCachedDistrictById } from "@/lib/data/districts";
import { requireAuth } from "@/lib/auth/current-user";

type CreateAdminPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CreateAdminPageProps): Promise<Metadata> {
  const { id } = await params;
  const district = await getCachedDistrictById(id);

  return {
    title: district?.name
      ? `Buat Admin ${district.name} - MDMC Bali`
      : "Buat Admin Daerah",
  };
}

export default async function CreateAdminPage({ params }: CreateAdminPageProps) {
  const { id } = await params;
  await requireAuth(["ADMIN_WILAYAH_BALI"]);

  const district = await getCachedDistrictById(id);

  if (!district) {
    notFound();
  }

  return (
    <CreateAdminForm
      districtCode={district.code}
      districtId={district.id}
      districtName={district.name}
    />
  );
}
