"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  UserCheck,
  MapPin,
  ChevronRight,
  Bell,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/app/login/actions";
import type { UserRole } from "@/types/auth";

interface SidebarProps {
  role: UserRole;
  onItemClick?: () => void;
  onTriggerToast?: (title: string, description: string) => void;
}

export function Sidebar({ role, onItemClick }: SidebarProps) {
  const pathname = usePathname();

  const isWilayahAdmin = role === "ADMIN_WILAYAH_BALI";

  // Menu items according to Phase 4.7 specifications
  const navItems = isWilayahAdmin
    ? [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/admin/wilayah",
          exact: true,
        },
        {
          label: "Kabupaten/Kota",
          icon: Building2,
          href: "/admin/wilayah/districts",
          exact: false,
        },
        {
          label: "Admin Daerah",
          icon: UserCheck,
          href: "/admin/wilayah/admins",
          exact: false,
        },
        {
          label: "Relawan",
          icon: Users,
          href: "/admin/wilayah/volunteers",
          exact: false,
        },
        {
          label: "Notifikasi",
          icon: Bell,
          href: "/admin/wilayah/notifications",
          exact: false,
        },
        {
          label: "Laporan",
          icon: FileText,
          href: "/admin/wilayah/reports",
          exact: false,
        },
        {
          label: "Profile",
          icon: UserCircle,
          href: "/admin/wilayah/profile",
          exact: false,
        },
        {
          label: "Settings",
          icon: Settings,
          href: "/admin/wilayah/settings",
          exact: false,
        },
      ]
    : [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/admin/daerah",
          exact: true,
        },
        {
          label: "Data Relawan",
          icon: Users,
          href: "/admin/daerah/volunteers",
          exact: false,
        },
        {
          label: "Profil Daerah",
          icon: MapPin,
          href: "/admin/daerah/profile",
          exact: false,
        },
        {
          label: "Laporan",
          icon: FileText,
          href: "/admin/daerah/reports",
          exact: false,
        },
      ];

  const handleNavClick = () => {
    if (onItemClick) onItemClick();
  };

  return (
    <aside className="flex h-full w-full flex-col bg-[#0B1F3A] text-white select-none">
      {/* BRAND & LOGO AREA */}
      <div className="flex flex-col gap-3 border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-white p-1 shadow-md ring-1 ring-white/20 shrink-0">
            <Image
              src="/logo-mdmc.png"
              alt="Logo MDMC"
              width={38}
              height={38}
              className="size-full object-contain"
              priority
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-wider text-white">
                MDMC BALI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-700/50">
                {isWilayahAdmin ? "WILAYAH" : "DAERAH"}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-300 leading-tight">
              Volunteer Management System
            </p>
          </div>
        </div>

        {/* ONLINE SYSTEM BADGE */}
        <div className="mt-1 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
              ONLINE SYSTEM
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">v4.0</span>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {isWilayahAdmin ? "Menu Utama Wilayah Bali" : "Menu Utama Daerah"}
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (!item.exact && item.href !== "#" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleNavClick}
              className={`group flex items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-[#124E8C] text-white shadow-md ring-1 ring-white/20"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`size-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-amber-300" : "text-sky-300/80 group-hover:text-white"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={`size-3.5 transition-transform ${
                  isActive
                    ? "text-white opacity-100 translate-x-0.5"
                    : "text-slate-500 opacity-0 group-hover:opacity-100"
                }`}
              />
            </Link>
          );
        })}

        {/* LOGOUT BUTTON */}
        <form action={logout} className="pt-2 mt-2 border-t border-white/10">
          <button
            type="submit"
            className="group flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-all duration-150 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut className="size-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Logout</span>
            </div>
          </button>
        </form>
      </div>

      {/* FOOTER ACCESS INFO */}
      <div className="border-t border-white/10 p-4 bg-slate-950/40 text-slate-400 text-[11px]">
        <div className="flex items-center justify-between">
          <span>Role Akses:</span>
          <Badge
            variant="outline"
            className="text-[10px] font-bold border-white/20 text-sky-300 bg-white/5"
          >
            {role}
          </Badge>
        </div>
        <p className="mt-2 text-[10px] text-slate-400 font-sans">
          MDMC Bali Volunteer System © 2026
        </p>
      </div>
    </aside>
  );
}
