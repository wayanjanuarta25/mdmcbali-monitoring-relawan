import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminProfileCard } from "@/components/dashboard/organization/AdminProfileCard";
import { adminMockData, type MockAdminProfile } from "@/data/mock/organization";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

type AdminDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", id)
    .maybeSingle();

  const mock = adminMockData.find((a) => a.id === id);
  const name = data?.full_name || mock?.full_name;

  return {
    title: name ? `${name} - Detail Administrator` : "Detail Administrator",
  };
}

export default async function AdminDetailPage({
  params,
}: AdminDetailPageProps) {
  const { id } = await params;
  await requireAuth(["ADMIN_WILAYAH_BALI"]);

  const supabase = await createClient();

  // Query profile from DB
  const { data: dbAdmin } = await supabase
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
    .eq("id", id)
    .maybeSingle();

  const mockAdmin = adminMockData.find((a) => a.id === id);

  if (!dbAdmin && !mockAdmin) {
    notFound();
  }

  const admin: MockAdminProfile = dbAdmin
    ? {
        id: dbAdmin.id,
        full_name: dbAdmin.full_name,
        email: dbAdmin.email,
        phone: dbAdmin.phone || "-",
        is_active: dbAdmin.is_active,
        district_id: dbAdmin.district_id,
        district_name:
          (dbAdmin.districts as { name?: string } | null)?.name || "Daerah Bali",
        created_at: dbAdmin.created_at,
      }
    : mockAdmin!;

  return <AdminProfileCard admin={admin} />;
}
