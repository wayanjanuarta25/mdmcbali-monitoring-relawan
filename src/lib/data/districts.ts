import "server-only";

import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DistrictRecord {
  id: string;
  name: string;
  code: string;
  type: "KABUPATEN" | "KOTA";
  status?: string;
  created_at: string;
}

/**
 * Cached fetcher for master district list.
 * Uses Next.js unstable_cache to avoid hitting the database on every page navigation.
 */
export const getCachedDistricts = unstable_cache(
  async (): Promise<DistrictRecord[]> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("districts")
        .select("id, name, code, type, status, created_at")
        .order("name", { ascending: true });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          name: d.name,
          code: d.code,
          type: d.type as "KABUPATEN" | "KOTA",
          status: d.status ?? "ACTIVE",
          created_at: d.created_at,
        }));
      }
    } catch {
      // Return empty array on error
    }

    return [];
  },
  ["mdmc-districts-list"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["districts"],
  },
);

/**
 * Cached fetcher for a single district by its ID.
 */
export const getCachedDistrictById = unstable_cache(
  async (id: string): Promise<DistrictRecord | null> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("districts")
        .select("id, name, code, type, status, created_at")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          code: data.code,
          type: data.type as "KABUPATEN" | "KOTA",
          status: data.status ?? "ACTIVE",
          created_at: data.created_at,
        };
      }
    } catch {
      // Return null on error
    }

    return null;
  },
  ["mdmc-district-by-id"],
  {
    revalidate: 3600,
    tags: ["districts"],
  },
);
