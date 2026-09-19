"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createVolunteerAction } from "@/app/admin/daerah/volunteers/actions";
import type { CreateVolunteerState } from "@/types/volunteer";

const initialState: CreateVolunteerState = {
  error: null,
  fieldErrors: {},
};

interface CreateVolunteerFormProps {
  districtName: string;
}

export function CreateVolunteerForm({ districtName }: CreateVolunteerFormProps) {
  const [state, formAction, pending] = useActionState(
    createVolunteerAction,
    initialState,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h3 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2">
          <Users className="size-5 text-[#124E8C]" />
          Formulir Relawan Baru
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Relawan akan otomatis didaftarkan pada wilayah penugasan:{" "}
          <strong className="text-[#124E8C]">{districtName}</strong>
        </p>
      </div>

      {state.error && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-800 border border-red-200">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* NAMA LENGKAP */}
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="name"
              className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <User className="size-3.5 text-[#124E8C]" />
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Contoh: I Made Dwi Prasetya"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#124E8C]/20 ${
                state.fieldErrors?.name
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 focus:border-[#124E8C]"
              }`}
            />
            {state.fieldErrors?.name && (
              <p className="text-[11px] font-semibold text-red-600 mt-1">
                {state.fieldErrors.name}
              </p>
            )}
          </div>

          {/* JENIS KELAMIN */}
          <div className="space-y-2">
            <label
              htmlFor="gender"
              className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <User className="size-3.5 text-[#124E8C]" />
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              required
              defaultValue="Laki-laki"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#124E8C]/20 ${
                state.fieldErrors?.gender
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 focus:border-[#124E8C]"
              }`}
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            {state.fieldErrors?.gender && (
              <p className="text-[11px] font-semibold text-red-600 mt-1">
                {state.fieldErrors.gender}
              </p>
            )}
          </div>

          {/* UMUR */}
          <div className="space-y-2">
            <label
              htmlFor="age"
              className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <Calendar className="size-3.5 text-[#124E8C]" />
              Umur (Tahun) <span className="text-red-500">*</span>
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min={12}
              max={99}
              required
              placeholder="Contoh: 24"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#124E8C]/20 ${
                state.fieldErrors?.age
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 focus:border-[#124E8C]"
              }`}
            />
            {state.fieldErrors?.age && (
              <p className="text-[11px] font-semibold text-red-600 mt-1">
                {state.fieldErrors.age}
              </p>
            )}
          </div>

          {/* NO TELEPON */}
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="phone"
              className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <Phone className="size-3.5 text-[#124E8C]" />
              Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="Contoh: 081234567890"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#124E8C]/20 ${
                state.fieldErrors?.phone
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 focus:border-[#124E8C]"
              }`}
            />
            {state.fieldErrors?.phone && (
              <p className="text-[11px] font-semibold text-red-600 mt-1">
                {state.fieldErrors.phone}
              </p>
            )}
          </div>

          {/* ALAMAT */}
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="address"
              className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <MapPin className="size-3.5 text-[#124E8C]" />
              Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              required
              placeholder="Contoh: Jl. Diponegoro No. 12, Banjar Kawan, Bangli"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#124E8C]/20 ${
                state.fieldErrors?.address
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 focus:border-[#124E8C]"
              }`}
            />
            {state.fieldErrors?.address && (
              <p className="text-[11px] font-semibold text-red-600 mt-1">
                {state.fieldErrors.address}
              </p>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/admin/daerah/volunteers"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Batal
          </Link>
          <Button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-[#124E8C] hover:bg-[#0E3E70] text-white px-5 py-2.5 text-xs font-bold"
          >
            {pending ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5 mr-1.5" />
                Simpan Relawan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
