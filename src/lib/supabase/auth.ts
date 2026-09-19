import "server-only";

import { getCurrentAuth, requireAuth } from "@/lib/auth/current-user";
import type { UserProfile, UserRole } from "@/types/auth";

export async function getCurrentUser() {
  const { user } = await getCurrentAuth();
  return user;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const { profile } = await getCurrentAuth();
  return profile;
}

export async function requireRole(
  allowedRoles: readonly UserRole[],
): Promise<UserProfile> {
  return requireAuth(allowedRoles);
}

