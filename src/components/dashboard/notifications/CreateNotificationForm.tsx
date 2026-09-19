"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Flame,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { createNotificationAction } from "@/app/admin/wilayah/notifications/actions";
import type { NotificationActionState } from "@/types/notification";

interface DistrictOption {
  id: string;
  name: string;
  code: string;
  type: string;
}

interface CreateNotificationFormProps {
  districts: DistrictOption[];
}

export function CreateNotificationForm({ districts }: CreateNotificationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [state, setState] = React.useState<NotificationActionState>({ success: false });

  const [targetType, setTargetType] = React.useState<"ALL" | "ADMIN_DAERAH" | "DISTRICT">("ALL");
  const [notifType, setNotifType] = React.useState<"INFORMASI" | "PERINGATAN" | "DARURAT">("INFORMASI");
  const [priority, setPriority] = React.useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await createNotificationAction({ success: false }, formData);
      setState(res);
      if (res.success) {
        setTimeout(() => {
          router.push("/admin/wilayah/notifications");
        }, 1200);
      }
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/wilayah/notifications"
          className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A]">Terbitkan Notifikasi Baru</h1>
          <p className="text-xs text-slate-500">
            Kirim pengumuman, peringatan bencana, atau instruksi siaga ke sistem MDMC Bali.
          </p>
        </div>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200 animate-in slide-in-from-top-2">
          <AlertCircle className="size-4 shrink-0 text-rose-600" />
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-in slide-in-from-top-2">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          <span>{state.message || "Notifikasi berhasil diterbitkan! Mengalihkan..."}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        {/* JUDUL */}
        <div className="space-y-1.5">
          <label htmlFor="title" className="text-xs font-bold text-slate-700">
            Judul Notifikasi <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Contoh: SIAGA DARURAT: Gempa Karangasem M5.2"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#124E8C] focus:ring-1 focus:ring-[#124E8C] outline-hidden transition-all"
          />
        </div>

        {/* PESAN */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="text-xs font-bold text-slate-700">
            Isi Pesan Notifikasi <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Tuliskan detail informasi, arahan posko, atau instruksi kesiapsiagaan relawan di sini..."
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#124E8C] focus:ring-1 focus:ring-[#124E8C] outline-hidden transition-all resize-y"
          />
        </div>

        {/* ROW 1: TIPE & PRIORITAS */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* TIPE NOTIFIKASI */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Tipe Notifikasi <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setNotifType("INFORMASI")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  notifType === "INFORMASI"
                    ? "bg-sky-50 border-[#124E8C] text-[#124E8C] font-bold shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Info className="size-4 mb-1" />
                <span className="text-[11px]">Informasi</span>
              </button>

              <button
                type="button"
                onClick={() => setNotifType("PERINGATAN")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  notifType === "PERINGATAN"
                    ? "bg-amber-50 border-amber-500 text-amber-800 font-bold shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <AlertTriangle className="size-4 mb-1 text-amber-600" />
                <span className="text-[11px]">Peringatan</span>
              </button>

              <button
                type="button"
                onClick={() => setNotifType("DARURAT")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  notifType === "DARURAT"
                    ? "bg-rose-50 border-rose-500 text-rose-800 font-bold shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Flame className="size-4 mb-1 text-rose-600" />
                <span className="text-[11px]">Darurat</span>
              </button>
            </div>
            <input type="hidden" name="type" value={notifType} />
          </div>

          {/* PRIORITAS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Tingkat Prioritas <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-3 px-1 rounded-xl border text-center text-xs font-mono transition-all ${
                    priority === p
                      ? "bg-[#0B1F3A] border-[#0B1F3A] text-white font-bold shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px]">{p}</span>
                </button>
              ))}
            </div>
            <input type="hidden" name="priority" value={priority} />
          </div>
        </div>

        {/* ROW 2: TARGET NOTIFIKASI */}
        <div className="space-y-3 border-t border-slate-100 pt-5">
          <label className="text-xs font-bold text-slate-700">
            Target Notifikasi <span className="text-rose-500">*</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label
              className={`flex items-center gap-2.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                targetType === "ALL"
                  ? "bg-sky-50/70 border-[#124E8C] text-[#124E8C] font-semibold"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="target_type"
                value="ALL"
                checked={targetType === "ALL"}
                onChange={() => setTargetType("ALL")}
                className="size-4 text-[#124E8C] focus:ring-[#124E8C]"
              />
              <span className="text-xs">Semua (Seluruh Bali)</span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                targetType === "ADMIN_DAERAH"
                  ? "bg-sky-50/70 border-[#124E8C] text-[#124E8C] font-semibold"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="target_type"
                value="ADMIN_DAERAH"
                checked={targetType === "ADMIN_DAERAH"}
                onChange={() => setTargetType("ADMIN_DAERAH")}
                className="size-4 text-[#124E8C] focus:ring-[#124E8C]"
              />
              <span className="text-xs">Hanya Admin Daerah</span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                targetType === "DISTRICT"
                  ? "bg-sky-50/70 border-[#124E8C] text-[#124E8C] font-semibold"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="target_type"
                value="DISTRICT"
                checked={targetType === "DISTRICT"}
                onChange={() => setTargetType("DISTRICT")}
                className="size-4 text-[#124E8C] focus:ring-[#124E8C]"
              />
              <span className="text-xs">Kabupaten/Kota Tertentu</span>
            </label>
          </div>

          {/* PILIH DISTRICT (JIKA TARGET = DISTRICT) */}
          {targetType === "DISTRICT" && (
            <div className="pt-2 animate-in fade-in-50 duration-200">
              <label htmlFor="target_district_id" className="text-xs font-bold text-slate-700 block mb-1.5">
                Pilih Kabupaten / Kota Sasaran <span className="text-rose-500">*</span>
              </label>
              {districts.length === 0 ? (
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  Belum ada daerah terdaftar di sistem. Daftarkan daerah terlebih dahulu pada modul Kabupaten/Kota.
                </p>
              ) : (
                <select
                  id="target_district_id"
                  name="target_district_id"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 bg-white focus:border-[#124E8C] focus:ring-1 focus:ring-[#124E8C] outline-hidden"
                >
                  <option value="">-- Pilih Daerah --</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.type === "KOTA" ? "Kota" : "Kabupaten"} {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* EXPIRES AT (OPTIONAL) */}
        <div className="space-y-1.5 border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between">
            <label htmlFor="expires_at" className="text-xs font-bold text-slate-700">
              Batas Waktu Tayang (Opsional)
            </label>
            <span className="text-[11px] text-slate-400">Kosongkan jika aktif tanpa batas waktu</span>
          </div>
          <div className="relative">
            <input
              id="expires_at"
              name="expires_at"
              type="datetime-local"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#124E8C] focus:ring-1 focus:ring-[#124E8C] outline-hidden"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <Link
            href="/admin/wilayah/notifications"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-[#124E8C] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0B1F3A] transition-all disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Menerbitkan...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Terbitkan Notifikasi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
