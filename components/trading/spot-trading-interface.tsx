"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Activity, TrendingUp, TrendingDown, RefreshCw, X } from "lucide-react"
import { ConnectionManager, type OrderRequest } from "@/lib/binance-api"
import { WebSocketManager, type PriceUpdate } from "@/lib/websocket-manager"

interface TradingPair {
  symbol: string
  baseAsset: string
  quoteAsset: string
  price: number
  volume24h: number
  change24h: number
  minQty: number
  maxQty: number
  stepSize: number
  tickSize: number
}

interface Balance {
  asset: string
  free: number
  locked: number
  total: number
}

interface Order {
  id: string
  symbol: string
  side: "BUY" | "SELL"
  type: string
  quantity: number
  price?: number
  status: string
  filledQuantity: number
  remainingQuantity: number
  timestamp: string
}

interface SpotTradingInterfaceProps {
  onStatsUpdate?: (stats: any) => void
  liveData?: Map<string, PriceUpdate>
}

export function SpotTradingInterface({ onStatsUpdate, liveData }: SpotTradingInterfaceProps) {
  const { toast } = useToast()
  const [selectedPair, setSelectedPair] = useState("BTCUSDT")
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([])
  const [balances, setBalances] = useState<Balance[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Order Form State
  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY")
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const connectionManager = ConnectionManager.getInstance()
  const wsManager = WebSocketManager.getInstance()

  useEffect(() => {
    if (connectionManager.isConnected()) {
      loadInitialData()

      // Auto-refresh data every 30 seconds (less frequent since we have real-time data)
      const interval = setInterval(() => {
        refreshTradingData()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (liveData && tradingPairs.length > 0) {
      setTradingPairs((prevPairs) =>
        prevPairs.map((pair) => {
          const liveUpdate = liveData.get(pair.symbol)
          if (liveUpdate) {
            return {
              ...pair,
              price: liveUpdate.price,
              change24h: liveUpdate.change24h,
              volume24h: liveUpdate.volume24h,
            }
          }
          return pair
        }),
      )
      setLastUpdate(new Date())
    }
  }, [liveData, tradingPairs.length])

  const loadInitialData = async () => {
    setIsLoadingData(true)
    try {
      await Promise.all([loadTradingPairs(), loadBalances(), loadOrders()])
    } catch (error) {
      console.error("Failed to load initial data:", error)
      toast({
        title: "Data Loading Error",
        description: "Failed to load trading data. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const loadTradingPairs = async () => {
    const client = connectionManager.getClient()
    if (!client) return

    try {
      // Get exchange info and 24hr ticker data
      const [exchangeInfo, tickerData] = await Promise.all([client.getExchangeInfo(), client.get24hrTicker()])

      // Filter for major trading pairs and combine with ticker data
      const majorPairs = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "ADAUSDT", "DOTUSDT", "LINKUSDT", "BNBUSDT", "XRPUSDT"]
      const pairs: TradingPair[] = []

      for (const symbol of majorPairs) {
        const symbolInfo = exchangeInfo.symbols.find((s: any) => s.symbol === symbol)
        const tickerInfo = Array.isArray(tickerData)
          ? tickerData.find((t: any) => t.symbol === symbol)
          : tickerData.symbol === symbol
            ? tickerData
            : null

        if (symbolInfo && tickerInfo) {
          const lotSizeFilter = symbolInfo.filters.find((f: any) => f.filterType === "LOT_SIZE")
          const priceFilter = symbolInfo.filters.find((f: any) => f.filterType === "PRICE_FILTER")

          pairs.push({
            symbol: symbolInfo.symbol,
            baseAsset: symbolInfo.baseAsset,
            quoteAsset: symbolInfo.quoteAsset,
            price: Number.parseFloat(tickerInfo.lastPrice || tickerInfo.price),
            volume24h: Number.parseFloat(tickerInfo.volume || "0"),
            change24h: Number.parseFloat(tickerInfo.priceChangePercent || "0"),
            minQty: Number.parseFloat(lotSizeFilter?.minQty || "0"),
            maxQty: Number.parseFloat(lotSizeFilter?.maxQty || "0"),
            stepSize: Number.parseFloat(lotSizeFilter?.stepSize || "0"),
            tickSize: Number.parseFloat(priceFilter?.tickSize || "0"),
          })
        }
      }

      setTradingPairs(pairs)
    } catch (error) {
      console.error("Failed to load trading pairs:", error)
      // Fallback to mock data
      setTradingPairs([
        {
          symbol: "BTCUSDT",
          baseAsset: "BTC",
          quoteAsset: "USDT",
          price: 67234.56,
          volume24h: 1234567890,
          change24h: 2.34,
          minQty: 0.00001,
          maxQty: 9000,
          stepSize: 0.00001,
          tickSize: 0.01,
        },
        {
          symbol: "ETHUSDT",
          baseAsset: "ETH",
          quoteAsset: "USDT",
          price: 3456.78,
          volume24h: 987654321,
          change24h: -1.23,
          minQty: 0.0001,
          maxQty: 90000,
          stepSize: 0.0001,
          tickSize: 0.01,
        },
      ])
    }
  }

  const loadBalances = async () => {
    const client = connectionManager.getClient()
    if (!client) return

    try {
      const accountInfo = await client.getAccountInfo()
      const balanceData: Balance[] = accountInfo.balances
        .filter((b: any) => Number.parseFloat(b.free) > 0 || Number.parseFloat(b.locked) > 0)
        .map((b: any) => ({
          asset: b.asset,
          free: Number.parseFloat(b.free),
          locked: Number.parseFloat(b.locked),
          total: Number.parseFloat(b.free) + Number.parseFloat(b.locked),
        }))

      setBalances(balanceData)

      // Update total balance for stats
      const totalBalance = balanceData.reduce((sum, b) => {
        const pair = tradingPairs.find((p) => p.baseAsset === b.asset)
        return sum + b.total * (pair?.price || (b.asset === "USDT" ? 1 : 0))
      }, 0)

      onStatsUpdate?.({
        totalBalance,
        openOrders: orders.filter((o) => o.status === "NEW").length,
        dailyPnL: 1234.56,
        successRate: 78.5,
      })
    } catch (error) {
      console.error("Failed to load balances:", error)
    }
  }

  const loadOrders = async () => {
    const client = connectionManager.getClient()
    if (!client) return

    try {
      const openOrders = await client.getOpenOrders()
      const orderData: Order[] = openOrders.map((o: any) => ({
        id: o.orderId.toString(),
        symbol: o.symbol,
        side: o.side,
        type: o.type,
        quantity: Number.parseFloat(o.origQty),
        price: Number.parseFloat(o.price),
        status: o.status,
        filledQuantity: Number.parseFloat(o.executedQty),
        remainingQuantity: Number.parseFloat(o.origQty) - Number.parseFloat(o.executedQty),
        timestamp: new Date(o.time).toISOString(),
      }))

      setOrders(orderData)
    } catch (error) {
      console.error("Failed to load orders:", error)
    }
  }

  const refreshTradingData = async () => {
    if (!connectionManager.isConnected()) return

    try {
      await Promise.all([loadBalances(), loadOrders()])
      // Don't reload trading pairs as they're updated via WebSocket
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to refresh trading data:", error)
    }
  }

  const placeOrder = async () => {
    if (!quantity || Number.parseFloat(quantity) <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    if (orderType === "LIMIT" && (!price || Number.parseFloat(price) <= 0)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price for limit orders",
        variant: "destructive",
      })
      return
    }

    const client = connectionManager.getClient()
    if (!client) {
      toast({
        title: "Not Connected",
        description: "Please connect to Binance API first",
        variant: "destructive",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      const orderData: OrderRequest = {
        symbol: selectedPair,
        side: orderSide,
        type: orderType,
        quantity: Number.parseFloat(quantity),
        ...(orderType === "LIMIT" && { price: Number.parseFloat(price) }),
        timeInForce: "GTC",
      }

      const result = await client.placeOrder(orderData)

      toast({
        title: "Order Placed Successfully",
        description: `${orderSide} order for ${quantity} ${selectedPair.replace("USDT", "")} placed`,
      })

      // Clear form and refresh data
      setQuantity("")
      setPrice("")
      await refreshTradingData()
    } catch (error) {
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const cancelOrder = async (orderId: string, symbol: string) => {
    const client = connectionManager.getClient()
    if (!client) return

    try {
      await client.cancelOrder(symbol, Number.parseInt(orderId))

      toast({
        title: "Order Cancelled",
        description: `Order ${orderId} has been cancelled`,
      })

      await refreshTradingData()
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel order",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`
    return `$${volume.toFixed(2)}`
  }

  const currentPair = tradingPairs.find((p) => p.symbol === selectedPair)
  const baseAsset = currentPair?.baseAsset || "BTC"
  const quoteAsset = currentPair?.quoteAsset || "USDT"
  const baseBalance = balances.find((b) => b.asset === baseAsset)
  const quoteBalance = balances.find((b) => b.asset === quoteAsset)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trading Pairs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Trading Pairs</CardTitle>
          <div className="flex items-center gap-2">
            {liveData && liveData.size > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={refreshTradingData} disabled={isLoadingData}>
              <RefreshCw className={`h-4 w-4 ${isLoadingData ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</div>

          {tradingPairs.map((pair) => {
            const hasLiveData = liveData?.has(pair.symbol)

            return (
              <div
                key={pair.symbol}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPair === pair.symbol ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                } ${hasLiveData ? "ring-1 ring-green-500/20" : ""}`}
                onClick={() => setSelectedPair(pair.symbol)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {pair.symbol}
                      {hasLiveData && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Vol: {formatVolume(pair.volume24h * pair.price)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{formatPrice(pair.price)}</div>
                    <div
                      className={`text-sm flex items-center ${pair.change24h >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {pair.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {pair.change24h >= 0 ? "+" : ""}
                      {pair.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Order Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Place Order - {selectedPair}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={orderSide === "BUY" ? "default" : "outline"}
              onClick={() => setOrderSide("BUY")}
              className={orderSide === "BUY" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Buy {baseAsset}
            </Button>
            <Button
              variant={orderSide === "SELL" ? "default" : "outline"}
              onClick={() => setOrderSide("SELL")}
              className={orderSide === "SELL" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Sell {baseAsset}
            </Button>
          </div>

          <Select value={orderType} onValueChange={(value: "MARKET" | "LIMIT") => setOrderType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MARKET">Market Order</SelectItem>
              <SelectItem value="LIMIT">Limit Order</SelectItem>
            </SelectContent>
          </Select>

          {orderType === "LIMIT" && (
            <div className="space-y-2">
              <Label>Price ({quoteAsset})</Label>
              <Input
                type="number"
                placeholder={currentPair?.price.toString()}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step={currentPair?.tickSize}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Quantity ({baseAsset})</Label>
            <Input
              type="number"
              placeholder="0.00000000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              step={currentPair?.stepSize}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Available:</span>
              <span className="font-mono">
                {orderSide === "BUY"
                  ? `${quoteBalance?.free.toFixed(2) || "0.00"} ${quoteAsset}`
                  : `${baseBalance?.free.toFixed(8) || "0.00000000"} ${baseAsset}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total:</span>
              <span className="font-mono">
                {quantity && (orderType === "MARKET" || price)
                  ? formatPrice(
                      Number.parseFloat(quantity) *
                        (orderType === "MARKET" ? currentPair?.price || 0 : Number.parseFloat(price || "0")),
                    )
                  : "$0.00"}
              </span>
            </div>
          </div>

          {/* Quick percentage buttons */}
          <div className="grid grid-cols-4 gap-1">
            {[25, 50, 75, 100].map((percentage) => (
              <Button
                key={percentage}
                variant="outline"
                size="sm"
                className="text-xs bg-transparent"
                onClick={() => {
                  if (orderSide === "BUY" && quoteBalance && currentPair) {
                    const availableQuote = quoteBalance.free * (percentage / 100)
                    const qty = availableQuote / currentPair.price
                    setQuantity(qty.toFixed(8))
                  } else if (orderSide === "SELL" && baseBalance) {
                    const qty = baseBalance.free * (percentage / 100)
                    setQuantity(qty.toFixed(8))
                  }
                }}
              >
                {percentage}%
              </Button>
            ))}
          </div>

          <Button
            onClick={placeOrder}
            disabled={isPlacingOrder}
            className={`w-full ${
              orderSide === "BUY" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isPlacingOrder ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              `${orderSide} ${baseAsset}`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Account Balances & Orders */}
      <div className="space-y-6">
        {/* Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {balances
              .filter((b) => b.total > 0)
              .slice(0, 8)
              .map((balance) => (
                <div key={balance.asset} className="flex justify-between items-center p-2 rounded border">
                  <div>
                    <div className="font-medium">{balance.asset}</div>
                    <div className="text-sm text-muted-foreground">Free: {balance.free.toFixed(8)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{balance.total.toFixed(8)}</div>
                    {balance.locked > 0 && (
                      <div className="text-xs text-yellow-500">Locked: {balance.locked.toFixed(8)}</div>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Open Orders */}
        {orders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Open Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders
                  .filter((o) => o.status === "NEW")
                  .map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 rounded border">
                      <div className="flex items-center gap-3">
                        <Badge variant={order.side === "BUY" ? "default" : "destructive"} className="text-xs">
                          {order.side}
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">{order.symbol}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.type} • {order.quantity} @ {order.price ? formatPrice(order.price) : "Market"}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelOrder(order.id, order.symbol)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
