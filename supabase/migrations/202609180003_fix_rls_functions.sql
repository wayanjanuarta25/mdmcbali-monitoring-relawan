-- ========================================================
-- MDMC VOLUNTEER MANAGEMENT SYSTEM - PROVINSI BALI
-- MIGRATION PHASE 5: FIX RLS HELPER FUNCTIONS RECURSION
-- ========================================================

-- Re-create helper functions using PL/pgSQL to prevent query inlining and RLS recursion in PostgreSQL

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
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
SET search_path = public, auth
AS $$
DECLARE
  _district_id UUID;
BEGIN
  SELECT district_id INTO _district_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
  RETURN _district_id;
END;
$$;
