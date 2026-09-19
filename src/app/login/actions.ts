"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isUserRole, ROLE_HOME } from "@/types/auth";

export type LoginState = {
  error: string | null;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Email dan password wajib diisi." };
  }

  let normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  // Support username shortcuts (bangli, badung, denpasar, wilayah)
  if (!normalizedEmail.includes("@")) {
    if (normalizedEmail === "bangli") {
      normalizedEmail = "bangli@gmail.com";
    } else if (normalizedEmail === "badung") {
      normalizedEmail = "badung@mdmc.or.id";
    } else if (normalizedEmail === "denpasar") {
      normalizedEmail = "denpasar@gmail.com";
    } else if (normalizedEmail === "wilayah") {
      normalizedEmail = "wilayah.bali@mdmc.or.id";
    } else {
      normalizedEmail = `${normalizedEmail}@mdmc.or.id`;
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
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
    return { error: "Email atau password tidak valid." };
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
