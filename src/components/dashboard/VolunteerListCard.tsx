"use client";

import * as React from "react";
import { Phone, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RecentVolunteerItem } from "@/data/mock/dashboard";
import { cn } from "@/lib/utils";

export interface VolunteerListCardProps {
  volunteers: RecentVolunteerItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function VolunteerListCard({
  volunteers,
  title = "Relawan Terbaru",
  subtitle = "Data pendaftaran dan verifikasi anggota relawan daerah",
  className,
}: VolunteerListCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-[#0B1F3A]">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <Badge variant="brand" className="text-[10px] bg-sky-100 text-[#124E8C] border-sky-200 font-bold">
          Terverifikasi
        </Badge>
      </div>

      {volunteers.length === 0 ? (
        <div className="flex h-36 flex-col items-center justify-center text-center p-6 text-slate-400 text-xs rounded-xl border border-dashed border-slate-200">
          <p className="font-semibold text-slate-600">Belum ada data relawan terdaftar</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            Daftarkan anggota relawan baru atau import data relawan untuk kabupaten/kota ini.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {volunteers.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 hover:bg-white hover:border-[#124E8C]/30 hover:shadow-xs transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#124E8C] to-[#0B1F3A] text-white font-bold text-xs shadow-xs shrink-0">
                  {item.name.charAt(0).toUpperCase()}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0B1F3A]">
                    {item.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span>{item.gender}</span>
                    <span>•</span>
                    <span>{item.age} Tahun</span>
                    <span>•</span>
                    <span className="text-[#124E8C] font-semibold">{item.role}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="size-3" />
                  {item.status}
                </span>

                <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                  <Phone className="size-3 text-slate-400" />
                  {item.phone}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
