const hasMySQL = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME

let executeQuery, testConnection, closePool, pool, db, getDb

if (hasMySQL) {
  console.log("[v0] Using MySQL database")
  const mysql = require("./db")

  executeQuery = mysql.executeQuery
  testConnection = mysql.testConnection
  closePool = mysql.closePool
  pool = mysql.pool
} else {
  console.log("[v0] Using local SQLite database")
  const sqlite = require("./db-local")

  executeQuery = sqlite.executeQuery
  testConnection = sqlite.testConnection
  closePool = sqlite.closePool
  getDb = sqlite.getDb
  db = sqlite.db
}

export { executeQuery, testConnection, closePool, pool, db, getDb }
