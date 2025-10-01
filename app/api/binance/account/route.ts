import { NextResponse } from "next/server"
import crypto from "crypto"

interface BinanceCredentials {
  apiKey: string
  secretKey: string
  testMode: boolean
}

// Binance API signature generation
function generateSignature(queryString: string, secretKey: string): string {
  return crypto.createHmac("sha256", secretKey).update(queryString).digest("hex")
}

// Binance API request helper
async function binanceRequest(endpoint: string, credentials: BinanceCredentials, params: Record<string, any> = {}) {
  const baseUrl = credentials.testMode ? "https://testnet.binance.vision/api/v3" : "https://api.binance.com/api/v3"

  const timestamp = Date.now()
  const queryParams = new URLSearchParams({
    ...params,
    timestamp: timestamp.toString(),
  })

  const signature = generateSignature(queryParams.toString(), credentials.secretKey)
  queryParams.append("signature", signature)

  const response = await fetch(`${baseUrl}${endpoint}?${queryParams}`, {
    headers: {
      "X-MBX-APIKEY": credentials.apiKey,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Binance API Error: ${error}`)
  }

  return response.json()
}

async function handler(request: Request) {
  try {
    const credentials: BinanceCredentials = await request.json()

    // Validate credentials
    if (!credentials.apiKey || !credentials.secretKey) {
      return NextResponse.json({ error: "API key and secret key are required" }, { status: 400 })
    }

    // Test connection by fetching account information
    const accountInfo = await binanceRequest("/account", credentials)

    return NextResponse.json({
      success: true,
      account: {
        accountType: accountInfo.accountType,
        canTrade: accountInfo.canTrade,
        canWithdraw: accountInfo.canWithdraw,
        canDeposit: accountInfo.canDeposit,
        balances: accountInfo.balances?.filter(
          (b: any) => Number.parseFloat(b.free) > 0 || Number.parseFloat(b.locked) > 0,
        ),
      },
    })
  } catch (error) {
    console.error("Binance API connection error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to connect to Binance API",
        details: "Please check your API credentials and permissions",
      },
      { status: 500 },
    )
  }
}

export const POST = handler
