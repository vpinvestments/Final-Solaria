import { testConnection, executeQuery } from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("[v0] Testing remote MySQL database connection...")

    console.log("[v0] Environment variables check:", {
      DB_HOST: process.env.DB_HOST ? "✓ Set" : "✗ Missing",
      DB_PORT: process.env.DB_PORT ? "✓ Set" : "✗ Missing",
      DB_USER: process.env.DB_USER ? "✓ Set" : "✗ Missing",
      DB_PASSWORD: process.env.DB_PASSWORD ? "✓ Set" : "✗ Missing",
      DB_NAME: process.env.DB_NAME ? "✓ Set" : "✗ Missing",
      DB_SSL: process.env.DB_SSL || "not set",
    })

    const requiredEnvVars = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"]
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required environment variables: ${missingVars.join(", ")}`,
          error: "Configuration Error",
          details: {
            database: "Remote MySQL",
            missingVariables: missingVars,
            availableVariables: requiredEnvVars.filter((varName) => process.env[varName]),
          },
        },
        { status: 500 },
      )
    }

    const connectionTest = await testConnection()

    if (!connectionTest.success) {
      console.log("[v0] Connection test failed:", connectionTest)
      return NextResponse.json(
        {
          success: false,
          message: connectionTest.message,
          error: connectionTest.error,
          details: {
            database: "Remote MySQL",
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            ssl: process.env.DB_SSL,
          },
        },
        { status: 500 },
      )
    }

    console.log("[v0] Connection successful, running test queries...")

    let versionResult: any[] = []
    let tables: any[] = []
    let userCount = [{ count: 0 }]

    try {
      versionResult = (await executeQuery(
        "SELECT VERSION() as version, NOW() as current_time, USER() as current_user",
      )) as any[]
      console.log("[v0] Version query successful:", versionResult[0])
    } catch (error) {
      console.log("[v0] Version query failed:", error)
      throw new Error(`Version query failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    try {
      tables = (await executeQuery("SHOW TABLES LIKE 'users'")) as any[]
      console.log("[v0] Tables query result:", tables)
    } catch (error) {
      console.log("[v0] Tables query failed:", error)
      // Don't throw here, just log
    }

    try {
      if (Array.isArray(tables) && tables.length > 0) {
        userCount = (await executeQuery("SELECT COUNT(*) as count FROM users")) as any[]
        console.log("[v0] User count query successful:", userCount[0])
      }
    } catch (error) {
      console.log("[v0] Users table doesn't exist yet or query failed:", error)
      // Don't throw here, just log
    }

    return NextResponse.json({
      success: true,
      message: "Remote MySQL database connection successful",
      details: {
        database: "Remote MySQL",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        databaseName: process.env.DB_NAME,
        user: process.env.DB_USER,
        ssl: process.env.DB_SSL,
        serverInfo: versionResult[0] || null,
        usersTableExists: Array.isArray(tables) && tables.length > 0,
        userCount: userCount[0]?.count || 0,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Remote MySQL connection failed:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        success: false,
        message: "Remote MySQL database connection failed",
        error: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
        details: {
          database: "Remote MySQL",
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          ssl: process.env.DB_SSL,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    )
  }
}
