import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Plus, ShieldAlert, CheckCircle2, Radio } from "lucide-react";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import { NotificationTable } from "@/components/dashboard/notifications/NotificationTable";
import type { NotificationItem } from "@/types/notification";

export const metadata: Metadata = {
  title: "Manajemen Notifikasi - MDMC Bali",
};

export default async function WilayahNotificationsPage() {
  await requireAuth(["ADMIN_WILAYAH_BALI"]);
  const supabase = await createClient();

  // Query notifications with joined target_district (soft delete: deleted_at IS NULL)
  const { data: notificationsData } = await supabase
    .from("notifications")
    .select(`
      id,
      title,
      message,
      type,
      priority,
      target_type,
      target_district_id,
      is_active,
      created_by,
      created_at,
      expires_at,
      deleted_at,
      districts:target_district_id (
        name
      )
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  type RawNotification = NotificationItem & {
    districts?: { name: string } | null;
  };

  const notifications = ((notificationsData as unknown as RawNotification[]) || []).map((n) => ({
    ...n,
    target_district_name: n.districts?.name || null,
  })) as (NotificationItem & { target_district_name?: string | null })[];

  const totalCount = notifications.length;
  const activeCount = notifications.filter((n) => n.is_active).length;
  const emergencyCount = notifications.filter(
    (n) => n.is_active && (n.type === "DARURAT" || n.priority === "CRITICAL"),
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#124E8C] text-white">
              <Bell className="size-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#124E8C]">
              Pusat Komunikasi & Siaga
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] mt-1">
            Manajemen Notifikasi & Siaga
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pengumuman darurat, instruksi siaga bencana, dan broadcast informasi se-Bali.
          </p>
        </div>

        <Link
          href="/admin/wilayah/notifications/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#124E8C] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0B1F3A] transition-all shrink-0"
        >
          <Plus className="size-4" />
          <span>+ Buat Notifikasi</span>
        </Link>
      </div>

      {/* METRIC COUNTERS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">Total Notifikasi</span>
            <h3 className="text-2xl font-black text-[#0B1F3A] mt-1">{totalCount}</h3>
            <span className="text-[11px] text-slate-400">Arsip pengumuman aktif</span>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-50 text-[#124E8C]">
            <Radio className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">Notifikasi Tayang</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</h3>
            <span className="text-[11px] text-slate-400">Aktif ditampilkan di banner/lonceng</span>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">Status Darurat / Kritis</span>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{emergencyCount}</h3>
            <span className="text-[11px] text-slate-400">Peringatan bencana & siaga darurat</span>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <ShieldAlert className="size-5" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <NotificationTable notifications={notifications} />
    </div>
  );
}
