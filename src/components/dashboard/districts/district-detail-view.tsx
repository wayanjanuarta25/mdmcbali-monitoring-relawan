"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Building2,
  Users,
  UserCheck,
  UserPlus,
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "../shell/page-header";
import { StatCard } from "../ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { toggleAdminStatusAction } from "@/app/admin/wilayah/districts/actions";
import type { UserProfile } from "@/types/auth";
import type { DistrictWithAdmin } from "./districts-list-view";

interface DistrictDetailViewProps {
  profile: UserProfile;
  district: DistrictWithAdmin;
}

export function DistrictDetailView({ district }: DistrictDetailViewProps) {
  const router = useRouter();
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const admin = district.adminProfile;
  const hasAdmin = Boolean(admin);
  const isActive = admin?.is_active ?? false;

  const handleToggleStatus = async () => {
    if (!admin) return;
    setLoading(true);
    const res = await toggleAdminStatusAction(admin.id, isActive, district.id);
    setLoading(false);

    if (res.error) {
      setToastMessage(`Error: ${res.error}`);
    } else {
      setToastMessage(res.message || "Status berhasil diperbarui.");
      router.refresh();
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* PAGE HEADER */}
      <PageHeader
        eyebrow="DETAIL KABUPATEN / KOTA"
        title={district.name}
        description={`Kelola wilayah kerja ${district.name} dan administrator daerah`}
        scopeBadge={`Kode: ${district.code}`}
        breadcrumbs={[
          { label: "Dashboard Wilayah", href: "/admin/wilayah" },
          { label: "Kabupaten & Kota", href: "/admin/wilayah/districts" },
          { label: district.name },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/wilayah/districts")}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="size-4 mr-1" />
            Kembali
          </Button>
        }
      />

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-4 text-xs font-semibold text-[#124E8C] border border-[#124E8C]/20 shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HERO DISTRICT BANNER (HEADER: Nama Kabupaten/Kota, Kode Wilayah, Status) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#0B1F3A] via-[#124E8C] to-[#1E3A5F] p-6 sm:p-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-sky-200 border border-white/15 shrink-0 shadow-inner">
            <MapPin className="size-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-200 uppercase tracking-widest">
                Provinsi Bali
              </span>
              <Badge variant="brand" className="bg-sky-400/20 text-sky-100 border-sky-400/30 text-[10px]">
                {district.type}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {district.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Kode Wilayah: <span className="font-mono font-bold text-sky-300">{district.code}</span>
            </p>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs ${
              hasAdmin && isActive
                ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                : "bg-amber-400/20 text-amber-200 border border-amber-400/30"
            }`}
          >
            {hasAdmin && isActive ? (
              <>
                <CheckCircle2 className="size-4 text-emerald-400" />
                Terpengurus (Admin Aktif)
              </>
            ) : (
              <>
                <ShieldAlert className="size-4 text-amber-300" />
                Belum Memiliki Admin
              </>
            )}
          </span>
        </div>
      </div>

      {/* SUMMARY STAT CARDS (Jumlah Admin, Jumlah Relawan, Status Pengelolaan) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Jumlah Admin"
          value={hasAdmin ? "1 Admin" : "0 Admin"}
          icon={<UserCheck className="size-5 text-[#124E8C]" />}
          subtitle={admin ? admin.full_name : "Memerlukan penugasan admin"}
          badge={hasAdmin ? (isActive ? "Aktif" : "Non-aktif") : "Kosong"}
        />
        <StatCard
          title="Jumlah Relawan"
          value={`${district.volunteerCount || 0} Relawan`}
          icon={<Users className="size-5 text-emerald-600" />}
          subtitle="Terdaftar dalam database daerah"
        />
        <StatCard
          title="Status Pengelolaan"
          value={hasAdmin ? (isActive ? "Terkelola" : "Non-aktif") : "Belum Memiliki Admin"}
          icon={<Building2 className="size-5 text-sky-600" />}
          subtitle={hasAdmin ? "Daerah siap beroperasi" : "Perlu penugasan admin baru"}
          trend={hasAdmin && isActive ? "Siaga" : "Perlu Penugasan"}
          trendDirection={hasAdmin && isActive ? "up" : "down"}
        />
      </div>

      {/* SECTION: ADMINISTRATOR DAERAH */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A]">
              Administrator Daerah ({district.name})
            </h3>
            <p className="text-xs text-slate-500">
              Informasi akun administrator pengelola wilayah kerja daerah
            </p>
          </div>

          {!hasAdmin && (
            <Link
              href={`/admin/wilayah/districts/${district.id}/create-admin`}
              className={buttonVariants({
                size: "sm",
                className: "bg-[#124E8C] hover:bg-[#0B1F3A] text-white font-bold text-xs shadow-xs w-fit",
              })}
            >
              <UserPlus className="size-4 mr-1.5" />
              Buat Admin Daerah
            </Link>
          )}
        </div>

        {hasAdmin && admin ? (
          /* CARD: NAMA, EMAIL, NO HP, STATUS & BUTTON: NONAKTIFKAN ADMIN */
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl border border-slate-200 bg-slate-50/60 p-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#124E8C] text-white font-bold text-lg shadow-sm shrink-0">
                {admin.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-base font-bold text-[#0B1F3A]">{admin.full_name}</h4>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {isActive ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                    {isActive ? "Aktif" : "Non-aktif"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Mail className="size-3.5 text-[#124E8C]" />
                    {admin.email}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono">
                    <Phone className="size-3.5 text-[#124E8C]" />
                    {admin.phone || "Tidak ada nomor HP"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
              <Button
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={handleToggleStatus}
                className={`text-xs font-bold h-9 px-4 ${
                  isActive
                    ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {loading ? "Memproses..." : isActive ? "Nonaktifkan Admin" : "Aktifkan Admin"}
              </Button>
            </div>
          </div>
        ) : (
          /* REUSABLE EMPTY STATE COMPONENT */
          <EmptyState
            icon={<ShieldAlert className="size-8 text-amber-500" />}
            title="Belum ada administrator daerah"
            description={`Kabupaten/Kota ${district.name} saat ini belum memiliki pengurus Admin Daerah. Buat akun baru untuk mengelola wilayah kerja ini.`}
            action={
              <Link
                href={`/admin/wilayah/districts/${district.id}/create-admin`}
                className={buttonVariants({
                  size: "sm",
                  className: "bg-[#124E8C] hover:bg-[#0B1F3A] text-white font-bold text-xs shadow-md mt-1",
                })}
              >
                <UserPlus className="size-4 mr-1.5" />
                Buat Admin Daerah
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
