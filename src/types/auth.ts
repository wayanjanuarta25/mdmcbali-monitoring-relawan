export const USER_ROLES = [
  "ADMIN_WILAYAH_BALI",
  "ADMIN_DAERAH",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type DistrictInfo = {
  id: string;
  name: string;
  code: string;
  type: "KABUPATEN" | "KOTA";
};

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  district_id: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  district?: DistrictInfo | null;
  districts?: DistrictInfo | null;
};

export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN_WILAYAH_BALI: "/admin/wilayah",
  ADMIN_DAERAH: "/admin/daerah",
};

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole);
}
