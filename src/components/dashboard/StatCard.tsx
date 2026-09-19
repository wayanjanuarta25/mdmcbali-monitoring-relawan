"use client";

import * as React from "react";
import {
  Map,
  Users,
  UserRound,
  ShieldCheck,
  UserPlus,
  Database,
  Building2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconName?: "Map" | "Users" | "UserRound" | "ShieldCheck" | "UserPlus" | "DatabaseCheck" | "Building2";
  subtitle?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  badge?: string;
  className?: string;
}

const ICON_MAP = {
  Map: Map,
  Users: Users,
  UserRound: UserRound,
  ShieldCheck: ShieldCheck,
  UserPlus: UserPlus,
  DatabaseCheck: Database,
  Building2: Building2,
};

export function StatCard({
  title,
  value,
  icon,
  iconName,
  subtitle,
  trend,
  trendDirection = "up",
  badge,
  className,
}: StatCardProps) {
  const ResolvedIcon = iconName ? ICON_MAP[iconName] : null;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#124E8C]/30",
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </span>

          <div className="flex items-center gap-1.5">
            {badge && (
              <Badge variant="brand" className="text-[10px] px-2 py-0.5">
                {badge}
              </Badge>
            )}

            <div className="flex size-10 items-center justify-center rounded-xl bg-[#EAF3FF] text-[#124E8C] transition-transform group-hover:scale-110">
              {icon || (ResolvedIcon ? <ResolvedIcon className="size-5" /> : null)}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-[#0B1F3A] tracking-tight">
            {value}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        {subtitle ? (
          <span className="text-slate-500 font-medium truncate">{subtitle}</span>
        ) : null}

        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-bold text-[11px] shrink-0 ml-auto",
              trendDirection === "up" ? "text-emerald-600" : "text-amber-600",
            )}
          >
            {trendDirection === "up" ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {trend}
          </span>
        ) : null}
      </div>
    </div>
  );
}
