"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin detail error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-red-200 bg-red-50/50 space-y-4 my-8">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <AlertCircle className="size-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-[#0B1F3A]">
          Gagal Memuat Profil Administrator
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Terjadi kendala saat memuat informasi admin. Silakan periksa kembali data atau muat ulang halaman.
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={() => reset()}
          className="bg-[#124E8C] text-white hover:bg-[#0B1F3A] text-xs h-9 px-4 rounded-xl"
        >
          <RefreshCw className="size-3.5 mr-1.5" />
          Coba Lagi
        </Button>
        <Link
          href="/admin/wilayah/admins"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "text-xs border-slate-300 h-9 px-4 rounded-xl",
          })}
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          Kembali
        </Link>
      </div>
    </div>
  );
}
