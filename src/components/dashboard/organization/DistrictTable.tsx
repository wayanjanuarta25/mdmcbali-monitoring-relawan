"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Eye,
  UserPlus,
  Search,
  SearchX,
  CheckCircle2,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { MockDistrictItem } from "@/data/mock/organization";
import { DeleteDistrictDialog } from "./DeleteDistrictDialog";
import { deleteDistrictAction } from "@/app/admin/wilayah/districts/actions";

export interface DistrictTableProps {
  districts: MockDistrictItem[];
}

export function DistrictTable({ districts }: DistrictTableProps) {
  const [districtsList, setDistrictsList] = React.useState<MockDistrictItem[]>(districts);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [districtToDelete, setDistrictToDelete] = React.useState<MockDistrictItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [actionMessage, setActionMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  React.useEffect(() => {
    setDistrictsList(districts);
  }, [districts]);

  const handleDeleteConfirm = async () => {
    if (!districtToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteDistrictAction(districtToDelete.id);
      if (res.success) {
        setDistrictsList((prev) => prev.filter((item) => item.id !== districtToDelete.id));
        setActionMessage({
          type: "success",
          text: res.message || `Kabupaten/Kota ${districtToDelete.name} berhasil dihapus.`,
        });
        setDistrictToDelete(null);
      } else {
        setActionMessage({
          type: "error",
          text: res.error || "Gagal menghapus kabupaten/kota.",
        });
      }
    } catch {
      setActionMessage({
        type: "error",
        text: "Terjadi kesalahan saat menghubungi server.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDistricts = districtsList.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(term) ||
      d.code.toLowerCase().includes(term) ||
      (d.adminProfile?.full_name || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* ACTION MESSAGE NOTIFICATION */}
      {actionMessage && (
        <div
          className={`px-5 py-3 text-xs font-semibold flex items-center justify-between border-b ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-100"
              : "bg-red-50 text-red-800 border-red-100"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-2 text-sm"
          >
            ×
          </button>
        </div>
      )}
      {/* TABLE CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-100 bg-white">
        <div>
          <h3 className="text-base font-bold text-[#0B1F3A]">
            Daftar Wilayah Kerja MDMC Bali
          </h3>
          <p className="text-xs text-slate-500">
            {districtsList.length > 0
              ? `${districtsList.length} Wilayah kerja terdaftar dengan status penugasan administrator`
              : "Belum ada wilayah kerja terdaftar"}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kabupaten, kode, atau admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={districtsList.length === 0}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#124E8C]/20 focus:border-[#124E8C] disabled:opacity-50"
          />
        </div>
      </div>

      {districtsList.length === 0 ? (
        <div className="p-12">
          <EmptyState
            icon={<MapPin className="size-10 text-slate-300" />}
            title="Belum ada wilayah"
            description="Belum ada data Kabupaten atau Kota yang terdaftar dalam sistem. Tambahkan daerah pertama untuk mulai mengelola organisasi MDMC."
            action={
              <Link
                href="/admin/wilayah/districts/create"
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className: "bg-[#0B1F3A] hover:bg-[#124E8C] text-white font-semibold text-xs px-4 py-2 shadow-xs",
                })}
              >
                <UserPlus className="size-3.5 mr-1.5 text-amber-300" />
                Tambah Daerah
              </Link>
            }
          />
        </div>
      ) : filteredDistricts.length === 0 ? (
        <div className="p-8">
          <EmptyState
            icon={<SearchX className="size-8 text-slate-400" />}
            title="Kabupaten/Kota tidak ditemukan"
            description={`Tidak ada hasil untuk pencarian "${searchTerm}".`}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm("")}
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
                <th className="p-4">Kabupaten/Kota</th>
                <th className="p-4">Tipe</th>
                <th className="p-4">Kode</th>
                <th className="p-4">Administrator</th>
                <th className="p-4 text-center">Jumlah Relawan</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredDistricts.map((district, index) => {
                const hasAdmin = Boolean(district.adminProfile);
                const isManaged = district.status === "ACTIVE" || hasAdmin;

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
                          className="hover:text-[#124E8C] hover:underline underline-offset-2"
                        >
                          {district.name}
                        </Link>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {district.type}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-600">
                      {district.code}
                    </td>
                    <td className="p-4">
                      {hasAdmin && district.adminProfile ? (
                        <div>
                          <p className="font-bold text-[#0B1F3A]">
                            {district.adminProfile.full_name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {district.adminProfile.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          Belum ada admin
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center font-bold text-slate-800">
                      {district.volunteerCount ?? 0}
                    </td>
                    <td className="p-4 text-center">
                      {isManaged ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="size-3" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <ShieldAlert className="size-3" />
                          BELUM DIKELOLA
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
                              variant: "default",
                              size: "sm",
                              className:
                                "text-xs bg-[#124E8C] hover:bg-[#0B1F3A] text-white h-8 px-3 font-semibold shadow-xs",
                            })}
                          >
                            <UserPlus className="size-3.5 mr-1 text-amber-300" />
                            Buat Admin
                          </Link>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isDeleting}
                          onClick={() => {
                            setActionMessage(null);
                            setDistrictToDelete(district);
                          }}
                          className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-2.5 font-semibold"
                          title="Hapus Kabupaten/Kota"
                        >
                          <Trash2 className="size-3.5 mr-1 text-red-500" />
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      <DeleteDistrictDialog
        district={districtToDelete}
        isOpen={Boolean(districtToDelete)}
        isLoading={isDeleting}
        onClose={() => setDistrictToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

