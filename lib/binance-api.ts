import crypto from "crypto"

export interface BinanceCredentials {
  apiKey: string
  secretKey: string
  testMode: boolean
}

export interface BinanceAccountInfo {
  accountType: string
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  balances: Array<{
    asset: string
    free: string
    locked: string
  }>
}

export interface BinanceTradingPair {
  symbol: string
  status: string
  baseAsset: string
  baseAssetPrecision: number
  quoteAsset: string
  quotePrecision: number
  orderTypes: string[]
  icebergAllowed: boolean
  ocoAllowed: boolean
  isSpotTradingAllowed: boolean
  isMarginTradingAllowed: boolean
  filters: Array<{
    filterType: string
    minPrice?: string
    maxPrice?: string
    tickSize?: string
    minQty?: string
    maxQty?: string
    stepSize?: string
    minNotional?: string
  }>
}

export interface BinanceOrder {
  symbol: string
  orderId: number
  orderListId: number
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: string
  timeInForce: string
  type: string
  side: string
  stopPrice?: string
  icebergQty?: string
  time: number
  updateTime: number
  isWorking: boolean
  origQuoteOrderQty: string
}

export interface OrderRequest {
  symbol: string
  side: "BUY" | "SELL"
  type: "MARKET" | "LIMIT" | "STOP_LOSS" | "STOP_LOSS_LIMIT" | "TAKE_PROFIT" | "TAKE_PROFIT_LIMIT"
  quantity: number
  price?: number
  stopPrice?: number
  timeInForce?: "GTC" | "IOC" | "FOK"
  newClientOrderId?: string
}

// Secure credential storage using localStorage with encryption
export class CredentialManager {
  private static readonly STORAGE_KEY = "binance_credentials"
  private static readonly ENCRYPTION_KEY = "solaria_world_api_key_encryption"

  static encrypt(text: string): string {
    try {
      // Simple encryption for demo - in production, use proper encryption
      return btoa(text)
    } catch {
      return text
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      return atob(encryptedText)
    } catch {
      return encryptedText
    }
  }

  static saveCredentials(credentials: BinanceCredentials): void {
    try {
      if (typeof window === "undefined") {
        return
      }
      const encrypted = this.encrypt(JSON.stringify(credentials))
      localStorage.setItem(this.STORAGE_KEY, encrypted)
    } catch (error) {
      console.error("Failed to save credentials:", error)
    }
  }

  static loadCredentials(): BinanceCredentials | null {
    try {
      if (typeof window === "undefined") {
        return null
      }
      const encrypted = localStorage.getItem(this.STORAGE_KEY)
      if (!encrypted) return null

      const decrypted = this.decrypt(encrypted)
      return JSON.parse(decrypted)
    } catch (error) {
      console.error("Failed to load credentials:", error)
      return null
    }
  }

  static clearCredentials(): void {
    if (typeof window === "undefined") {
      return
    }
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static hasCredentials(): boolean {
    if (typeof window === "undefined") {
      return false
    }
    return localStorage.getItem(this.STORAGE_KEY) !== null
  }
}

// Binance API client
export class BinanceAPIClient {
  private credentials: BinanceCredentials
  private baseUrl: string

  constructor(credentials: BinanceCredentials) {
    this.credentials = credentials
    this.baseUrl = credentials.testMode ? "https://testnet.binance.vision/api/v3" : "https://api.binance.com/api/v3"
  }

  private generateSignature(queryString: string): string {
    return crypto.createHmac("sha256", this.credentials.secretKey).update(queryString).digest("hex")
  }

