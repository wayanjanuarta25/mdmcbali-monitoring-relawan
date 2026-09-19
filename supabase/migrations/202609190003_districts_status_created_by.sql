-- ========================================================
-- MDMC VOLUNTEER MANAGEMENT SYSTEM - PROVINSI BALI
-- MIGRATION: ADD STATUS & CREATED_BY TO DISTRICTS
-- ========================================================

ALTER TABLE public.districts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL;

COMMENT ON COLUMN public.districts.status IS 'Status keaktifan daerah (ACTIVE / INACTIVE).';
COMMENT ON COLUMN public.districts.created_by IS 'ID admin wilayah yang menambahkan daerah.';
