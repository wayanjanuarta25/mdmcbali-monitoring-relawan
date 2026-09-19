import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DistrictDetailCard } from "@/components/dashboard/organization/DistrictDetailCard";
import type { MockDistrictItem } from "@/data/mock/organization";
import { getCachedDistrictById } from "@/lib/data/districts";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

type DistrictDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: DistrictDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const district = await getCachedDistrictById(id);

  return {
    title: district?.name
      ? `${district.name} - Detail Daerah MDMC Bali`
      : "Detail Daerah",
  };
}

export default async function DistrictDetailPage({
  params,
}: DistrictDetailPageProps) {
  const { id } = await params;
  await requireAuth(["ADMIN_WILAYAH_BALI"]);

  // 1. Fetch cached district (uses Next.js unstable_cache)
  const targetDistrict = await getCachedDistrictById(id);

  if (!targetDistrict) {
    notFound();
  }

  const supabase = await createClient();

  // 2. Fetch assigned ADMIN_DAERAH profile
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, is_active")
    .eq("district_id", id)
    .eq("role", "ADMIN_DAERAH")
    .maybeSingle();

  // 3. Count volunteers
  const { count: volunteerCount } = await supabase
    .from("volunteers")
    .select("id", { count: "exact", head: true })
    .eq("district_id", id);

  const hasAdmin = Boolean(adminProfile);

  const district: MockDistrictItem = {
    id: targetDistrict.id,
    name: targetDistrict.name,
    code: targetDistrict.code,
    type: targetDistrict.type,
    created_at: targetDistrict.created_at,
    adminProfile: adminProfile
      ? {
          id: adminProfile.id,
          full_name: adminProfile.full_name,
          email: adminProfile.email,
          phone: adminProfile.phone || "",
          is_active: adminProfile.is_active,
          district_id: targetDistrict.id,
          district_name: targetDistrict.name,
        }
      : null,
    volunteerCount:
      volunteerCount !== null && volunteerCount !== undefined
        ? volunteerCount
        : 0,
    status: hasAdmin ? "ACTIVE" : "BELUM DIKELOLA",
  };

  return <DistrictDetailCard district={district} />;
}
