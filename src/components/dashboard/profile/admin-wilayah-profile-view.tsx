"use client";

import * as React from "react";
import {
  UserCircle,
  Mail,
  Phone,
  ShieldCheck,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Image as ImageIcon,
  Copy,
  Check,
  Lock,
  AtSign,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  updateProfileAction,
  updateAccountIdentityAction,
  type ProfileActionState,
} from "@/app/admin/wilayah/profile/actions";
import { isValidUsername, type UserProfile } from "@/types/auth";

interface AdminWilayahProfileViewProps {
  profile: UserProfile;
}

export function AdminWilayahProfileView({ profile }: AdminWilayahProfileViewProps) {
  // Transitions & States for Personal Profile
  const [isPendingProfile, startProfileTransition] = React.useTransition();
  const [profileState, setProfileState] = React.useState<ProfileActionState>({ success: false });

  // Transitions & States for Account Identity
  const [isPendingIdentity, startIdentityTransition] = React.useTransition();
  const [identityState, setIdentityState] = React.useState<ProfileActionState>({ success: false });

  // Form states
  const [fullName, setFullName] = React.useState(profile.full_name || "");
  const [phone, setPhone] = React.useState(profile.phone || "");
  const [avatarUrl, setAvatarUrl] = React.useState(profile.avatar_url || "");
  const [username, setUsername] = React.useState(profile.username || "admin_bali");
  const [email, setEmail] = React.useState(profile.email || "");
  const [copiedId, setCopiedId] = React.useState(false);

  const userInitials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AW";

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startProfileTransition(async () => {
      const res = await updateProfileAction({ success: false }, formData);
      setProfileState(res);
      if (res.success) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  const handleIdentitySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const enteredUsername = formData.get("username")?.toString().trim().toLowerCase() || "";
    if (!enteredUsername || !isValidUsername(enteredUsername)) {
      setIdentityState({
        success: false,
        error: "Username minimal 5-30 karakter (hanya huruf kecil, angka, dan underscore).",
      });
      return;
    }

    startIdentityTransition(async () => {
      const res = await updateAccountIdentityAction({ success: false }, formData);
      setIdentityState(res);
      if (res.success) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "-";
    try {
      return new Date(isoString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#EAF3FF] text-[#124E8C]">
              <UserCircle className="size-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
              Profile Admin Wilayah
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Kelola data identitas akun, kredensial login (Username & Email), dan profil operasional MDMC Bali.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand" className="text-xs py-1 px-3">
            <ShieldCheck className="size-3.5 mr-1" />
            {profile.role}
          </Badge>
          <Badge variant="success" className="text-xs py-1 px-3">
            {profile.is_active ? "Akun Aktif" : "Non-Aktif"}
          </Badge>
        </div>
      </div>

      {/* FEEDBACK ALERTS */}
      {identityState.error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200 shadow-xs animate-in slide-in-from-top-2">
          <AlertCircle className="size-5 shrink-0 text-rose-600" />
          <div className="flex-1">{identityState.error}</div>
        </div>
      )}

      {identityState.success && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          <div className="flex-1">{identityState.message || "Identitas akun berhasil diperbarui!"}</div>
        </div>
      )}

      {profileState.error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200 shadow-xs animate-in slide-in-from-top-2">
          <AlertCircle className="size-5 shrink-0 text-rose-600" />
          <div className="flex-1">{profileState.error}</div>
        </div>
      )}

      {profileState.success && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          <div className="flex-1">{profileState.message || "Profil berhasil diperbarui!"}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: IDENTITY CARD */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-slate-200 shadow-xs">
            {/* Header pattern banner */}
            <div className="h-24 bg-gradient-to-r from-[#0B1F3A] via-[#124E8C] to-[#2878BD] p-4 flex justify-end">
              <Badge variant="outline" className="h-6 border-white/30 text-white bg-white/10 text-[10px]">
                Provinsi Bali
              </Badge>
            </div>

            <CardContent className="pt-0 pb-6 px-6 -mt-12 text-center flex flex-col items-center">
              {/* Avatar Preview */}
              <div className="ring-4 ring-white rounded-2xl shadow-lg bg-white mb-3">
                <Avatar size="xl">
                  <AvatarImage src={avatarUrl} alt={fullName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </div>

              <h2 className="text-base font-bold text-[#0B1F3A] tracking-tight">
                {fullName || "Admin Wilayah MDMC"}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-mono font-bold text-[#124E8C] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  @{username}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">{email}</p>

              <div className="w-full border-t border-slate-100 my-4 pt-4 space-y-2.5 text-left text-xs">
                {/* ROLE */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" />
                    Role
                  </span>
                  <span className="font-bold text-[#124E8C] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 text-[11px]">
                    {profile.role}
                  </span>
                </div>

                {/* WILAYAH */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    Wilayah
                  </span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {profile.province || "Bali"}
                  </span>
                </div>

                {/* USERNAME */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <AtSign className="size-3.5" />
                    Username
                  </span>
                  <span className="font-semibold text-slate-700 font-mono">
                    @{username}
                  </span>
                </div>

                {/* EMAIL */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    Email
                  </span>
                  <span className="font-semibold text-slate-700 truncate max-w-[170px]" title={email}>
                    {email}
                  </span>
                </div>

                {/* NOMOR HP */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    Nomor HP
                  </span>
                  <span className="font-semibold text-slate-700 font-mono">
                    {phone || "-"}
                  </span>
                </div>

                {/* TERDAFTAR */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    Terdaftar
                  </span>
                  <span className="text-slate-600 font-medium text-[11px]">
                    {formatDate(profile.created_at)}
                  </span>
                </div>
              </div>

              {/* USER ID (READONLY) */}
              <div className="w-full mt-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span className="font-semibold flex items-center gap-1">
                    <Lock className="size-3 text-slate-400" />
                    ID Pengguna (Readonly)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="flex items-center gap-1 text-[#124E8C] hover:underline cursor-pointer"
                  >
                    {copiedId ? (
                      <>
                        <Check className="size-3 text-emerald-600" />
                        <span className="text-emerald-600">Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-[10px] text-slate-600 break-all text-left">
                  {profile.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: FORMS */}
        <div className="lg:col-span-2 space-y-6">
          {/* CARD 1: ACCOUNT IDENTITY (SPEC REQUIREMENT 12) */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AtSign className="size-5 text-[#124E8C]" />
                  <CardTitle>ACCOUNT IDENTITY</CardTitle>
                </div>
                <span className="text-[10px] text-[#124E8C] bg-blue-50 px-2 py-0.5 rounded font-bold border border-blue-200">
                  Kredensial Login
                </span>
              </div>
              <CardDescription>
                Atur Username dan Email yang digunakan untuk login ke portal MDMC Bali.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* WARNING NOTICE AS REQUIRED */}
              <div className="mb-5 flex items-start gap-3 rounded-xl bg-amber-50 p-3.5 text-xs text-amber-800 border border-amber-200 leading-relaxed">
                <AlertTriangle className="size-4.5 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-bold">Peringatan Keamanan:</p>
                  <p className="mt-0.5 text-amber-700">
                    Perubahan email akan membutuhkan verifikasi ulang email. Pastikan email baru aktif dan dapat diakses.
                  </p>
                </div>
              </div>

              <form onSubmit={handleIdentitySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* USERNAME */}
                  <div className="space-y-1.5">
                    <label htmlFor="username" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Username <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] font-mono text-slate-400">5 - 30 karakter</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        placeholder="admin_bali"
                        className="pl-8 font-mono text-xs"
                      />
                      <AtSign className="absolute left-2.5 top-2.5 size-4 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Hanya huruf kecil, angka, dan underscore (_).
                    </p>
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-slate-700">
                      Email Akun <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="wilayah.bali@mdmc.or.id"
                        className="pl-8 font-mono text-xs"
                      />
                      <Mail className="absolute left-2.5 top-2.5 size-4 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Alamat email login Supabase Auth.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPendingIdentity}
                    className="bg-[#124E8C] hover:bg-[#0B1F3A] text-white font-bold h-9 px-5 rounded-xl transition-all shadow-xs flex items-center gap-2"
                  >
                    {isPendingIdentity ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Menyimpan Identitas...</span>
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        <span>Simpan Identitas Akun</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* CARD 2: PERSONAL & CONTACT INFORMATION */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader>
              <CardTitle>Informasi Profil & Kontak</CardTitle>
              <CardDescription>
                Sesuaikan nama tampilan personal, nomor WhatsApp, dan avatar relawan.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* NAMA LENGKAP */}
                <div className="space-y-1.5">
                  <label htmlFor="full_name" className="text-xs font-bold text-slate-700">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap..."
                  />
                  <p className="text-[11px] text-slate-400">
                    Nama yang ditampilkan pada dokumen siaga dan header sistem.
                  </p>
                </div>

                {/* NOMOR HP */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-slate-700">
                    Nomor HP / WhatsApp
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="pl-9"
                    />
                    <Phone className="absolute left-3 top-2.5 size-4 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Nomor kontak koordinasi operasi kebencanaan.
                  </p>
                </div>

                {/* AVATAR URL */}
                <div className="space-y-1.5">
                  <label htmlFor="avatar_url" className="text-xs font-bold text-slate-700">
                    URL Foto Avatar
                  </label>
                  <div className="relative">
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... atau URL gambar avatar"
                      className="pl-9"
                    />
                    <ImageIcon className="absolute left-3 top-2.5 size-4 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Tautan gambar format PNG, JPG, atau WebP.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPendingProfile}
                    className="bg-[#0B1F3A] hover:bg-[#124E8C] text-white font-bold h-9 px-5 rounded-xl transition-all shadow-xs flex items-center gap-2"
                  >
                    {isPendingProfile ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Menyimpan Profil...</span>
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        <span>Simpan Profil</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* CARD 3: SYSTEM SCOPE & AUTHORITY (READONLY) */}
          <Card className="border-slate-200 shadow-xs bg-slate-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-slate-400" />
                <CardTitle className="text-sm">Hak Akses & Otoritas Sistem</CardTitle>
              </div>
              <CardDescription>
                Informasi kewenangan dan lingkup wilayah terkunci oleh sistem keamanan Supabase RLS.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ROLE */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Role Akses</label>
                  <Input
                    type="text"
                    disabled
                    value={profile.role}
                    className="bg-white text-slate-600 font-semibold cursor-not-allowed select-none"
                  />
                </div>

                {/* WILAYAH */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Wilayah Otoritas</label>
                  <Input
                    type="text"
                    disabled
                    value={profile.province || "Bali"}
                    className="bg-white text-slate-600 font-semibold cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
