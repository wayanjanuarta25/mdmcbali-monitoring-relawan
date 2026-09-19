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
import type { DistrictDistribution } from "@/data/mock/dashboard";

interface ProvinceBarChartProps {
  data?: DistrictDistribution[];
}

export function ProvinceBarChart({ data = [] }: ProvinceBarChartProps) {
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
        <p className="font-semibold text-slate-500">Belum ada data distribusi relawan</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
          Tambahkan kabupaten/kota dan relawan untuk melihat grafik distribusi.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="district"
            tick={{ fontSize: 11, fill: "#64748B" }}
            interval={0}
            angle={-25}
            textAnchor="end"
            tickLine={false}
            axisLine={{ stroke: "#CBD5E1" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0B1F3A",
              borderRadius: "8px",
              color: "#FFFFFF",
              border: "none",
              fontSize: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
            }}
            formatter={(val) => [
              `${Number(val ?? 0).toLocaleString("id-ID")} Relawan`,
              "Jumlah",
            ]}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 3 || index === 0 ? "#124E8C" : "#0EA5E9"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
