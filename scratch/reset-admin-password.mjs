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

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const newPassword = process.argv[2] || "AdminMDMC2026!";

async function resetPassword() {
  console.log(`Menghubungi Supabase di: ${supabaseUrl}...`);

  // Cari user ADMIN_WILAYAH_BALI di profiles
  const { data: profile, error: pError } = await supabase
    .from("profiles")
    .select("id, email, username, role")
    .eq("role", "ADMIN_WILAYAH_BALI")
    .maybeSingle();

  let targetId = profile?.id;
  let targetEmail = profile?.email || "wilayah.bali@mdmc.or.id";

  if (!targetId) {
    console.log("Mencari user di auth.users berdasarkan email wilayah.bali@mdmc.or.id...");
    const { data: users, error: uError } = await supabase.auth.admin.listUsers();
    if (uError) {
      console.error("Gagal mengambil list users:", uError.message);
      return;
    }
    const adminUser = users.users.find(
      (u) => u.email === "wilayah.bali@mdmc.or.id"
    );
    if (adminUser) {
      targetId = adminUser.id;
      targetEmail = adminUser.email;
    }
  }

  if (!targetId) {
    console.error("User Admin Wilayah tidak ditemukan di database!");
    return;
  }

  console.log(`Mengatur ulang password untuk user ID: ${targetId} (${targetEmail})...`);
  const { data: updated, error: updateError } =
    await supabase.auth.admin.updateUserById(targetId, {
      password: newPassword,
      email_confirm: true,
    });

  if (updateError) {
    console.error("Gagal mereset password:", updateError.message);
  } else {
    console.log("=========================================");
    console.log("BERHASIL MERESET PASSWORD ADMIN WILAYAH!");
    console.log("=========================================");
    console.log(`Email / Username : ${targetEmail} / ${profile?.username || "admin_bali"}`);
    console.log(`Password Baru    : ${newPassword}`);
    console.log("=========================================");
  }
}

resetPassword().catch((err) => {
  console.error("Koneksi gagal:", err.message);
});
