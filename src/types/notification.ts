export type NotificationType = "INFORMASI" | "PERINGATAN" | "DARURAT";
export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type NotificationTargetType = "ALL" | "ADMIN_DAERAH" | "DISTRICT";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  target_type: NotificationTargetType;
  target_district_id: string | null;
  is_active: boolean;
  created_by?: string | null;
  created_at: string;
  expires_at?: string | null;
  deleted_at?: string | null;
  district_name?: string;
  is_read?: boolean;
}

export type NotificationActionState = {
  success?: boolean;
  error?: string | null;
  message?: string | null;
};
