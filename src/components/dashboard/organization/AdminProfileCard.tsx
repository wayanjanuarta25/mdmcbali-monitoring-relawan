"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Power,
  PowerOff,
  ShieldCheck,
  Loader2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  toggleAdminStatusAction,
  deleteAdminDaerahAction,
} from "@/app/admin/wilayah/districts/actions";
import { DeleteAdminDialog } from "./DeleteAdminDialog";
import type { MockAdminProfile } from "@/data/mock/organization";

export interface AdminProfileCardProps {
  admin: MockAdminProfile;
}

export function AdminProfileCard({ admin: initialAdmin }: AdminProfileCardProps) {
  const router = useRouter();
  const [admin, setAdmin] = React.useState<MockAdminProfile>(initialAdmin);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteAdminDaerahAction(admin.id);
      if (res.success) {
        router.push("/admin/wilayah/admins");
      } else {
        setMessage({
          type: "error",
          text: res.error || "Gagal menghapus admin.",
        });
        setIsDeleteDialogOpen(false);
      }
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat menghapus admin.",
      });
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedJoinDate = admin.created_at
    ? new Date(admin.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "15 Januari 2026";

  const handleToggle = async () => {
    try {
      setIsUpdating(true);
      setMessage(null);

      const res = await toggleAdminStatusAction(
        admin.id,
        admin.is_active,
        admin.district_id || undefined,
      );

      if (res.success) {
        setAdmin((prev) => ({ ...prev, is_active: !prev.is_active }));
        setMessage({
          type: "success",
          text: `Status berhasil diubah menjadi ${!admin.is_active ? "Aktif" : "Nonaktif"}.`,
        });
      } else {
        setMessage({
          type: "error",
          text: res.error || "Gagal mengubah status.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat menghubungi server.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* BACK BUTTON */}
      <div>
        <Link
          href="/admin/wilayah/admins"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#124E8C] transition-colors"
        >
          <ArrowLeft className="size-4 mr-1" />
          Kembali ke Manajemen Admin
        </Link>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* HERO BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#0B1F3A] via-[#124E8C] to-[#1E3A5F] p-6 sm:p-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10 text-amber-300 border border-white/15 shrink-0 shadow-inner">
            <User className="size-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-200 uppercase tracking-widest">
                ADMIN DAERAH
              </span>
              <Badge
                variant="brand"
                className="bg-sky-400/20 text-sky-100 border-sky-400/30 text-[10px]"
              >
                {admin.district_name || "Provinsi Bali"}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {admin.full_name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              {admin.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {admin.is_active ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 shadow-xs">
              <CheckCircle2 className="size-4 text-emerald-400" />
              Status: Aktif
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-red-400/20 text-red-200 border border-red-400/30 shadow-xs">
              <XCircle className="size-4 text-red-400" />
              Status: Nonaktif
            </span>
          )}
        </div>
      </div>

      {/* DETAIL PROFILE CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#124E8C]" />
              Informasi Akun & Penugasan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data lengkap akun administrator daerah MDMC Bali
            </p>
          </div>

          <div className="flex items-center gap-2">
            {admin.is_active ? (
              <Button
                variant="outline"
                size="sm"
                disabled={isUpdating}
                onClick={handleToggle}
                className="text-xs border-red-200 text-red-600 hover:bg-red-50 font-semibold"
              >
                {isUpdating ? (
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                ) : (
                  <PowerOff className="size-3.5 mr-1.5" />
                )}
                Nonaktifkan Akun
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled={isUpdating}
                onClick={handleToggle}
                className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold"
              >
                {isUpdating ? (
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Power className="size-3.5 mr-1.5" />
                )}
                Aktifkan Akun
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={isUpdating || isDeleting}
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold"
            >
              <Trash2 className="size-3.5 mr-1.5 text-red-500" />
              Hapus Admin
            </Button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* FIELD 1: NAMA LENGKAP */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="size-3.5 text-[#124E8C]" />
              Nama Lengkap
            </span>
            <p className="text-sm font-extrabold text-[#0B1F3A]">
              {admin.full_name}
            </p>
          </div>

          {/* FIELD 2: EMAIL */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Mail className="size-3.5 text-[#124E8C]" />
              Email
            </span>
            <p className="text-sm font-mono font-bold text-slate-800">
              {admin.email}
            </p>
          </div>

          {/* FIELD 3: PHONE */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Phone className="size-3.5 text-[#124E8C]" />
              Nomor Telepon / WhatsApp
            </span>
            <p className="text-sm font-mono font-bold text-slate-800">
              {admin.phone || "Tidak tercantum"}
            </p>
          </div>

          {/* FIELD 4: WILAYAH */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-[#124E8C]" />
              Wilayah Penugasan
            </span>
            <p className="text-sm font-extrabold text-[#0B1F3A]">
              {admin.district_name || "Provinsi Bali"}
            </p>
          </div>

          {/* FIELD 5: STATUS */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              Status Akun
            </span>
            <div className="pt-0.5">
              {admin.is_active ? (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="size-3.5" />
                  Aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                  <XCircle className="size-3.5" />
                  Nonaktif
                </span>
              )}
            </div>
          </div>

          {/* FIELD 6: TANGGAL BERGABUNG */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-[#124E8C]" />
              Tanggal Bergabung
            </span>
            <p className="text-sm font-mono font-bold text-slate-800">
              {formattedJoinDate}
            </p>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <DeleteAdminDialog
        admin={admin}
        isOpen={isDeleteDialogOpen}
        isLoading={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
