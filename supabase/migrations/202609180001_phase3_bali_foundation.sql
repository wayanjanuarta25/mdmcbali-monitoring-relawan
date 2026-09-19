-- ========================================================
-- MDMC VOLUNTEER MANAGEMENT SYSTEM - PROVINSI BALI
-- MIGRATION PHASE 3: DATABASE FOUNDATION + SECURITY
-- ========================================================

-- 1. DROP EXISTING CONFLICTING TABLES/TYPES IF RE-RUNNING
DROP TABLE IF EXISTS public.volunteers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.districts CASCADE;

DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.district_type CASCADE;
DROP TYPE IF EXISTS public.volunteer_status CASCADE;

-- 2. CREATE ENUMS
CREATE TYPE public.user_role AS ENUM (
  'ADMIN_WILAYAH_BALI',
  'ADMIN_DAERAH'
);

CREATE TYPE public.district_type AS ENUM (
  'KABUPATEN',
  'KOTA'
);

CREATE TYPE public.volunteer_status AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'TRAINING',
  'SUSPENDED'
);

-- 3. CREATE TABLE: DISTRICTS (KABUPATEN / KOTA DI BALI)
CREATE TABLE public.districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  type public.district_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.districts IS 'Master data Kabupaten & Kota di Provinsi Bali.';

-- SEED MASTER DATA DISTRICTS BALI
INSERT INTO public.districts (name, code, type) VALUES
  ('Badung', 'BALI-BDG', 'KABUPATEN'),
  ('Bangli', 'BALI-BGL', 'KABUPATEN'),
  ('Buleleng', 'BALI-BLL', 'KABUPATEN'),
  ('Denpasar', 'BALI-DPS', 'KOTA'),
  ('Gianyar', 'BALI-GNY', 'KABUPATEN'),
  ('Jembrana', 'BALI-JBR', 'KABUPATEN'),
  ('Karangasem', 'BALI-KRA', 'KABUPATEN'),
  ('Klungkung', 'BALI-KLK', 'KABUPATEN'),
  ('Tabanan', 'BALI-TBN', 'KABUPATEN')
ON CONFLICT (code) DO NOTHING;

-- 4. CREATE TABLE: PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role public.user_role NOT NULL,
  district_id UUID REFERENCES public.districts (id) ON DELETE SET NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT profiles_role_scope_check CHECK (
    (role = 'ADMIN_WILAYAH_BALI' AND district_id IS NULL)
    OR (role = 'ADMIN_DAERAH' AND district_id IS NOT NULL)
  )
);

COMMENT ON TABLE public.profiles IS 'Identitas dan scope kewenangan pengguna MDMC Bali.';

-- 5. CREATE TABLE: VOLUNTEERS
CREATE TABLE public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID NOT NULL REFERENCES public.districts (id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('L', 'P', 'Laki-laki', 'Perempuan')),
  address TEXT,
  phone TEXT,
  blood_type TEXT,
  education TEXT,
  occupation TEXT,
  skills TEXT[] DEFAULT '{}'::TEXT[],
  join_date DATE DEFAULT CURRENT_DATE,
  photo_url TEXT,
  status public.volunteer_status NOT NULL DEFAULT 'ACTIVE',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.volunteers IS 'Data relawan kesiapsiagaan bencana MDMC Bali.';

-- 6. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$;

CREATE TRIGGER districts_set_updated_at
  BEFORE UPDATE ON public.districts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER volunteers_set_updated_at
  BEFORE UPDATE ON public.volunteers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. ROLE SAFETY TRIGGER FOR PROFILES
-- Prevents ADMIN_WILAYAH_BALI from altering own role or any ADMIN_WILAYAH_BALI role
CREATE OR REPLACE FUNCTION public.check_profile_role_lock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Prevent altering role of an ADMIN_WILAYAH_BALI profile
  IF OLD.role = 'ADMIN_WILAYAH_BALI' AND NEW.role <> OLD.role THEN
    RAISE EXCEPTION 'Akses ditolak: Role ADMIN_WILAYAH_BALI tidak dapat diubah.';
  END IF;

  -- Prevent user from changing their own role
  IF auth.uid() = OLD.id AND NEW.role <> OLD.role THEN
    RAISE EXCEPTION 'Akses ditolak: Pengguna tidak dapat mengubah role milik sendiri.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_prevent_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_profile_role_lock();

