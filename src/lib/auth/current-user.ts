import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import {
  isUserRole,
  ROLE_HOME,
  type UserProfile,
  type UserRole,
} from "@/types/auth";

export type CurrentAuthData = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
};

/**
 * Cached per-request auth helper.
 * De-duplicates Supabase auth.getUser() and profile queries across
 * layouts, pages, and server components within the same render cycle.
 */
export const getCurrentAuth = cache(async (): Promise<CurrentAuthData> => {
  const supabase = await createClient();

  // 1. Fetch user from Supabase auth
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      session: null,
      profile: null,
      role: null,
      isAuthenticated: false,
    };
  }

  // 2. Fetch user profile from database with joined district
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(`
      *,
      districts (
        id,
        name,
        code,
        type
      )
    `)
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profileData || !isUserRole(profileData.role)) {
    return {
      user,
      session: null,
      profile: null,
      role: null,
      isAuthenticated: true,
    };
  }

  const rawDistricts = profileData.districts as unknown;
  const districtInfo = (
    Array.isArray(rawDistricts) ? rawDistricts[0] : rawDistricts
  ) as UserProfile["district"];

  const profile: UserProfile = {
    id: profileData.id,
    email: profileData.email,
    full_name: profileData.full_name,
    username:
      ((profileData as { username?: string | null }).username) ||
      (profileData.role === "ADMIN_WILAYAH_BALI" ? "admin_bali" : null),
    role: profileData.role,
    district_id: profileData.district_id,
    phone: profileData.phone,
    avatar_url: profileData.avatar_url,
    province: ((profileData as { province?: string | null }).province) || "Bali",
    is_active: profileData.is_active,
    last_login_at: profileData.last_login_at,
    created_at: profileData.created_at,
    updated_at: profileData.updated_at,
    district: districtInfo || null,
    districts: districtInfo || null,
  };

  return {
    user,
    session: null,
    profile,
    role: profile.role,
    isAuthenticated: true,
  };
});

/**
 * Ensure user is logged in and possesses an allowed role.
 * Redirects to /login if unauthenticated, or to user's home dashboard if unauthorized.
 */
export async function requireAuth(
  allowedRoles?: readonly UserRole[],
): Promise<UserProfile> {
  const { user, profile, role } = await getCurrentAuth();

  if (!user) {
    redirect("/login");
  }

  if (!profile || !role) {
    redirect("/login?error=profile");
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    redirect(ROLE_HOME[role]);
  }

  return profile;
}
