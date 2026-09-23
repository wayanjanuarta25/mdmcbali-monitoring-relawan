"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  LockKeyhole,
  Phone,
  ArrowLeft,
  UserPlus,
  CheckCircle2,
  ShieldAlert,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createAdminDaerahAction, type ActionState } from "@/app/admin/wilayah/districts/actions";

interface CreateAdminFormProps {
  districtId: string;
  districtName: string;
  districtCode: string;
}

const initialState: ActionState = {};

export function CreateAdminForm({
  districtId,
  districtName,
  districtCode,
}: CreateAdminFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createAdminDaerahAction,
    initialState,
  );

  React.useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push(`/admin/wilayah/districts/${districtId}`);
        router.refresh();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, districtId, router]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-in fade-in-50 duration-300">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#124E8C] p-6 text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-sky-200 border border-white/15 shrink-0">
            <UserPlus className="size-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider">
                Formulir Akun Administrator
              </span>
              <Badge variant="brand" className="bg-sky-400/20 text-sky-100 border-sky-400/30 text-[10px]">
                {districtCode}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Buat Admin {districtName}
            </h2>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="border-white/20 text-white hover:bg-white/10 w-fit"
        >
          <ArrowLeft className="size-4 mr-1" />
          Kembali
        </Button>
      </div>

      {state.success ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="size-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">{state.message}</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              Mengalihkan kembali ke halaman detail daerah...
            </p>
          </div>
        </div>
      ) : null}

      {/* FORM CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="district_id" value={districtId} />

          {/* READONLY KABUPATEN/KOTA FIELD (SPEC REQUIREMENT) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Kabupaten / Kota Target (Readonly)
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                readOnly
                value={`${districtName} (${districtCode})`}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-xs font-bold text-[#0B1F3A] cursor-not-allowed outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400">Target daerah ditentukan otomatis dari halaman sebelumnya.</p>
          </div>

          {/* FULL NAME */}
          <div className="space-y-1.5">
            <label htmlFor="full_name" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Nama Lengkap Admin <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Contoh: I Made Agus Suardana, S.Kom."
                required
                minLength={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-[#124E8C] focus:bg-white focus:ring-2 focus:ring-[#124E8C]/20"
              />
            </div>
            <p className="text-[11px] text-slate-400">Minimal 3 karakter, sertakan gelar jika ada.</p>
          </div>

          {/* USERNAME */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Username Admin <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400 font-bold">@</span>
              <input
                id="username"
                name="username"
                type="text"
                placeholder={`admin_${districtName.toLowerCase().replace(/\s+/g, "")}`}
                required
                minLength={5}
                maxLength={30}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-mono font-medium text-slate-900 outline-none transition focus:border-[#124E8C] focus:bg-white focus:ring-2 focus:ring-[#124E8C]/20"
              />
            </div>
            <p className="text-[11px] text-slate-400">Minimal 5-30 karakter (huruf kecil, angka, dan underscore).</p>
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Official Admin <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder={`${districtName.toLowerCase().replace(/\s+/g, "")}@mdmc.or.id`}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-[#124E8C] focus:bg-white focus:ring-2 focus:ring-[#124E8C]/20"
              />
            </div>
            <p className="text-[11px] text-slate-400">Email ini akan digunakan untuk login ke portal daerah.</p>
          </div>

          {/* PHONE */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Nomor WhatsApp / HP (Indonesia) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="081234567890 atau +6281234567890"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-[#124E8C] focus:bg-white focus:ring-2 focus:ring-[#124E8C]/20"
              />
            </div>
            <p className="text-[11px] text-slate-400">Gunakan nomor Indonesia aktif untuk koordinasi darurat.</p>
          </div>

          {/* PASSWORD AWAL */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Password Awal <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Minimal 8 karakter unik"
                required
                minLength={8}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-[#124E8C] focus:bg-white focus:ring-2 focus:ring-[#124E8C]/20"
              />
            </div>
            <p className="text-[11px] text-slate-400">Minimal 8 karakter untuk keamanan akun daerah.</p>
          </div>

          {/* ERROR ALERT */}
          {state.error ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 animate-in fade-in duration-150">
              <ShieldAlert className="size-4 shrink-0 text-rose-600" />
              <span>{state.error}</span>
            </div>
          ) : null}

          {/* SUBMIT BUTTON WITH LOADING STATE */}
          <div className="pt-3">
            <Button
              type="submit"
              disabled={pending || state.success}
              className="h-11 w-full bg-[#124E8C] hover:bg-[#0B1F3A] text-white font-bold text-xs shadow-md transition-all"
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Memproses Pembuatan Akun...
                </span>
              ) : (
                `Buat Akun Admin ${districtName}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
