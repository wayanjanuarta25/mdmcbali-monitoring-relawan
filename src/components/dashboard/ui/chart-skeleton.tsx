import * as React from "react";
import { Skeleton } from "@/components/ui/page-skeleton";

export interface ChartSkeletonProps {
  type?: "bar" | "donut";
  height?: number;
}

export function ChartSkeleton({ type = "bar", height = 280 }: ChartSkeletonProps) {
  if (type === "donut") {
    return (
      <div
        className="w-full flex flex-col items-center justify-center relative animate-pulse"
        style={{ height: `${height}px` }}
      >
        {/* Donut Ring Skeleton */}
        <div className="relative flex items-center justify-center size-44 rounded-full border-[14px] border-slate-200/80">
          <div className="flex flex-col items-center justify-center space-y-1">
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-2 w-8 rounded-sm" />
          </div>
        </div>

        {/* Legend Skeletons */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  // Bar Chart Skeleton
  return (
    <div
      className="w-full flex flex-col justify-end p-2 space-y-3 animate-pulse"
      style={{ height: `${height}px` }}
    >
      {/* Grid Lines & Bars */}
      <div className="flex-1 flex items-end justify-between gap-3 border-b border-slate-200 pb-2 px-2">
        <Skeleton className="h-[45%] w-full rounded-t-md" />
        <Skeleton className="h-[25%] w-full rounded-t-md" />
        <Skeleton className="h-[65%] w-full rounded-t-md" />
        <Skeleton className="h-[90%] w-full rounded-t-md" />
        <Skeleton className="h-[55%] w-full rounded-t-md" />
        <Skeleton className="h-[30%] w-full rounded-t-md" />
        <Skeleton className="h-[40%] w-full rounded-t-md" />
        <Skeleton className="h-[20%] w-full rounded-t-md" />
        <Skeleton className="h-[50%] w-full rounded-t-md" />
      </div>

      {/* X-Axis Labels Skeleton */}
      <div className="flex justify-between gap-2 px-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-2.5 w-6 rounded-sm" />
        ))}
      </div>
    </div>
  );
}
