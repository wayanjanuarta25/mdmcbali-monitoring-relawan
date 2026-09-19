"use client";

import * as React from "react";
import { UserCheck, Users, Clock, AlertCircle } from "lucide-react";
import type { ActivityItem } from "@/data/mock/dashboard";
import { cn } from "@/lib/utils";

export interface ActivityTimelineProps {
  activities: ActivityItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const ICON_BY_TYPE = {
  admin: UserCheck,
  volunteer: Users,
  update: Clock,
  alert: AlertCircle,
};

const COLOR_BY_TYPE = {
  admin: "bg-blue-100 text-[#124E8C] border-blue-200",
  volunteer: "bg-emerald-100 text-emerald-800 border-emerald-200",
  update: "bg-sky-100 text-sky-800 border-sky-200",
  alert: "bg-amber-100 text-amber-800 border-amber-200",
};

export function ActivityTimeline({
  activities,
  title = "Aktivitas Terbaru",
  subtitle = "Catatan pembaruan dan tindakan sistem MDMC Bali",
  className,
}: ActivityTimelineProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5",
        className,
      )}
    >
      <div>
        <h3 className="text-base font-bold text-[#0B1F3A]">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {activities.length === 0 ? (
        <div className="flex h-36 flex-col items-center justify-center text-center p-6 text-slate-400 text-xs rounded-xl border border-dashed border-slate-200">
          <Clock className="size-6 text-slate-300 mb-2" />
          <p className="font-semibold text-slate-600">Belum ada aktivitas tercatat</p>
          <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">
            Aktivitas pengelolaan daerah, relawan, dan notifikasi akan otomatis terekam di sini.
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pl-6 py-1">
          {activities.map((item) => {
            const Icon = ICON_BY_TYPE[item.type] || Clock;
            const colorClass = COLOR_BY_TYPE[item.type] || "bg-slate-100 text-slate-700";

            return (
              <div key={item.id} className="relative group">
                {/* Timeline Bullet Node */}
                <div
                  className={cn(
                    "absolute -left-[35px] top-0.5 flex size-8 items-center justify-center rounded-full border shadow-xs transition-transform group-hover:scale-110",
                    colorClass,
                  )}
                >
                  <Icon className="size-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-[#0B1F3A] group-hover:text-[#124E8C] transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-medium font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded w-fit">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
