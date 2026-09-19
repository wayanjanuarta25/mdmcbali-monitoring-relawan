import type { Metadata } from "next";
import Link from "next/link";
import { Users, UserPlus, ShieldCheck, UserCheck, FileUp, FileDown } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell/page-header";
import { StatCard } from "@/components/dashboard/ui/stat-card";
import { VolunteerTable } from "@/components/dashboard/volunteers/VolunteerTable";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import type { VolunteerItem } from "@/types/volunteer";

export const metadata: Metadata = {
  title: "Data Relawan - MDMC Daerah",
};

export default async function DaerahVolunteersPage() {
  const profile = await requireAuth(["ADMIN_DAERAH", "ADMIN_WILAYAH_BALI"]);
  const supabase = await createClient();

  const isDaerahAdmin = profile.role === "ADMIN_DAERAH";
  const district = profile.district || profile.districts;
  const districtName = district?.name || "Daerah";
  const typeLabel = district?.type === "KOTA" ? "Kota" : "Kabupaten";

  // Build query with RLS
  let query = supabase
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
        name
      )
    `)
    .order("created_at", { ascending: false });

  // For ADMIN_DAERAH, enforce their district scope
  if (profile.role === "ADMIN_DAERAH" && profile.district_id) {
    query = query.eq("district_id", profile.district_id);
  }

  const { data: rawVolunteers, error: queryError } = await query;

  if (queryError) {
    console.error("Error fetching volunteers:", queryError);
  }

  const volunteers: VolunteerItem[] = (rawVolunteers || []).map((v) => {
    const districtRel = v.districts as { name?: string } | null;
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
      district_name: districtRel?.name || districtName,
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
      {/* PAGE HEADER WITH ACTION BUTTONS */}
      <PageHeader
        eyebrow="PORTAL MDMC DAERAH"
        title="Data Relawan"
        description={`Pengelolaan dan database personil relawan kesiapsiagaan bencana di ${typeLabel} ${districtName}`}
        scopeBadge={`${typeLabel} ${districtName}`}
        breadcrumbs={[
          { label: "Dashboard Daerah", href: "/admin/daerah" },
          { label: "Data Relawan" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/admin/daerah/volunteers/export"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className:
                  "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs h-9 px-3 rounded-xl shadow-2xs",
              })}
            >
              <FileDown className="size-3.5 mr-1.5 text-sky-600" />
              Export Excel
            </a>

            {isDaerahAdmin && (
              <>
                <Link
                  href="/admin/daerah/volunteers/import"
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className:
                      "border-slate-200 bg-white hover:bg-slate-50 text-[#124E8C] font-semibold text-xs h-9 px-3 rounded-xl shadow-2xs",
                  })}
                >
                  <FileUp className="size-3.5 mr-1.5 text-emerald-600" />
                  Import Excel
                </Link>

                <Link
                  href="/admin/daerah/volunteers/create"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                    className:
                      "bg-[#124E8C] hover:bg-[#0E3E70] text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-xs",
                  })}
                >
                  <UserPlus className="size-3.5 mr-1.5 text-amber-300" />
                  Tambah Relawan
                </Link>
              </>
            )}
          </div>
        }
      />

      {/* STAT SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Relawan"
          value={totalVolunteers}
          icon={<Users className="size-5 text-[#124E8C]" />}
          subtitle={`Terdaftar di ${districtName}`}
        />

        <StatCard
          title="Relawan Aktif"
          value={activeCount}
          icon={<ShieldCheck className="size-5 text-emerald-600" />}
          subtitle="Siaga tanggap kebencanaan"
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

      {/* VOLUNTEER TABLE & FILTER */}
      <VolunteerTable
        volunteers={volunteers}
        districtName={`${typeLabel} ${districtName}`}
      />
    </div>
  );
}
