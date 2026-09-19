-- ========================================================
-- MDMC VOLUNTEER MANAGEMENT SYSTEM - PROVINSI BALI
-- MIGRATION: SOFT DELETE ADMIN DAERAH (deleted_at)
-- ========================================================

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN public.profiles.deleted_at IS 'Waktu akun dinonaktifkan / dihapus secara soft-delete.';
