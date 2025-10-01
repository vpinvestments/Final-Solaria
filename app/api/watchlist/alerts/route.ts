import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db-local"

// GET /api/watchlist/alerts - Get user's alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"
    const coinId = searchParams.get("coinId")

    const db = getDb()

    let query = `
      SELECT * FROM price_alerts 
      WHERE user_id = ?
    `
    const params = [userId]

    if (coinId) {
      query += " AND coin_id = ?"
      params.push(coinId)
    }

    query += " ORDER BY created_date DESC"

    const alerts = db.prepare(query).all(...params)

    return NextResponse.json({
      success: true,
      data: alerts.map((alert: any) => ({
        id: alert.id,
        coinId: alert.coin_id,
        coinName: alert.coin_name,
        coinSymbol: alert.coin_symbol,
        type: alert.alert_type,
        targetValue: alert.target_value,
        isActive: Boolean(alert.is_active),
        isTriggered: Boolean(alert.is_triggered),
        triggeredDate: alert.triggered_date,
        createdDate: alert.created_date,
      })),
    })
  } catch (error) {
    console.error("[v0] Alerts GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch alerts" }, { status: 500 })
  }
}

// POST /api/watchlist/alerts - Create new alert
export async function POST(request: NextRequest) {
  try {
    const { userId = "1", coinId, coinName, coinSymbol, alertType, targetValue } = await request.json()

    if (!coinId || !alertType || !targetValue) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const validAlertTypes = ["price_above", "price_below", "volume_above", "market_cap_above"]
    if (!validAlertTypes.includes(alertType)) {
      return NextResponse.json({ success: false, error: "Invalid alert type" }, { status: 400 })
    }

    const db = getDb()

    const insertAlert = db.prepare(`
      INSERT INTO price_alerts (user_id, coin_id, coin_name, coin_symbol, alert_type, target_value)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = insertAlert.run(userId, coinId, coinName, coinSymbol, alertType, targetValue)

    return NextResponse.json({
      success: true,
      message: "Alert created",
      id: result.lastInsertRowid,
    })
  } catch (error) {
    console.error("[v0] Alert POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to create alert" }, { status: 500 })
  }
}

// DELETE /api/watchlist/alerts - Delete alert
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const alertId = searchParams.get("alertId")
    const userId = searchParams.get("userId") || "1"

    if (!alertId) {
      return NextResponse.json({ success: false, error: "Missing alertId" }, { status: 400 })
    }

    const db = getDb()

    const result = db.prepare("DELETE FROM price_alerts WHERE id = ? AND user_id = ?").run(alertId, userId)

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: "Alert not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Alert deleted",
    })
  } catch (error) {
    console.error("[v0] Alert DELETE error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete alert" }, { status: 500 })
  }
}
