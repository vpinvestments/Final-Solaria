// Trading API integration for multiple exchanges
export interface TradingPair {
  symbol: string
  baseAsset: string
  quoteAsset: string
  price: number
  volume24h: number
  change24h: number
}

export interface OrderRequest {
  symbol: string
  side: "buy" | "sell"
  type: "market" | "limit" | "stop"
  quantity: number
  price?: number
  stopPrice?: number
  timeInForce?: "GTC" | "IOC" | "FOK"
}

export interface Order {
  id: string
  symbol: string
  side: "buy" | "sell"
  type: "market" | "limit" | "stop"
  quantity: number
  price?: number
  stopPrice?: number
  status: "pending" | "filled" | "cancelled" | "rejected"
  filledQuantity: number
  remainingQuantity: number
  averagePrice?: number
  timestamp: string
  exchange: string
}

export interface Balance {
  asset: string
  free: number
  locked: number
  total: number
}

export interface ExchangeAPI {
  name: string
  connected: boolean
  testMode: boolean
  getBalances(): Promise<Balance[]>
  getTradingPairs(): Promise<TradingPair[]>
  placeOrder(order: OrderRequest): Promise<Order>
  cancelOrder(orderId: string, symbol: string): Promise<boolean>
  getOpenOrders(symbol?: string): Promise<Order[]>
  getOrderHistory(symbol?: string, limit?: number): Promise<Order[]>
}

// Binance API Implementation
export class BinanceAPI implements ExchangeAPI {
  name = "Binance"
  connected = false
  testMode = true

  private apiKey: string
  private secretKey: string
  private baseUrl: string

  constructor(apiKey: string, secretKey: string, testMode = true) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.testMode = testMode
    this.baseUrl = testMode ? "https://testnet.binance.vision/api/v3" : "https://api.binance.com/api/v3"
  }

  async getBalances(): Promise<Balance[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      { asset: "BTC", free: 0.5, locked: 0.1, total: 0.6 },
      { asset: "ETH", free: 2.3, locked: 0.2, total: 2.5 },
      { asset: "USDT", free: 9500, locked: 500, total: 10000 },
      { asset: "SOL", free: 25, locked: 0, total: 25 },
    ]
  }

  async getTradingPairs(): Promise<TradingPair[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    return [
      {
        symbol: "BTCUSDT",
        baseAsset: "BTC",
        quoteAsset: "USDT",
        price: 67234.56,
        volume24h: 1234567,
        change24h: 2.34,
      },
      {
        symbol: "ETHUSDT",
        baseAsset: "ETH",
        quoteAsset: "USDT",
        price: 3456.78,
        volume24h: 987654,
        change24h: -1.23,
      },
      {
        symbol: "SOLUSDT",
        baseAsset: "SOL",
        quoteAsset: "USDT",
        price: 180.45,
        volume24h: 456789,
        change24h: 5.67,
      },
    ]
  }

  async placeOrder(order: OrderRequest): Promise<Order> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const orderId = `binance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Simulate order processing
    const isMarketOrder = order.type === "market"
    const status = isMarketOrder ? "filled" : "pending"
    const filledQuantity = isMarketOrder ? order.quantity : 0

    return {
      id: orderId,
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      quantity: order.quantity,
      price: order.price,
      stopPrice: order.stopPrice,
      status,
      filledQuantity,
      remainingQuantity: order.quantity - filledQuantity,
      averagePrice: isMarketOrder ? order.price : undefined,
      timestamp: new Date().toISOString(),
      exchange: "Binance",
    }
  }

  async cancelOrder(orderId: string, symbol: string): Promise<boolean> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400))
    return true
  }

  async getOpenOrders(symbol?: string): Promise<Order[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    return [
      {
        id: "binance_open_1",
        symbol: "BTCUSDT",
        side: "buy",
        type: "limit",
        quantity: 0.1,
        price: 65000,
        status: "pending",
        filledQuantity: 0,
        remainingQuantity: 0.1,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        exchange: "Binance",
      },
    ]
  }

  async getOrderHistory(symbol?: string, limit = 50): Promise<Order[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400))

    return [
      {
        id: "binance_hist_1",
        symbol: "BTCUSDT",
        side: "buy",
        type: "market",
        quantity: 0.05,
        price: 67000,
        status: "filled",
        filledQuantity: 0.05,
        remainingQuantity: 0,
        averagePrice: 67000,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        exchange: "Binance",
      },
    ]
  }
}

// Coinbase API Implementation
export class CoinbaseAPI implements ExchangeAPI {
  name = "Coinbase Pro"
  connected = false
  testMode = true

  private apiKey: string
  private secretKey: string
  private passphrase: string
  private baseUrl: string

  constructor(apiKey: string, secretKey: string, passphrase: string, testMode = true) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.passphrase = passphrase
    this.testMode = testMode
    this.baseUrl = testMode ? "https://api-public.sandbox.pro.coinbase.com" : "https://api.pro.coinbase.com"
  }

  async getBalances(): Promise<Balance[]> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    return [
      { asset: "BTC", free: 0.3, locked: 0.05, total: 0.35 },
      { asset: "ETH", free: 1.8, locked: 0.1, total: 1.9 },
      { asset: "USD", free: 5000, locked: 200, total: 5200 },
    ]
  }

  async getTradingPairs(): Promise<TradingPair[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    return [
      {
        symbol: "BTC-USD",
        baseAsset: "BTC",
        quoteAsset: "USD",
        price: 67150.0,
        volume24h: 987654,
        change24h: 2.1,
      },
      {
        symbol: "ETH-USD",
        baseAsset: "ETH",
        quoteAsset: "USD",
        price: 3445.5,
        volume24h: 654321,
        change24h: -0.8,
      },
    ]
  }

  async placeOrder(order: OrderRequest): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 900))

    const orderId = `coinbase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const isMarketOrder = order.type === "market"

    return {
      id: orderId,
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      quantity: order.quantity,
      price: order.price,
      status: isMarketOrder ? "filled" : "pending",
      filledQuantity: isMarketOrder ? order.quantity : 0,
      remainingQuantity: isMarketOrder ? 0 : order.quantity,
      averagePrice: isMarketOrder ? order.price : undefined,
      timestamp: new Date().toISOString(),
      exchange: "Coinbase Pro",
    }
  }

  async cancelOrder(orderId: string, symbol: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  }

  async getOpenOrders(symbol?: string): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 350))
    return []
  }

  async getOrderHistory(symbol?: string, limit = 50): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 450))
    return []
  }
}

