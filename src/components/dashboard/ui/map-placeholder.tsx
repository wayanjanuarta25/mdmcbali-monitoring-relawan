import * as React from "react";
import { Map, MapPin, Layers, Compass, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const REGIONS = [
  { name: "Sumatera", relawan: "4.820" },
  { name: "Jawa", relawan: "14.600" },
  { name: "Kalimantan", relawan: "2.100" },
  { name: "Sulawesi", relawan: "2.350" },
  { name: "Bali & Nusa Tenggara", relawan: "980" },
  { name: "Maluku & Papua", relawan: "580" },
];

export function MapPlaceholder() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Header section */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#EAF3FF] text-[#124E8C]">
            <Map className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A]">
              Peta Sebaran Relawan
            </h3>
            <p className="text-xs text-slate-500">
              Visualisasi geografis posko & sebaran relawan MDMC se-Indonesia
            </p>
          </div>
        </div>
        <Badge variant="brand" className="w-fit text-xs px-3 py-1">
          <Compass className="size-3.5 animate-spin text-[#124E8C]" />
          GIS Ready
        </Badge>
      </div>

      {/* Main Map Box */}
      <div className="relative flex min-h-[300px] flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-[#0B1F3A] to-[#0A182E] p-8 text-center text-white overflow-hidden">
        {/* Subtle SVG Grid overlay effect */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Pulse location pins */}
        <div className="absolute top-1/3 left-1/4 flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] font-medium text-sky-200 animate-pulse">
          <MapPin className="size-3 text-red-400 fill-red-400" /> Jabar (4.850)
        </div>
        <div className="absolute top-1/2 left-2/3 flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] font-medium text-sky-200 animate-pulse delay-300">
          <MapPin className="size-3 text-red-400 fill-red-400" /> Sulsel (1.650)
        </div>
        <div className="absolute bottom-1/3 right-1/4 flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] font-medium text-sky-200 animate-pulse delay-700">
          <MapPin className="size-3 text-red-400 fill-red-400" /> Papua (580)
        </div>

        {/* Center Card Content */}
        <div className="relative z-10 max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md shadow-2xl">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#124E8C] text-sky-200 shadow-inner">
            <Layers className="size-7" />
          </div>
          <h4 className="mt-4 text-xl font-bold tracking-tight text-white">
            Interactive Map Indonesia
          </h4>
          <p className="mt-2 text-xs sm:text-sm text-sky-100/80 leading-relaxed">
            Modul peta interaktif ArcGIS/Leaflet GIS nasional sedang disiapkan untuk integrasi live tracking tanggap darurat bencana.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
            <ExternalLink className="size-3.5" />
            Available in next phase
          </div>
        </div>
      </div>

      {/* Region Footer pills */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 sm:grid-cols-3 lg:grid-cols-6 border-t border-slate-100">
        {REGIONS.map((r) => (
          <div
            key={r.name}
            className="flex flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-white p-2.5 text-center shadow-2xs"
          >
            <span className="text-[11px] font-medium text-slate-500 truncate w-full">
              {r.name}
            </span>
            <span className="text-xs font-bold text-[#0B1F3A]">
              {r.relawan} Relawan
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
