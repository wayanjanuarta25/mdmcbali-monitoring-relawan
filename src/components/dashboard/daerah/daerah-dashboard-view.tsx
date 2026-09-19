"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { CheckCircle2 } from "lucide-react";
import { DashboardHeader } from "../DashboardHeader";
import { StatCard } from "../StatCard";
import { ChartCard } from "../ChartCard";
import { ChartSkeleton } from "../ui/chart-skeleton";
import { VolunteerListCard } from "../VolunteerListCard";
import { QuickActionCard } from "../QuickActionCard";
import { DaerahInfoCard } from "./daerah-info-card";
import type { DistrictInfo, UserProfile } from "@/types/auth";
import type { GenderRatio, AgeDistribution } from "@/data/mock/dashboard";
import type { NotificationItem } from "@/types/notification";

const GenderDonutChart = dynamic(
  () =>
    import("../ui/gender-donut-chart").then((mod) => mod.GenderDonutChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton type="donut" height={280} />,
  },
);

const AgeBarChart = dynamic(
  () => import("../ui/age-bar-chart").then((mod) => mod.AgeBarChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton type="bar" height={280} />,
  },
);

export interface DaerahVolunteerStats {
  totalVolunteers: number;
  activeVolunteers: number;
  newVolunteers: number;
  genderRatio?: GenderRatio[];
  ageDistribution?: AgeDistribution[];
  recentVolunteers?: {
    id: string;
    name: string;
    gender: string;
    age: number | null;
    status: string;
    role?: string;
    phone?: string | null;
  }[];
}

export interface DaerahDashboardViewProps {
  profile: UserProfile;
  district?: DistrictInfo | null;
  stats?: DaerahVolunteerStats | null;
  activeNotification?: NotificationItem | null;
}

