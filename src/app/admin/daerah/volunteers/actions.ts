"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import { normalizePhoneNumber, isValidIndonesianPhone } from "@/lib/utils/phone";
import type {
  CreateVolunteerState,
  ImportVolunteerInputRow,
  ImportVolunteerResult,
} from "@/types/volunteer";

export async function createVolunteerAction(
  _prevState: CreateVolunteerState,
  formData: FormData,
): Promise<CreateVolunteerState> {
  const { user, profile } = await getCurrentAuth();

  if (!user || !profile) {
    return { error: "Sesi Anda telah kedaluwarsa. Silakan login kembali." };
  }

  if (profile.role !== "ADMIN_DAERAH" && profile.role !== "ADMIN_WILAYAH_BALI") {
    return {
      error: "Akses ditolak: Anda tidak memiliki wewenang mendaftarkan relawan.",
    };
  }

  const name = formData.get("name")?.toString().trim() || "";
  const gender = formData.get("gender")?.toString().trim() || "";
  const ageStr = formData.get("age")?.toString().trim() || "";
  const address = formData.get("address")?.toString().trim() || "";
  const phone = formData.get("phone")?.toString().trim() || "";

  const fieldErrors: CreateVolunteerState["fieldErrors"] = {};

  if (!name || name.length < 3) {
    fieldErrors.name = "Nama lengkap wajib diisi minimal 3 karakter.";
  }

  if (!gender || !["L", "P", "Laki-laki", "Perempuan"].includes(gender)) {
    fieldErrors.gender = "Pilih jenis kelamin yang valid (Laki-laki atau Perempuan).";
  }

  const age = parseInt(ageStr, 10);
  if (!ageStr || isNaN(age) || age < 12 || age > 99) {
    fieldErrors.age = "Umur wajib berupa angka valid antara 12 dan 99 tahun.";
  }

  if (!address || address.length < 5) {
    fieldErrors.address = "Alamat domisili wajib diisi minimal 5 karakter.";
  }

  const normalizedPhone = normalizePhoneNumber(phone);
  if (!phone || !isValidIndonesianPhone(normalizedPhone)) {
    fieldErrors.phone = "Nomor HP tidak valid. Contoh format Indonesia: 081234567890.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // Determine target district_id
  let districtId = profile.district_id;
  if (!districtId && profile.role === "ADMIN_WILAYAH_BALI") {
    const formDistrict = formData.get("district_id")?.toString().trim();
    if (formDistrict) {
      districtId = formDistrict;
    }
  }

  if (!districtId) {
    return {
      error:
        "Kabupaten/Kota tidak teridentifikasi. Pastikan akun memiliki wilayah penugasan daerah.",
    };
  }

  const normalizedGender =
    gender === "L" || gender === "Laki-laki" ? "Laki-laki" : "Perempuan";

  const supabase = await createClient();

  // Check duplicate phone in database
  const { data: existingVolunteer } = await supabase
    .from("volunteers")
    .select("id, name")
    .eq("phone_normalized", normalizedPhone)
    .maybeSingle();

  if (existingVolunteer) {
    return {
      fieldErrors: {
        phone: `Nomor HP ini sudah terdaftar atas nama ${existingVolunteer.name}.`,
      },
    };
  }

  const { error: insertError } = await supabase.from("volunteers").insert({
    district_id: districtId,
    name,
    gender: normalizedGender,
    age,
    address,
    phone,
    phone_normalized: normalizedPhone,
    status: "ACTIVE",
    created_by: user.id,
  });

  if (insertError) {
    return {
      error: `Gagal menyimpan data relawan ke database: ${insertError.message}`,
    };
  }

  revalidatePath("/admin/daerah/volunteers");
  revalidatePath("/admin/daerah");
  revalidatePath("/admin/wilayah/volunteers");
  revalidatePath("/admin/wilayah");

  redirect("/admin/daerah/volunteers");
}

/**
 * Server action to check existing phone numbers in batch.
 * Used by client preview to flag duplicates before import submission.
 */
export async function checkExistingPhonesAction(
  normalizedPhones: string[],
): Promise<{ existingPhones: string[] }> {
  try {
    const { user, profile } = await getCurrentAuth();
    if (!user || !profile) {
      return { existingPhones: [] };
    }

    if (!normalizedPhones || normalizedPhones.length === 0) {
      return { existingPhones: [] };
    }

    const supabase = await createClient();
    const { data } = await supabase
      .from("volunteers")
      .select("phone_normalized")
      .in("phone_normalized", normalizedPhones);

    const existing = (data || [])
      .map((row) => row.phone_normalized)
      .filter((p): p is string => Boolean(p));

    return { existingPhones: existing };
  } catch {
    return { existingPhones: [] };
  }
}

/**
 * Server action for atomic batch volunteer import.
 * Strictly restricted to ADMIN_DAERAH. Uses PostgreSQL RPC with full rollback on error.
 */
export async function importVolunteersBatchAction(
  rows: ImportVolunteerInputRow[],
  fileName: string = "import.xlsx",
): Promise<ImportVolunteerResult> {
  try {
    const { user, profile } = await getCurrentAuth();

    if (!user || !profile) {
      return { success: false, error: "Sesi Anda telah kedaluwarsa. Silakan login kembali." };
    }

    if (profile.role !== "ADMIN_DAERAH") {
      return {
        success: false,
        error: "Akses ditolak: Hanya ADMIN_DAERAH yang berwenang mengimpor data relawan.",
      };
    }

    if (!profile.district_id) {
      return {
        success: false,
        error: "Akun Anda tidak memiliki wilayah penugasan (district_id).",
      };
    }

    if (!rows || rows.length === 0) {
      return { success: false, error: "Data relawan kosong. Tidak ada data yang diimpor." };
    }

    if (rows.length > 5000) {
      return {
        success: false,
        error: "Maksimal data yang dapat diimpor adalah 5.000 baris per file.",
      };
    }

    // Call PostgreSQL atomic RPC function
    const supabase = await createClient();
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      "import_volunteers_batch",
      {
        volunteers_data: rows,
        target_district_id: profile.district_id,
        current_user_id: user.id,
        file_name: fileName,
      },
    );

    if (rpcError) {
      // Check for unique constraint violation on phone_normalized
      const msg = rpcError.message || "";
      if (msg.includes("idx_volunteers_phone_normalized") || msg.includes("unique")) {
        return {
          success: false,
          error: "Import gagal: Terdapat nomor telepon yang sudah terdaftar di database. Transaksi dibatalkan (rollback).",
        };
      }
      return {
        success: false,
        error: `Import gagal: ${msg}`,
      };
    }

    const importedCount = rpcResult?.imported_count || rows.length;

    revalidatePath("/admin/daerah/volunteers");
    revalidatePath("/admin/daerah");
    revalidatePath("/admin/wilayah/volunteers");
    revalidatePath("/admin/wilayah");

    return {
      success: true,
      imported_count: importedCount,
      message: `Berhasil mengimpor ${importedCount} data relawan ke database.`,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga saat mengimpor data.",
    };
  }
}

