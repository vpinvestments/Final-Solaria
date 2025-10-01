import { type NextRequest, NextResponse } from "next/server"
import { searchCryptocurrencies } from "@/lib/crypto-api"

// GET /api/crypto/search - Search cryptocurrencies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const results = await searchCryptocurrencies(query)

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("[v0] Crypto search error:", error)
    return NextResponse.json({ success: false, error: "Failed to search cryptocurrencies" }, { status: 500 })
  }
}
