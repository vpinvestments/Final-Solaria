const { getDb } = require("../lib/db-local")
const bcrypt = require("bcryptjs")

console.log("[v0] Adding test users...")

const testUsers = [
  {
    email: "john.doe@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
  },
  {
    email: "jane.smith@example.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Smith",
  },
  {
    email: "trader@solariaworld.com",
    password: "trader123",
    firstName: "Pro",
    lastName: "Trader",
  },
]

try {
  const db = getDb()

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (email, password, first_name, last_name, email_verified, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `)

  let addedCount = 0

  for (const user of testUsers) {
    const hashedPassword = bcrypt.hashSync(user.password, 12)
    const result = insertUser.run(user.email, hashedPassword, user.firstName, user.lastName, true)

    if (result.changes > 0) {
      console.log(`[v0] Added user: ${user.email}`)
      addedCount++
    } else {
      console.log(`[v0] User already exists: ${user.email}`)
    }
  }

  console.log(`[v0] Added ${addedCount} new test users`)

  const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get()
  console.log(`[v0] Total users in database: ${totalUsers.count}`)
} catch (error) {
  console.error("[v0] Failed to add test users:", error)
  throw error
}
