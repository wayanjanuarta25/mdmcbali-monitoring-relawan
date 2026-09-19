"use client";

import * as React from "react";
import { WilayahDashboardView } from "@/components/dashboard/views/wilayah-dashboard-view";
import {
  DaerahDashboardView,
  type DaerahVolunteerStats,
} from "@/components/dashboard/views/daerah-dashboard-view";
import type { UserProfile, DistrictInfo } from "@/types/auth";
import type {
  DistrictDistribution,
  GenderRatio,
  DistrictStatusItem,
  ActivityItem,
} from "@/data/mock/dashboard";
import type { NotificationItem } from "@/types/notification";

export interface RoleDashboardProps {
  profile: UserProfile;
  eyebrow?: string;
  title?: string;
  description?: string;
  scopeLabel?: string;
  districtCount?: number;
  adminCount?: number;
  volunteerCount?: number;
  districtStatuses?: DistrictStatusItem[];
  volunteerDistribution?: DistrictDistribution[];
  genderStats?: GenderRatio[];
  activeNotification?: NotificationItem | null;
  recentActivities?: ActivityItem[];
  district?: DistrictInfo | null;
  daerahStats?: DaerahVolunteerStats | null;
}

export function RoleDashboard({
  profile,
  scopeLabel,
  districtCount = 0,
  adminCount = 0,
  volunteerCount = 0,
  districtStatuses = [],
  volunteerDistribution = [],
  genderStats = [],
  activeNotification = null,
  recentActivities = [],
  district,
  daerahStats,
}: RoleDashboardProps) {
  const isDaerahView =
    profile.role === "ADMIN_DAERAH" || scopeLabel === "Kabupaten/Kota";

  return isDaerahView ? (
    <DaerahDashboardView
      profile={profile}
      district={district}
      stats={daerahStats}
    />
  ) : (
    <WilayahDashboardView
      profile={profile}
      districtCount={districtCount}
      adminCount={adminCount}
      volunteerCount={volunteerCount}
      districtStatuses={districtStatuses}
      volunteerDistribution={volunteerDistribution}
      genderStats={genderStats}
      activeNotification={activeNotification}
      recentActivities={recentActivities}
    />
  );
}

