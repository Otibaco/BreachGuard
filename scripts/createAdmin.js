/**
 * scripts/createAdmin.js
 *
 * Creates (or updates the password for) an administrator account.
 * This is the only supported way to provision an admin - there is no
 * public registration endpoint.
 *
 * Usage:
 *   node scripts/createAdmin.js --email admin@example.com --username admin --password "a-strong-password"
 *
 * Any flag can be omitted and falls back to ADMIN_EMAIL / ADMIN_USERNAME
 * from .env.local, or an interactive prompt for the password.
 * If an admin with that email already exists, the password (and username)
 * are updated.
 *
 * This script defines its own copy of the User schema so it can run as a
 * plain CommonJS Node script (`node scripts/createAdmin.js`) without going
 * through Next.js's ESM/bundler pipeline. Keep it in sync with
 * models/User.js if that schema ever changes.
 */

require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--email") parsed.email = args[i + 1];
    if (args[i] === "--username") parsed.username = args[i + 1];
    if (args[i] === "--password") parsed.password = args[i + 1];
  }
  return parsed;
}

function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const { email: cliEmail, username: cliUsername, password: cliPassword } = parseArgs();

  const email = (cliEmail || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!email) {
    console.error("No admin email provided. Pass --email or set ADMIN_EMAIL in .env.local.");
    process.exit(1);
  }

  const username = (cliUsername || process.env.ADMIN_USERNAME || email.split("@")[0]).trim();
  if (username.length < 3) {
    console.error("Username must be at least 3 characters. Pass --username explicitly.");
    process.exit(1);
  }

  const password =
    cliPassword || (await promptHidden("Enter a password for the admin account: "));

  if (!password || password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Add it to .env.local.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await User.findOne({ email }).select("+password");
  if (existing) {
    existing.password = passwordHash;
    existing.username = username;
    existing.role = "admin";
    await existing.save();
    console.log(`Updated password for existing admin: ${email}`);
  } else {
    await User.create({ email, username, password: passwordHash, role: "admin" });
    console.log(`Created new admin: ${email} (username: ${username})`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
});
