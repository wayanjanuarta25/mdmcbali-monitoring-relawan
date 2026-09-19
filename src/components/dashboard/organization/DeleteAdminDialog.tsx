"use client";

import * as React from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MockAdminProfile } from "@/data/mock/organization";

interface DeleteAdminDialogProps {
  admin: MockAdminProfile | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAdminDialog({
  admin,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: DeleteAdminDialogProps) {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* HEADER ICON & TITLE */}
        <div className="flex items-start gap-3.5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-red-100 text-red-600 shrink-0">
            <Trash2 className="size-5" />
          </div>
          <div>
            <h3 id="dialog-title" className="text-base font-extrabold text-[#0B1F3A]">
              Hapus Admin Daerah?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Tindakan ini akan menghapus akun administrator daerah secara permanen dari sistem.
            </p>
          </div>
        </div>

        {/* ADMIN INFO BOX */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Nama Admin:</span>
            <span className="font-extrabold text-[#0B1F3A]">{admin.full_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Kabupaten/Kota:</span>
            <span className="font-bold text-[#124E8C]">
              {admin.district_name || "Daerah Bali"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Email:</span>
            <span className="font-mono text-slate-700">{admin.email}</span>
          </div>
        </div>

        {/* WARNING ALERT */}
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 border border-amber-200/80 text-amber-900 text-xs font-medium">
          <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            <strong>Peringatan:</strong> Akun akan dinonaktifkan dan tidak dapat login kembali.
          </span>
        </div>

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
            disabled={isLoading}
            onClick={onConfirm}
            className="text-xs bg-red-600 hover:bg-red-700 font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="size-3.5 mr-1.5" />
                Hapus Akun
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
