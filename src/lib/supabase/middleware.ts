import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseConfig } from "@/lib/supabase/config";
import { isUserRole, type UserProfile } from "@/types/auth";

export async function getMiddlewareAuth(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseConfig();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: UserProfile | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, role, district_id, phone, avatar_url, is_active, last_login_at, created_at, updated_at",
      )
      .eq("id", user.id)
      .maybeSingle();

    if (data && isUserRole(data.role)) profile = data as UserProfile;
  }

  return { response, user, profile };
}
