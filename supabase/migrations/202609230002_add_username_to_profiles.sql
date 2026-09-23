-- ========================================================
-- MDMC VOLUNTEER MANAGEMENT SYSTEM - PROVINSI BALI
-- MIGRATION: ADD USERNAME TO PROFILES & MULTI-IDENTIFIER AUTH
-- ========================================================

-- 1. ADD USERNAME COLUMN TO PROFILES IF NOT EXISTS
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username VARCHAR(30);

-- 2. BACKFILL USERNAME FOR EXISTING PROFILES
-- For Wilayah Bali admin
UPDATE public.profiles
SET username = 'admin_bali'
WHERE email = 'wilayah.bali@mdmc.or.id' AND (username IS NULL OR username = '');

-- For any other existing profiles, generate valid unique usernames (5-30 chars, lowercase, numbers, _)
UPDATE public.profiles
SET username = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(SPLIT_PART(email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g'),
    '_+', '_', 'g'
  )
)
WHERE (username IS NULL OR username = '');

-- Ensure fallback meets minimum 5 characters requirement
UPDATE public.profiles
SET username = RPAD(username, 5, '0')
WHERE LENGTH(username) < 5;

-- Ensure username is unique and not null
ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;

-- 3. ADD UNIQUE AND FORMAT CONSTRAINTS
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS unique_username;
ALTER TABLE public.profiles ADD CONSTRAINT unique_username UNIQUE(username);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS check_username_format;
ALTER TABLE public.profiles ADD CONSTRAINT check_username_format
  CHECK (username ~ '^[a-z0-9_]{5,30}$');

COMMENT ON COLUMN public.profiles.username IS 'Username unik untuk login multi-identifier (5-30 karakter, lowercase, angka, underscore).';

-- 4. RLS SECURITY POLICY: USER UPDATE OWN ACCOUNT
DROP POLICY IF EXISTS "user update own account" ON public.profiles;
CREATE POLICY "user update own account"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. UPDATE FIELD LOCK TRIGGER
-- Prevent altering id, role, and province
-- User can edit: username, full_name, phone, avatar_url, updated_at
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

-- 6. RELOAD SUPABASE POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
