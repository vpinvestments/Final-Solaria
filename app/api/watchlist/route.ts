import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db-switch"
import { getTopCryptocurrencies } from "@/lib/crypto-api"

// GET /api/watchlist - Get user's watchlist
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1" // Default to demo user

    // Get watchlist items with real-time price data
    const watchlistItems: any = await executeQuery(
      `
      SELECT w.*, p.alert_type, p.target_value, p.is_active as alert_active
      FROM watchlist_items w
      LEFT JOIN price_alerts p ON w.coin_id = p.coin_id AND w.user_id = p.user_id AND p.is_active = 1
      WHERE w.user_id = ?
      ORDER BY w.is_favorite DESC, w.added_date DESC
    `,
      [userId],
    )

    // Get unique coin IDs to fetch current market data
    const coinIds = [...new Set(watchlistItems.map((item: any) => item.coin_id))]

    let marketData: any[] = []
    if (coinIds.length > 0) {
      try {
        // Fetch current market data for all coins
        const allCoins = await getTopCryptocurrencies(250)
        marketData = allCoins.filter((coin) => coinIds.includes(coin.id))
      } catch (error) {
        console.error("[v0] Error fetching market data:", error)
      }
    }

    // Combine watchlist data with current market data
    const enrichedWatchlist = watchlistItems.map((item: any) => {
      const marketInfo = marketData.find((coin) => coin.id === item.coin_id)

      return {
        id: item.id,
        coinId: item.coin_id,
        name: item.coin_name,
        symbol: item.coin_symbol,
        notes: item.notes,
        isFavorite: Boolean(item.is_favorite),
        addedDate: item.added_date,
        // Current market data
        price: marketInfo?.price || 0,
        change24h: marketInfo?.change24h || 0,
        change7d: marketInfo?.change7d || 0,
        volume24h: marketInfo?.volume24h || 0,
        marketCap: marketInfo?.marketCap || 0,
        image: marketInfo?.image || "/placeholder.svg",
        // Alert data
        alerts: watchlistItems
          .filter((alert: any) => alert.coin_id === item.coin_id && alert.alert_type)
          .map((alert: any) => ({
            type: alert.alert_type,
            value: alert.target_value,
            active: Boolean(alert.alert_active),
          })),
      }
    })

    // Remove duplicates (since we joined with alerts)
    const uniqueWatchlist = enrichedWatchlist.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    )

    return NextResponse.json({
      success: true,
      data: uniqueWatchlist,
      count: uniqueWatchlist.length,
    })
  } catch (error) {
    console.error("[v0] Watchlist GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch watchlist" }, { status: 500 })
  }
}

// POST /api/watchlist - Add item to watchlist
export async function POST(request: NextRequest) {
  try {
    const { userId = "1", coinId, coinName, coinSymbol, notes = "", alerts = [] } = await request.json()

    if (!coinId || !coinName || !coinSymbol) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if item already exists
    const existing: any = await executeQuery("SELECT id FROM watchlist_items WHERE user_id = ? AND coin_id = ?", [
      userId,
      coinId,
    ])

    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Item already in watchlist" }, { status: 409 })
    }

    // Add to watchlist
    const result: any = await executeQuery(
      `
      INSERT INTO watchlist_items (user_id, coin_id, coin_name, coin_symbol, notes)
      VALUES (?, ?, ?, ?, ?)
    `,
      [userId, coinId, coinName, coinSymbol, notes],
    )

    // Add alerts if provided
    if (alerts.length > 0) {
      for (const alert of alerts) {
        if (alert.type && alert.value) {
          await executeQuery(
            `
            INSERT INTO price_alerts (user_id, coin_id, coin_name, coin_symbol, alert_type, target_value)
            VALUES (?, ?, ?, ?, ?, ?)
          `,
            [userId, coinId, coinName, coinSymbol, alert.type, alert.value],
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Added to watchlist",
      id: result.insertId,
    })
  } catch (error) {
    console.error("[v0] Watchlist POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to add to watchlist" }, { status: 500 })
  }
}

// DELETE /api/watchlist - Remove item from watchlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"
    const coinId = searchParams.get("coinId")

    if (!coinId) {
      return NextResponse.json({ success: false, error: "Missing coinId" }, { status: 400 })
    }

    // Remove from watchlist
    const result: any = await executeQuery("DELETE FROM watchlist_items WHERE user_id = ? AND coin_id = ?", [
      userId,
      coinId,
    ])

    // Remove associated alerts
    await executeQuery("DELETE FROM price_alerts WHERE user_id = ? AND coin_id = ?", [userId, coinId])

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Item not found in watchlist" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Removed from watchlist",
    })
  } catch (error) {
    console.error("[v0] Watchlist DELETE error:", error)
    return NextResponse.json({ success: false, error: "Failed to remove from watchlist" }, { status: 500 })
  }
}
