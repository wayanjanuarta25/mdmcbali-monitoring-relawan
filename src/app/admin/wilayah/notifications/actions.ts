"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAuth } from "@/lib/auth/current-user";
import { requireRole } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  NotificationActionState,
  NotificationType,
  NotificationPriority,
  NotificationTargetType,
} from "@/types/notification";

export async function createNotificationAction(
  _prevState: NotificationActionState,
  formData: FormData,
): Promise<NotificationActionState> {
  try {
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);

    const title = formData.get("title")?.toString().trim() || "";
    const message = formData.get("message")?.toString().trim() || "";
    const type = (formData.get("type")?.toString() || "INFORMASI") as NotificationType;
    const priority = (formData.get("priority")?.toString() || "MEDIUM") as NotificationPriority;
    const targetType = (formData.get("target_type")?.toString() || "ALL") as NotificationTargetType;
    const targetDistrictId = formData.get("target_district_id")?.toString() || null;
    const expiresAt = formData.get("expires_at")?.toString() || null;

    if (!title || title.length < 3) {
      return { success: false, error: "Judul notifikasi wajib diisi minimal 3 karakter." };
    }

    if (!message || message.length < 5) {
      return { success: false, error: "Pesan notifikasi wajib diisi minimal 5 karakter." };
    }

    if (!["INFORMASI", "PERINGATAN", "DARURAT"].includes(type)) {
      return { success: false, error: "Tipe notifikasi tidak valid." };
    }

    if (!["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(priority)) {
      return { success: false, error: "Prioritas notifikasi tidak valid." };
    }

    if (!["ALL", "ADMIN_DAERAH", "DISTRICT"].includes(targetType)) {
      return { success: false, error: "Target notifikasi tidak valid." };
    }

    if (targetType === "DISTRICT" && !targetDistrictId) {
      return { success: false, error: "Kabupaten/Kota target wajib dipilih jika target adalah DISTRICT." };
    }

    const adminClient = createAdminClient();

    const { data: newNotif, error: insertError } = await adminClient
      .from("notifications")
      .insert({
        title,
        message,
        type,
        priority,
        target_type: targetType,
        target_district_id: targetType === "DISTRICT" ? targetDistrictId : null,
        expires_at: expiresAt && expiresAt.trim() ? new Date(expiresAt).toISOString() : null,
        is_active: true,
        created_by: currentAdmin.id,
      })
      .select("id, title")
      .single();

    if (insertError || !newNotif) {
      return {
        success: false,
        error: `Gagal menyimpan notifikasi: ${insertError?.message || "Unknown error"}`,
      };
    }

    // Insert Audit Log
    await adminClient.from("audit_logs").insert({
      user_id: currentAdmin.id,
      action: "CREATE_NOTIFICATION",
      target_type: "NOTIFICATIONS",
      target_id: newNotif.id,
      description: `Membuat notifikasi "${title}" (${type}, target: ${targetType})`,
    });

    revalidatePath("/admin/wilayah/notifications");
    revalidatePath("/admin/wilayah");
    revalidatePath("/admin/daerah");

    return {
      success: true,
      message: `Notifikasi "${title}" berhasil diterbitkan!`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.",
    };
  }
}

export async function toggleNotificationAction(
  id: string,
  currentStatus: boolean,
): Promise<NotificationActionState> {
  try {
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);
    const adminClient = createAdminClient();

    const newStatus = !currentStatus;

    const { error } = await adminClient
      .from("notifications")
      .update({ is_active: newStatus })
      .eq("id", id);

    if (error) {
      return { success: false, error: `Gagal memperbarui status notifikasi: ${error.message}` };
    }

    await adminClient.from("audit_logs").insert({
      user_id: currentAdmin.id,
      action: "TOGGLE_NOTIFICATION_STATUS",
      target_type: "NOTIFICATIONS",
      target_id: id,
      description: `Mengubah status notifikasi ${id} menjadi ${newStatus ? "Aktif" : "Non-aktif"}`,
    });

    revalidatePath("/admin/wilayah/notifications");
    revalidatePath("/admin/wilayah");
    revalidatePath("/admin/daerah");

    return {
      success: true,
      message: `Status notifikasi berhasil diubah menjadi ${newStatus ? "Aktif" : "Non-aktif"}.`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal mengubah status notifikasi.",
    };
  }
}

export async function softDeleteNotificationAction(
  id: string,
): Promise<NotificationActionState> {
  try {
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);
    const adminClient = createAdminClient();

    // Soft delete: set deleted_at timestamp and is_active = false
    const { error } = await adminClient
      .from("notifications")
      .update({
        deleted_at: new Date().toISOString(),
        is_active: false,
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: `Gagal menghapus notifikasi: ${error.message}` };
    }

    await adminClient.from("audit_logs").insert({
      user_id: currentAdmin.id,
      action: "SOFT_DELETE_NOTIFICATION",
      target_type: "NOTIFICATIONS",
      target_id: id,
      description: `Menghapus (soft delete) notifikasi id: ${id}`,
    });

    revalidatePath("/admin/wilayah/notifications");
    revalidatePath("/admin/wilayah");
    revalidatePath("/admin/daerah");

    return {
      success: true,
      message: "Notifikasi berhasil dihapus.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal menghapus notifikasi.",
    };
  }
}

