// Binance OAuth implementation for Solaria World
// Note: Binance OAuth is currently available only to close ecosystem partners

export interface BinanceOAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
  environment: "production" | "testnet"
}

export interface BinanceOAuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  scope: string
  expiresAt: number
}

export interface BinanceUserInfo {
  id: string
  email: string
  emailVerified: boolean
  nickname: string
  avatar: string
  country: string
  kycLevel: number
  accountType: string
}

export class BinanceOAuthManager {
  private config: BinanceOAuthConfig
  private baseUrl: string

  constructor(config: BinanceOAuthConfig) {
    this.config = config
    this.baseUrl = "https://accounts.binance.com"
  }

  // Generate OAuth authorization URL
  generateAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      // Updated scope to use comma-separated values as per official docs
      scope: this.config.scope.join(","),
      ...(state && { state }),
    })

    // Updated authorization endpoint to match official documentation
    return `${this.baseUrl}/en/oauth/authorize?${params.toString()}`
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string, state?: string): Promise<BinanceOAuthTokens> {
    // Updated token endpoint to match official documentation
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri,
        ...(state && { state }),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OAuth token exchange failed: ${error}`)
    }

    const tokens = await response.json()

    return {
      ...tokens,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<BinanceOAuthTokens> {
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token refresh failed: ${error}`)
    }

    const tokens = await response.json()

    return {
      ...tokens,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    }
  }

  // Get user information using access token
  async getUserInfo(accessToken: string): Promise<BinanceUserInfo> {
    // Updated userinfo endpoint to match official documentation
    const response = await fetch(`${this.baseUrl}/oauth/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get user info: ${error}`)
    }

    return response.json()
  }

  // Revoke access token
  async revokeToken(token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/oauth/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        token,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token revocation failed: ${error}`)
    }
  }

  // Check if token is expired
  isTokenExpired(tokens: BinanceOAuthTokens): boolean {
    return Date.now() >= tokens.expiresAt
  }

  // Get valid access token (refresh if needed)
  async getValidAccessToken(tokens: BinanceOAuthTokens): Promise<string> {
    if (this.isTokenExpired(tokens)) {
      const newTokens = await this.refreshAccessToken(tokens.refreshToken)
      // Save new tokens (implementation depends on storage strategy)
      this.saveTokens(newTokens)
      return newTokens.accessToken
    }
    return tokens.accessToken
  }

  // Token storage management
  private saveTokens(tokens: BinanceOAuthTokens): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("binance_oauth_tokens", JSON.stringify(tokens))
    }
  }

  loadTokens(): BinanceOAuthTokens | null {
    if (typeof window === "undefined") return null

    const stored = localStorage.getItem("binance_oauth_tokens")
    return stored ? JSON.parse(stored) : null
  }

  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("binance_oauth_tokens")
    }
  }
}

// OAuth-enabled Binance API client
export class BinanceOAuthAPIClient {
  private oauthManager: BinanceOAuthManager
  private baseApiUrl: string

  constructor(oauthManager: BinanceOAuthManager) {
    this.oauthManager = oauthManager
    this.baseApiUrl =
      oauthManager["config"].environment === "production"
        ? "https://api.binance.com/api/v3"
        : "https://testnet.binance.vision/api/v3"
  }

  private async makeAuthenticatedRequest(
    endpoint: string,
    method: "GET" | "POST" | "DELETE" = "GET",
    params: Record<string, any> = {},
  ): Promise<any> {
    const tokens = this.oauthManager.loadTokens()
    if (!tokens) {
      throw new Error("No OAuth tokens available. Please authenticate first.")
    }

    const accessToken = await this.oauthManager.getValidAccessToken(tokens)

    const queryParams = new URLSearchParams(params)
    const url = method === "GET" ? `${this.baseApiUrl}${endpoint}?${queryParams}` : `${this.baseApiUrl}${endpoint}`

    const requestOptions: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }

    if (method !== "GET") {
      requestOptions.body = queryParams
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Binance API Error: ${error}`)
    }

    return response.json()
  }

  async getAccountInfo(): Promise<any> {
    return this.makeAuthenticatedRequest("/account")
  }

  async getBalances(): Promise<any> {
    const accountInfo = await this.getAccountInfo()
    return accountInfo.balances?.filter((b: any) => Number.parseFloat(b.free) > 0 || Number.parseFloat(b.locked) > 0)
  }

  async placeOrder(orderData: any): Promise<any> {
    return this.makeAuthenticatedRequest("/order", "POST", orderData)
  }

  async getOpenOrders(symbol?: string): Promise<any> {
    const params = symbol ? { symbol } : {}
    return this.makeAuthenticatedRequest("/openOrders", "GET", params)
  }

  async cancelOrder(symbol: string, orderId: number): Promise<any> {
    return this.makeAuthenticatedRequest("/order", "DELETE", { symbol, orderId })
  }
}

// Utility functions for OAuth flow
export const BinanceOAuthUtils = {
  // Generate secure random state for CSRF protection
  generateState(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  },

  // Validate state parameter
  validateState(receivedState: string, expectedState: string): boolean {
    return receivedState === expectedState
  },

  // Parse OAuth callback URL
  parseCallbackUrl(url: string): { code?: string; state?: string; error?: string } {
    const urlObj = new URL(url)
    const params = urlObj.searchParams

    return {
      code: params.get("code") || undefined,
      state: params.get("state") || undefined,
      error: params.get("error") || undefined,
    }
  },

  // Check if user is eligible for Binance OAuth
  checkOAuthEligibility(): { eligible: boolean; message: string } {
    // Binance OAuth is currently only available to close ecosystem partners
    return {
      eligible: false,
      message:
        "Binance OAuth is currently available only to close ecosystem partners. Please contact Binance business team for access.",
    }
  },
}
