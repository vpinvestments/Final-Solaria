import { type NextRequest, NextResponse } from "next/server"
import { BinanceOAuthManager, BinanceOAuthUtils } from "@/lib/binance-oauth"

// OAuth configuration - these would come from environment variables
const oauthConfig = {
  clientId: process.env.BINANCE_OAUTH_CLIENT_ID || "",
  clientSecret: process.env.BINANCE_OAUTH_CLIENT_SECRET || "",
  redirectUri: process.env.BINANCE_OAUTH_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/binance/callback`,
  scope: ["user:email", "user:read", "trade:read", "trade:write"],
  environment: (process.env.BINANCE_ENVIRONMENT as "production" | "testnet") || "testnet",
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    if (action === "authorize") {
      // Check OAuth eligibility first
      const eligibility = BinanceOAuthUtils.checkOAuthEligibility()
      if (!eligibility.eligible) {
        return NextResponse.json(
          {
            error: "OAuth not available",
            message: eligibility.message,
            requestAccess: "https://developers.binance.com/en/landingpage/oauth",
          },
          { status: 403 },
        )
      }

      // Generate authorization URL
      const oauthManager = new BinanceOAuthManager(oauthConfig)
      const state = BinanceOAuthUtils.generateState()
      const authUrl = oauthManager.generateAuthUrl(state)

      // Store state in session/cookie for validation
      const response = NextResponse.json({
        authUrl,
        state,
        message: "Redirect user to this URL to begin OAuth flow",
      })

      // Set state cookie for validation
      response.cookies.set("oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600, // 10 minutes
      })

      return response
    }

    if (action === "status") {
      // Check if user has valid OAuth tokens
      return NextResponse.json({
        available: false,
        message: "Binance OAuth is currently available only to close ecosystem partners",
        hasTokens: false,
        requestAccess: "https://developers.binance.com/en/landingpage/oauth",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Binance OAuth error:", error)
    return NextResponse.json(
      { error: "OAuth request failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === "revoke") {
      // Revoke OAuth tokens
      const oauthManager = new BinanceOAuthManager(oauthConfig)
      const tokens = oauthManager.loadTokens()

      if (tokens) {
        await oauthManager.revokeToken(tokens.accessToken)
        oauthManager.clearTokens()
      }

      return NextResponse.json({ success: true, message: "OAuth tokens revoked" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Binance OAuth POST error:", error)
    return NextResponse.json(
      { error: "OAuth operation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
