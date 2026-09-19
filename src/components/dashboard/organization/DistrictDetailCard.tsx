"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  User,
  Users,
  Clock,
  UserPlus,
  Mail,
  Phone,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { MockDistrictItem } from "@/data/mock/organization";

export interface DistrictDetailCardProps {
  district: MockDistrictItem;
}

export function DistrictDetailCard({ district }: DistrictDetailCardProps) {
  const hasAdmin = Boolean(district.adminProfile);
  const admin = district.adminProfile;
  const isManaged = district.status === "ACTIVE" || hasAdmin;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* NAVIGATION BACK */}
      <div>
        <Link
          href="/admin/wilayah/districts"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#124E8C] transition-colors"
        >
          <ArrowLeft className="size-4 mr-1" />
          Kembali ke Daftar Kabupaten/Kota
        </Link>
      </div>

      {/* HEADER BANNER */}
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
                {district.type}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {district.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Kode Wilayah:{" "}
              <span className="font-mono font-bold text-sky-300">
                {district.code}
              </span>
            </p>
          </div>
        </div>

        <div>
          {isManaged ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 shadow-xs">
              <CheckCircle2 className="size-4 text-emerald-400" />
              Status: ACTIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30 shadow-xs">
              <ShieldAlert className="size-4 text-amber-300" />
              Status: BELUM DIKELOLA
            </span>
          )}
        </div>
      </div>

      {/* 3 SUMMARY INFO CARDS */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* CARD 1: ADMINISTRATOR DAERAH */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <User className="size-4 text-[#124E8C]" />
              Administrator Daerah
            </h3>
            {hasAdmin && admin ? (
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  admin.is_active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {admin.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
            ) : null}
          </div>

          {hasAdmin && admin ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-extrabold text-[#0B1F3A]">
                  {admin.full_name}
                </p>
                <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-1">
                  <Mail className="size-3.5 text-slate-400 shrink-0" />
                  {admin.email}
                </p>
                {admin.phone && (
                  <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-1">
                    <Phone className="size-3.5 text-slate-400 shrink-0" />
                    {admin.phone}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Status Akun:</span>
                <span className="text-xs font-semibold text-emerald-700">
                  {admin.is_active ? "Terverifikasi" : "Ditangguhkan"}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <EmptyState
                icon={<AlertTriangle className="size-6 text-amber-500" />}
                title="Belum ada Admin Daerah"
                description="Wilayah ini belum memiliki pengurus daerah yang ditugaskan."
                action={
                  <Link
                    href={`/admin/wilayah/districts/${district.id}/create-admin`}
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className:
                        "text-xs bg-[#124E8C] text-white hover:bg-[#0B1F3A] font-semibold",
                    })}
                  >
                    <UserPlus className="size-3.5 mr-1 text-amber-300" />
                    Buat Admin Daerah
                  </Link>
                }
              />
            </div>
          )}
        </div>

        {/* CARD 2: JUMLAH RELAWAN */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <Users className="size-4 text-[#124E8C]" />
              Jumlah Relawan
            </h3>
            <Badge variant="outline" className="text-[10px] font-mono text-slate-500">
              Database
            </Badge>
          </div>

          <div className="py-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#0B1F3A]">
                {district.volunteerCount ?? 0}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Personil Terdata
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {district.volunteerCount && district.volunteerCount > 0
                ? "Personil relawan siaga bencana yang tercatat di wilayah ini."
                : "Belum ada personil relawan terdaftar untuk daerah ini."}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100">
            <span className="font-semibold text-slate-700">Rencana Phase 5:</span>{" "}
            Fitur pendataan relawan daerah secara rinci akan diaktifkan pada modul Volunteer Management.
          </div>
        </div>

        {/* CARD 3: AKTIVITAS TERBARU */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <Activity className="size-4 text-[#124E8C]" />
              Aktivitas Terbaru
            </h3>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="size-3 text-slate-400" />
              Real-time
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-xs">
              <div className="size-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  Sinkronisasi Master Wilayah
                </p>
                <p className="text-[11px] text-slate-400">
                  Data daerah {district.name} terverifikasi aktif di sistem MDMC Bali.
                </p>
              </div>
            </div>

            {hasAdmin ? (
              <div className="flex items-start gap-3 text-xs">
                <div className="size-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">
                    Administrator Terhubung
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {admin?.full_name} memegang akses operasional daerah.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 text-xs">
                <div className="size-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-700">
                    Menunggu Penugasan Administrator
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Perlu pembuatan akun Admin Daerah oleh Admin Wilayah.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 text-xs">
              <div className="size-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-600">
                  Pencatatan Log Bencana
                </p>
                <p className="text-[11px] text-slate-400">
                  Status kesiapsiagaan darurat siaga 1 (Normal / Aman).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
