"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  success?: boolean;
  error?: string | null;
  message?: string | null;
};

// Indonesian Phone number validation regex
const ID_PHONE_REGEX = /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createAdminDaerahAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    // 1. Get current logged in admin
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);

    const fullName = formData.get("full_name");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone = formData.get("phone");
    const districtId = formData.get("district_id");

    // Validation checks
    if (typeof fullName !== "string" || fullName.trim().length < 3) {
      return {
        success: false,
        error: "Nama lengkap wajib diisi minimal 3 karakter.",
      };
    }

    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return {
        success: false,
        error: "Format email tidak valid (contoh: nama@mdmc.or.id).",
      };
    }

    if (typeof password !== "string" || password.length < 8) {
      return {
        success: false,
        error: "Password wajib diisi minimal 8 karakter.",
      };
    }

    if (typeof phone !== "string" || !ID_PHONE_REGEX.test(phone.trim())) {
      return {
        success: false,
        error:
          "Nomor HP tidak valid. Gunakan format Indonesia yang benar (contoh: 081234567890 atau +6281234567890).",
      };
    }

    if (typeof districtId !== "string" || !districtId) {
      return { success: false, error: "Kabupaten/Kota target wajib dipilih." };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const normalizedFullName = fullName.trim();

    let createdUser: { id: string; email?: string } | null = null;

    // 2. Create user using Supabase Admin Client auth.admin.createUser()
    const adminAuthClient = createAdminClient();
    const { data: authData, error: authError } =
      await adminAuthClient.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: { full_name: normalizedFullName },
      });

    if (authError || !authData?.user) {
      // Check if user already exists
      const msg = authError?.message || "Gagal membuat akun dengan Supabase Admin Client.";
      const isAlreadyRegistered =
        msg.includes("already registered") || msg.includes("already exists");

      if (isAlreadyRegistered) {
        return {
          success: false,
          error: "Email tersebut sudah terdaftar dalam sistem autentikasi.",
        };
      }

      return {
        success: false,
        error: msg,
      };
    }

    createdUser = authData.user;

    // 3. Upsert into public.profiles
    const { error: profileError } = await adminAuthClient.from("profiles").upsert(
      {
        id: createdUser.id,
        email: normalizedEmail,
        full_name: normalizedFullName,
        role: "ADMIN_DAERAH",
        district_id: districtId,
        phone: normalizedPhone,
        is_active: true,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      return {
        success: false,
        error: `Gagal membuat profil admin: ${profileError.message}`,
      };
    }

    // 4. Insert Audit Log
    await adminAuthClient.from("audit_logs").insert({
      user_id: currentAdmin.id,
      action: "CREATE_ADMIN_DAERAH",
      target_type: "PROFILES",
      target_id: createdUser.id,
      description: `Membuat akun Admin Daerah (${normalizedFullName} - ${normalizedEmail}) untuk district_id: ${districtId}`,
    });

    // 5. Auto Notification for new ADMIN_DAERAH
    try {
      await adminAuthClient.from("notifications").insert({
        title: `Penugasan Admin Daerah: ${normalizedFullName}`,
        message: `Akun administrator baru (${normalizedFullName} - ${normalizedEmail}) telah resmi ditugaskan oleh Pengurus Wilayah MDMC Bali.`,
        type: "INFORMASI",
        priority: "MEDIUM",
        target_type: "ALL",
        is_active: true,
        created_by: currentAdmin.id,
      });
    } catch {
      // Non-blocking notification creation
    }

    revalidatePath("/admin/wilayah/districts");
    revalidatePath("/admin/wilayah/admins");
    revalidatePath(`/admin/wilayah/districts/${districtId}`);
    revalidatePath("/admin/wilayah");

    return {
      success: true,
      message: `Akun Admin Daerah (${normalizedFullName}) berhasil dibuat!`,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.",
    };
  }
}

export async function toggleAdminStatusAction(
  profileId: string,
  currentStatus: boolean,
  districtId?: string,
): Promise<ActionState> {
  try {
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);

    const newStatus = !currentStatus;
    const serverClient = await createClient();
    const updateClient = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createAdminClient()
      : serverClient;

    const { error } = await updateClient
      .from("profiles")
      .update({ is_active: newStatus })
      .eq("id", profileId);

    if (error) {
      return { success: false, error: `Gagal memperbarui status: ${error.message}` };
    }

    // Record Audit Log
    await updateClient.from("audit_logs").insert({
      user_id: currentAdmin.id,
      action: "TOGGLE_ADMIN_STATUS",
      target_type: "PROFILES",
      target_id: profileId,
      description: `Mengubah status keaktifan Admin Daerah (id: ${profileId}) menjadi ${newStatus ? "Aktif" : "Non-aktif"}.`,
    });

    revalidatePath("/admin/wilayah/districts");
    if (districtId) revalidatePath(`/admin/wilayah/districts/${districtId}`);

    return {
      success: true,
      message: `Status Admin Daerah berhasil diubah menjadi ${newStatus ? "Aktif" : "Non-aktif"}.`,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Terjadi kesalahan saat mengubah status.",
    };
  }
}

