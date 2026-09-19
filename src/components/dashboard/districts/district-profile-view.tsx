"use client";

import * as React from "react";
import {
  MapPin,
  Building2,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "../shell/page-header";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/types/auth";

export interface DistrictProfileData {
  districtName: string;
  districtCode: string;
  districtType: "KABUPATEN" | "KOTA";
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  isActive: boolean;
}

interface DistrictProfileViewProps {
  profile?: UserProfile;
  districtData: DistrictProfileData;
}

export function DistrictProfileView({
  districtData,
}: DistrictProfileViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* PAGE HEADER */}
      <PageHeader
        eyebrow="PORTAL MDMC DAERAH"
        title="Profil Wilayah"
        description={`Informasi profil wilayah kerja dan akun administrator resmi ${districtData.districtName}`}
        scopeBadge={`Wilayah: ${districtData.districtName}`}
        breadcrumbs={[
          { label: "Dashboard Daerah", href: "/admin/daerah" },
          { label: "Profil Wilayah" },
        ]}
      />

      {/* HERO BANNER CARD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#0B1F3A] via-[#124E8C] to-[#1E3A5F] p-6 sm:p-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-amber-300 border border-white/15 shrink-0 shadow-inner">
            <Building2 className="size-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-200 uppercase tracking-widest">
                MDMC Provinsi Bali
              </span>
              <Badge
                variant="brand"
                className="bg-sky-400/20 text-sky-100 border-sky-400/30 text-[10px]"
              >
                {districtData.districtType}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {districtData.districtName}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Kode Wilayah:{" "}
              <span className="font-mono font-bold text-sky-300">
                {districtData.districtCode}
              </span>
            </p>
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 shadow-xs">
            <CheckCircle2 className="size-4 text-emerald-400" />
            Status: Aktif
          </span>
        </div>
      </div>

      {/* DETAILED PROFILE CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#124E8C]" />
              Data Administrator & Wilayah Kerja
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identitas resmi administrator daerah MDMC Bali (Readonly)
            </p>
          </div>

          <Badge variant="outline" className="text-[10px] text-slate-500 font-mono">
            <Lock className="size-3 mr-1 text-slate-400" />
            Locked Profile
          </Badge>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* FIELD 1: NAMA KABUPATEN/KOTA */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="size-3.5 text-[#124E8C]" />
              Nama Kabupaten / Kota
            </span>
            <p className="text-sm font-extrabold text-[#0B1F3A]">
              {districtData.districtName}
            </p>
          </div>

          {/* FIELD 2: KODE WILAYAH */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-[#124E8C]" />
              Kode Wilayah
            </span>
            <p className="text-sm font-mono font-extrabold text-[#0B1F3A]">
              {districtData.districtCode}
            </p>
          </div>

          {/* FIELD 3: ADMINISTRATOR DAERAH */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="size-3.5 text-[#124E8C]" />
              Administrator Daerah
            </span>
            <p className="text-sm font-extrabold text-[#0B1F3A]">
              {districtData.adminName}
            </p>
          </div>

          {/* FIELD 4: EMAIL */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Mail className="size-3.5 text-[#124E8C]" />
              Email Official
            </span>
            <p className="text-sm font-mono font-bold text-slate-800">
              {districtData.adminEmail}
            </p>
          </div>

          {/* FIELD 5: NOMOR HP */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Phone className="size-3.5 text-[#124E8C]" />
              Nomor WhatsApp / HP
            </span>
            <p className="text-sm font-mono font-bold text-slate-800">
              {districtData.adminPhone}
            </p>
          </div>

          {/* FIELD 6: STATUS */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              Status Akun
            </span>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="size-3.5" />
                Aktif
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER INFORMATIONAL NOTICE */}
        <div className="rounded-xl bg-blue-50/60 p-4 border border-blue-100 text-xs text-[#124E8C] space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Lock className="size-3.5 shrink-0" /> Catatan Hak Akses:
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Data wilayah kerja daerah bersifat tetap dan dikelola langsung oleh Admin Wilayah MDMC Provinsi Bali. Jika terdapat perubahan pengurus atau nomor kontak, silakan hubungi Sekretariat MDMC Bali.
          </p>
        </div>
      </div>
    </div>
  );
}
