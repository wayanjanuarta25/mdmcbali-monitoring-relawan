import * as React from "react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-32 w-full rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />

      {/* Stat cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="size-10 rounded-lg bg-slate-200" />
            </div>
            <div className="mt-4 h-8 w-20 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Chart cards skeleton */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="h-80 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="mt-6 h-60 w-full rounded bg-slate-100" />
        </div>
        <div className="h-80 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="mt-6 flex justify-center">
            <div className="size-48 rounded-full bg-slate-100 border-8 border-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
