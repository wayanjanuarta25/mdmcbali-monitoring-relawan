import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getCurrentAuth } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import { formatDisplayPhone } from "@/lib/utils/phone";

export async function GET() {
  try {
    const { user, profile } = await getCurrentAuth();

    if (!user || !profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (profile.role !== "ADMIN_WILAYAH_BALI") {
      return NextResponse.json({ error: "Forbidden: Hanya ADMIN_WILAYAH_BALI yang dapat mengekspor seluruh data Bali" }, { status: 403 });
    }

    const supabase = await createClient();

    // Query all volunteers across Bali with district information
    const { data: volunteers, error } = await supabase
      .from("volunteers")
      .select(`
        name,
        gender,
        age,
        address,
        phone,
        phone_normalized,
        status,
        created_at,
        districts (
          name,
          type,
          code
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 },
      );
    }

    // Format rows for Excel
    const rows = (volunteers || []).map((v, index) => {
      const districtRel = v.districts as { name?: string; type?: string; code?: string } | null;
      const districtName = districtRel?.name ? `${districtRel.type === "KOTA" ? "Kota" : "Kabupaten"} ${districtRel.name}` : "Bali";

      const regDate = v.created_at
        ? new Date(v.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-";

      return {
        No: index + 1,
        "Kabupaten / Kota": districtName,
        "Kode Wilayah": districtRel?.code || "-",
        "Nama Relawan": v.name,
        "Jenis Kelamin": v.gender || "-",
        "Umur (Tahun)": v.age ?? "-",
        "Alamat Domisili": v.address || "-",
        "No. Telepon / WhatsApp": formatDisplayPhone(v.phone_normalized || v.phone),
        Status: v.status === "ACTIVE" ? "Aktif (Siaga)" : v.status,
        "Tanggal Terdaftar": regDate,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 6 },  // No
      { wch: 22 }, // Kabupaten / Kota
      { wch: 12 }, // Kode Wilayah
      { wch: 28 }, // Nama
      { wch: 16 }, // Jenis Kelamin
      { wch: 14 }, // Umur
      { wch: 38 }, // Alamat
      { wch: 22 }, // No Telepon
      { wch: 16 }, // Status
      { wch: 20 }, // Tanggal Terdaftar
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relawan Se-Provinsi Bali");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const fileName = `Data_Relawan_MDMC_Provinsi_Bali_${dateStr}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Gagal mengenerate file Excel",
      },
      { status: 500 },
    );
  }
}
