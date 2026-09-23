"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { insertAuditLog } from "@/lib/audit/log-event";
import { isValidUsername } from "@/types/auth";

export interface ProfileActionState {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Update personal profile information (full_name, phone, avatar_url)
 */
export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  try {
    // 1. Authorize: must be ADMIN_WILAYAH_BALI
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);

    // 2. Validate caller from Supabase Auth
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== currentAdmin.id) {
      return {
        success: false,
        error: "Sesi tidak valid atau kedaluwarsa. Silakan login kembali.",
      };
    }

    // 3. Extract only allowed editable fields
    const fullNameRaw = formData.get("full_name")?.toString().trim() || "";
    const phoneRaw = formData.get("phone")?.toString().trim() || "";
    const avatarUrlRaw = formData.get("avatar_url")?.toString().trim() || "";

    if (!fullNameRaw || fullNameRaw.length < 3) {
      return {
        success: false,
        error: "Nama lengkap wajib diisi minimal 3 karakter.",
      };
    }

    // Phone validation if provided
    if (phoneRaw && !/^[0-9+\-\s]{8,20}$/.test(phoneRaw)) {
      return {
        success: false,
        error: "Format nomor HP tidak valid (gunakan 8-20 karakter angka).",
      };
    }

    // 4. Update public.profiles WHERE id = auth.uid()
    // STRICT SECURITY: Only full_name, phone, and avatar_url can be updated
    // ID, role, and province are strictly protected
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullNameRaw,
        phone: phoneRaw || null,
        avatar_url: avatarUrlRaw || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return {
        success: false,
        error: `Gagal memperbarui profil: ${updateError.message}`,
      };
    }

    // 5. Insert audit log
    await insertAuditLog(supabase, {
      user_id: user.id,
      action: "UPDATE_PROFILE",
      event: "UPDATE_PROFILE",
      target_type: "PROFILES",
      target_id: user.id,
      description: `Admin Wilayah memperbarui profil: ${fullNameRaw}`,
      metadata: {
        full_name: fullNameRaw,
        phone: phoneRaw,
        avatar_url: avatarUrlRaw,
      },
    });

    // 6. Revalidate cache
    revalidatePath("/admin/wilayah/profile");
    revalidatePath("/admin/wilayah");

    return {
      success: true,
      message: "Profil Admin Wilayah berhasil diperbarui!",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return { success: false, error: message };
  }
}

/**
 * Update account identity (username and email)
 * Flow:
 * Submit username & email -> check auth -> check username duplicate -> update profiles -> update Supabase Auth email -> audit log -> revalidatePath
 */
export async function updateAccountIdentityAction(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  try {
    // 1. Authorize: must be ADMIN_WILAYAH_BALI
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);

    // 2. Validate caller from Supabase Auth
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== currentAdmin.id) {
      return {
        success: false,
        error: "Sesi tidak valid atau kedaluwarsa. Silakan login kembali.",
      };
    }

    const newUsernameRaw = formData.get("username")?.toString().trim().toLowerCase() || "";
    const newEmailRaw = formData.get("email")?.toString().trim().toLowerCase() || "";

    // 3. Username Validation
    if (!newUsernameRaw) {
      return { success: false, error: "Username wajib diisi." };
    }

    if (newUsernameRaw.length < 5) {
      return { success: false, error: "Username minimal 5 karakter." };
    }

    if (newUsernameRaw.length > 30) {
      return { success: false, error: "Username maksimal 30 karakter." };
    }

    if (!isValidUsername(newUsernameRaw)) {
      return {
        success: false,
        error: "Format username tidak valid. Hanya boleh huruf kecil, angka, dan underscore (_).",
      };
    }

    // Email validation
    if (!newEmailRaw || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmailRaw)) {
      return { success: false, error: "Format email tidak valid." };
    }

    // 4. Fetch current profile data for comparison
    const { data: currentProfileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const oldUsername = currentProfileData?.username || "";
    const oldEmail = currentProfileData?.email || user.email || "";

    // 5. Check duplicate username
    if (newUsernameRaw !== oldUsername) {
      const adminClient = createAdminClient();
      const { data: duplicateUser, error: checkError } = await adminClient
        .from("profiles")
        .select("id")
        .eq("username", newUsernameRaw)
        .neq("id", user.id)
        .maybeSingle();

      if (
        checkError &&
        (checkError.message.includes("column") ||
          checkError.message.includes("schema cache") ||
          checkError.code === "42703" ||
          checkError.code === "PGRST204")
      ) {
        return {
          success: false,
          error:
            "Kolom 'username' belum dibuat di tabel profiles Supabase. Silakan jalankan query migrasi di SQL Editor Supabase terlebih dahulu.",
        };
      }

      if (duplicateUser) {
        return { success: false, error: "Username sudah digunakan" };
      }
    }

    // 6. Update email in Supabase Auth if changed
    let emailChanged = false;
    if (newEmailRaw !== oldEmail) {
      const { error: emailUpdateError } = await supabase.auth.updateUser({
        email: newEmailRaw,
      });

      if (emailUpdateError) {
        return {
          success: false,
          error: `Gagal memperbarui email akun: ${emailUpdateError.message}`,
        };
      }
      emailChanged = true;
    }

    // 7. Update public.profiles
    const updatePayload: Record<string, unknown> = {
      username: newUsernameRaw,
      updated_at: new Date().toISOString(),
    };

    if (emailChanged) {
      updatePayload.email = newEmailRaw;
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id);

    if (profileUpdateError) {
      if (
        profileUpdateError.message.includes("column") ||
        profileUpdateError.message.includes("schema cache") ||
        profileUpdateError.code === "PGRST204" ||
        profileUpdateError.code === "42703"
      ) {
        return {
          success: false,
          error:
            "Kolom 'username' belum ada di tabel profiles Supabase. Silakan jalankan file migrasi 'supabase/migrations/202609230002_add_username_to_profiles.sql' di SQL Editor Supabase.",
        };
      }
      return {
        success: false,
        error: `Gagal memperbarui identitas profil: ${profileUpdateError.message}`,
      };
    }

    // 8. Insert audit log
    await insertAuditLog(supabase, {
      user_id: user.id,
      action: "UPDATE_PROFILE",
      event: "UPDATE_PROFILE",
      target_type: "PROFILES",
      target_id: user.id,
      description: `Admin Wilayah memperbarui identitas akun (Username: @${newUsernameRaw}, Email: ${newEmailRaw})`,
      metadata: {
        old_username: oldUsername,
        new_username: newUsernameRaw,
        old_email: oldEmail,
        new_email: newEmailRaw,
        email_changed: emailChanged,
      },
    });

    // 9. Revalidate cache
    revalidatePath("/admin/wilayah/profile");
    revalidatePath("/admin/wilayah");

    const message = emailChanged
      ? "Username berhasil disimpan! Tautan konfirmasi telah dikirim ke email baru Anda."
      : "Identitas akun (Username & Email) berhasil diperbarui!";

    return {
      success: true,
      message,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return { success: false, error: message };
  }
}

// Alias as specified in requirements
export const updateAccountIdentity = updateAccountIdentityAction;
