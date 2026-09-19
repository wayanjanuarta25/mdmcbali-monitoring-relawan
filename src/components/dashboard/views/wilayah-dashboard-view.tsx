"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { DashboardHeader } from "../DashboardHeader";
import { StatCard } from "../StatCard";
import { ChartCard } from "../ChartCard";
import { ChartSkeleton } from "../ui/chart-skeleton";
import { DistrictStatusTable } from "../DistrictStatusTable";
import { ActivityTimeline } from "../ActivityTimeline";
import { QuickActionCard } from "../QuickActionCard";
import type {
  DistrictDistribution,
  GenderRatio,
  DistrictStatusItem,
  ActivityItem,
  QuickActionItem,
} from "@/data/mock/dashboard";
import type { NotificationItem } from "@/types/notification";
import type { UserProfile } from "@/types/auth";

const ProvinceBarChart = dynamic(
  () =>
    import("../ui/province-bar-chart").then((mod) => mod.ProvinceBarChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton type="bar" height={280} />,
  },
);

const GenderDonutChart = dynamic(
  () =>
    import("../ui/gender-donut-chart").then((mod) => mod.GenderDonutChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton type="donut" height={280} />,
  },
);

const DEFAULT_QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "add-district",
    title: "Tambah Daerah",
    description: "Daftarkan kabupaten atau kota baru ke dalam sistem MDMC",
    buttonText: "+ Tambah Daerah",
    href: "/admin/wilayah/districts/create",
    variant: "primary",
  },
  {
    id: "export-volunteers",
    title: "Export Relawan Bali",
    description: "Unduh seluruh data relawan se-Provinsi Bali dalam format Excel",
    buttonText: "Export Excel",
    href: "/admin/wilayah/volunteers/export",
    variant: "outline",
  },
  {
    id: "broadcast-notif",
    title: "Buat Notifikasi Siaga",
    description: "Terbitkan pengumuman darurat atau informasi untuk admin daerah",
    buttonText: "Buat Notifikasi",
    href: "/admin/wilayah/notifications",
    variant: "secondary",
  },
];

export interface WilayahDashboardViewProps {
  profile?: UserProfile;
  districtCount?: number;
  adminCount?: number;
  volunteerCount?: number;
  districtStatuses?: DistrictStatusItem[];
  volunteerDistribution?: DistrictDistribution[];
  genderStats?: GenderRatio[];
  activeNotification?: NotificationItem | null;
  recentActivities?: ActivityItem[];
}

export function WilayahDashboardView({
  districtCount = 0,
  adminCount = 0,
  volunteerCount = 0,
  districtStatuses = [],
  volunteerDistribution = [],
  genderStats = [],
  activeNotification = null,
  recentActivities = [],
}: WilayahDashboardViewProps) {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleActionClick = (actionKey: string) => {
    setToastMessage(`Aksi "${actionKey}" berhasil diproses.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const summaryCards = [
    {
      title: "Total Kabupaten/Kota",
      value: districtCount,
      iconName: "Building2" as const,
      subtitle: districtCount > 0 ? `${districtCount} Daerah Terdaftar` : "Belum ada wilayah",
      trend: districtCount > 0 ? `${districtCount} Wilayah` : "Kosong",
      trendDirection: (districtCount > 0 ? "up" : "down") as "up" | "down",
    },
    {
      title: "Administrator Daerah",
      value: `${adminCount} Admin`,
      iconName: "Users" as const,
      subtitle: "Pengurus daerah aktif bertugas",
      badge: districtCount > 0 ? `${adminCount}/${districtCount} Terisi` : `${adminCount} Terisi`,
    },
    {
      title: "Total Relawan Bali",
      value: volunteerCount.toLocaleString("id-ID"),
      iconName: "UserRound" as const,
      subtitle: "Relawan terdata se-Bali",
      trend: volunteerCount > 0 ? `${volunteerCount} Personil` : "Kosong",
      trendDirection: (volunteerCount > 0 ? "up" : "down") as "up" | "down",
    },
    {
      title: "Relawan Siaga Aktif",
      value: volunteerCount.toLocaleString("id-ID"),
      iconName: "ShieldCheck" as const,
      subtitle: "Siaga tanggap darurat posko",
      trend: volunteerCount > 0 ? "100% Aktif" : "0",
      trendDirection: (volunteerCount > 0 ? "up" : "down") as "up" | "down",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* HEADER SECTION - WITH DYNAMIC NOTIFICATION STATUS (IF ANY) */}
      <DashboardHeader
        title="Dashboard MDMC Bali"
        subtitle="Monitoring kesiapsiagaan relawan dan aktivitas daerah se-Provinsi Bali"
        badge="Wilayah Bali"
        notification={activeNotification}
      />

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-4 text-xs font-semibold text-[#124E8C] border border-[#124E8C]/20 shadow-xs animate-in slide-in-from-top-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SUMMARY CARDS (4 CARDS) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((item, index) => (
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

      {/* SECTION 1: STATISTIK RELAWAN BALI (2 KOLOM) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT: BAR CHART - DISTRIBUSI RELAWAN PER KABUPATEN/KOTA */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Distribusi Relawan per Kabupaten/Kota"
            subtitle={
              districtCount > 0
                ? `Jumlah relawan terdaftar di ${districtCount} daerah administrasi`
                : "Belum ada wilayah terdaftar"
            }
          >
            {volunteerDistribution.length > 0 ? (
              <ProvinceBarChart data={volunteerDistribution} />
            ) : (
              <div className="flex h-[280px] flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
                <p className="font-semibold text-slate-500">Belum ada data distribusi relawan</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Tambahkan kabupaten/kota dan input relawan untuk melihat grafik distribusi.
                </p>
              </div>
            )}
          </ChartCard>
        </div>

        {/* RIGHT: DONUT CHART - KOMPOSISI GENDER */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Komposisi Gender"
            subtitle="Rasio gender relawan kesiapsiagaan Bali"
          >
            {volunteerCount > 0 && genderStats.length > 0 ? (
              <GenderDonutChart
                data={genderStats}
                totalLabel={volunteerCount.toLocaleString("id-ID")}
              />
            ) : (
              <div className="flex h-[280px] flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
                <p className="font-semibold text-slate-500">Belum ada data gender relawan</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Grafik rasio gender akan otomatis terisi setelah relawan didaftarkan.
                </p>
              </div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* SECTION 2: STATUS KABUPATEN/KOTA (REAL SUPABASE QUERY) */}
      <DistrictStatusTable
        districts={districtStatuses}
        title="Status Kabupaten/Kota"
        subtitle="Status administrator dan jumlah relawan daerah se-Provinsi Bali"
      />

      {/* SECTION 3 & 4: AKTIVITAS TERBARU & QUICK ACTION */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* SECTION 3: AKTIVITAS TERBARU */}
        <div className="lg:col-span-6">
          <ActivityTimeline
            activities={recentActivities}
            title="Aktivitas Terbaru"
            subtitle="Catatan tindakan dan pembaruan sistem wilayah"
          />
        </div>

        {/* SECTION 4: QUICK ACTION */}
        <div className="lg:col-span-6">
          <QuickActionCard
            actions={DEFAULT_QUICK_ACTIONS}
            title="Quick Action"
            subtitle="Akses cepat ke modul manajemen wilayah"
            onActionClick={handleActionClick}
          />
        </div>
      </div>
    </div>
  );
}
