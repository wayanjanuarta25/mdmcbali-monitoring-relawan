import type { SupabaseClient } from "@supabase/supabase-js";

export interface AuditLogPayload {
  user_id: string;
  action: string;
  event?: string;
  target_type: string;
  target_id?: string | null;
  description: string;
  metadata?: Record<string, unknown>;
}

/**
 * Inserts an audit log entry.
 * Resiliently handles databases with or without the optional `event` and `metadata` columns.
 */
export async function insertAuditLog(
  supabase: SupabaseClient,
  payload: AuditLogPayload
) {
  try {
    // Attempt inserting with event and metadata
    const { error } = await supabase.from("audit_logs").insert({
      user_id: payload.user_id,
      action: payload.action,
      event: payload.event || payload.action,
      target_type: payload.target_type,
      target_id: payload.target_id || null,
      description: payload.description,
      metadata: payload.metadata || {},
    });

    if (error) {
      // If event or metadata columns don't exist yet (Postgres 42703), insert without them
      if (error.code === "42703") {
        await supabase.from("audit_logs").insert({
          user_id: payload.user_id,
          action: payload.action,
          target_type: payload.target_type,
          target_id: payload.target_id || null,
          description: payload.description,
        });
      } else {
        console.warn("[insertAuditLog] Non-blocking audit log error:", error.message);
      }
    }
  } catch (err) {
    console.warn("[insertAuditLog] Unexpected error logging audit:", err);
  }
}