export async function deleteAdminDaerahAction(
  profileId: string,
): Promise<ActionState> {
  try {
    // 1. Validate caller role: ADMIN_WILAYAH_BALI
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);

    const adminClient = createAdminClient();

    // 2. Fetch target profile
    const { data: targetProfile, error: targetError } = await adminClient
      .from("profiles")
      .select("id, full_name, email, role, district_id")
      .eq("id", profileId)
      .maybeSingle();

    if (targetError || !targetProfile) {
      return { success: false, error: "Data Admin Daerah tidak ditemukan." };
    }

    // 3. Ensure target is ADMIN_DAERAH
    if (targetProfile.role !== "ADMIN_DAERAH") {
      return {
        success: false,
        error: "Akses ditolak: Hanya akun ADMIN_DAERAH yang dapat dihapus.",
      };
    }

    // 4. Delete profile record & auth user permanently
    await adminClient.from("profiles").delete().eq("id", profileId);

    const { error: authDeleteError } =
      await adminClient.auth.admin.deleteUser(profileId);

    if (authDeleteError) {
      return {
        success: false,
        error: `Gagal menghapus akun autentikasi: ${authDeleteError.message}`,
      };
    }

    // 5. Insert audit_logs
    await adminClient.from("audit_logs").insert({
      user_id: currentAdmin.id,
      action: "DELETE_ADMIN_DAERAH",
      target_type: "PROFILES",
      target_id: profileId,
      description: `Admin Daerah ${targetProfile.full_name} dinonaktifkan`,
    });

    // 6. Revalidate pages
    revalidatePath("/admin/wilayah/admins");
    revalidatePath("/admin/wilayah/districts");
    if (targetProfile.district_id) {
      revalidatePath(`/admin/wilayah/districts/${targetProfile.district_id}`);
    }

    return {
      success: true,
      message: `Akun Admin Daerah (${targetProfile.full_name}) berhasil dihapus permanen.`,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menghapus Admin Daerah.",
    };
  }
}

export async function createDistrictAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    // 1. Authorize ADMIN_WILAYAH_BALI
    const currentAdmin = await requireRole(["ADMIN_WILAYAH_BALI"]);

    const name = formData.get("name");
    const code = formData.get("code");
    const type = formData.get("type");
    const status = formData.get("status");

    // Validation
    if (typeof name !== "string" || name.trim().length < 2) {
      return { success: false, error: "Nama Kabupaten/Kota wajib diisi minimal 2 karakter." };
    }

    if (typeof code !== "string" || code.trim().length < 2) {
      return { success: false, error: "Kode wilayah wajib diisi minimal 2 karakter (contoh: BDG, DPS)." };
    }

    const normalizedName = name.trim();
    const normalizedCode = code.trim().toUpperCase();
    const validatedType = type === "KOTA" ? "KOTA" : "KABUPATEN";
    const validatedStatus = status === "INACTIVE" ? "INACTIVE" : "ACTIVE";

    const adminClient = createAdminClient();

    // Check code uniqueness
    const { data: existingCode } = await adminClient
      .from("districts")
      .select("id")
      .eq("code", normalizedCode)
      .maybeSingle();

    if (existingCode) {
      return { success: false, error: `Kode wilayah "${normalizedCode}" sudah digunakan.` };
    }

    // Insert into districts
    const { data: newDistrict, error: insertError } = await adminClient
      .from("districts")
      .insert({
        name: normalizedName,
        code: normalizedCode,
        type: validatedType,
        status: validatedStatus,
        created_by: currentAdmin.id,
      })
      .select("id, name, code")
      .single();

    if (insertError || !newDistrict) {
      return {
        success: false,
        error: `Gagal menyimpan data wilayah: ${insertError?.message || "Unknown error"}`,
      };
    }

    // Insert audit log
    await adminClient.from("audit_logs").insert({
      user_id: currentAdmin.id,
      action: "CREATE_DISTRICT",
      target_type: "DISTRICTS",
      target_id: newDistrict.id,
      description: `Menambahkan wilayah baru: ${newDistrict.name} (${newDistrict.code})`,
    });

    revalidatePath("/admin/wilayah/districts");
    revalidatePath("/admin/wilayah");
    revalidatePath("/admin/wilayah/admins/create");

    return {
      success: true,
      message: `Wilayah ${newDistrict.name} (${newDistrict.code}) berhasil ditambahkan!`,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Terjadi kesalahan saat menambahkan wilayah.",
    };
  }
}

