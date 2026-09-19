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

    if (profile.role !== "ADMIN_DAERAH" && profile.role !== "ADMIN_WILAYAH_BALI") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = await createClient();

    let query = supabase
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
          type
        )
      `)
      .order("created_at", { ascending: false });

    // Scoped to district
    if (profile.district_id) {
      query = query.eq("district_id", profile.district_id);
    }

    const { data: volunteers, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 },
      );
    }

    const districtRel = profile.district || profile.districts;
    const districtName = districtRel?.name || "Daerah";

    // Format rows for Excel
    const rows = (volunteers || []).map((v, index) => {
      const regDate = v.created_at
        ? new Date(v.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-";

      return {
        No: index + 1,
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
      { wch: 28 }, // Nama
      { wch: 16 }, // Jenis Kelamin
      { wch: 14 }, // Umur
      { wch: 38 }, // Alamat
      { wch: 22 }, // No Telepon
      { wch: 16 }, // Status
      { wch: 20 }, // Tanggal Terdaftar
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Relawan");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const safeDistrictName = districtName.replace(/[^a-zA-Z0-9]/g, "_");
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const fileName = `Data_Relawan_MDMC_${safeDistrictName}_${dateStr}.xlsx`;

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
