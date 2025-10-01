const { getDb } = require("../lib/db-local.js")
const bcrypt = require("bcryptjs")

console.log("[v0] Setting up local database...")

try {
  const db = getDb()

  console.log("[v0] Creating users table...")
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      oauth_provider TEXT NULL,
      oauth_id TEXT NULL,
      avatar_url TEXT NULL,
      email_verified BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_oauth_provider_id ON users(oauth_provider, oauth_id);
  `)

  console.log("[v0] Users table created successfully!")

  const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get("demo@solariaworld.com")

  if (!existingUser) {
    console.log("[v0] Creating demo user...")
    const hashedPassword = bcrypt.hashSync("demo123", 12)

    const insertUser = db.prepare(`
      INSERT INTO users (email, password, first_name, last_name, email_verified, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `)

    insertUser.run("demo@solariaworld.com", hashedPassword, "Demo", "User", true)
    console.log("[v0] Demo user created successfully!")
    console.log("[v0] Demo credentials: demo@solariaworld.com / demo123")
  } else {
    console.log("[v0] Demo user already exists")
  }

  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get()
  console.log(`[v0] Database setup complete! Total users: ${userCount.count}`)
} catch (error) {
  console.error("[v0] Database setup failed:", error)
  throw error
}
