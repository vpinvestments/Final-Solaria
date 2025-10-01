const { getDb } = require("../lib/db-local")

console.log("[v0] Listing all users...")

try {
  const db = getDb()

  const users = db
    .prepare(`
    SELECT id, email, first_name, last_name, oauth_provider, email_verified, created_at 
    FROM users 
    ORDER BY created_at DESC
  `)
    .all()

  if (users.length === 0) {
    console.log("[v0] No users found in database")
  } else {
    console.log(`[v0] Found ${users.length} users:`)
    console.table(users)
  }
} catch (error) {
  console.error("[v0] Failed to list users:", error)
  throw error
}
