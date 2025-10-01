"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Activity, AlertTriangle } from "lucide-react"
import { useBalanceUpdates } from "@/hooks/use-balance-updates"

interface Balance {
  asset: string
  free: number
  locked: number
  total: number
}

interface TradingPair {
  symbol: string
  baseAsset: string
  quoteAsset: string
  price: number
}

export function TradeForm() {
  const { toast } = useToast()
  const { exchangeBalances, refreshBalances } = useBalanceUpdates()
  const [orderType, setOrderType] = useState("market")
  const [selectedExchange, setSelectedExchange] = useState("binance")
  const [selectedPair, setSelectedPair] = useState("BTCUSDT")
  const [buyAmount, setBuyAmount] = useState("")
  const [buyPrice, setBuyPrice] = useState("")
  const [sellAmount, setSellAmount] = useState("")
  const [sellPrice, setSellPrice] = useState("")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([])
  const [currentPrice, setCurrentPrice] = useState(67234.56)

  const [connectedExchanges] = useState([
    { id: "binance", name: "Binance", connected: true },
    { id: "coinbase", name: "Coinbase Pro", connected: false },
  ])

  useEffect(() => {
    loadTradingPairs()
  }, [selectedExchange])

  const loadTradingPairs = async () => {
    // Simulate loading trading pairs
    setTradingPairs([
      { symbol: "BTCUSDT", baseAsset: "BTC", quoteAsset: "USDT", price: 67234.56 },
      { symbol: "ETHUSDT", baseAsset: "ETH", quoteAsset: "USDT", price: 3456.78 },
      { symbol: "SOLUSDT", baseAsset: "SOL", quoteAsset: "USDT", price: 180.45 },
    ])
  }

  useEffect(() => {
    const pair = tradingPairs.find((p) => p.symbol === selectedPair)
    if (pair) {
      setCurrentPrice(pair.price)
    }
  }, [selectedPair, tradingPairs])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const getBalance = (asset: string): number => {
    const exchangeBalance = exchangeBalances.find((eb) => eb.exchange === selectedExchange)
    if (!exchangeBalance) return 0

    const balance = exchangeBalance.balances.find((b) => b.asset === asset)
    return balance?.free || 0
  }

  const currentPair = tradingPairs.find((p) => p.symbol === selectedPair)
  const baseAsset = currentPair?.baseAsset || "BTC"
  const quoteAsset = currentPair?.quoteAsset || "USDT"
  const baseBalance = getBalance(baseAsset)
  const quoteBalance = getBalance(quoteAsset)

  const placeOrder = async (side: "buy" | "sell") => {
    const amount = side === "buy" ? buyAmount : sellAmount
    const price = side === "buy" ? buyPrice : sellPrice

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (orderType === "limit" && (!price || Number.parseFloat(price) <= 0)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price for limit orders",
        variant: "destructive",
      })
      return
    }

    // Check balance
    const requiredBalance =
      side === "buy"
        ? Number.parseFloat(amount) * (orderType === "market" ? currentPrice : Number.parseFloat(price || "0"))
        : Number.parseFloat(amount)

    const availableBalance = side === "buy" ? quoteBalance : baseBalance

    if (requiredBalance > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `Not enough ${side === "buy" ? quoteAsset : baseAsset} balance`,
        variant: "destructive",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      const orderRequest = {
        symbol: selectedPair,
        side,
        type: orderType,
        quantity: Number.parseFloat(amount),
        price: orderType === "limit" ? Number.parseFloat(price || "0") : currentPrice,
        timeInForce: "GTC" as const,
      }

      const response = await fetch("/api/trading/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: orderRequest,
          exchangeId: selectedExchange,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Order Placed Successfully",
          description: `${side.toUpperCase()} order for ${amount} ${baseAsset} placed on ${connectedExchanges.find((e) => e.id === selectedExchange)?.name}`,
        })

        // Clear form
        if (side === "buy") {
          setBuyAmount("")
          setBuyPrice("")
        } else {
          setSellAmount("")
          setSellPrice("")
        }

        await refreshBalances()
      } else {
        throw new Error(data.error || "Failed to place order")
      }
    } catch (error) {
      console.error("Order placement error:", error)
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const connectedExchange = connectedExchanges.find((e) => e.id === selectedExchange)
  const isExchangeConnected = connectedExchange?.connected || false

  return (
    <Card className="h-auto lg:h-[700px] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3 lg:pb-4">
        <CardTitle className="text-lg lg:text-xl">Place Order</CardTitle>

        <div className="space-y-3">
          <div>
            <Label htmlFor="exchange" className="text-sm">
              Exchange
            </Label>
            <Select value={selectedExchange} onValueChange={setSelectedExchange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {connectedExchanges.map((exchange) => (
                  <SelectItem key={exchange.id} value={exchange.id} disabled={!exchange.connected}>
                    <div className="flex items-center gap-2">
                      <span>{exchange.name}</span>
                      {exchange.connected ? (
                        <Badge variant="default" className="bg-green-500/20 text-green-400 text-xs">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Disconnected
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="trading-pair" className="text-sm">
              Trading Pair
            </Label>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tradingPairs.map((pair) => (
                  <SelectItem key={pair.symbol} value={pair.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <span>{pair.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-2">{formatPrice(pair.price)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0">
        {!isExchangeConnected ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto" />
              <div>
                <div className="font-medium">Exchange Not Connected</div>
                <div className="text-sm text-muted-foreground">Connect to an exchange to start trading</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Tabs defaultValue="buy" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 flex-shrink-0 mb-3 lg:mb-4">
                <TabsTrigger value="buy" className="text-sm">
                  Buy {baseAsset}
                </TabsTrigger>
                <TabsTrigger value="sell" className="text-sm">
                  Sell {baseAsset}
                </TabsTrigger>
              </TabsList>

              <div className="mb-3 lg:mb-4 flex-shrink-0">
                <Label htmlFor="order-type" className="text-sm">
                  Order Type
                </Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market Order</SelectItem>
                    <SelectItem value="limit">Limit Order</SelectItem>
                    <SelectItem value="stop">Stop Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-h-0">
                <TabsContent value="buy" className="space-y-3 mt-0 h-full flex flex-col">
                  {orderType === "limit" && (
                    <div className="space-y-1 flex-shrink-0">
                      <Label htmlFor="buy-price" className="text-sm">
                        Price ({quoteAsset})
                      </Label>
                      <Input
                        id="buy-price"
                        type="number"
                        placeholder={currentPrice.toString()}
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-1 flex-shrink-0">
                    <Label htmlFor="buy-amount" className="text-sm">
                      Amount ({baseAsset})
                    </Label>
                    <Input
                      id="buy-amount"
                      type="number"
                      placeholder="0.00000000"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1 flex-shrink-0">
                    <Label className="text-sm">Total Cost</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <span className="font-mono text-sm">
                        {buyAmount && (orderType === "market" || buyPrice)
                          ? formatPrice(
                              Number.parseFloat(buyAmount) *
                                (orderType === "market" ? currentPrice : Number.parseFloat(buyPrice || "0")),
                            )
                          : "$0.00"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 flex-shrink-0">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-mono">
                        {quoteBalance.toFixed(2)} {quoteAsset}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Fee (0.1%)</span>
                      <span className="font-mono">
                        {buyAmount && (orderType === "market" || buyPrice)
                          ? formatPrice(
                              Number.parseFloat(buyAmount) *
                                (orderType === "market" ? currentPrice : Number.parseFloat(buyPrice || "0")) *
                                0.001,
                            )
                          : "$0.00"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent px-2"
                      onClick={() => setBuyAmount(((quoteBalance * 0.25) / currentPrice).toFixed(8))}
                    >
                      25%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent px-2"
                      onClick={() => setBuyAmount(((quoteBalance * 0.5) / currentPrice).toFixed(8))}
                    >
                      50%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent px-2"
                      onClick={() => setBuyAmount(((quoteBalance * 0.75) / currentPrice).toFixed(8))}
                    >
                      75%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent px-2"
                      onClick={() => setBuyAmount(((quoteBalance * 1.0) / currentPrice).toFixed(8))}
                    >
                      100%
                    </Button>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 flex-shrink-0 mt-auto text-sm py-2"
                    onClick={() => placeOrder("buy")}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>{orderType === "market" ? `Buy ${baseAsset} (Market)` : `Buy ${baseAsset} (${orderType})`}</>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="sell" className="space-y-3 mt-0 h-full flex flex-col">
                  {orderType === "limit" && (
                    <div className="space-y-1 flex-shrink-0">
                      <Label htmlFor="sell-price" className="text-sm">
                        Price ({quoteAsset})
                      </Label>
                      <Input
                        id="sell-price"
                        type="number"
                        placeholder={currentPrice.toString()}
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-1 flex-shrink-0">
                    <Label htmlFor="sell-amount" className="text-sm">
                      Amount ({baseAsset})
                    </Label>
                    <Input
                      id="sell-amount"
                      type="number"
                      placeholder="0.00000000"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1 flex-shrink-0">
                    <Label className="text-sm">Total Receive</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <span className="font-mono text-sm">
                        {sellAmount && (orderType === "market" || sellPrice)
                          ? formatPrice(
                              Number.parseFloat(sellAmount) *
                                (orderType === "market" ? currentPrice : Number.parseFloat(sellPrice || "0")),
                            )
                          : "$0.00"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 flex-shrink-0">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-mono">
                        {baseBalance.toFixed(8)} {baseAsset}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Fee (0.1%)</span>
                      <span className="font-mono">
                        {sellAmount && (orderType === "market" || sellPrice)
                          ? formatPrice(
                              Number.parseFloat(sellAmount) *
                                (orderType === "market" ? currentPrice : Number.parseFloat(sellPrice || "0")) *
                                0.001,
                            )
                          : "$0.00"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent px-2"
                      onClick={() => setSellAmount((baseBalance * 0.25).toFixed(8))}
                    >
                      25%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent px-2"
                      onClick={() => setSellAmount((baseBalance * 0.5).toFixed(8))}
                    >
                      50%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent px-2"
                      onClick={() => setSellAmount((baseBalance * 0.75).toFixed(8))}
                    >
                      75%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent px-2"
                      onClick={() => setSellAmount((baseBalance * 1.0).toFixed(8))}
                    >
                      100%
                    </Button>
                  </div>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 flex-shrink-0 mt-auto text-sm py-2"
                    onClick={() => placeOrder("sell")}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>{orderType === "market" ? `Sell ${baseAsset} (Market)` : `Sell ${baseAsset} (${orderType})`}</>
                    )}
                  </Button>
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  )
}
