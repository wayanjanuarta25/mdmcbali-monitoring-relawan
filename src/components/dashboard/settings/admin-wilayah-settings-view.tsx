"use client";

import * as React from "react";
import {
  Settings as SettingsIcon,
  Shield,
  KeyRound,
  Bell,
  AlertTriangle,
  Radio,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Save,
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  updatePasswordAction,
  updateNotificationSettingsAction,
  type PasswordActionState,
  type UserNotificationSettings,
  type SettingsActionState,
} from "@/app/admin/wilayah/settings/actions";
import type { UserProfile } from "@/types/auth";

interface AdminWilayahSettingsViewProps {
  profile: UserProfile;
  initialSettings: UserNotificationSettings;
}

export function AdminWilayahSettingsView({
  profile,
  initialSettings,
}: AdminWilayahSettingsViewProps) {
  // Password State
  const [isPasswordPending, startPasswordTransition] = React.useTransition();
  const [passwordState, setPasswordState] = React.useState<PasswordActionState>({
    success: false,
  });
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  // Notification Preferences State
  const [isSettingsPending, startSettingsTransition] = React.useTransition();
  const [settingsState, setSettingsState] = React.useState<SettingsActionState>({
    success: false,
  });
  const [emergencyAlert, setEmergencyAlert] = React.useState(
    initialSettings.emergency_alert
  );
  const [notificationEnabled, setNotificationEnabled] = React.useState(
    initialSettings.notification_enabled
  );

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setPasswordState({
        success: false,
        error: "Password baru harus memiliki panjang minimal 8 karakter.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordState({
        success: false,
        error: "Konfirmasi password tidak cocok dengan password baru.",
      });
      return;
    }

    // Open confirmation dialog
    setConfirmDialogOpen(true);
  };

  const handleConfirmPasswordChange = () => {
    setConfirmDialogOpen(false);
    const formData = new FormData();
    formData.append("new_password", newPassword);
    formData.append("confirm_password", confirmPassword);

    startPasswordTransition(async () => {
      const res = await updatePasswordAction({ success: false }, formData);
      setPasswordState(res);
      if (res.success) {
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  };

  const handleSaveNotifications = () => {
    startSettingsTransition(async () => {
      const res = await updateNotificationSettingsAction({
        emergency_alert: emergencyAlert,
        notification_enabled: notificationEnabled,
      });
      setSettingsState(res);
    });
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#EAF3FF] text-[#124E8C]">
              <SettingsIcon className="size-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
              Settings Akun & Preferensi
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Kelola kata sandi akun Supabase Auth dan preferensi peringatan siaga darurat MDMC Bali.
          </p>
        </div>

        <Badge variant="outline" className="text-xs py-1 px-3 border-slate-300">
          <Shield className="size-3.5 mr-1 text-[#124E8C]" />
          {profile.role}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: ACCOUNT SECURITY */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-xs h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center gap-2 text-[#124E8C] mb-1">
                  <KeyRound className="size-4.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Section 1
                  </span>
                </div>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Perbarui kata sandi akun login Supabase Anda. Gunakan kombinasi yang kuat dan aman.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {passwordState.error && (
                  <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 border border-rose-200 animate-in slide-in-from-top-2">
                    <AlertCircle className="size-4.5 shrink-0 text-rose-600" />
                    <span>{passwordState.error}</span>
                  </div>
                )}

                {passwordState.success && (
                  <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="size-4.5 shrink-0 text-emerald-600" />
                    <span>{passwordState.message || "Password berhasil diubah!"}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* PASSWORD BARU */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="new_password"
                      className="text-xs font-bold text-slate-700"
                    >
                      Password Baru <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        name="new_password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 8 karakter..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* KONFIRMASI PASSWORD */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirm_password"
                      className="text-xs font-bold text-slate-700"
                    >
                      Konfirmasi Password <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang password baru..."
                    />
                  </div>

                  {/* Password strength tips */}
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">Persyaratan Keamanan:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                      <li className={newPassword.length >= 8 ? "text-emerald-600 font-medium" : ""}>
                        Minimal 8 karakter huruf & angka
                      </li>
                      <li
                        className={
                          confirmPassword && newPassword === confirmPassword
                            ? "text-emerald-600 font-medium"
                            : ""
                        }
                      >
                        Konfirmasi password harus cocok
                      </li>
                    </ul>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isPasswordPending || !newPassword || !confirmPassword}
                      className="w-full bg-[#124E8C] hover:bg-[#0B1F3A] text-white font-bold h-10 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isPasswordPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Menyimpan Password...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="size-4" />
                          <span>Simpan Password</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* SECTION 2: NOTIFICATION PREFERENCE */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-xs h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center gap-2 text-[#124E8C] mb-1">
                  <Bell className="size-4.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Section 2
                  </span>
                </div>
                <CardTitle>Notification Preference</CardTitle>
                <CardDescription>
                  Atur jenis peringatan siaga darurat kebencanaan dan notifikasi koordinasi relawan MDMC.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {settingsState.error && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 border border-rose-200 animate-in slide-in-from-top-2">
                    <AlertCircle className="size-4.5 shrink-0 text-rose-600" />
                    <span>{settingsState.error}</span>
                  </div>
                )}

                {settingsState.success && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="size-4.5 shrink-0 text-emerald-600" />
                    <span>{settingsState.message || "Preferensi berhasil disimpan!"}</span>
                  </div>
                )}

                {/* TOGGLE 1: NOTIFIKASI DARURAT */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700 shrink-0">
                      <AlertTriangle className="size-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#0B1F3A]">
                          Notifikasi Darurat
                        </h4>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            emergencyAlert
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {emergencyAlert ? "ON" : "OFF"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Terima peringatan mendesak terkait insiden kebencanaan alam, gempa, tsunami, atau status darurat kritis di Provinsi Bali.
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={emergencyAlert}
                    onCheckedChange={setEmergencyAlert}
                    aria-label="Toggle Notifikasi Darurat"
                  />
                </div>

                {/* TOGGLE 2: NOTIFIKASI WILAYAH */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-sky-100 text-[#124E8C] shrink-0">
                      <Radio className="size-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#0B1F3A]">
                          Notifikasi Wilayah
                        </h4>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            notificationEnabled
                              ? "bg-sky-100 text-[#124E8C]"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {notificationEnabled ? "ON" : "OFF"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Terima pengumuman umum, arahan posko, laporan relawan per kabupaten/kota, dan agenda kegiatan MDMC Bali.
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={notificationEnabled}
                    onCheckedChange={setNotificationEnabled}
                    aria-label="Toggle Notifikasi Wilayah"
                  />
                </div>

                {/* SAVE BUTTON */}
                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={handleSaveNotifications}
                    disabled={isSettingsPending}
                    className="w-full bg-[#0B1F3A] hover:bg-[#124E8C] text-white font-bold h-10 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSettingsPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Menyimpan Preferensi...</span>
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        <span>Simpan Preferensi Notifikasi</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* CONFIRMATION DIALOG FOR PASSWORD CHANGE */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Perubahan Kata Sandi</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin memperbarui kata sandi akun Admin Wilayah? Anda akan menggunakan kata sandi baru ini pada login berikutnya.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-800">
            <AlertTriangle className="size-4 shrink-0 text-amber-600" />
            <span>Pastikan Anda mengingat atau mencatat kata sandi baru Anda.</span>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              className="bg-[#124E8C] hover:bg-[#0B1F3A] text-white"
              onClick={handleConfirmPasswordChange}
            >
              Ya, Simpan Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
