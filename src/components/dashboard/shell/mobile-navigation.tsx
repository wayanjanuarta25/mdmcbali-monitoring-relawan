"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, Building2, Users, FileText, MapPin, UserCheck } from "lucide-react";
import { Sidebar } from "./sidebar";
import type { UserRole } from "@/types/auth";

interface MobileNavigationProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (title: string, description: string) => void;
}

export function MobileNavigation({
  role,
  isOpen,
  onClose,
  onTriggerToast,
}: MobileNavigationProps) {
  const pathname = usePathname();

  const isWilayahAdmin = role === "ADMIN_WILAYAH_BALI";

  const bottomNavItems = isWilayahAdmin
    ? [
        { label: "Dashboard", icon: LayoutDashboard, href: "/admin/wilayah" },
        { label: "Kab/Kota", icon: Building2, href: "/admin/wilayah/districts" },
        { label: "Admin", icon: UserCheck, href: "/admin/wilayah/admins" },
        { label: "Relawan", icon: Users, href: "/admin/wilayah/volunteers" },
        { label: "Laporan", icon: FileText, href: "/admin/wilayah/reports" },
      ]
    : [
        { label: "Dashboard", icon: LayoutDashboard, href: "/admin/daerah" },
        { label: "Relawan", icon: Users, href: "/admin/daerah/volunteers" },
        { label: "Profil", icon: MapPin, href: "/admin/daerah/profile" },
        { label: "Laporan", icon: FileText, href: "/admin/daerah/reports" },
      ];

  return (
    <>
      {/* MOBILE DRAWER OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#0B1F3A] shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
                aria-label="Tutup menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <Sidebar
              role={role}
              onItemClick={onClose}
              onTriggerToast={onTriggerToast}
            />
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (for < 768px viewports like 390px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 w-full items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md lg:hidden shadow-lg">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive
                  ? "text-[#124E8C] font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon
                className={`size-5 mb-0.5 ${
                  isActive ? "text-[#124E8C]" : "text-slate-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
