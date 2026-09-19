"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";
import { MobileNavigation } from "./mobile-navigation";
import { ToastNotification, type ToastMessage } from "../ui/toast-notification";
import type { UserProfile } from "@/types/auth";

export interface DashboardShellProps {
  profile: UserProfile;
  children: React.ReactNode;
}

export function DashboardShell({ profile, children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback(
    (title: string, description?: string, type: ToastMessage["type"] = "info") => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex">
      {/* DESKTOP FIXED SIDEBAR */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 xl:w-72 lg:flex-col">
        <Sidebar
          role={profile.role}
          onTriggerToast={(title, desc) => addToast(title, desc, "info")}
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 flex-col lg:pl-64 xl:pl-72 min-h-screen w-full">
        {/* TOP NAVBAR */}
        <TopNavbar
          profile={profile}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          onTriggerToast={(title, desc) => addToast(title, desc, "info")}
        />

        {/* PAGE CONTENT SLOT (with padding bottom for mobile bottom nav) */}
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* MOBILE NAVIGATION DRAWER & BOTTOM NAV */}
      <MobileNavigation
        role={profile.role}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onTriggerToast={(title, desc) => addToast(title, desc, "info")}
      />

      {/* TOAST NOTIFICATION CONTAINER */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
