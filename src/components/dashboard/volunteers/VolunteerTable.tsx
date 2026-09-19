"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  SearchX,
  UserPlus,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { VolunteerItem } from "@/types/volunteer";

interface VolunteerTableProps {
  volunteers: VolunteerItem[];
  districtName?: string;
}

export function VolunteerTable({
  volunteers: initialVolunteers,
  districtName = "Daerah",
}: VolunteerTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [genderFilter, setGenderFilter] = React.useState<"all" | "L" | "P">("all");

  const filteredVolunteers = initialVolunteers.filter((v) => {
    // Gender filter
    if (genderFilter === "L") {
      if (v.gender !== "L" && v.gender !== "Laki-laki") return false;
    } else if (genderFilter === "P") {
      if (v.gender !== "P" && v.gender !== "Perempuan") return false;
    }

    // Search filter
    const term = searchTerm.toLowerCase();
    return (
      v.name.toLowerCase().includes(term) ||
      (v.phone || "").toLowerCase().includes(term) ||
      (v.address || "").toLowerCase().includes(term) ||
      (v.district_name || "").toLowerCase().includes(term)
    );
  });

  if (initialVolunteers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <EmptyState
          icon={<UserPlus className="size-10 text-[#124E8C]" />}
          title={`Belum Ada Relawan Terdaftar di ${districtName}`}
          description={`Mulai daftarkan anggota relawan kesiapsiagaan bencana pertama di wilayah ${districtName} sekarang.`}
          action={
            <Link
              href="/admin/daerah/volunteers/create"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "bg-[#124E8C] hover:bg-[#0E3E70] text-white font-bold text-xs mt-2",
              })}
            >
              <UserPlus className="size-4 mr-1.5" />
              Tambah Relawan Pertama
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden space-y-0">
      {/* FILTER & SEARCH HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 border-b border-slate-100 bg-white">
        <div>
          <h3 className="text-base font-bold text-[#0B1F3A]">
            Daftar Relawan Terdata ({initialVolunteers.length})
          </h3>
          <p className="text-xs text-slate-500">
            Anggota relawan kesiapsiagaan terverifikasi di wilayah {districtName}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* GENDER FILTER TABS */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setGenderFilter("all")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                genderFilter === "all"
                  ? "bg-white text-[#124E8C] shadow-xs font-bold"
                  : "text-slate-600 hover:text-[#0B1F3A]"
              }`}
            >
              Semua ({initialVolunteers.length})
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter("L")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                genderFilter === "L"
                  ? "bg-white text-[#124E8C] shadow-xs font-bold"
                  : "text-slate-600 hover:text-[#0B1F3A]"
              }`}
            >
              Laki-laki
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter("P")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                genderFilter === "P"
                  ? "bg-white text-[#124E8C] shadow-xs font-bold"
                  : "text-slate-600 hover:text-[#0B1F3A]"
              }`}
            >
              Perempuan
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, no HP, alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#124E8C]/20 focus:border-[#124E8C]"
            />
          </div>
        </div>
      </div>

      {filteredVolunteers.length === 0 ? (
        <div className="p-8">
          <EmptyState
            icon={<SearchX className="size-8 text-slate-400" />}
            title="Relawan tidak ditemukan"
            description={`Tidak ada relawan yang sesuai dengan kriteria pencarian "${searchTerm}".`}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setGenderFilter("all");
                }}
                className="text-xs border-slate-300"
              >
                Reset Pencarian
              </Button>
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Nama Lengkap</th>
                <th className="p-4 text-center">Gender</th>
                <th className="p-4 text-center">Umur</th>
                <th className="p-4">Alamat Domisili</th>
                <th className="p-4">No Telepon</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Tanggal Gabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredVolunteers.map((vol, index) => {
                const isMale = vol.gender === "L" || vol.gender === "Laki-laki";
                const formattedDate = vol.created_at
                  ? new Date(vol.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-";

                return (
                  <tr
                    key={vol.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 text-center text-slate-400 font-mono font-bold">
                      {index + 1}
                    </td>
                    <td className="p-4 font-bold text-[#0B1F3A]">
                      <span>{vol.name}</span>
                    </td>
                    <td className="p-4 text-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          isMale
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-pink-50 text-pink-700 border-pink-200"
                        }`}
                      >
                        {isMale ? "Laki-laki" : "Perempuan"}
                      </Badge>
                    </td>
                    <td className="p-4 text-center font-bold text-slate-800">
                      {vol.age ? `${vol.age} thn` : "-"}
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3 text-slate-400 shrink-0" />
                        <span className="truncate">{vol.address || "-"}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-700">
                      <div className="flex items-center gap-1">
                        <Phone className="size-3 text-[#124E8C] shrink-0" />
                        <span>{vol.phone || "-"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold"
                      >
                        <CheckCircle2 className="size-3 mr-1" />
                        {vol.status || "Aktif"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right text-slate-500 font-mono">
                      <div className="flex items-center justify-end gap-1">
                        <Calendar className="size-3 text-slate-400 shrink-0" />
                        <span>{formattedDate}</span>
                      </div>
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
