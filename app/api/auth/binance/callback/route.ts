import { type NextRequest, NextResponse } from "next/server"
import { BinanceOAuthManager, BinanceOAuthUtils } from "@/lib/binance-oauth"

export const dynamic = "force-dynamic"

const oauthConfig = {
  clientId: process.env.BINANCE_OAUTH_CLIENT_ID || "",
  clientSecret: process.env.BINANCE_OAUTH_CLIENT_SECRET || "",
  redirectUri: process.env.BINANCE_OAUTH_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/binance/callback`,
  scope: ["user:email", "user:address", "create:apikey"],
  environment: (process.env.BINANCE_ENVIRONMENT as "production" | "testnet") || "testnet",
}

function getBaseUrl(request: NextRequest): string {
  // Try environment variable first
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // Fallback to constructing from request headers
  const host = request.headers.get("host")
  const protocol = request.headers.get("x-forwarded-proto") || "https"

  if (host) {
    return `${protocol}://${host}`
  }

  // Final fallback for development
  return "http://localhost:3000"
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    const error = url.searchParams.get("error")

    const baseUrl = getBaseUrl(request)

    // Handle OAuth errors
    if (error) {
      const errorDescription = url.searchParams.get("error_description")
      return NextResponse.redirect(
        `${baseUrl}/trading?oauth_error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || "")}`,
      )
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        `${baseUrl}/trading?oauth_error=invalid_request&error_description=${encodeURIComponent("Missing code or state parameter")}`,
      )
    }

    // Validate state parameter (CSRF protection)
    const storedState = request.cookies.get("oauth_state")?.value
    if (!storedState || !BinanceOAuthUtils.validateState(state, storedState)) {
      return NextResponse.redirect(
        `${baseUrl}/trading?oauth_error=invalid_state&error_description=${encodeURIComponent("State parameter validation failed")}`,
      )
    }

    // Exchange code for tokens
    const oauthManager = new BinanceOAuthManager(oauthConfig)
    const tokens = await oauthManager.exchangeCodeForTokens(code, state)

    // Get user information
    const userInfo = await oauthManager.getUserInfo(tokens.accessToken)

    // Store tokens securely (in production, use secure server-side storage)
    // For now, we'll redirect with success and let the client handle token storage
    const response = NextResponse.redirect(
      `${baseUrl}/trading?oauth_success=true&user_id=${encodeURIComponent(userInfo.id)}&nickname=${encodeURIComponent(userInfo.nickname)}`,
    )

    // Clear state cookie
    response.cookies.delete("oauth_state")

    // Set tokens in secure cookies (optional - depends on your security requirements)
    response.cookies.set("binance_oauth_tokens", JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokens.expiresIn,
    })

    return response
  } catch (error) {
    console.error("OAuth callback error:", error)
    const baseUrl = getBaseUrl(request)
    return NextResponse.redirect(
      `${baseUrl}/trading?oauth_error=callback_failed&error_description=${encodeURIComponent(error instanceof Error ? error.message : "OAuth callback processing failed")}`,
    )
  }
}