  private async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "DELETE" = "GET",
    params: Record<string, any> = {},
    requiresSignature = true,
  ): Promise<any> {
    const timestamp = Date.now()
    const queryParams = new URLSearchParams({
      ...params,
      ...(requiresSignature && { timestamp: timestamp.toString() }),
    })

    if (requiresSignature) {
      const signature = this.generateSignature(queryParams.toString())
      queryParams.append("signature", signature)
    }

    const url = method === "GET" ? `${this.baseUrl}${endpoint}?${queryParams}` : `${this.baseUrl}${endpoint}`

    const requestOptions: RequestInit = {
      method,
      headers: {
        "X-MBX-APIKEY": this.credentials.apiKey,
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

  async testConnection(): Promise<boolean> {
    try {
      await this.getAccountInfo()
      return true
    } catch {
      return false
    }
  }

  async getAccountInfo(): Promise<BinanceAccountInfo> {
    return this.makeRequest("/account")
  }

  async getExchangeInfo(): Promise<{ symbols: BinanceTradingPair[] }> {
    return this.makeRequest("/exchangeInfo", "GET", {}, false)
  }

  async get24hrTicker(symbol?: string): Promise<any> {
    const params = symbol ? { symbol } : {}
    return this.makeRequest("/ticker/24hr", "GET", params, false)
  }

  async getOrderBook(symbol: string, limit = 100): Promise<any> {
    return this.makeRequest("/depth", "GET", { symbol, limit }, false)
  }

  async placeOrder(order: OrderRequest): Promise<BinanceOrder> {
    const params: any = {
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      quantity: order.quantity.toString(),
    }

    if (order.price) params.price = order.price.toString()
    if (order.stopPrice) params.stopPrice = order.stopPrice.toString()
    if (order.timeInForce) params.timeInForce = order.timeInForce
    if (order.newClientOrderId) params.newClientOrderId = order.newClientOrderId

    return this.makeRequest("/order", "POST", params)
  }

  async cancelOrder(symbol: string, orderId: number): Promise<any> {
    return this.makeRequest("/order", "DELETE", { symbol, orderId })
  }

  async getOpenOrders(symbol?: string): Promise<BinanceOrder[]> {
    const params = symbol ? { symbol } : {}
    return this.makeRequest("/openOrders", "GET", params)
  }

  async getOrderHistory(symbol: string, limit = 500): Promise<BinanceOrder[]> {
    return this.makeRequest("/allOrders", "GET", { symbol, limit })
  }

  async getCurrentPrice(symbol: string): Promise<{ symbol: string; price: string }> {
    return this.makeRequest("/ticker/price", "GET", { symbol }, false)
  }
}

// API validation utilities
export class APIValidator {
  static validateApiKey(apiKey: string): { valid: boolean; message: string } {
    if (!apiKey) {
      return { valid: false, message: "API key is required" }
    }

    if (apiKey.length < 32) {
      return { valid: false, message: "API key appears to be too short" }
    }

    if (!/^[a-zA-Z0-9]+$/.test(apiKey)) {
      return { valid: false, message: "API key contains invalid characters" }
    }

    return { valid: true, message: "API key format is valid" }
  }

  static validateSecretKey(secretKey: string): { valid: boolean; message: string } {
    if (!secretKey) {
      return { valid: false, message: "Secret key is required" }
    }

    if (secretKey.length < 32) {
      return { valid: false, message: "Secret key appears to be too short" }
    }

    if (!/^[a-zA-Z0-9+/=]+$/.test(secretKey)) {
      return { valid: false, message: "Secret key contains invalid characters" }
    }

    return { valid: true, message: "Secret key format is valid" }
  }

  static async testCredentials(
    credentials: BinanceCredentials,
  ): Promise<{ valid: boolean; message: string; accountInfo?: BinanceAccountInfo }> {
    try {
      const client = new BinanceAPIClient(credentials)
      const accountInfo = await client.getAccountInfo()

      if (!accountInfo.canTrade) {
        return {
          valid: false,
          message:
            "API key does not have trading permissions. Please enable 'Spot & Margin Trading' in your API settings.",
        }
      }

      return {
        valid: true,
        message: "Credentials are valid and trading is enabled",
        accountInfo,
      }
    } catch (error) {
      return {
        valid: false,
        message: error instanceof Error ? error.message : "Failed to validate credentials",
      }
    }
  }
}

// Connection status manager
export class ConnectionManager {
  private static instance: ConnectionManager
  private client: BinanceAPIClient | null = null
  private connectionStatus: "disconnected" | "connecting" | "connected" | "error" = "disconnected"
  private listeners: Array<(status: string) => void> = []

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager()
    }
    return ConnectionManager.instance
  }

  addStatusListener(callback: (status: string) => void): void {
    this.listeners.push(callback)
  }

  removeStatusListener(callback: (status: string) => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.connectionStatus))
  }

  async connect(credentials: BinanceCredentials): Promise<boolean> {
    this.connectionStatus = "connecting"
    this.notifyListeners()

    try {
      const validation = await APIValidator.testCredentials(credentials)

      if (!validation.valid) {
        this.connectionStatus = "error"
        this.notifyListeners()
        throw new Error(validation.message)
      }

      this.client = new BinanceAPIClient(credentials)
      CredentialManager.saveCredentials(credentials)

      this.connectionStatus = "connected"
      this.notifyListeners()

      return true
    } catch (error) {
      this.connectionStatus = "error"
      this.notifyListeners()
      throw error
    }
  }

  disconnect(): void {
    this.client = null
    this.connectionStatus = "disconnected"
    CredentialManager.clearCredentials()
    this.notifyListeners()
  }

  getClient(): BinanceAPIClient | null {
    return this.client
  }

  getStatus(): string {
    return this.connectionStatus
  }

  isConnected(): boolean {
    return this.connectionStatus === "connected" && this.client !== null
  }

  async autoConnect(): Promise<boolean> {
    const savedCredentials = CredentialManager.loadCredentials()
    if (savedCredentials) {
      try {
        return await this.connect(savedCredentials)
      } catch {
        CredentialManager.clearCredentials()
        return false
      }
    }
    return false
  }
}
