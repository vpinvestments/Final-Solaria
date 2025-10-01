import { executeQuery, testConnection } from "../lib/db"

async function manageLocalDatabase() {
  console.log("[v0] Local Database Management Tool")
  console.log("=====================================")

  try {
    // Test connection
    const connectionTest = await testConnection()
    if (!connectionTest.success) {
      console.error("[v0] ❌ Database connection failed:", connectionTest.message)
      return
    }
    console.log("[v0] ✅ Database connection successful")

    // Show database info
    const versionResult = await executeQuery("SELECT sqlite_version() as version")
    console.log("[v0] SQLite version:", (versionResult as any[])[0]?.version)

    // List all tables
    const tables = await executeQuery("SELECT name FROM sqlite_master WHERE type='table'")
    console.log("[v0] Tables:", (tables as any[]).map((t) => t.name).join(", "))

    // Show users table info
    const userCount = await executeQuery("SELECT COUNT(*) as count FROM users")
    console.log("[v0] Total users:", (userCount as any[])[0]?.count)

    // Show demo user
    const demoUser = await executeQuery("SELECT email, first_name, last_name, created_at FROM users WHERE email = ?", [
      "demo@solariaworld.com",
    ])
    if ((demoUser as any[]).length > 0) {
      console.log("[v0] ✅ Demo user exists:", (demoUser as any[])[0])
    } else {
      console.log("[v0] ⚠️ Demo user not found")
    }

    // Show all users (limited info for privacy)
    const allUsers = await executeQuery(
      "SELECT id, email, first_name, last_name, oauth_provider, created_at FROM users LIMIT 10",
    )
    console.log("[v0] Recent users:")
    ;(allUsers as any[]).forEach((user) => {
      console.log(
        `  - ${user.id}: ${user.email} (${user.first_name} ${user.last_name}) - ${user.oauth_provider || "local"} - ${user.created_at}`,
      )
    })
  } catch (error) {
    console.error("[v0] ❌ Database management failed:", error)
  }
}

// Run if called directly
if (require.main === module) {
  manageLocalDatabase()
}

export { manageLocalDatabase }
