-- ========================================================
-- MDMC VOLUNTEER MANAGEMENT SYSTEM - PROVINSI BALI
-- MIGRATION: RLS POLICIES FOR ADMIN_DAERAH VOLUNTEERS
-- ========================================================

DROP POLICY IF EXISTS "ADMIN_DAERAH select own district volunteers" ON public.volunteers;
CREATE POLICY "ADMIN_DAERAH select own district volunteers"
  ON public.volunteers FOR SELECT
  TO authenticated
  USING (
    public.get_my_role() = 'ADMIN_DAERAH' 
    AND district_id = public.get_my_district_id()
  );

DROP POLICY IF EXISTS "ADMIN_DAERAH insert own district volunteers" ON public.volunteers;
CREATE POLICY "ADMIN_DAERAH insert own district volunteers"
  ON public.volunteers FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_my_role() = 'ADMIN_DAERAH' 
    AND district_id = public.get_my_district_id()
  );

DROP POLICY IF EXISTS "ADMIN_DAERAH update own district volunteers" ON public.volunteers;
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

DROP POLICY IF EXISTS "ADMIN_DAERAH delete own district volunteers" ON public.volunteers;
CREATE POLICY "ADMIN_DAERAH delete own district volunteers"
  ON public.volunteers FOR DELETE
  TO authenticated
  USING (
    public.get_my_role() = 'ADMIN_DAERAH' 
    AND district_id = public.get_my_district_id()
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.volunteers TO authenticated;
