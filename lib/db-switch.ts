import * as mysqlDb from "./db"
import * as sqliteDb from "./db-local"

const hasMySQL = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME

if (hasMySQL) {
  console.log("[v0] Database switcher: MySQL mode enabled")
} else {
  console.log("[v0] Database switcher: SQLite mode enabled")
}

export function executeQuery(query: string, params: any[] = []): any {
  if (hasMySQL) {
    return mysqlDb.executeQuery(query, params)
  } else {
    return sqliteDb.executeQuery(query, params)
  }
}

export function testConnection() {
  if (hasMySQL) {
    return mysqlDb.testConnection()
  } else {
    return sqliteDb.testConnection()
  }
}

export function closePool() {
  if (hasMySQL) {
    return mysqlDb.closePool()
  } else {
    return sqliteDb.closePool()
  }
}

export const pool = hasMySQL ? mysqlDb.pool : undefined
export const db = hasMySQL ? undefined : sqliteDb.db
export const getDb = hasMySQL ? undefined : sqliteDb.getDb
