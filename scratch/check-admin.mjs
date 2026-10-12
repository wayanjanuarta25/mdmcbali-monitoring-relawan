import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Read .env.local
const envFile = fs.readFileSync(".env.local", "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const [key, ...rest] = line.split("=");
  if (key && rest.length > 0) {
    env[key.trim()] = rest.join("=").trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("Checking profiles...");
  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("*");
  if (pErr) console.error("Profile error:", pErr);
  else {
    console.log("Profiles count:", profiles?.length);
    console.log(
      "Admin Wilayah profiles:",
      profiles?.filter((p) => p.role === "ADMIN_WILAYAH_BALI")
    );
  }

  console.log("\nChecking auth users...");
  const { data: users, error: uErr } = await supabase.auth.admin.listUsers();
  if (uErr) console.error("Users error:", uErr);
  else {
    console.log("Auth users count:", users?.users?.length);
    users?.users?.forEach((u) => {
      console.log(`- ID: ${u.id}, Email: ${u.email}, Created: ${u.created_at}`);
    });
  }
}

main().catch(console.error);
