-- ========================================================
-- MDMC VOLUNTEER MANAGEMENT SYSTEM - PROVINSI BALI
-- MASTER DATA SEED: 9 KABUPATEN / KOTA DI BALI
-- ========================================================

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
ON CONFLICT (code) DO UPDATE 
SET 
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  updated_at = NOW();