-- 8. ROW LEVEL SECURITY (RLS) POLICIES

-- ENABLE RLS
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- HELPER FUNCTIONS FOR SECURITY RULES
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _role public.user_role;
BEGIN
  SELECT role INTO _role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
  RETURN _role;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_district_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _district_id UUID;
BEGIN
  SELECT district_id INTO _district_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
  RETURN _district_id;
END;
$$;

-- DISTRICTS POLICIES
-- Read access for all authenticated users
CREATE POLICY "Authenticated users can view districts"
  ON public.districts FOR SELECT
  TO authenticated
  USING (true);

-- Full write access for ADMIN_WILAYAH_BALI
CREATE POLICY "ADMIN_WILAYAH_BALI full access to districts"
  ON public.districts FOR ALL
  TO authenticated
  USING (public.get_my_role() = 'ADMIN_WILAYAH_BALI')
  WITH CHECK (public.get_my_role() = 'ADMIN_WILAYAH_BALI');

-- PROFILES POLICIES
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- ADMIN_WILAYAH_BALI can view all profiles in Bali
CREATE POLICY "ADMIN_WILAYAH_BALI view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.get_my_role() = 'ADMIN_WILAYAH_BALI');

-- ADMIN_WILAYAH_BALI can insert profiles (except ADMIN_WILAYAH_BALI role)
CREATE POLICY "ADMIN_WILAYAH_BALI insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_my_role() = 'ADMIN_WILAYAH_BALI'
    OR auth.uid() = id
  );

-- ADMIN_WILAYAH_BALI can update profiles (subject to role lock trigger)
CREATE POLICY "ADMIN_WILAYAH_BALI update profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.get_my_role() = 'ADMIN_WILAYAH_BALI')
  WITH CHECK (public.get_my_role() = 'ADMIN_WILAYAH_BALI');

-- VOLUNTEERS POLICIES
-- ADMIN_WILAYAH_BALI has full access to all volunteers in Bali
CREATE POLICY "ADMIN_WILAYAH_BALI full access to volunteers"
  ON public.volunteers FOR ALL
  TO authenticated
  USING (public.get_my_role() = 'ADMIN_WILAYAH_BALI')
  WITH CHECK (public.get_my_role() = 'ADMIN_WILAYAH_BALI');

-- ADMIN_DAERAH can read volunteers in their district
CREATE POLICY "ADMIN_DAERAH select own district volunteers"
  ON public.volunteers FOR SELECT
  TO authenticated
  USING (
    public.get_my_role() = 'ADMIN_DAERAH' 
    AND district_id = public.get_my_district_id()
  );

-- ADMIN_DAERAH can insert volunteers into their district
CREATE POLICY "ADMIN_DAERAH insert own district volunteers"
  ON public.volunteers FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_my_role() = 'ADMIN_DAERAH' 
    AND district_id = public.get_my_district_id()
  );

-- ADMIN_DAERAH can update volunteers in their district
CREATE POLICY "ADMIN_DAERAH update own district volunteers"
  ON public.volunteers FOR UPDATE
  TO authenticated
  USING (
    public.get_my_role() = 'ADMIN_DAERAH' 
    AND district_id = public.get_my_district_id()
  )
  WITH CHECK (
    public.get_my_role() = 'ADMIN_DAERAH' 
    AND district_id = public.get_my_district_id()
  );

-- ADMIN_DAERAH can delete volunteers in their district
CREATE POLICY "ADMIN_DAERAH delete own district volunteers"
  ON public.volunteers FOR DELETE
  TO authenticated
  USING (
    public.get_my_role() = 'ADMIN_DAERAH' 
    AND district_id = public.get_my_district_id()
  );

GRANT SELECT ON TABLE public.districts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.volunteers TO authenticated;
