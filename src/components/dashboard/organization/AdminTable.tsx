"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  Search,
  SearchX,
  CheckCircle2,
  XCircle,
  Power,
  PowerOff,
  Building2,
  Loader2,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  toggleAdminStatusAction,
  deleteAdminDaerahAction,
} from "@/app/admin/wilayah/districts/actions";
import { DeleteAdminDialog } from "./DeleteAdminDialog";
import type { MockAdminProfile } from "@/data/mock/organization";

export interface AdminTableProps {
  admins: MockAdminProfile[];
}

export type AdminFilterTab = "active" | "inactive" | "all";

export function AdminTable({ admins: initialAdmins }: AdminTableProps) {
  const [admins, setAdmins] = React.useState<MockAdminProfile[]>(initialAdmins);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterTab, setFilterTab] = React.useState<AdminFilterTab>("active");
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [actionMessage, setActionMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Delete modal state
  const [adminToDelete, setAdminToDelete] =
    React.useState<MockAdminProfile | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    setAdmins(initialAdmins);
  }, [initialAdmins]);

  const filteredAdmins = admins.filter((a) => {
    // 1. Tab filter
    if (filterTab === "active" && !a.is_active) return false;
    if (filterTab === "inactive" && a.is_active) return false;

    // 2. Search term
    const term = searchTerm.toLowerCase();
    return (
      a.full_name.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term) ||
      (a.district_name || "").toLowerCase().includes(term) ||
      (a.phone || "").toLowerCase().includes(term)
    );
  });

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteAdminDaerahAction(adminToDelete.id);
      if (res.success) {
        setAdmins((prev) => prev.filter((item) => item.id !== adminToDelete.id));
        setActionMessage({
          type: "success",
          text: `Akun Admin Daerah ${adminToDelete.full_name} berhasil dihapus permanen.`,
        });
        setAdminToDelete(null);
      } else {
        setActionMessage({
          type: "error",
          text: res.error || "Gagal menghapus admin daerah.",
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

  const handleToggleStatus = async (admin: MockAdminProfile) => {
    try {
      setLoadingId(admin.id);
      setActionMessage(null);

      const res = await toggleAdminStatusAction(
        admin.id,
        admin.is_active,
        admin.district_id || undefined,
      );

      if (res.success) {
        setAdmins((prev) =>
          prev.map((item) =>
            item.id === admin.id ? { ...item, is_active: !item.is_active } : item,
          ),
        );
        setActionMessage({
          type: "success",
          text: `Status ${admin.full_name} berhasil diubah menjadi ${
            !admin.is_active ? "Aktif" : "Nonaktif"
          }.`,
        });
      } else {
        setActionMessage({
          type: "error",
          text: res.error || "Gagal mengubah status admin.",
        });
      }
    } catch {
      setActionMessage({
        type: "error",
        text: "Terjadi kesalahan saat menghubungi server.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden space-y-0">
      {/* MESSAGE ALERT IF ANY */}
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
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* SEARCH AND CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 border-b border-slate-100 bg-white">
        <div>
          <h3 className="text-base font-bold text-[#0B1F3A]">
            Daftar Administrator Daerah Bali
          </h3>
          <p className="text-xs text-slate-500">
            Total {admins.length} akun pengurus kabupaten/kota terdaftar
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* FILTER TABS */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterTab("active")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                filterTab === "active"
                  ? "bg-white text-[#124E8C] shadow-xs font-bold"
                  : "text-slate-600 hover:text-[#0B1F3A]"
              }`}
            >
              Admin Aktif
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("inactive")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                filterTab === "inactive"
                  ? "bg-white text-[#124E8C] shadow-xs font-bold"
                  : "text-slate-600 hover:text-[#0B1F3A]"
              }`}
            >
              Admin Nonaktif
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                filterTab === "all"
                  ? "bg-white text-[#124E8C] shadow-xs font-bold"
                  : "text-slate-600 hover:text-[#0B1F3A]"
              }`}
            >
              Semua Admin
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, email, kabupaten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#124E8C]/20 focus:border-[#124E8C]"
            />
          </div>
        </div>
      </div>

      {admins.length === 0 ? (
        <div className="p-12">
          <EmptyState
            icon={<Users className="size-10 text-slate-300" />}
            title="Belum ada admin daerah"
            description="Belum ada akun Administrator Daerah yang terdaftar. Administrator Daerah dibuat melalui menu detail masing-masing wilayah kerja."
            action={
              <Link
                href="/admin/wilayah/districts"
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className:
                    "bg-[#0B1F3A] hover:bg-[#124E8C] text-white font-semibold text-xs px-4 shadow-xs",
                })}
              >
                Lihat Wilayah Kerja
              </Link>
            }
          />
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="p-8">
          <EmptyState
            icon={<SearchX className="size-8 text-slate-400" />}
            title="Administrator tidak ditemukan"
            description={`Tidak ada admin yang cocok dengan kriteria "${searchTerm}".`}
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
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4">Kabupaten/Kota</th>
                <th className="p-4">Tanggal Dibuat</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredAdmins.map((admin, index) => {
                const isLoading = loadingId === admin.id;
                const formattedDate = admin.created_at
                  ? new Date(admin.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Jan 2026";

                return (
                  <tr
                    key={admin.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 text-center text-slate-400 font-mono font-bold">
                      {index + 1}
                    </td>
                    <td className="p-4 font-bold text-[#0B1F3A]">
                      <Link
                        href={`/admin/wilayah/admins/${admin.id}`}
                        className="hover:text-[#124E8C] hover:underline underline-offset-2"
                      >
                        {admin.full_name}
                      </Link>
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {admin.email}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-[#124E8C]" />
                        <span className="font-semibold text-slate-800">
                          {admin.district_name || "Daerah Bali"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {formattedDate}
                    </td>
                    <td className="p-4 text-center">
                      {admin.is_active ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold"
                        >
                          <CheckCircle2 className="size-3 mr-1" />
                          Aktif
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] font-bold"
                        >
                          <XCircle className="size-3 mr-1 text-slate-400" />
                          Nonaktif
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/wilayah/admins/${admin.id}`}
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

                        {admin.is_active ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                            onClick={() => handleToggleStatus(admin)}
                            className="text-xs border-red-200 text-red-600 hover:bg-red-50 h-8 px-2.5 font-semibold"
                          >
                            {isLoading ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <>
                                <PowerOff className="size-3.5 mr-1" />
                                Nonaktifkan
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                            onClick={() => handleToggleStatus(admin)}
                            className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-8 px-2.5 font-semibold"
                          >
                            {isLoading ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <>
                                <Power className="size-3.5 mr-1" />
                                Aktifkan
                              </>
                            )}
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isLoading}
                          onClick={() => setAdminToDelete(admin)}
                          className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-2.5 font-semibold"
                          title="Hapus Admin Daerah"
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
      <DeleteAdminDialog
        admin={adminToDelete}
        isOpen={Boolean(adminToDelete)}
        isLoading={isDeleting}
        onClose={() => setAdminToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

