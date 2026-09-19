import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  subtitle?: string;
  badge?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendDirection = "up",
  subtitle,
  badge,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      {/* Top ambient color bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#124E8C] transition-colors" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl">
              {value}
            </h3>
            {badge && (
              <Badge variant="brand" className="text-[10px] px-2 py-0">
                {badge}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50/80 text-[#124E8C] group-hover:bg-[#124E8C] group-hover:text-white transition-colors duration-200 shadow-xs">
          {icon}
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          {trend ? (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                trendDirection === "up"
                  ? "text-emerald-600"
                  : trendDirection === "down"
                  ? "text-rose-600"
                  : "text-slate-600"
              }`}
            >
              {trendDirection === "up" && <TrendingUp className="size-3.5" />}
              {trendDirection === "down" && (
                <TrendingDown className="size-3.5" />
              )}
              {trend}
            </span>
          ) : null}
          {subtitle && (
            <span className="truncate text-slate-400 font-normal">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
