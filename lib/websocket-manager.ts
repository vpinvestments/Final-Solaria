export interface PriceUpdate {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  timestamp: number
}

export interface OrderBookUpdate {
  symbol: string
  bids: [string, string][]
  asks: [string, string][]
  timestamp: number
}

export interface AccountUpdate {
  balances: { asset: string; free: string; locked: string }[]
  timestamp: number
}

export class WebSocketManager {
  private static instance: WebSocketManager
  private connections: Map<string, WebSocket> = new Map()
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private reconnectAttempts: Map<string, number> = new Map()
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager()
    }
    return WebSocketManager.instance
  }

  // Subscribe to price updates for multiple symbols
  subscribeToPrices(symbols: string[], callback: (data: PriceUpdate) => void): () => void {
    const streamName = "prices"

    if (!this.listeners.has(streamName)) {
      this.listeners.set(streamName, new Set())
    }

    this.listeners.get(streamName)!.add(callback)

    // Create WebSocket connection if it doesn't exist
    if (!this.connections.has(streamName)) {
      this.createPriceStream(symbols)
    }

    // Return unsubscribe function
    return () => {
      this.listeners.get(streamName)?.delete(callback)
      if (this.listeners.get(streamName)?.size === 0) {
        this.closeConnection(streamName)
      }
    }
  }

  // Subscribe to order book updates
  subscribeToOrderBook(symbol: string, callback: (data: OrderBookUpdate) => void): () => void {
    const streamName = `orderbook_${symbol.toLowerCase()}`

    if (!this.listeners.has(streamName)) {
      this.listeners.set(streamName, new Set())
    }

    this.listeners.get(streamName)!.add(callback)

    if (!this.connections.has(streamName)) {
      this.createOrderBookStream(symbol)
    }

    return () => {
      this.listeners.get(streamName)?.delete(callback)
      if (this.listeners.get(streamName)?.size === 0) {
        this.closeConnection(streamName)
      }
    }
  }

  // Subscribe to account updates (requires authenticated connection)
  subscribeToAccount(callback: (data: AccountUpdate) => void): () => void {
    const streamName = "account"

    if (!this.listeners.has(streamName)) {
      this.listeners.set(streamName, new Set())
    }

    this.listeners.get(streamName)!.add(callback)

    if (!this.connections.has(streamName)) {
      this.createAccountStream()
    }

    return () => {
      this.listeners.get(streamName)?.delete(callback)
      if (this.listeners.get(streamName)?.size === 0) {
        this.closeConnection(streamName)
      }
    }
  }

  private createPriceStream(symbols: string[]) {
    const streamName = "prices"
    const streams = symbols.map((symbol) => `${symbol.toLowerCase()}@ticker`).join("/")
    const wsUrl = `wss://stream.binance.com:9443/ws/${streams}`

    console.log("[v0] Creating price stream for symbols:", symbols)

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("[v0] Price stream connected")
      this.reconnectAttempts.set(streamName, 0)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // Handle single ticker or multiple tickers
        const tickers = Array.isArray(data) ? data : [data]

        tickers.forEach((ticker: any) => {
          if (ticker.s && ticker.c) {
            const priceUpdate: PriceUpdate = {
              symbol: ticker.s,
              price: Number.parseFloat(ticker.c),
              change24h: Number.parseFloat(ticker.P),
              volume24h: Number.parseFloat(ticker.v),
              timestamp: Date.now(),
            }

            this.notifyListeners(streamName, priceUpdate)
          }
        })
      } catch (error) {
        console.error("[v0] Error parsing price data:", error)
      }
    }

    ws.onclose = () => {
      console.log("[v0] Price stream disconnected")
      this.handleReconnect(streamName, () => this.createPriceStream(symbols))
    }

    ws.onerror = (error) => {
      console.error("[v0] Price stream error:", error)
    }

    this.connections.set(streamName, ws)
  }

  private createOrderBookStream(symbol: string) {
    const streamName = `orderbook_${symbol.toLowerCase()}`
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`

    console.log("[v0] Creating order book stream for:", symbol)

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("[v0] Order book stream connected for", symbol)
      this.reconnectAttempts.set(streamName, 0)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.bids && data.asks) {
          const orderBookUpdate: OrderBookUpdate = {
            symbol: data.s,
            bids: data.bids.slice(0, 10), // Top 10 bids
            asks: data.asks.slice(0, 10), // Top 10 asks
            timestamp: Date.now(),
          }

          this.notifyListeners(streamName, orderBookUpdate)
        }
      } catch (error) {
        console.error("[v0] Error parsing order book data:", error)
      }
    }

    ws.onclose = () => {
      console.log("[v0] Order book stream disconnected for", symbol)
      this.handleReconnect(streamName, () => this.createOrderBookStream(symbol))
    }

    ws.onerror = (error) => {
      console.error("[v0] Order book stream error:", error)
    }

    this.connections.set(streamName, ws)
  }

  private createAccountStream() {
    // Note: This would require authenticated WebSocket connection
    // For demo purposes, we'll simulate account updates
    const streamName = "account"

    console.log("[v0] Creating mock account stream")

    // Simulate account updates every 5 seconds
    const interval = setInterval(() => {
      const mockAccountUpdate: AccountUpdate = {
        balances: [
          { asset: "BTC", free: "0.5", locked: "0.1" },
          { asset: "ETH", free: "2.5", locked: "0.0" },
          { asset: "USDT", free: "10000.00", locked: "500.00" },
        ],
        timestamp: Date.now(),
      }

      this.notifyListeners(streamName, mockAccountUpdate)
    }, 5000)

    // Store interval reference as a mock WebSocket
    this.connections.set(streamName, { close: () => clearInterval(interval) } as any)
  }

  private handleReconnect(streamName: string, reconnectFn: () => void) {
    const attempts = this.reconnectAttempts.get(streamName) || 0

    if (attempts < this.maxReconnectAttempts) {
      this.reconnectAttempts.set(streamName, attempts + 1)

      setTimeout(() => {
        console.log(`[v0] Reconnecting ${streamName}, attempt ${attempts + 1}`)
        reconnectFn()
      }, this.reconnectDelay * Math.pow(2, attempts))
    } else {
      console.error(`[v0] Max reconnection attempts reached for ${streamName}`)
    }
  }

  private notifyListeners(streamName: string, data: any) {
    const listeners = this.listeners.get(streamName)
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error("[v0] Error in listener callback:", error)
        }
      })
    }
  }

  private closeConnection(streamName: string) {
    const connection = this.connections.get(streamName)
    if (connection) {
      connection.close()
      this.connections.delete(streamName)
      this.listeners.delete(streamName)
      this.reconnectAttempts.delete(streamName)
      console.log(`[v0] Closed connection: ${streamName}`)
    }
  }

  // Clean up all connections
  disconnect() {
    console.log("[v0] Disconnecting all WebSocket connections")
    this.connections.forEach((connection, streamName) => {
      this.closeConnection(streamName)
    })
  }
}