export function DaerahDashboardView({
  profile,
  district: districtProp,
  stats,
  activeNotification = null,
}: DaerahDashboardViewProps) {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Use district from prop or from profile.district (joined via profiles.district_id)
  const district = districtProp || profile.district || profile.districts || null;

  const districtName = district?.name || "Daerah";
  const typeLabel = district?.type === "KOTA" ? "Kota" : "Kabupaten";

  const handleActionClick = (actionKey: string) => {
    if (actionKey === "export_data") {
      setToastMessage("Modul Export Data Relawan dapat diakses melalui menu Data Relawan.");
    } else {
      setToastMessage(`Aksi "${actionKey}" diproses.`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Header Title & Badge formatting
  const headerTitle = district?.name
    ? `MDMC ${typeLabel} ${district.name}`
    : "MDMC Dashboard Daerah";
  const headerBadge = district?.name
    ? `Kabupaten/Kota ${district.name}`
    : "Kabupaten/Kota";

  // Dynamic summary items tailored to current district and DB counts
  const totalVal = stats ? stats.totalVolunteers : 0;
  const activeVal = stats ? stats.activeVolunteers : 0;
  const newVal = stats ? stats.newVolunteers : 0;

  const summaryItems = [
    {
      title: "Total Relawan",
      value: totalVal,
      iconName: "Users" as const,
      subtitle: `Terdaftar di ${typeLabel} ${districtName}`,
      trend: stats ? `${totalVal} personil` : "0",
      trendDirection: "up" as const,
    },
    {
      title: "Relawan Aktif",
      value: activeVal,
      iconName: "ShieldCheck" as const,
      subtitle: "Siaga tanggap posko lokal",
      trend:
        totalVal > 0
          ? `${Math.round((activeVal / totalVal) * 100)}% Siaga`
          : "0% Siaga",
      trendDirection: "up" as const,
    },
    {
      title: "Relawan Baru Bulan Ini",
      value: newVal,
      iconName: "UserPlus" as const,
      subtitle: "Registrasi bulan berjalan",
      badge: "Bulan Ini",
    },
    {
      title: "Status Data",
      value: totalVal > 0 ? "Lengkap" : "Kosong",
      iconName: "DatabaseCheck" as const,
      subtitle: `Terverifikasi oleh Admin ${districtName}`,
      badge: totalVal > 0 ? "Verified" : "Belum Ada Data",
    },
  ];

  // Dynamic quick actions tailored to current district
  const quickActions = [
    {
      id: "dqa-1",
      title: "Tambah Relawan Baru",
      description: `Daftarkan relawan kesiapsiagaan baru di wilayah ${districtName}`,
      buttonText: "Tambah Data",
      href: "/admin/daerah/volunteers/create",
      variant: "primary" as const,
    },
    {
      id: "dqa-2",
      title: "Lihat Semua Relawan",
      description: `Kelola daftar lengkap anggota relawan ${districtName}`,
      buttonText: "Lihat Data",
      href: "/admin/daerah/volunteers",
      variant: "secondary" as const,
    },
    {
      id: "dqa-3",
      title: "Export Data",
      description: `Unduh ringkasan data relawan wilayah ${districtName}`,
      buttonText: "Export Data",
      actionKey: "export_data",
      variant: "outline" as const,
    },
  ];

  const recentVolunteersList =
    stats?.recentVolunteers && stats.recentVolunteers.length > 0
      ? stats.recentVolunteers.map((rv) => ({
          id: rv.id,
          name: rv.name,
          gender: (rv.gender === "P" || rv.gender === "Perempuan"
            ? "Perempuan"
            : "Laki-laki") as "Laki-laki" | "Perempuan",
          age: rv.age || 25,
          status: (rv.status === "ACTIVE" || rv.status === "Aktif"
            ? "Aktif"
            : "Inaktif") as "Aktif" | "Inaktif" | "Siaga",
          role: rv.role || "Relawan Kesiapsiagaan",
          phone: rv.phone || "-",
        }))
      : [];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* HEADER SECTION */}
      <DashboardHeader
        title={headerTitle}
        subtitle="Monitoring kesiapsiagaan dan administrasi posko tingkat daerah"
        badge={headerBadge}
        notification={activeNotification}
      />

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-4 text-xs font-semibold text-[#124E8C] border border-[#124E8C]/20 shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="size-4 shrink-0 text-[#124E8C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SUMMARY CARDS (4 CARDS) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            iconName={item.iconName}
            subtitle={item.subtitle}
            trend={item.trend}
            trendDirection={item.trendDirection}
            badge={item.badge}
          />
        ))}
      </div>

      {/* SECTION 1: STATISTIK RELAWAN (GENDER & AGE CHARTS) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT: GENDER CHART */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Komposisi Gender Relawan"
            subtitle={`Rasio gender anggota relawan ${typeLabel} ${districtName}`}
          >
            <GenderDonutChart
              data={stats?.genderRatio ?? []}
              totalLabel={totalVal > 0 ? totalVal.toString() : "0"}
            />
          </ChartCard>
        </div>

        {/* RIGHT: AGE DISTRIBUTION CHART */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Distribusi Usia Relawan"
            subtitle={`Persentase kelompok usia anggota relawan ${districtName}`}
          >
            <AgeBarChart data={stats?.ageDistribution ?? []} />
          </ChartCard>
        </div>
      </div>

      {/* SECTION 2: RELAWAN TERBARU */}
      <VolunteerListCard
        volunteers={recentVolunteersList}
        title="Relawan Terbaru"
        subtitle="Daftar pendaftaran dan verifikasi anggota relawan teranyar"
      />

      {/* SECTION 3 & 4: QUICK ACTION & INFORMASI DAERAH */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* SECTION 3: QUICK ACTION */}
        <div className="lg:col-span-7">
          <QuickActionCard
            actions={quickActions}
            title="Quick Action"
            subtitle="Tindakan cepat operasional relawan daerah"
            onActionClick={handleActionClick}
          />
        </div>

        {/* SECTION 4: INFORMASI DAERAH */}
        <div className="lg:col-span-5">
          <DaerahInfoCard profile={profile} district={district} />
        </div>
      </div>
    </div>
  );
}
