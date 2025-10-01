const { getDb } = require("../lib/db-local")

console.log("[v0] Resetting database...")

try {
  const db = getDb()

  console.log("[v0] Dropping users table...")
  db.exec("DROP TABLE IF EXISTS users")

  console.log("[v0] Database reset complete!")
  console.log("[v0] Run setup-database.js to recreate tables")
} catch (error) {
  console.error("[v0] Failed to reset database:", error)
  throw error
}
