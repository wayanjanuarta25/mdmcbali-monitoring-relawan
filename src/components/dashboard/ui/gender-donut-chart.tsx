"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { GenderRatio } from "@/data/mock/dashboard";

interface GenderDonutChartProps {
  data?: GenderRatio[];
  totalLabel?: string | number;
}

export function GenderDonutChart({
  data = [],
  totalLabel,
}: GenderDonutChartProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalCount =
    totalLabel || data.reduce((acc, curr) => acc + curr.count, 0);

  if (!isMounted) {
    return (
      <div className="h-[280px] w-full flex items-center justify-center bg-slate-50/50 rounded-lg">
        <span className="text-xs text-slate-400">Memuat grafik...</span>
      </div>
    );
  }

  if (data.length === 0 || Number(totalCount) === 0) {
    return (
      <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
        <p className="font-semibold text-slate-500">Belum ada data komposisi gender</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
          Grafik rasio gender akan otomatis terisi saat data relawan ditambahkan.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || (index === 0 ? "#124E8C" : "#0EA5E9")}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0B1F3A",
              borderRadius: "8px",
              color: "#FFFFFF",
              border: "none",
              fontSize: "12px",
            }}
            formatter={(val, name) => [
              `${Number(val ?? 0).toLocaleString("id-ID")} Relawan`,
              String(name),
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => {
              const item = data.find((d) => d.name === value);
              return (
                <span className="text-xs font-semibold text-slate-700 mx-2">
                  {value}:{" "}
                  <span className="font-bold text-[#0B1F3A]">
                    {item?.percentage}%
                  </span>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center indicator */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="block text-xl font-extrabold text-[#0B1F3A]">
          {typeof totalCount === "number"
            ? totalCount.toLocaleString("id-ID")
            : totalCount}
        </span>
        <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Total
        </span>
      </div>
    </div>
  );
}
