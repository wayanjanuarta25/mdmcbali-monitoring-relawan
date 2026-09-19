"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  UserCheck,
  UserX,
  Users,
  Search,
  Eye,
  UserPlus,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  SearchX,
} from "lucide-react";
import { PageHeader } from "../shell/page-header";
import { StatCard } from "../ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { UserProfile } from "@/types/auth";

export interface DistrictWithAdmin {
  id: string;
  name: string;
  code: string;
  type: "KABUPATEN" | "KOTA";
  created_at: string;
  adminProfile?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string | null;
    is_active: boolean;
  } | null;
  volunteerCount?: number;
}

interface DistrictsListViewProps {
  profile?: UserProfile;
  districts: DistrictWithAdmin[];
  totalDistrictsCount: number;
  activeAdminsCount: number;
  unassignedCount: number;
  totalVolunteersCount?: number;
}

export function DistrictsListView({
  districts,
  totalDistrictsCount,
  activeAdminsCount,
  unassignedCount,
  totalVolunteersCount = 0,
}: DistrictsListViewProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredDistricts = districts.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.adminProfile?.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* PAGE HEADER */}
      <PageHeader
        eyebrow="MDMC PROVINSI BALI"
        title="Kabupaten/Kota MDMC Bali"
        description="Kelola wilayah kerja dan administrator daerah"
        scopeBadge="Scope: Bali"
        breadcrumbs={[
          { label: "Dashboard Wilayah", href: "/admin/wilayah" },
          { label: "Kabupaten & Kota" },
        ]}
      />

      {/* 4 SUMMARY CARDS (EXACT SPECIFICATION) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Kabupaten/Kota */}
        <StatCard
          title="Total Kabupaten/Kota"
          value={totalDistrictsCount || 9}
          icon={<Building2 className="size-5" />}
          subtitle="8 Kabupaten, 1 Kota (Denpasar)"
          trend="100% Terdaftar Bali"
          trendDirection="up"
        />

        {/* Card 2: Admin Daerah Aktif */}
        <StatCard
          title="Admin Daerah Aktif"
          value={activeAdminsCount}
          icon={<UserCheck className="size-5 text-emerald-600" />}
          subtitle="Pengurus daerah aktif bertugas"
          badge="Aktif"
        />

        {/* Card 3: Belum Memiliki Admin */}
        <StatCard
          title="Belum Memiliki Admin"
          value={unassignedCount}
          icon={<UserX className="size-5 text-amber-600" />}
          subtitle="Memerlukan penugasan admin"
          trend={unassignedCount > 0 ? "Perlu Penugasan" : "Lengkap"}
          trendDirection={unassignedCount > 0 ? "down" : "up"}
        />

        {/* Card 4: Total Relawan */}
        <StatCard
          title="Total Relawan"
          value={totalVolunteersCount}
          icon={<Users className="size-5 text-sky-600" />}
          subtitle="Relawan terdaftar di Bali"
        />
      </div>

      {/* DISTRICTS LIST TABLE CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A]">
              Daftar Kabupaten & Kota MDMC Bali
            </h3>
            <p className="text-xs text-slate-500">
              Kelola penugasan akun Admin Daerah untuk tiap wilayah kerja
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kabupaten/kota atau admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#124E8C]/20 focus:border-[#124E8C]"
            />
          </div>
        </div>

        {filteredDistricts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<SearchX className="size-8 text-slate-400" />}
              title="Data daerah tidak ditemukan"
              description={`Tidak ada kabupaten/kota yang cocok dengan kata kunci "${searchTerm}". Silakan periksa kembali pencarian Anda.`}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="text-xs border-slate-300"
                >
                  Bersihkan Pencarian
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
                  <th className="p-4">Kabupaten/Kota</th>
                  <th className="p-4">Tipe</th>
                  <th className="p-4">Admin Daerah</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredDistricts.map((district, index) => {
                  const hasAdmin = Boolean(district.adminProfile);
                  const admin = district.adminProfile;
                  const isActive = admin?.is_active ?? false;

                  return (
                    <tr
                      key={district.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-4 text-center text-slate-400 font-mono font-bold">
                        {index + 1}
                      </td>
                      <td className="p-4 font-bold text-[#0B1F3A]">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-[#124E8C]" />
                          <Link
                            href={`/admin/wilayah/districts/${district.id}`}
                            className="hover:text-[#124E8C] underline-offset-2 hover:underline"
                          >
                            {district.name}
                          </Link>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {district.code}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {district.type}
                        </span>
                      </td>
                      <td className="p-4">
                        {hasAdmin && admin ? (
                          <div>
                            <p className="font-bold text-[#0B1F3A]">{admin.full_name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {admin.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            Belum ada admin
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {hasAdmin && admin && isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="size-3" />
                            Admin aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <ShieldAlert className="size-3 text-slate-400" />
                            Belum ada admin
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/wilayah/districts/${district.id}`}
                            className={buttonVariants({
                              variant: "outline",
                              size: "sm",
                              className:
                                "text-xs border-slate-200 text-[#124E8C] hover:bg-blue-50 h-8 px-3 font-semibold",
                            })}
                          >
                            <Eye className="size-3.5 mr-1" />
                            Detail
                          </Link>

                          {!hasAdmin && (
                            <Link
                              href={`/admin/wilayah/districts/${district.id}/create-admin`}
                              className={buttonVariants({
                                size: "sm",
                                className:
                                  "bg-[#124E8C] hover:bg-[#0B1F3A] text-white text-[11px] h-8 px-3 font-semibold shadow-xs",
                              })}
                            >
                              <UserPlus className="size-3.5 mr-1" />
                              Buat Admin
                            </Link>
                          )}
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
    </div>
  );
}
