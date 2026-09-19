import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Masuk",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white p-2 shadow-lg ring-2 ring-white/20 shrink-0">
            <Image
              src="/logo-mdmc.png"
              alt="Logo MDMC"
              width={48}
              height={48}
              className="size-full object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-xl font-black tracking-wider text-white">MDMC bali</p>
            <p className="text-xs text-white/75 font-medium">Volunteer Management System</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
            Satu data, satu koordinasi
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
            Sistem Informasi Relawan Kesiapsiagaan Bencana
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
            Mendukung pengelolaan relawan MDMC yang tertib, aman, dan
            terkoordinasi dari tingkat daerah hingga nasional.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm text-white/65">
          <ShieldCheck aria-hidden="true" className="size-5 text-blue-200" />
          Akses dilindungi sesuai kewenangan organisasi
        </div>
      </section>

      <section className="flex items-center justify-center bg-background px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3.5 lg:hidden">
            <div className="flex size-12 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm border border-slate-200 shrink-0">
              <Image
                src="/logo-mdmc.png"
                alt="Logo MDMC"
                width={40}
                height={40}
                className="size-full object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-lg font-black text-primary">MDMC</p>
              <p className="text-xs text-muted-foreground font-medium">
                Volunteer Management System
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-secondary-foreground">
              Portal Pengelola
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary">
              Masuk ke sistem
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Gunakan akun resmi yang telah diberikan oleh administrator MDMC.
            </p>

            {error === "profile" ? (
              <p className="mt-5 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                Profil pengguna tidak ditemukan. Silakan hubungi administrator.
              </p>
            ) : null}

            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Muhammadiyah Disaster Management Center
          </p>
        </div>
      </section>
    </main>
  );
}
