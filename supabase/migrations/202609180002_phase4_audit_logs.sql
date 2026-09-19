-- ========================================================
-- MDMC VOLUNTEER MANAGEMENT SYSTEM - PROVINSI BALI
-- MIGRATION PHASE 4: AUDIT LOGS TABLE & RLS
-- ========================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS 'Catatan log aktivitas pengelola sistem MDMC Bali.';

-- RLS POLICIES FOR AUDIT_LOGS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ADMIN_WILAYAH_BALI read audit_logs" ON public.audit_logs;
CREATE POLICY "ADMIN_WILAYAH_BALI read audit_logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.get_my_role() = 'ADMIN_WILAYAH_BALI');

DROP POLICY IF EXISTS "Authenticated users insert audit_logs" ON public.audit_logs;
CREATE POLICY "Authenticated users insert audit_logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

GRANT SELECT, INSERT ON TABLE public.audit_logs TO authenticated;
