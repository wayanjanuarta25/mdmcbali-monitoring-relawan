"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "info" | "warning";
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastNotification({
  toasts,
  onDismiss,
}: ToastNotificationProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xl text-slate-800 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="flex items-start gap-3">
            {toast.type === "success" && (
              <CheckCircle2 className="size-5 text-emerald-600 mt-0.5 shrink-0" />
            )}
            {toast.type === "warning" && (
              <AlertCircle className="size-5 text-amber-500 mt-0.5 shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="size-5 text-[#124E8C] mt-0.5 shrink-0" />
            )}
            <div>
              <h4 className="text-xs font-bold text-[#0B1F3A]">{toast.title}</h4>
              {toast.description && (
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            aria-label="Tutup notifikasi"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
