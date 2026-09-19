-- Migration: Add phone_normalized and import_volunteers_batch RPC function
-- Date: 2026-09-19

-- 1. Add phone_normalized column to volunteers if not exists
ALTER TABLE public.volunteers ADD COLUMN IF NOT EXISTS phone_normalized TEXT;

-- 2. Create Unique Index on phone_normalized for quick search & uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_volunteers_phone_normalized ON public.volunteers (phone_normalized);

-- 3. Create Atomic RPC Batch Import Function
CREATE OR REPLACE FUNCTION public.import_volunteers_batch(
  volunteers_data JSONB,
  target_district_id UUID,
  current_user_id UUID,
  file_name TEXT DEFAULT 'import.xlsx'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_role TEXT;
  v_caller_district_id UUID;
  v_count INTEGER;
  v_rec RECORD;
  v_inserted_count INTEGER := 0;
BEGIN
  -- 1. Validate caller existence and role
  SELECT role, district_id INTO v_caller_role, v_caller_district_id
  FROM public.profiles
  WHERE id = current_user_id;

  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'Akses ditolak: Profil pengguna tidak ditemukan.';
  END IF;

  IF v_caller_role != 'ADMIN_DAERAH' THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya ADMIN_DAERAH yang memiliki izin import data relawan.';
  END IF;

  -- 2. Validate district match
  IF v_caller_district_id IS NULL OR v_caller_district_id != target_district_id THEN
    RAISE EXCEPTION 'Akses ditolak: Anda hanya dapat mengimpor data untuk wilayah kerja Anda sendiri.';
  END IF;

  -- 3. Check batch size limit (max 5000 rows)
  v_count := jsonb_array_length(volunteers_data);
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Data relawan kosong. Minimal 1 baris data diperlukan.';
  END IF;

  IF v_count > 5000 THEN
    RAISE EXCEPTION 'Jumlah baris data melebihi batas maksimal 5.000 relawan per import.';
  END IF;

  -- 4. Atomic insert loop (entire transaction rolls back on any exception)
  FOR v_rec IN 
    SELECT 
      (elem->>'name')::TEXT AS name,
      (elem->>'gender')::TEXT AS gender,
      NULLIF(elem->>'age', '')::INTEGER AS age,
      (elem->>'address')::TEXT AS address,
      (elem->>'phone')::TEXT AS phone,
      (elem->>'phone_normalized')::TEXT AS phone_normalized
    FROM jsonb_array_elements(volunteers_data) AS elem
  LOOP
    -- Validate row level constraints
    IF v_rec.name IS NULL OR length(trim(v_rec.name)) < 2 THEN
      RAISE EXCEPTION 'Nama relawan wajib diisi minimal 2 karakter (baris: %)', v_rec.name;
    END IF;

    IF v_rec.phone_normalized IS NULL OR length(trim(v_rec.phone_normalized)) < 9 THEN
      RAISE EXCEPTION 'Nomor telepon tidak valid untuk relawan: %', v_rec.name;
    END IF;

    -- Insert into volunteers table
    INSERT INTO public.volunteers (
      district_id,
      name,
      gender,
      age,
      address,
      phone,
      phone_normalized,
      status,
      created_by
    ) VALUES (
      target_district_id,
      trim(v_rec.name),
      v_rec.gender,
      v_rec.age,
      trim(v_rec.address),
      trim(v_rec.phone),
      trim(v_rec.phone_normalized),
      'ACTIVE',
      current_user_id
    );

    v_inserted_count := v_inserted_count + 1;
  END LOOP;

  -- 5. Insert Audit Log with full metadata
  INSERT INTO public.audit_logs (
    user_id,
    action,
    target_type,
    target_id,
    description
  ) VALUES (
    current_user_id,
    'IMPORT_VOLUNTEERS',
    'VOLUNTEERS',
    target_district_id,
    format('Import %s data relawan dari file "%s" ke district_id: %s', v_inserted_count, file_name, target_district_id)
  );

  RETURN jsonb_build_object(
    'success', true,
    'imported_count', v_inserted_count,
    'district_id', target_district_id,
    'file_name', file_name
  );
END;
$$;
