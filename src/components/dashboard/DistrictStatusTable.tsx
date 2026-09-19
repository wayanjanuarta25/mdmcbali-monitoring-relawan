"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Eye, CheckCircle2, ShieldAlert, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { DistrictStatusItem } from "@/data/mock/dashboard";
import { cn } from "@/lib/utils";

export interface DistrictStatusTableProps {
  districts: DistrictStatusItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function DistrictStatusTable({
  districts,
  title = "Status Kabupaten/Kota",
  subtitle = "Status pengelolaan dan administrator daerah se-Provinsi Bali",
  className,
}: DistrictStatusTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filtered = districts.filter(
    (d) =>
      d.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.districtCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-[#0B1F3A]">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari daerah / admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#124E8C]/20 focus:border-[#124E8C]"
          />
        </div>
      </div>

      {districts.length === 0 ? (
        <div className="p-12 text-center">
          <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <MapPin className="size-6 text-slate-400" />
            </div>
            <h4 className="text-base font-bold text-[#0B1F3A]">Belum ada wilayah</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Belum ada data Kabupaten atau Kota yang terdaftar dalam sistem. Daftarkan daerah pertama untuk mulai mengelola organisasi.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/wilayah/districts/create"
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className: "bg-[#0B1F3A] hover:bg-[#124E8C] text-white font-semibold text-xs px-4 h-9 shadow-xs",
                })}
              >
                + Tambah Daerah
              </Link>
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500">
          Tidak ada daerah yang cocok dengan kata kunci pencarian &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="p-4">Kabupaten/Kota</th>
                <th className="p-4">Admin</th>
                <th className="p-4 text-center">Jumlah Relawan</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filtered.map((d) => {
              const isActive = d.status === "Aktif";

              return (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-[#0B1F3A]">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-[#124E8C]" />
                      <span>{d.district}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {d.districtCode}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    {d.admin !== "-" ? (
                      <span className="font-bold text-[#0B1F3A]">{d.admin}</span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">-</span>
                    )}
                  </td>
                  <td className="p-4 text-center font-bold text-[#124E8C]">
                    {d.relawan}
                  </td>
                  <td className="p-4 text-center">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="size-3" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <ShieldAlert className="size-3 text-slate-400" />
                        Belum Aktif
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/wilayah/districts/${d.id}`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                        className:
                          "text-xs text-[#124E8C] hover:bg-blue-50 font-bold h-8 px-3",
                      })}
                    >
                      <Eye className="size-3.5 mr-1" />
                      Detail
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
