import { testConnection, executeQuery, closePool } from "../lib/db"

async function testRemoteMySQLConnection() {
  try {
    console.log("[v0] Starting remote MySQL database connection test...")
    console.log("[v0] Configuration:")
    console.log("  Host:", process.env.DB_HOST)
    console.log("  Database:", process.env.DB_NAME)
    console.log("  Port:", process.env.DB_PORT)
    console.log("  SSL:", process.env.DB_SSL === "true" ? "Enabled" : "Disabled")

    const connectionResult = await testConnection()

    if (!connectionResult.success) {
      console.error("[v0] ❌ Connection failed:", connectionResult.message)
      return
    }

    console.log("[v0] ✅ Remote MySQL connection established successfully")

    const [serverInfo] = (await executeQuery(
      "SELECT VERSION() as version, NOW() as current_time, USER() as current_user",
    )) as any[]
    console.log("[v0] ✅ Server info:", serverInfo)

    const [hostInfo] = (await executeQuery("SELECT @@hostname as hostname, @@port as port")) as any[]
    console.log("[v0] ✅ Remote server details:", hostInfo)

    // Check users table
    try {
      const [tables] = (await executeQuery("SHOW TABLES LIKE 'users'")) as any[]
      if (Array.isArray(tables) && tables.length > 0) {
        console.log("[v0] ✅ Users table exists")

        const [columns] = (await executeQuery("DESCRIBE users")) as any[]
        console.log("[v0] Users table structure:", columns)

        const [count] = (await executeQuery("SELECT COUNT(*) as user_count FROM users")) as any[]
        console.log("[v0] Users table record count:", count)
      } else {
        console.log("[v0] ⚠️ Users table does not exist - run the create-users-table.sql script")
      }
    } catch (tableError) {
      console.log("[v0] ⚠️ Users table check failed:", tableError)
    }

    const [processlist] = (await executeQuery("SHOW PROCESSLIST")) as any[]
    console.log("[v0] ✅ Active connections:", processlist.length)

    console.log("[v0] ✅ Remote MySQL connection test completed successfully")
  } catch (error) {
    console.error("[v0] ❌ Remote MySQL connection test failed:")
    console.error("[v0] Error:", error)

    if (error instanceof Error) {
      if (error.message.includes("ENOTFOUND")) {
        console.error("[v0] → DNS resolution failed. Check if DB_HOST is correct and accessible from your network")
      } else if (error.message.includes("ECONNREFUSED")) {
        console.error("[v0] → Connection refused. Check if MySQL server is running and port is open")
      } else if (error.message.includes("Access denied")) {
        console.error("[v0] → Authentication failed. Check DB_USER and DB_PASSWORD credentials")
      } else if (error.message.includes("Unknown database")) {
        console.error("[v0] → Database not found. Check if DB_NAME database exists on the server")
      } else if (error.message.includes("timeout")) {
        console.error("[v0] → Connection timeout. Check network connectivity and firewall settings")
      }
    }
  } finally {
    await closePool()
  }
}

testRemoteMySQLConnection()
