import type { Metadata } from "next";

import {
  DistrictProfileView,
  type DistrictProfileData,
} from "@/components/dashboard/districts/district-profile-view";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import type { DistrictInfo } from "@/types/auth";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await requireAuth(["ADMIN_DAERAH", "ADMIN_WILAYAH_BALI"]);
  const district = profile.district || profile.districts;
  return {
    title: district?.name
      ? `Profil ${district.name} - MDMC Daerah`
      : "Profil Wilayah - MDMC Daerah",
  };
}

export default async function DistrictProfilePage() {
  const profile = await requireAuth(["ADMIN_DAERAH", "ADMIN_WILAYAH_BALI"]);
  const supabase = await createClient();

  let district: DistrictInfo | null = profile.district || profile.districts || null;

  if (!district && profile.district_id) {
    const { data: dbDistrict } = await supabase
      .from("districts")
      .select("id, name, code, type")
      .eq("id", profile.district_id)
      .maybeSingle();

    if (dbDistrict) {
      district = dbDistrict as DistrictInfo;
    }
  }

  const districtData: DistrictProfileData = {
    districtName: district?.name || "Wilayah MDMC Bali",
    districtCode: district?.code || "BALI-WLY",
    districtType: district?.type || "KABUPATEN",
    adminName: profile.full_name,
    adminEmail: profile.email,
    adminPhone: profile.phone || "-",
    isActive: profile.is_active,
  };

  return <DistrictProfileView districtData={districtData} profile={profile} />;
}
