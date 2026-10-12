"use client";

import * as React from "react";
import { AlertTriangle, Loader2, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MockDistrictItem } from "@/data/mock/organization";

interface DeleteDistrictDialogProps {
  district: MockDistrictItem | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteDistrictDialog({
  district,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: DeleteDistrictDialogProps) {
  if (!isOpen || !district) return null;

  const hasAdmin = Boolean(district.adminProfile);
  const hasVolunteers = (district.volunteerCount ?? 0) > 0;
  const isBlocked = hasAdmin || hasVolunteers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-district-dialog-title"
      >
        {/* HEADER ICON & TITLE */}
        <div className="flex items-start gap-3.5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-red-100 text-red-600 shrink-0">
            <Trash2 className="size-5" />
          </div>
          <div>
            <h3 id="delete-district-dialog-title" className="text-base font-extrabold text-[#0B1F3A]">
              Hapus {district.type === "KOTA" ? "Kota" : "Kabupaten"}?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Tindakan ini akan menghapus data wilayah dari sistem secara permanen.
            </p>
          </div>
        </div>

        {/* DISTRICT INFO BOX */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Nama Wilayah:</span>
            <span className="font-extrabold text-[#0B1F3A] flex items-center gap-1.5">
              <Building2 className="size-3.5 text-[#124E8C]" />
              {district.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Kode Wilayah:</span>
            <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              {district.code}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Tipe Wilayah:</span>
            <span className="font-semibold text-slate-700">{district.type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Administrator:</span>
            <span className={district.adminProfile ? "font-bold text-[#0B1F3A]" : "italic text-slate-400"}>
              {district.adminProfile ? district.adminProfile.full_name : "Belum ada"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Jumlah Relawan:</span>
            <span className="font-bold text-slate-800">
              {district.volunteerCount ?? 0} Relawan
            </span>
          </div>
        </div>

        {/* WARNING ALERT / BLOCK NOTICE */}
        {isBlocked ? (
          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 p-3 border border-red-200/80 text-red-900 text-xs font-medium">
            <AlertTriangle className="size-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-bold">Tidak dapat dihapus!</p>
              <p className="text-[11px] text-red-700 mt-0.5">
                {hasAdmin && hasVolunteers
                  ? `Wilayah ini masih memiliki ${district.volunteerCount} relawan dan administrator aktif (${district.adminProfile?.full_name}). Hapus data tersebut terlebih dahulu.`
                  : hasAdmin
                  ? `Wilayah ini masih memiliki administrator aktif (${district.adminProfile?.full_name}). Hapus akun administrator daerah terlebih dahulu.`
                  : `Wilayah ini masih memiliki ${district.volunteerCount} data relawan terdaftar. Pindahkan atau hapus relawan terlebih dahulu.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 border border-amber-200/80 text-amber-900 text-xs font-medium">
            <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              <strong>Peringatan:</strong> Wilayah yang sudah dihapus tidak dapat dipulihkan kembali. Pastikan data sudah benar.
            </span>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onClose}
            className="text-xs border-slate-200"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isLoading || isBlocked}
            onClick={onConfirm}
            className="text-xs bg-red-600 hover:bg-red-700 font-bold disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="size-3.5 mr-1.5" />
                Hapus Wilayah
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
