"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { insertAuditLog } from "@/lib/audit/log-event";

export interface PasswordActionState {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UserNotificationSettings {
  notification_enabled: boolean;
  emergency_alert: boolean;
}

export interface SettingsActionState {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Fetch current user notification settings or return defaults
 */
export async function getUserSettingsAction(): Promise<UserNotificationSettings> {
  try {
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_settings")
      .select("notification_enabled, emergency_alert")
      .eq("id", currentAdmin.id)
      .maybeSingle();

    if (error || !data) {
      return {
        notification_enabled: true,
        emergency_alert: true,
      };
    }

    return {
      notification_enabled: data.notification_enabled ?? true,
      emergency_alert: data.emergency_alert ?? true,
    };
  } catch {
    return {
      notification_enabled: true,
      emergency_alert: true,
    };
  }
}

/**
 * Update Supabase Auth user password
 */
export async function updatePasswordAction(
  _prevState: PasswordActionState,
  formData: FormData
): Promise<PasswordActionState> {
  try {
    // 1. Auth check
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== currentAdmin.id) {
      return {
        success: false,
        error: "Sesi autentikasi tidak valid. Silakan login kembali.",
      };
    }

    const newPassword = formData.get("new_password")?.toString() || "";
    const confirmPassword = formData.get("confirm_password")?.toString() || "";

    // Validation
    if (!newPassword || newPassword.length < 8) {
      return {
        success: false,
        error: "Password baru harus memiliki panjang minimal 8 karakter.",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: "Konfirmasi password tidak cocok dengan password baru.",
      };
    }

    // 2. Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return {
        success: false,
        error: `Gagal memperbarui password: ${updateError.message}`,
      };
    }

    // 3. Insert audit log
    await insertAuditLog(supabase, {
      user_id: user.id,
      action: "UPDATE_PASSWORD",
      event: "UPDATE_PASSWORD",
      target_type: "AUTH",
      target_id: user.id,
      description: "Admin Wilayah memperbarui kata sandi akun",
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: "Password akun berhasil diubah!",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return { success: false, error: message };
  }
}

/**
 * Update user notification preferences
 */
export async function updateNotificationSettingsAction(
  settings: UserNotificationSettings
): Promise<SettingsActionState> {
  try {
    // 1. Auth check
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== currentAdmin.id) {
      return {
        success: false,
        error: "Sesi tidak valid.",
      };
    }

    // 2. Upsert into user_settings
    const { error: upsertError } = await supabase
      .from("user_settings")
      .upsert({
        id: user.id,
        notification_enabled: settings.notification_enabled,
        emergency_alert: settings.emergency_alert,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      if (upsertError.code === "PGRST205") {
        return {
          success: false,
          error:
            "Tabel 'user_settings' belum dibuat di database Supabase. Silakan jalankan file migrasi supabase/migrations/202609230001_user_settings_and_profile_rls.sql di SQL Editor Supabase.",
        };
      }
      return {
        success: false,
        error: `Gagal menyimpan preferensi: ${upsertError.message}`,
      };
    }

    // 3. Insert audit log
    await insertAuditLog(supabase, {
      user_id: user.id,
      action: "UPDATE_SETTINGS",
      event: "UPDATE_SETTINGS",
      target_type: "USER_SETTINGS",
      target_id: user.id,
      description: `Preferensi notifikasi diperbarui: Darurat (${
        settings.emergency_alert ? "AKTIF" : "NONAKTIF"
      }), Wilayah (${settings.notification_enabled ? "AKTIF" : "NONAKTIF"})`,
      metadata: {
        notification_enabled: settings.notification_enabled,
        emergency_alert: settings.emergency_alert,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/admin/wilayah/settings");

    return {
      success: true,
      message: "Preferensi notifikasi berhasil disimpan!",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return { success: false, error: message };
  }
}
