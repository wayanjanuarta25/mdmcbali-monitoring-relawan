"use client";

import * as React from "react";
import {
  Bell,
  AlertTriangle,
  Flame,
  Info,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  Globe,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NotificationItem, NotificationType, NotificationPriority } from "@/types/notification";
import {
  toggleNotificationAction,
  softDeleteNotificationAction,
} from "@/app/admin/wilayah/notifications/actions";
import Link from "next/link";

interface NotificationTableProps {
  notifications: (NotificationItem & {
    target_district_name?: string | null;
  })[];
}

export function NotificationTable({ notifications }: NotificationTableProps) {
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    setFeedback(null);
    try {
      const res = await toggleNotificationAction(id, currentStatus);
      if (res.success) {
        setFeedback({
          type: "success",
          message: res.message || "Status notifikasi berhasil diperbarui.",
        });
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Gagal memperbarui status.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Terjadi kesalahan sistem saat mengubah status.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus notifikasi "${title}"? Tindakan ini dapat dipulihkan melalui audit log.`)) {
      return;
    }
    setLoadingId(id);
    setFeedback(null);
    try {
      const res = await softDeleteNotificationAction(id);
      if (res.success) {
        setFeedback({
          type: "success",
          message: res.message || "Notifikasi berhasil dihapus.",
        });
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Gagal menghapus notifikasi.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Terjadi kesalahan sistem saat menghapus notifikasi.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case "DARURAT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <Flame className="size-3.5 text-rose-600" />
            DARURAT
          </span>
        );
      case "PERINGATAN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="size-3.5 text-amber-600" />
            PERINGATAN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
            <Info className="size-3.5 text-sky-600" />
            INFORMASI
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case "CRITICAL":
        return (
          <Badge className="bg-rose-600 text-white font-mono text-[10px] uppercase">
            CRITICAL
          </Badge>
        );
      case "HIGH":
        return (
          <Badge className="bg-amber-500 text-white font-mono text-[10px] uppercase">
            HIGH
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge variant="secondary" className="font-mono text-[10px] uppercase text-slate-700 bg-slate-100">
            MEDIUM
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-mono text-[10px] uppercase text-slate-500">
            LOW
          </Badge>
        );
    }
  };

  const getTargetLabel = (notif: NotificationItem & { target_district_name?: string | null }) => {
    if (notif.target_type === "ALL") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium">
          <Globe className="size-3.5 text-sky-600" />
          Semua Bali
        </span>
      );
    }
    if (notif.target_type === "ADMIN_DAERAH") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium">
          <Users className="size-3.5 text-emerald-600" />
          Admin Daerah
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium">
        <MapPin className="size-3.5 text-rose-600" />
        {notif.target_district_name || "Daerah Spesifik"}
      </span>
    );
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white shadow-xs">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-[#124E8C] mb-4">
          <Bell className="size-7" />
        </div>
        <h3 className="text-base font-bold text-[#0B1F3A]">Belum Ada Notifikasi</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          Belum ada notifikasi atau broadcast yang diterbitkan oleh Pengurus Wilayah MDMC Bali.
        </p>
        <Link
          href="/admin/wilayah/notifications/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#124E8C] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0B1F3A] transition-all"
        >
          + Terbitkan Notifikasi
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-xl p-4 text-xs font-semibold animate-in slide-in-from-top-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="size-4 shrink-0 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Judul & Pesan</th>
                <th className="px-4 py-4">Tipe</th>
                <th className="px-4 py-4">Prioritas</th>
                <th className="px-4 py-4">Target</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Waktu</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notifications.map((n) => {
                const isLoading = loadingId === n.id;
                const formattedDate = new Date(n.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={n.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 max-w-xs sm:max-w-md">
                      <div className="space-y-1">
                        <div className="font-bold text-[#0B1F3A] text-sm">
                          {n.title}
                        </div>
                        <p className="text-slate-500 line-clamp-2 text-xs leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      {getTypeBadge(n.type)}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      {getPriorityBadge(n.priority)}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      {getTargetLabel(n)}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggle(n.id, n.is_active)}
                        disabled={isLoading}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                          n.is_active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300"
                        }`}
                        title="Klik untuk mengubah status aktif"
                      >
                        {isLoading ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <span
                            className={`size-2 rounded-full ${
                              n.is_active ? "bg-emerald-600" : "bg-slate-400"
                            }`}
                          />
                        )}
                        <span>{n.is_active ? "Aktif" : "Non-aktif"}</span>
                      </button>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3 text-slate-400" />
                        <span>{formattedDate}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(n.id, n.title)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus notifikasi (Soft delete)"
                      >
                        {isLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
