import Image from "next/image";
import { Building2, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const foundations = [
  {
    icon: Building2,
    title: "Struktur Terpusat",
    description: "Fondasi data untuk tingkat pusat, wilayah, dan daerah.",
  },
  {
    icon: ShieldCheck,
    title: "Keamanan Berlapis",
    description: "Disiapkan untuk autentikasi dan Row Level Security Supabase.",
  },
  {
    icon: Database,
    title: "Data Terintegrasi",
    description: "Koneksi PostgreSQL Supabase melalui environment variable.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white p-1 border border-slate-200 shadow-xs">
              <Image
                src="/logo-mdmc.png"
                alt="Logo MDMC"
                width={36}
                height={36}
                className="size-full object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-black tracking-wide text-primary">MDMC</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Volunteer Management System
              </p>
            </div>
          </div>
          <span className="rounded-full border border-secondary-foreground/15 bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            Phase 1
          </span>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
            Muhammadiyah Disaster Management Center
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Sistem Informasi Relawan Kesiapsiagaan Bencana
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Platform pengelolaan data relawan MDMC yang aman, terstruktur,
            dan siap mendukung koordinasi kebencanaan dari daerah hingga
            tingkat nasional.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              className={buttonVariants({ size: "lg", className: "h-11" })}
              href="/login"
            >
              Masuk ke Sistem
            </Link>
            <p className="text-sm text-muted-foreground">Akses khusus pengelola MDMC</p>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-secondary-foreground" />
          <p className="text-sm font-semibold text-secondary-foreground">
            Fondasi Sistem
          </p>
          <h2 className="mt-2 text-2xl font-bold text-primary">
            Infrastruktur Phase 1 siap
          </h2>
          <div className="mt-7 space-y-6">
            {foundations.map(({ icon: Icon, title, description }) => (
              <div className="flex gap-4" key={title}>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
