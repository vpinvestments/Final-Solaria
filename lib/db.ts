import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
          ca: undefined,
          cert: undefined,
          key: undefined,
        }
      : false,
  charset: "utf8mb4",
  timezone: "+00:00",
  flags: ["CONNECT_WITH_DB", "PROTOCOL_41", "TRANSACTIONS", "SECURE_CONNECTION"],
})

export { pool }

export async function executeQuery(query: string, params: any[] = []) {
  let connection
  try {
    connection = await pool.getConnection()
    const [results] = await connection.execute(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  } finally {
    if (connection) connection.release()
  }
}

export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    return { success: true, message: "Database connection successful" }
  } catch (error) {
    console.error("Database connection failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown connection error",
      error: error,
    }
  }
}

export async function closePool() {
  try {
    await pool.end()
    console.log("Database pool closed successfully")
  } catch (error) {
    console.error("Error closing database pool:", error)
  }
}
