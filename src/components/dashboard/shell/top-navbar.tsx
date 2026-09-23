"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Menu,
  User,
  Settings,
  Shield,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/types/auth";
import type { NotificationType, NotificationPriority } from "@/types/notification";
import {
  getUserNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from "@/app/admin/wilayah/notifications/actions";

interface TopNavbarProps {
  profile: UserProfile;
  onMobileMenuToggle: () => void;
  onTriggerToast: (title: string, description: string) => void;
}

interface UserNotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  created_at: string;
  is_read: boolean;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `${diffMin}m lalu`;
    if (diffHours < 24) return `${diffHours}j lalu`;
    return `${diffDays}h lalu`;
  } catch {
    return "Baru saja";
  }
}

export function TopNavbar({
  profile,
  onMobileMenuToggle,
  onTriggerToast,
}: TopNavbarProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const [notifications, setNotifications] = React.useState<UserNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [activeStatusNotification, setActiveStatusNotification] = React.useState<{
    id: string;
    title: string;
    type: NotificationType;
    priority: NotificationPriority;
  } | null>(null);

  const notifRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Fetch real notifications on mount
  React.useEffect(() => {
    let isMounted = true;
    getUserNotificationsAction().then((res) => {
      if (isMounted) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
        setActiveStatusNotification(res.activeStatusNotification);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: UserNotificationItem) => {
    if (!notif.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await markNotificationAsReadAction(notif.id);
    }
    onTriggerToast(notif.title, notif.message);
    setShowNotifications(false);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await markAllNotificationsAsReadAction();
    onTriggerToast("Notifikasi", "Semua notifikasi telah ditandai dibaca");
    setShowNotifications(false);
  };

  const userInitials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "MD";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 shadow-xs">
      {/* LEFT SECTION: Greeting & User Name */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onMobileMenuToggle}
          className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu className="size-5" />
        </button>

        {/* Mobile MDMC Logo */}
        <div className="flex items-center lg:hidden mr-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-white p-0.5 border border-slate-200 shadow-xs">
            <Image
              src="/logo-mdmc.png"
              alt="Logo MDMC"
              width={28}
              height={28}
              className="size-full object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-slate-500">
            Selamat datang kembali
          </span>
          <h2 className="text-sm sm:text-base font-extrabold text-[#0B1F3A] flex items-center gap-2">
            <span>{profile.full_name}</span>
            <span className="hidden md:inline-flex">
              <Badge variant="brand" className="text-[10px] py-0 px-2">
                {profile.role}
              </Badge>
            </span>
          </h2>
        </div>
      </div>

      {/* RIGHT SECTION: Status Badge, Notification Bell, Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dynamic Emergency / Siaga Status Pill (Desktop only) */}
        {activeStatusNotification && (
          <div
            className={`hidden xl:flex items-center gap-2 rounded-full px-3 py-1 border text-xs font-bold ${
              activeStatusNotification.type === "DARURAT" ||
              activeStatusNotification.priority === "CRITICAL"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : activeStatusNotification.type === "PERINGATAN"
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-sky-50 border-sky-200 text-sky-800"
            }`}
          >
            <Shield
              className={`size-3.5 ${
                activeStatusNotification.type === "DARURAT"
                  ? "text-rose-600 fill-rose-600"
                  : activeStatusNotification.type === "PERINGATAN"
                  ? "text-amber-600 fill-amber-600"
                  : "text-sky-600 fill-sky-600"
              }`}
            />
            <span className="truncate max-w-[280px]">
              {activeStatusNotification.title}
            </span>
          </div>
        )}

        {/* NOTIFICATION BELL DROPDOWN */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0B1F3A] transition-colors"
            aria-label="Lihat notifikasi"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-90 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50 animate-in fade-in-50 slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-[#0B1F3A] flex items-center gap-1.5">
                  <Bell className="size-3.5 text-[#124E8C]" /> Notifikasi Sistem
                </h4>
                {unreadCount > 0 ? (
                  <Badge variant="secondary" className="text-[10px] bg-rose-100 text-rose-800 border-rose-200 font-bold">
                    {unreadCount} Baru
                  </Badge>
                ) : (
                  <span className="text-[10px] text-slate-400">Semua dibaca</span>
                )}
              </div>

              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    <p className="font-semibold text-slate-500">Tidak ada notifikasi baru</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Sistem berjalan normal</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`flex items-start gap-3 rounded-xl p-2.5 text-xs transition-colors cursor-pointer border ${
                        !n.is_read
                          ? "bg-blue-50/70 border-blue-200/60 hover:bg-blue-50"
                          : "border-transparent hover:bg-slate-50"
                      }`}
                    >
                      {n.type === "DARURAT" && (
                        <AlertTriangle className="size-4 text-rose-500 mt-0.5 shrink-0" />
                      )}
                      {n.type === "PERINGATAN" && (
                        <AlertTriangle className="size-4 text-amber-500 mt-0.5 shrink-0" />
                      )}
                      {n.type === "INFORMASI" && (
                        <Shield className="size-4 text-[#124E8C] mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-slate-800 truncate">{n.title}</p>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {formatRelativeTime(n.created_at)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && unreadCount > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-[#124E8C] hover:underline cursor-pointer"
                  >
                    Tandai Semua Dibaca
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PROFILE AVATAR DROPDOWN */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#124E8C] text-xs font-bold text-white shadow-xs">
              {userInitials}
            </div>
            <span className="hidden sm:block text-xs font-bold text-[#0B1F3A] max-w-[100px] truncate">
              {profile.full_name}
            </span>
            <ChevronDown className="size-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in-50 slide-in-from-top-2 space-y-1">
              <div className="border-b border-slate-100 px-3 py-2 space-y-0.5">
                <p className="text-xs font-bold text-[#0B1F3A] truncate">
                  {profile.full_name}
                </p>
                <p className="text-[10px] font-mono font-semibold text-[#124E8C] truncate">
                  @{profile.username || "admin_bali"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{profile.email}</p>
              </div>

              <Link
                href={profile.role === "ADMIN_WILAYAH_BALI" ? "/admin/wilayah/profile" : "/admin/daerah/profile"}
                onClick={() => setShowProfileMenu(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <User className="size-4 text-slate-500" />
                <span>Profile</span>
              </Link>

              <Link
                href={profile.role === "ADMIN_WILAYAH_BALI" ? "/admin/wilayah/settings" : "#"}
                onClick={() => {
                  if (profile.role !== "ADMIN_WILAYAH_BALI") {
                    onTriggerToast("Settings", "Pengaturan Akun & Keamanan Sesi");
                  }
                  setShowProfileMenu(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Settings className="size-4 text-slate-500" />
                <span>Settings</span>
              </Link>

              <div className="border-t border-slate-100 pt-1">
                <div className="w-full">
                  <LogoutButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
