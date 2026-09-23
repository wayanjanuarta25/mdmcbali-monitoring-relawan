-- ========================================================
-- MDMC VOLUNTEER MANAGEMENT SYSTEM - PROVINSI BALI
-- MIGRATION: USER SETTINGS, PROFILE ENHANCEMENT & RLS SECURITY
-- ========================================================

-- 1. CREATE TABLE: USER_SETTINGS
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  emergency_alert BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.user_settings IS 'Preferensi notifikasi dan konfigurasi akun pengguna MDMC Bali.';

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policy: user manage own settings
DROP POLICY IF EXISTS "user manage own settings" ON public.user_settings;
CREATE POLICY "user manage own settings"
  ON public.user_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

GRANT ALL ON TABLE public.user_settings TO authenticated;

-- Trigger to auto-update updated_at on user_settings
DROP TRIGGER IF EXISTS user_settings_set_updated_at ON public.user_settings;
CREATE TRIGGER user_settings_set_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- 2. PROFILE ENHANCEMENT & SECURITY HARDENING
-- Add province column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS province TEXT DEFAULT 'Bali';

-- Ensure RLS on profiles allows users to update only their own profile
DROP POLICY IF EXISTS "user update own profile" ON public.profiles;
CREATE POLICY "user update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger to protect restricted fields from being altered on public.profiles
CREATE OR REPLACE FUNCTION public.protect_profile_restricted_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Prevent altering profile id
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Akses ditolak: ID profil tidak dapat diubah.';
  END IF;

  -- Prevent altering role
  IF NEW.role <> OLD.role THEN
    RAISE EXCEPTION 'Akses ditolak: Role profil tidak dapat diubah.';
  END IF;

  -- Prevent altering province/wilayah
  IF NEW.province IS DISTINCT FROM OLD.province THEN
    RAISE EXCEPTION 'Akses ditolak: Wilayah/Provinsi tidak dapat diubah.';
  END IF;

  -- Auto-set updated_at timestamp
  NEW.updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_protect_restricted_fields ON public.profiles;
CREATE TRIGGER profiles_protect_restricted_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_restricted_fields();


-- 3. AUDIT LOG ENHANCEMENT FOR EVENTS & METADATA
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS event TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.audit_logs.event IS 'Event identitas audit (misal: UPDATE_PROFILE, UPDATE_PASSWORD, UPDATE_SETTINGS).';
COMMENT ON COLUMN public.audit_logs.metadata IS 'Informasi detail metadata perubahan audit dalam format JSON.';
