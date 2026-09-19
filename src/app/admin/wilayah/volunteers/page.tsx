import type { Metadata } from "next";
import { Users, ShieldCheck, UserCheck, FileDown } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shell/page-header";
import { StatCard } from "@/components/dashboard/ui/stat-card";
import { VolunteerTable } from "@/components/dashboard/volunteers/VolunteerTable";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import type { VolunteerItem } from "@/types/volunteer";

export const metadata: Metadata = {
  title: "Monitoring Relawan Bali - MDMC Wilayah",
};

export default async function WilayahVolunteersPage() {
  await requireAuth(["ADMIN_WILAYAH_BALI"]);
  const supabase = await createClient();

  const { data: rawVolunteers, error: queryError } = await supabase
    .from("volunteers")
    .select(`
      id,
      district_id,
      name,
      gender,
      age,
      address,
      phone,
      phone_normalized,
      status,
      created_at,
      created_by,
      districts (
        name,
        type
      )
    `)
    .order("created_at", { ascending: false });

  if (queryError) {
    console.error("Error fetching volunteers for wilayah:", queryError);
  }

  const volunteers: VolunteerItem[] = (rawVolunteers || []).map((v) => {
    const districtRel = v.districts as { name?: string; type?: string } | null;
    const dName = districtRel?.name
      ? `${districtRel.type === "KOTA" ? "Kota" : "Kabupaten"} ${districtRel.name}`
      : "Bali";

    return {
      id: v.id,
      district_id: v.district_id,
      name: v.name,
      gender: v.gender || "Laki-laki",
      age: v.age || null,
      address: v.address || null,
      phone: v.phone || null,
      phone_normalized: v.phone_normalized || null,
      status: v.status || "ACTIVE",
      created_at: v.created_at,
      created_by: v.created_by,
      district_name: dName,
    };
  });

  const totalVolunteers = volunteers.length;
  const maleCount = volunteers.filter(
    (v) => v.gender === "L" || v.gender === "Laki-laki",
  ).length;
  const femaleCount = volunteers.filter(
    (v) => v.gender === "P" || v.gender === "Perempuan",
  ).length;
  const activeCount = volunteers.filter((v) => v.status === "ACTIVE").length;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <PageHeader
        eyebrow="MDMC PROVINSI BALI"
        title="Monitoring Relawan Bali"
        description="Pusat monitoring dan rekonsiliasi basis data personil relawan siaga bencana seluruh Bali"
        scopeBadge="Scope: Bali"
        breadcrumbs={[
          { label: "Dashboard Wilayah", href: "/admin/wilayah" },
          { label: "Relawan" },
        ]}
        actions={
          <a
            href="/admin/wilayah/volunteers/export"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "border-slate-200 bg-white hover:bg-slate-50 text-[#124E8C] font-semibold text-xs h-9 px-3.5 rounded-xl shadow-2xs",
            })}
          >
            <FileDown className="size-3.5 mr-1.5 text-sky-600" />
            Export Seluruh Bali
          </a>
        }
      />

      {/* 4 SUMMARY STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Relawan Bali"
          value={totalVolunteers}
          icon={<Users className="size-5 text-[#124E8C]" />}
          subtitle="Terdaftar di seluruh Kabupaten/Kota"
        />

        <StatCard
          title="Relawan Aktif"
          value={activeCount}
          icon={<ShieldCheck className="size-5 text-emerald-600" />}
          subtitle="Status siaga tanggap darurat"
          badge="Siaga"
        />

        <StatCard
          title="Relawan Laki-laki"
          value={maleCount}
          icon={<UserCheck className="size-5 text-sky-600" />}
          subtitle={
            totalVolunteers > 0
              ? `${Math.round((maleCount / totalVolunteers) * 100)}% dari total`
              : "0%"
          }
        />

        <StatCard
          title="Relawan Perempuan"
          value={femaleCount}
          icon={<UserCheck className="size-5 text-pink-600" />}
          subtitle={
            totalVolunteers > 0
              ? `${Math.round((femaleCount / totalVolunteers) * 100)}% dari total`
              : "0%"
          }
        />
      </div>

      {/* VOLUNTEER TABLE */}
      <VolunteerTable
        volunteers={volunteers}
        districtName="Provinsi Bali"
      />
    </div>
  );
}

