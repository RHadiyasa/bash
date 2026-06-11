/*
 * Seeder akun developer.
 * Jalankan: node scripts/createDeveloper.js <email> <password> [nama]
 * Contoh   : node scripts/createDeveloper.js dev@bash.id RahasiaKuat123 "Super Admin"
 *
 * Aman dijalankan berulang (upsert by email). Membaca MONGODB_URI dari .env.
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load .env (single-line keys saja; cukup untuk MONGODB_URI)
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const [, , email, password, name] = process.argv;

if (!email || !password) {
  console.error(
    "Usage: node scripts/createDeveloper.js <email> <password> [nama]"
  );
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password minimal 8 karakter.");
  process.exit(1);
}

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI tidak ditemukan di .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const users = mongoose.connection.collection("users");

  const hashed = await bcrypt.hash(password, 10);
  const now = new Date();

  await users.updateOne(
    { email },
    {
      $set: {
        password: hashed,
        role: "developer",
        isVerified: true,
        isActive: true,
        updatedAt: now,
      },
      $setOnInsert: {
        name: name || email,
        email,
        phoneNumber: 0,
        createdAt: now,
      },
    },
    { upsert: true }
  );

  console.log(`✅ Akun developer siap: ${email}`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error("Gagal membuat developer:", err.message);
  process.exit(1);
});
