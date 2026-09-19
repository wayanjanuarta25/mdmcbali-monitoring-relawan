"use client";

import * as React from "react";
import {
  Building2,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Lock,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DistrictInfo, UserProfile } from "@/types/auth";

interface DaerahInfoCardProps {
  profile: UserProfile;
  district: DistrictInfo | null;
}

export function DaerahInfoCard({ profile, district }: DaerahInfoCardProps) {
  const districtName = district?.name || "Belum Terhubung";
  const districtCode = district?.code || "-";
  const districtType = district?.type || "KABUPATEN";
  const typeLabel = districtType === "KOTA" ? "Kota" : "Kabupaten";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
            <Building2 className="size-5 text-[#124E8C]" />
            Informasi Daerah
          </h3>
          <Badge variant="outline" className="text-[10px] font-mono font-bold">
            {districtCode}
          </Badge>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* NAMA DAERAH / KABUPATEN */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              {typeLabel}:
            </span>
            <span className="font-extrabold text-[#0B1F3A] text-sm">
              {districtName}
            </span>
          </div>

          {/* TIPE DAERAH */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Tag className="size-3 text-[#124E8C]" /> Tipe Wilayah:
            </span>
            <Badge
              variant="secondary"
              className="font-bold text-[10px] tracking-wide"
            >
              {districtType}
            </Badge>
          </div>

          {/* KODE DAERAH */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              Kode Wilayah:
            </span>
            <span className="font-mono font-bold text-[#124E8C]">
              {districtCode}
            </span>
          </div>

          {/* ADMINISTRATOR */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <User className="size-3 text-[#124E8C]" /> Administrator:
            </span>
            <span className="font-bold text-[#0B1F3A] max-w-[180px] truncate text-right">
              {profile.full_name || "-"}
            </span>
          </div>

          {/* EMAIL */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Mail className="size-3 text-[#124E8C]" /> Email:
            </span>
            <span className="font-mono font-bold text-slate-800 max-w-[180px] truncate text-right">
              {profile.email}
            </span>
          </div>

          {/* NO HP */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Phone className="size-3 text-[#124E8C]" /> No HP:
            </span>
            <span className="font-mono font-bold text-slate-800">
              {profile.phone || "-"}
            </span>
          </div>

          {/* STATUS */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              Status:
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                profile.is_active
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-rose-100 text-rose-800 border border-rose-200"
              }`}
            >
              <CheckCircle2 className="size-3" />
              {profile.is_active ? "Aktif" : "Non-aktif"}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
        <Lock className="size-3 shrink-0" />
        <span>Dikelola oleh Admin Wilayah MDMC Bali</span>
      </div>
    </div>
  );
}
