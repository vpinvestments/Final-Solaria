import { NextResponse } from "next/server"
import { tradingAPI } from "@/lib/trading-api"

export const dynamic = "force-dynamic"

async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const exchangeId = searchParams.get("exchange")

    if (exchangeId) {
      // Get balances for specific exchange
      const exchange = tradingAPI.getExchange(exchangeId)
      if (!exchange) {
        return NextResponse.json({ error: "Exchange not found or not connected" }, { status: 404 })
      }

      const balances = await exchange.getBalances()
      return NextResponse.json({
        success: true,
        balances: [{ exchange: exchangeId, balances }],
      })
    } else {
      // Get balances from all connected exchanges
      const allBalances = await tradingAPI.getAllBalances()
      return NextResponse.json({ success: true, balances: allBalances })
    }
  } catch (error) {
    console.error("Get balances error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get balances" },
      { status: 500 },
    )
  }
}

export const GET = handler
