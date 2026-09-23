"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUserRole, ROLE_HOME } from "@/types/auth";

export type LoginState = {
  error: string | null;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const identifier = formData.get("email") ?? formData.get("identifier");
  const password = formData.get("password");

  if (typeof identifier !== "string" || typeof password !== "string") {
    return { error: "Username/Email dan password wajib diisi." };
  }

  const rawInput = identifier.trim().toLowerCase();

  if (!rawInput || !password) {
    return { error: "Username/Email dan password wajib diisi." };
  }

  let cleanInput = rawInput;
  if (cleanInput.startsWith("@")) {
    cleanInput = cleanInput.slice(1).trim();
  }

  const adminClient = createAdminClient();
  let targetAuthId: string | null = null;
  let emailToUse = cleanInput;

  // 1. Try finding profile by username (e.g. selatbali1)
  const { data: userProfile } = await adminClient
    .from("profiles")
    .select("id, email, username")
    .eq("username", cleanInput)
    .maybeSingle();

  if (userProfile) {
    targetAuthId = userProfile.id;
    emailToUse = userProfile.email;
  } else if (!cleanInput.includes("@")) {
    // If not found by username and no '@', check legacy shortcuts or email prefix
    if (cleanInput === "admin_bali" || cleanInput === "wilayah") {
      const { data: wProfile } = await adminClient
        .from("profiles")
        .select("id, email")
        .eq("role", "ADMIN_WILAYAH_BALI")
        .maybeSingle();
      if (wProfile) {
        targetAuthId = wProfile.id;
        emailToUse = wProfile.email;
      } else {
        emailToUse = "wilayah.bali@mdmc.or.id";
      }
    } else {
      const { data: prefixProfile } = await adminClient
        .from("profiles")
        .select("id, email")
        .ilike("email", `${cleanInput}@%`)
        .maybeSingle();

      if (prefixProfile) {
        targetAuthId = prefixProfile.id;
        emailToUse = prefixProfile.email;
      }
    }
  } else {
    // If input has '@', also check if a profile matches this email
    const { data: emailProfile } = await adminClient
      .from("profiles")
      .select("id, email")
      .eq("email", cleanInput)
      .maybeSingle();

    if (emailProfile) {
      targetAuthId = emailProfile.id;
      emailToUse = emailProfile.email;
    }
  }

  // 2. If a profile was identified, get the exact email registered in auth.users
  if (targetAuthId) {
    try {
      const { data: authUserData } =
        await adminClient.auth.admin.getUserById(targetAuthId);
      if (authUserData?.user?.email) {
        emailToUse = authUserData.user.email;
      }
    } catch {
      // Fallback to emailToUse if getUserById fails
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password,
  });

  if (error || !data.user) {
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("email not confirmed")) {
      return {
        error:
          "Email akun belum dikonfirmasi. Silakan periksa inbox email Anda atau konfirmasi akun di Supabase Auth.",
      };
    }
    return { error: "Username atau password salah" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile || !isUserRole(profile.role)) {
    await supabase.auth.signOut();
    return {
      error:
        "Profil pengguna belum terhubung. Silakan buat ulang akun dari menu Admin Wilayah untuk menyelesaikan pendaftaran.",
    };
  }

  if (profile.is_active === false) {
    await supabase.auth.signOut();
    return {
      error: "Akun Anda telah dinonaktifkan oleh administrator MDMC Bali.",
    };
  }

  // Record last_login_at
  await supabase
    .from("profiles")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", data.user.id);

  redirect(ROLE_HOME[profile.role]);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
