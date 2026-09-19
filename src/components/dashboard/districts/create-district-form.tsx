"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Tag,
  Building2,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  PlusCircle,
  ToggleLeft,
  Loader2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { createDistrictAction, type ActionState } from "@/app/admin/wilayah/districts/actions";

const initialState: ActionState = {};

export function CreateDistrictForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createDistrictAction,
    initialState,
  );

  React.useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push("/admin/wilayah/districts");
        router.refresh();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-in fade-in-50 duration-300">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#124E8C] p-6 text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-sky-200 border border-white/15 shrink-0">
            <PlusCircle className="size-6 text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider">
              Wilayah Administrasi Baru
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Tambah Daerah
            </h2>
          </div>
        </div>

        <Link
          href="/admin/wilayah/districts"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className:
              "self-start sm:self-auto border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white",
          })}
        >
          <ArrowLeft className="mr-2 size-4" />
          Kembali
        </Link>
      </div>

      {/* FEEDBACK ALERTS */}
      {state.error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 animate-in slide-in-from-top-2">
          <ShieldAlert className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-rose-900">Gagal Menambahkan Daerah</p>
            <p className="mt-0.5 text-rose-700">{state.error}</p>
          </div>
        </div>
      )}

      {state.success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 animate-in slide-in-from-top-2">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-900">Wilayah Berhasil Dibuat</p>
            <p className="mt-0.5 text-emerald-700">
              {state.message} Mengalihkan ke daftar wilayah...
            </p>
          </div>
        </div>
      )}

      {/* FORM CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <form action={formAction} className="space-y-6">
          {/* NAME */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
            >
              <MapPin className="size-3.5 text-slate-500" />
              Nama Kabupaten / Kota <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Contoh: Badung, Denpasar, Buleleng"
              disabled={pending || state.success}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium"
            />
            <p className="text-[11px] text-slate-500">
              Nama resmi daerah tingkat II (Kabupaten atau Kota).
            </p>
          </div>

          {/* CODE & TYPE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CODE */}
            <div className="space-y-1.5">
              <label
                htmlFor="code"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
              >
                <Tag className="size-3.5 text-slate-500" />
                Kode Wilayah <span className="text-rose-500">*</span>
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={10}
                placeholder="Contoh: BDG, DPS, BLL"
                disabled={pending || state.success}
                className="w-full uppercase tracking-wider font-mono rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              />
              <p className="text-[11px] text-slate-500">
                Kode singkatan unik untuk identifikasi daerah.
              </p>
            </div>

            {/* TYPE */}
            <div className="space-y-1.5">
              <label
                htmlFor="type"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
              >
                <Building2 className="size-3.5 text-slate-500" />
                Tipe Administrasi <span className="text-rose-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                required
                defaultValue="KABUPATEN"
                disabled={pending || state.success}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium"
              >
                <option value="KABUPATEN">Kabupaten</option>
                <option value="KOTA">Kota</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Status hukum otonomi daerah.
              </p>
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-1.5">
            <label
              htmlFor="status"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
            >
              <ToggleLeft className="size-3.5 text-slate-500" />
              Status Operasional
            </label>
            <select
              id="status"
              name="status"
              defaultValue="ACTIVE"
              disabled={pending || state.success}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium"
            >
              <option value="ACTIVE">Aktif (Dapat Ditugaskan Relawan & Admin)</option>
              <option value="INACTIVE">Non-aktif (Persiapan / Arsip)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Hanya daerah aktif yang dapat diberikan Admin Daerah.
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              href="/admin/wilayah/districts"
              className={buttonVariants({
                variant: "outline",
                className: "text-slate-700",
              })}
            >
              Batal
            </Link>
            <Button
              type="submit"
              disabled={pending || state.success}
              className="bg-[#0B1F3A] hover:bg-[#124E8C] text-white min-w-[140px]"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 size-4" />
                  Simpan Daerah
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
