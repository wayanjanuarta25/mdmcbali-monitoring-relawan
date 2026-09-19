"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";
import {
  FileUp,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Trash2,
  Info,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  normalizePhoneNumber,
  isValidIndonesianPhone,
  formatDisplayPhone,
} from "@/lib/utils/phone";
import {
  checkExistingPhonesAction,
  importVolunteersBatchAction,
} from "@/app/admin/daerah/volunteers/actions";
import type { ImportVolunteerInputRow } from "@/types/volunteer";

interface ParsedVolunteerRow {
  rowNumber: number;
  name: string;
  gender: "Laki-laki" | "Perempuan" | "";
  rawGender: string;
  age: number | null;
  rawAge: string;
  address: string;
  phone: string;
  phone_normalized: string;
  isValid: boolean;
  errors: string[];
  isDuplicateInFile?: boolean;
  isDuplicateInDb?: boolean;
}

interface ImportVolunteerViewProps {
  districtName: string;
}

export function ImportVolunteerView({ districtName }: ImportVolunteerViewProps) {
  const router = useRouter();

  const [fileName, setFileName] = React.useState<string>("");
  const [rows, setRows] = React.useState<ParsedVolunteerRow[]>([]);
  const [isCheckingDb, setIsCheckingDb] = React.useState<boolean>(false);
  const [isImporting, setIsImporting] = React.useState<boolean>(false);
  const [errorBanner, setErrorBanner] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Download template Excel
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        nama: "I Wayan Sudarma",
        jenis_kelamin: "L",
        umur: 28,
        alamat: "Jl. Raya Bangli No. 12, Kawan",
        no_telepon: "081234567890",
      },
      {
        nama: "Ni Made Astuti",
        jenis_kelamin: "P",
        umur: 24,
        alamat: "Banjar Kawan, Bangli",
        no_telepon: "081987654321",
      },
      {
        nama: "I Ketut Ariawan",
        jenis_kelamin: "Laki-laki",
        umur: 35,
        alamat: "Jl. Merdeka No. 45, Bangli",
        no_telepon: "085712345678",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Relawan");

    // Set column widths
    ws["!cols"] = [
      { wch: 25 }, // nama
      { wch: 15 }, // jenis_kelamin
      { wch: 10 }, // umur
      { wch: 35 }, // alamat
      { wch: 20 }, // no_telepon
    ];

    XLSX.writeFile(wb, "template_relawan_mdmc.xlsx");
  };

  // Handle file selection
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorBanner(null);
    setSuccessMessage(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];

        // Parse sheet to JSON array
        const rawJson: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws, {
          defval: "",
        });

        if (rawJson.length === 0) {
          setErrorBanner("File Excel kosong atau tidak memiliki baris data.");
          setRows([]);
          return;
        }

        if (rawJson.length > 5000) {
          setErrorBanner("Batas maksimal import adalah 5.000 baris. File Anda memiliki " + rawJson.length + " baris.");
          setRows([]);
          return;
        }

        // Map and validate initial format
        const phoneTracker = new Map<string, number[]>(); // normalizedPhone -> array of rowNumbers

        const parsed: ParsedVolunteerRow[] = rawJson.map((item, idx) => {
          const rowNum = idx + 2; // header is row 1
          const errors: string[] = [];

          // Case-insensitive key lookup
          const getItemValue = (keys: string[]): string => {
            for (const key of keys) {
              for (const itemKey of Object.keys(item)) {
                if (itemKey.trim().toLowerCase() === key.toLowerCase()) {
                  return String(item[itemKey] ?? "").trim();
                }
              }
            }
            return "";
          };

          const rawName = getItemValue(["nama", "nama lengkap", "name", "full_name"]);
          const rawGender = getItemValue(["jenis_kelamin", "gender", "jk"]);
          const rawAge = getItemValue(["umur", "age", "usia"]);
          const rawAddress = getItemValue(["alamat", "address", "domisili"]);
          const rawPhone = getItemValue(["no_telepon", "phone", "nomor_hp", "telepon", "no hp"]);

          // 1. Name validation
          if (!rawName || rawName.length < 2) {
            errors.push("Nama lengkap wajib minimal 2 karakter");
          }

          // 2. Gender validation
          let normalizedGender: "Laki-laki" | "Perempuan" | "" = "";
          const gUpper = rawGender.toUpperCase();
          if (gUpper === "L" || gUpper === "LAKI-LAKI" || gUpper === "LAKI LAKI" || gUpper === "MALE" || gUpper === "PRIA") {
            normalizedGender = "Laki-laki";
          } else if (gUpper === "P" || gUpper === "PEREMPUAN" || gUpper === "FEMALE" || gUpper === "WANITA") {
            normalizedGender = "Perempuan";
          } else {
            errors.push("Jenis kelamin harus L (Laki-laki) atau P (Perempuan)");
          }

          // 3. Age validation
          const parsedAge = parseInt(rawAge, 10);
          if (!rawAge || isNaN(parsedAge) || parsedAge < 12 || parsedAge > 99) {
            errors.push("Umur harus berupa angka antara 12 dan 99");
          }

          // 4. Address validation
          if (!rawAddress || rawAddress.length < 4) {
            errors.push("Alamat domisili wajib diisi minimal 4 karakter");
          }

          // 5. Phone validation & normalization
          const normPhone = normalizePhoneNumber(rawPhone);
          if (!rawPhone || !isValidIndonesianPhone(normPhone)) {
            errors.push("Format nomor telepon Indonesia tidak valid (cth: 081234567890)");
          } else {
            // Track duplicates within file
            const existingRows = phoneTracker.get(normPhone) || [];
            existingRows.push(rowNum);
            phoneTracker.set(normPhone, existingRows);
          }

          return {
            rowNumber: rowNum,
            name: rawName,
            gender: normalizedGender,
            rawGender,
            age: isNaN(parsedAge) ? null : parsedAge,
            rawAge,
            address: rawAddress,
            phone: rawPhone,
            phone_normalized: normPhone,
            isValid: errors.length === 0,
            errors,
          };
        });

        // Flag duplicates within the file
        phoneTracker.forEach((rowIndices) => {
          if (rowIndices.length > 1) {
            rowIndices.forEach((rowNum) => {
              const target = parsed.find((p) => p.rowNumber === rowNum);
              if (target) {
                target.isDuplicateInFile = true;
                target.isValid = false;
                target.errors.push(`Duplikat nomor telepon di baris: ${rowIndices.join(", ")}`);
              }
            });
          }
        });

        setRows(parsed);

        // Check duplicate against database
        const validPhonesToCheck = Array.from(phoneTracker.keys());
        if (validPhonesToCheck.length > 0) {
          setIsCheckingDb(true);
          try {
            const dbCheck = await checkExistingPhonesAction(validPhonesToCheck);
            if (dbCheck.existingPhones && dbCheck.existingPhones.length > 0) {
              const dbSet = new Set(dbCheck.existingPhones);
              setRows((current) =>
                current.map((row) => {
                  if (dbSet.has(row.phone_normalized)) {
                    return {
                      ...row,
                      isDuplicateInDb: true,
                      isValid: false,
                      errors: [...row.errors, "Nomor telepon sudah terdaftar di database"],
                    };
                  }
                  return row;
                }),
              );
            }
          } finally {
            setIsCheckingDb(false);
          }
        }
      } catch (err) {
        setErrorBanner(
          err instanceof Error
            ? err.message
            : "Gagal membaca file Excel. Pastikan format file .xlsx atau .xls valid.",
        );
        setRows([]);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Reset file selection
  const handleReset = () => {
    setFileName("");
    setRows([]);
    setErrorBanner(null);
    setSuccessMessage(null);
  };

  // Submit batch import
  const handleConfirmImport = async () => {
    if (rows.length === 0) return;

    const invalidCount = rows.filter((r) => !r.isValid).length;
    if (invalidCount > 0) {
      setErrorBanner(
        `Terdapat ${invalidCount} baris data yang memiliki kesalahan atau duplikat. Harap perbaiki file Excel Anda sebelum melakukan import.`,
      );
      return;
    }

    try {
      setIsImporting(true);
      setErrorBanner(null);

      const payload: ImportVolunteerInputRow[] = rows.map((r) => ({
        name: r.name,
        gender: r.gender as "Laki-laki" | "Perempuan",
        age: r.age,
        address: r.address,
        phone: r.phone,
        phone_normalized: r.phone_normalized,
      }));

      const res = await importVolunteersBatchAction(payload, fileName);

      if (res.success) {
        setSuccessMessage(res.message || "Seluruh data relawan berhasil diimpor ke database!");
        setTimeout(() => {
          router.push("/admin/daerah/volunteers");
          router.refresh();
        }, 1500);
      } else {
        setErrorBanner(res.error || "Gagal mengimpor data ke database.");
      }
    } catch (err) {
      setErrorBanner(
        err instanceof Error ? err.message : "Terjadi kesalahan saat mengimpor data.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  const totalCount = rows.length;
  const validCount = rows.filter((r) => r.isValid).length;
  const duplicateCount = rows.filter((r) => r.isDuplicateInFile || r.isDuplicateInDb).length;
  const errorCount = rows.filter((r) => !r.isValid).length;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* HEADER CARD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#124E8C] p-6 text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-sky-200 border border-white/15 shrink-0">
            <FileSpreadsheet className="size-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider">
                Import Data Relawan
              </span>
              <Badge variant="brand" className="bg-sky-400/20 text-sky-100 border-sky-400/30 text-[10px]">
                {districtName}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Import dari Spreadsheet Excel
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white text-xs font-semibold"
          >
            <Download className="mr-1.5 size-3.5" />
            Download Template
          </Button>

          <Link
            href="/admin/daerah/volunteers"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white text-xs font-semibold",
            })}
          >
            <ArrowLeft className="mr-1.5 size-3.5" />
            Kembali
          </Link>
        </div>
      </div>

      {/* FEEDBACK ALERTS */}
      {errorBanner && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 animate-in slide-in-from-top-2">
          <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-rose-900">Perhatian / Kesalahan Import</p>
            <p className="mt-0.5 text-rose-700 leading-relaxed">{errorBanner}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 animate-in slide-in-from-top-2">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-emerald-900">Import Berhasil</p>
            <p className="mt-0.5 text-emerald-700 leading-relaxed">
              {successMessage} Mengalihkan ke halaman relawan...
            </p>
          </div>
        </div>
      )}

      {/* UPLOAD ZONE */}
      {rows.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-[#124E8C] border border-sky-100">
            <FileUp className="size-7" />
          </div>
          <h3 className="mt-4 text-base sm:text-lg font-bold text-[#0B1F3A]">
            Pilih File Excel Relawan
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Format yang didukung: <span className="font-semibold text-slate-700">.xlsx</span> atau{" "}
            <span className="font-semibold text-slate-700">.xls</span>. Maksimal 5.000 baris data per import.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <label className="cursor-pointer">
              <span
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className: "bg-[#0B1F3A] hover:bg-[#124E8C] text-white font-semibold text-xs px-5 h-10 shadow-xs",
                })}
              >
                <FileSpreadsheet className="mr-2 size-4 text-amber-300" />
                Upload File Excel
              </span>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="text-xs border-slate-300 text-slate-700 h-10 font-semibold"
            >
              <Download className="mr-2 size-4 text-slate-500" />
              Download Template Kosong
            </Button>
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-4 border border-slate-100 text-left max-w-xl mx-auto text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-[#0B1F3A] mb-2">
              <Info className="size-4 text-sky-600" />
              Petunjuk Format Kolom Excel:
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500">
              <li><strong className="text-slate-700">nama</strong>: Nama lengkap relawan (minimal 2 karakter).</li>
              <li><strong className="text-slate-700">jenis_kelamin</strong>: L (Laki-laki) atau P (Perempuan).</li>
              <li><strong className="text-slate-700">umur</strong>: Angka usia relawan (12 - 99 tahun).</li>
              <li><strong className="text-slate-700">alamat</strong>: Alamat domisili lengkap.</li>
              <li><strong className="text-slate-700">no_telepon</strong>: Nomor HP aktif Indonesia (harus unik se-sistem).</li>
            </ul>
          </div>
        </div>
      ) : (
        /* PREVIEW SECTION */
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden space-y-4">
          {/* FILE INFO & SUMMARY BAR */}
          <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-4 text-[#124E8C]" />
                <span className="font-bold text-sm text-[#0B1F3A]">{fileName}</span>
                {isCheckingDb && (
                  <span className="flex items-center gap-1 text-[11px] text-sky-600 font-medium bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    <Loader2 className="size-3 animate-spin" /> Memeriksa duplikasi database...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Periksa pratinjau data sebelum memasukkan ke database relawan.
              </p>
            </div>

            {/* CHIP COUNTS */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                Total: <strong>{totalCount}</strong>
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="size-3 text-emerald-600" />
                Valid: <strong>{validCount}</strong>
              </span>

              {duplicateCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle className="size-3 text-amber-600" />
                  Duplikat: <strong>{duplicateCount}</strong>
                </span>
              )}

              {errorCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  <XCircle className="size-3 text-rose-600" />
                  Error: <strong>{errorCount}</strong>
                </span>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-rose-600 h-8 px-2 ml-1"
              >
                <Trash2 className="size-3.5 mr-1" />
                Ganti File
              </Button>
            </div>
          </div>

          {/* TABLE PREVIEW */}
          <div className="overflow-x-auto max-h-[480px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="p-3 w-12 text-center">Baris</th>
                  <th className="p-3">Nama Relawan</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3 text-center">Umur</th>
                  <th className="p-3">Alamat</th>
                  <th className="p-3">No. HP</th>
                  <th className="p-3">Status Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {rows.map((r) => {
                  return (
                    <tr
                      key={r.rowNumber}
                      className={`transition-colors ${
                        !r.isValid ? "bg-rose-50/40 hover:bg-rose-50/70" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="p-3 text-center font-mono text-slate-400 font-bold">
                        {r.rowNumber}
                      </td>
                      <td className="p-3 font-bold text-[#0B1F3A]">
                        {r.name || <span className="text-rose-500 italic">Kosong</span>}
                      </td>
                      <td className="p-3">
                        {r.gender ? (
                          <Badge variant="outline" className="text-[10px]">
                            {r.gender}
                          </Badge>
                        ) : (
                          <span className="text-rose-500 text-[11px] italic">
                            {r.rawGender || "Kosong"}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono font-bold">
                        {r.age !== null ? (
                          `${r.age} th`
                        ) : (
                          <span className="text-rose-500 italic">
                            {r.rawAge || "-"}
                          </span>
                        )}
                      </td>
                      <td className="p-3 max-w-xs truncate text-slate-600">
                        {r.address || <span className="text-rose-500 italic">Kosong</span>}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-800">
                        {formatDisplayPhone(r.phone_normalized || r.phone)}
                      </td>
                      <td className="p-3">
                        {r.isValid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="size-3" />
                            Valid
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            {r.errors.map((err, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1 text-[10px] font-semibold text-rose-700"
                              >
                                <XCircle className="size-3 shrink-0" />
                                <span>{err}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ACTION BUTTONS FOOTER */}
          <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div className="text-xs text-slate-500">
              {errorCount > 0 ? (
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="size-4" />
                  Terdapat {errorCount} baris bermasalah. Perbaiki file agar dapat diimpor secara atomik.
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="size-4" />
                  Semua {validCount} data valid dan siap dimasukkan ke database {districtName}.
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isImporting}
                className="text-xs"
              >
                Batal
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleConfirmImport}
                disabled={isImporting || errorCount > 0 || validCount === 0 || isCheckingDb}
                className="bg-[#0B1F3A] hover:bg-[#124E8C] text-white font-bold text-xs h-9 px-4 min-w-[140px] shadow-xs"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    Mengimpor...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-1.5 size-3.5 text-emerald-400" />
                    Impor {validCount} Data Relawan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
