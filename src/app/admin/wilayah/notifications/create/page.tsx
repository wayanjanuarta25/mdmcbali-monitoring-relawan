import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import { CreateNotificationForm } from "@/components/dashboard/notifications/CreateNotificationForm";

export const metadata: Metadata = {
  title: "Buat Notifikasi Baru - MDMC Bali",
};

export default async function CreateNotificationPage() {
  await requireAuth(["ADMIN_WILAYAH_BALI"]);
  const supabase = await createClient();

  // Fetch districts list for target dropdown
  const { data: districts } = await supabase
    .from("districts")
    .select("id, name, code, type")
    .order("name", { ascending: true });

  return (
    <div className="py-2">
      <CreateNotificationForm districts={districts || []} />
    </div>
  );
}
