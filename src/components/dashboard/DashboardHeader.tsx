"use client";

import * as React from "react";
import { Calendar, ShieldCheck, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NotificationItem } from "@/types/notification";

export interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  badge: string;
  status?: string;
  notification?: NotificationItem | null;
  currentDate?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  badge,
  notification,
  currentDate,
}: DashboardHeaderProps) {
  const dateStr =
    currentDate ||
    new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#0B1F3A] via-[#124E8C] to-[#1E3A5F] p-6 sm:p-8 text-white shadow-lg border border-[#124E8C]/30 animate-in fade-in-50 duration-300">
      <div className="flex items-start gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-amber-300 border border-white/15 shrink-0 shadow-inner">
          <ShieldCheck className="size-8 text-amber-300" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="brand"
              className="bg-sky-400/20 text-sky-100 border-sky-400/30 text-[10px] font-bold tracking-wider"
            >
              {badge}
            </Badge>

            {notification && notification.type === "DARURAT" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/30 text-rose-100 border border-rose-400/40 shadow-xs animate-pulse">
                <AlertTriangle className="size-3.5 text-rose-300" />
                STATUS: {notification.title.toUpperCase()}
              </span>
            )}

            {notification && notification.type === "PERINGATAN" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/30 text-amber-100 border border-amber-400/40 shadow-xs">
                <AlertCircle className="size-3.5 text-amber-300" />
                STATUS: {notification.title.toUpperCase()}
              </span>
            )}

            {notification && notification.type === "INFORMASI" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-sky-400/20 text-sky-100 border border-sky-400/40 shadow-xs">
                <Info className="size-3.5 text-sky-300" />
                INFO: {notification.title}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-sky-200 bg-white/10 px-4 py-2 rounded-xl border border-white/15 shrink-0 self-start md:self-auto font-medium">
        <Calendar className="size-4 text-amber-300 shrink-0" />
        <span>{dateStr}</span>
      </div>
    </div>
  );
}
