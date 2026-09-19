"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AgeDistribution } from "@/data/mock/dashboard";

interface AgeBarChartProps {
  data?: AgeDistribution[];
}

export function AgeBarChart({ data = [] }: AgeBarChartProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[280px] w-full flex items-center justify-center bg-slate-50/50 rounded-lg">
        <span className="text-xs text-slate-400">Memuat grafik...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
        <p className="font-semibold text-slate-500">Belum ada data distribusi usia</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
          Grafik kelompok usia akan otomatis terisi saat data relawan ditambahkan.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 10, left: -15, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="range"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={{ stroke: "#CBD5E1" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0B1F3A",
              borderRadius: "8px",
              color: "#FFFFFF",
              border: "none",
              fontSize: "12px",
            }}
            formatter={(val, _name, props) => [
              `${val}% (${props.payload.count} Relawan)`,
              "Persentase Usia",
            ]}
          />
          <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || (index === 1 ? "#124E8C" : "#0EA5E9")}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
