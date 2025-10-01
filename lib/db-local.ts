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

  initializeTables()
} catch (error) {
  console.error("[v0] Failed to connect to local database:", error)
  throw error
}

function initializeTables() {
  try {
    // Create watchlist_items table
    db.exec(`
      CREATE TABLE IF NOT EXISTS watchlist_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        coin_id TEXT NOT NULL,
        coin_name TEXT NOT NULL,
        coin_symbol TEXT NOT NULL,
        notes TEXT,
        is_favorite BOOLEAN DEFAULT FALSE,
        added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, coin_id)
      )
    `)

    // Create price_alerts table
    db.exec(`
      CREATE TABLE IF NOT EXISTS price_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        coin_id TEXT NOT NULL,
        coin_name TEXT NOT NULL,
        coin_symbol TEXT NOT NULL,
        alert_type TEXT NOT NULL CHECK (alert_type IN ('price_above', 'price_below', 'volume_above', 'market_cap_above')),
        target_value REAL NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        is_triggered BOOLEAN DEFAULT FALSE,
        triggered_date DATETIME NULL,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist_items(user_id);
      CREATE INDEX IF NOT EXISTS idx_watchlist_coin_id ON watchlist_items(coin_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON price_alerts(user_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_coin_id ON price_alerts(coin_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_active ON price_alerts(is_active);
    `)

    // Check if we have any data, if not add demo data
    const count = db.prepare("SELECT COUNT(*) as count FROM watchlist_items").get() as { count: number }

    if (count.count === 0) {
      console.log("[v0] Initializing demo watchlist data...")

      // Insert demo watchlist items
      const insertWatchlist = db.prepare(`
        INSERT INTO watchlist_items (user_id, coin_id, coin_name, coin_symbol, notes, is_favorite) 
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      insertWatchlist.run(1, "cardano", "Cardano", "ADA", "Potential breakout candidate", 0)
      insertWatchlist.run(1, "polygon", "Polygon", "MATIC", "Layer 2 scaling solution", 1)
      insertWatchlist.run(1, "chainlink", "Chainlink", "LINK", "Oracle network leader", 0)
      insertWatchlist.run(1, "avalanche", "Avalanche", "AVAX", "High-performance blockchain", 0)

      // Insert demo alerts
      const insertAlert = db.prepare(`
        INSERT INTO price_alerts (user_id, coin_id, coin_name, coin_symbol, alert_type, target_value) 
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      insertAlert.run(1, "cardano", "Cardano", "ADA", "price_above", 0.5)
      insertAlert.run(1, "cardano", "Cardano", "ADA", "volume_above", 300000000)
      insertAlert.run(1, "polygon", "Polygon", "MATIC", "price_below", 0.8)
      insertAlert.run(1, "chainlink", "Chainlink", "LINK", "price_above", 15.0)
      insertAlert.run(1, "avalanche", "Avalanche", "AVAX", "price_below", 35.0)

      console.log("[v0] Demo data initialized successfully")
    }

    console.log("[v0] Database tables initialized successfully")
  } catch (error) {
    console.error("[v0] Failed to initialize tables:", error)
  }
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
