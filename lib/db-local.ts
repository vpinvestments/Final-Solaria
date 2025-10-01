import Database from "better-sqlite3"
import { join } from "path"
import fs from "fs"

// Create or connect to local SQLite database
const dbPath = join(process.cwd(), "data", "solaria.db")
let db: Database.Database

try {
  // Ensure data directory exists
  const dataDir = join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  db = new Database(dbPath)
  db.pragma("journal_mode = WAL")
  console.log("[v0] Connected to local SQLite database:", dbPath)
} catch (error) {
  console.error("[v0] Failed to connect to local database:", error)
  throw error
}

export function getDb() {
  return db
}

export function executeQuery(query: string, params: any[] = []): any {
  try {
    if (query.trim().toUpperCase().startsWith("SELECT")) {
      const stmt = db.prepare(query)
      return stmt.all(...params)
    } else {
      const stmt = db.prepare(query)
      const result = stmt.run(...params)
      return { insertId: result.lastInsertRowid, affectedRows: result.changes }
    }
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

export function testConnection() {
  try {
    db.prepare("SELECT 1 as test").get()
    return { success: true, message: "Local SQLite database connection successful" }
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown connection error",
      error: error,
    }
  }
}

export function closePool() {
  try {
    if (db) {
      db.close()
      console.log("[v0] Database connection closed successfully")
    }
  } catch (error) {
    console.error("[v0] Error closing database connection:", error)
  }
}

export { db }
