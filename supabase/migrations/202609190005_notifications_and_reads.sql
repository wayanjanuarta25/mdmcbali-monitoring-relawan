-- Migration: Notification Management System with Soft Delete and Detailed RLS
-- Date: 2026-09-19

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('INFORMASI', 'PERINGATAN', 'DARURAT')),
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  target_type TEXT NOT NULL CHECK (target_type IN ('ALL', 'ADMIN_DAERAH', 'DISTRICT')),
  target_district_id UUID NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NULL,
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- 2. Create notification_reads table
CREATE TABLE IF NOT EXISTS public.notification_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_notification_user UNIQUE (notification_id, user_id)
);

-- 3. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_notifications_lookup 
ON public.notifications (is_active, target_type, target_district_id, created_at DESC)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notification_reads_user 
ON public.notification_reads (user_id, notification_id);

-- 4. Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is ADMIN_WILAYAH_BALI
CREATE OR REPLACE FUNCTION public.is_admin_wilayah()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN_WILAYAH_BALI'
  );
$$;

-- RLS for notifications:
-- ADMIN_WILAYAH_BALI can do everything (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "wilayah_full_access_notifications" ON public.notifications;
CREATE POLICY "wilayah_full_access_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (public.is_admin_wilayah())
WITH CHECK (public.is_admin_wilayah());

-- ADMIN_DAERAH read policy: target_type = 'ALL' OR 'ADMIN_DAERAH' OR 'DISTRICT' matching user's district_id
DROP POLICY IF EXISTS "daerah_read_notifications" ON public.notifications;
CREATE POLICY "daerah_read_notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  deleted_at IS NULL 
  AND is_active = true 
  AND (expires_at IS NULL OR expires_at > NOW())
  AND (
    target_type = 'ALL'
    OR target_type = 'ADMIN_DAERAH'
    OR (
      target_type = 'DISTRICT' 
      AND target_district_id = (SELECT district_id FROM public.profiles WHERE id = auth.uid())
    )
  )
);

-- RLS for notification_reads: User can only read and manage their own read states
DROP POLICY IF EXISTS "user_own_notification_reads" ON public.notification_reads;
CREATE POLICY "user_own_notification_reads"
ON public.notification_reads
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