export async function markNotificationAsReadAction(
  notificationId: string,
): Promise<NotificationActionState> {
  try {
    const { user } = await getCurrentAuth();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("notification_reads")
      .upsert(
        {
          notification_id: notificationId,
          user_id: user.id,
          read_at: new Date().toISOString(),
        },
        { onConflict: "notification_id,user_id" },
      );

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/wilayah");
    revalidatePath("/admin/daerah");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal menandai notifikasi.",
    };
  }
}

export async function markAllNotificationsAsReadAction(): Promise<NotificationActionState> {
  try {
    const { user, profile } = await getCurrentAuth();
    if (!user || !profile) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createClient();

    // Query all unexpired, active notifications matching user
    let query = supabase
      .from("notifications")
      .select("id")
      .is("deleted_at", null)
      .eq("is_active", true);

    if (profile.role !== "ADMIN_WILAYAH_BALI") {
      const orConditions = [
        "target_type.eq.ALL",
        `target_type.eq.${profile.role}`,
      ];
      if (profile.district_id) {
        orConditions.push(`and(target_type.eq.DISTRICT,target_district_id.eq.${profile.district_id})`);
      }
      query = query.or(orConditions.join(","));
    }

    const { data: notifs } = await query;

    if (notifs && notifs.length > 0) {
      const records = notifs.map((n) => ({
        notification_id: n.id,
        user_id: user.id,
        read_at: new Date().toISOString(),
      }));

      await supabase
        .from("notification_reads")
        .upsert(records, { onConflict: "notification_id,user_id" });
    }

    revalidatePath("/admin/wilayah");
    revalidatePath("/admin/daerah");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal menandai semua notifikasi.",
    };
  }
}

/**
 * System helper to dispatch auto notification (e.g. when a new ADMIN_DAERAH is created)
 */
export async function createSystemNotification({
  title,
  message,
  type = "INFORMASI",
  priority = "MEDIUM",
  targetType = "ALL",
  targetDistrictId = null,
  createdBy,
}: {
  title: string;
  message: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  targetType?: NotificationTargetType;
  targetDistrictId?: string | null;
  createdBy: string;
}) {
  try {
    const adminClient = createAdminClient();
    await adminClient.from("notifications").insert({
      title,
      message,
      type,
      priority,
      target_type: targetType,
      target_district_id: targetDistrictId,
      is_active: true,
      created_by: createdBy,
    });
  } catch (err) {
    console.error("Failed to create auto system notification:", err);
  }
}

export async function getUserNotificationsAction(): Promise<{
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    created_at: string;
    is_read: boolean;
  }>;
  unreadCount: number;
  activeStatusNotification: {
    id: string;
    title: string;
    type: NotificationType;
    priority: NotificationPriority;
  } | null;
}> {
  try {
    const { user, profile } = await getCurrentAuth();
    if (!user || !profile) {
      return { notifications: [], unreadCount: 0, activeStatusNotification: null };
    }

    const supabase = await createClient();
    const now = new Date().toISOString();

    let query = supabase
      .from("notifications")
      .select("id, title, message, type, priority, target_type, target_district_id, created_at, is_active")
      .is("deleted_at", null)
      .eq("is_active", true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (profile.role !== "ADMIN_WILAYAH_BALI") {
      const orParts = ["target_type.eq.ALL", "target_type.eq.ADMIN_DAERAH"];
      if (profile.district_id) {
        orParts.push(`and(target_type.eq.DISTRICT,target_district_id.eq.${profile.district_id})`);
      }
      query = query.or(orParts.join(","));
    }

    const { data: notifs } = await query;
    if (!notifs || notifs.length === 0) {
      return { notifications: [], unreadCount: 0, activeStatusNotification: null };
    }

    // Fetch user reads
    const notifIds = notifs.map((n) => n.id);
    const { data: reads } = await supabase
      .from("notification_reads")
      .select("notification_id")
      .eq("user_id", user.id)
      .in("notification_id", notifIds);

    const readSet = new Set((reads || []).map((r) => r.notification_id));

    const mapped = notifs.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type as NotificationType,
      priority: n.priority as NotificationPriority,
      created_at: n.created_at,
      is_read: readSet.has(n.id),
    }));

    const unreadCount = mapped.filter((n) => !n.is_read).length;

    // Active status notification for top navbar pill (find DARURAT or CRITICAL or PERINGATAN)
    const alertNotif =
      notifs.find((n) => n.type === "DARURAT" || n.priority === "CRITICAL") ||
      notifs.find((n) => n.type === "PERINGATAN");

    const activeStatusNotification = alertNotif
      ? {
          id: alertNotif.id,
          title: alertNotif.title,
          type: alertNotif.type as NotificationType,
          priority: alertNotif.priority as NotificationPriority,
        }
      : null;

    return {
      notifications: mapped,
      unreadCount,
      activeStatusNotification,
    };
  } catch (err) {
    console.error("Error in getUserNotificationsAction:", err);
    return { notifications: [], unreadCount: 0, activeStatusNotification: null };
  }
}