// Trading API Manager
export class TradingAPIManager {
  private exchanges: Map<string, ExchangeAPI> = new Map()
  private activeExchange: string | null = null

  addExchange(id: string, api: ExchangeAPI) {
    this.exchanges.set(id, api)
    api.connected = true
  }

  removeExchange(id: string) {
    this.exchanges.delete(id)
    if (this.activeExchange === id) {
      this.activeExchange = null
    }
  }

  setActiveExchange(id: string) {
    if (this.exchanges.has(id)) {
      this.activeExchange = id
    }
  }

  getActiveExchange(): ExchangeAPI | null {
    if (!this.activeExchange) return null
    return this.exchanges.get(this.activeExchange) || null
  }

  getExchange(id: string): ExchangeAPI | null {
    return this.exchanges.get(id) || null
  }

  getConnectedExchanges(): { id: string; api: ExchangeAPI }[] {
    return Array.from(this.exchanges.entries()).map(([id, api]) => ({ id, api }))
  }

  async getAllBalances(): Promise<{ exchange: string; balances: Balance[] }[]> {
    const results = []

    for (const [id, api] of this.exchanges) {
      try {
        const balances = await api.getBalances()
        results.push({ exchange: id, balances })
      } catch (error) {
        console.error(`Failed to get balances from ${id}:`, error)
      }
    }

    return results
  }

  async placeOrder(order: OrderRequest, exchangeId?: string): Promise<Order> {
    const exchange = exchangeId ? this.getExchange(exchangeId) : this.getActiveExchange()

    if (!exchange) {
      throw new Error("No exchange available for trading")
    }

    return exchange.placeOrder(order)
  }
}

// Global trading API manager instance
export const tradingAPI = new TradingAPIManager()
