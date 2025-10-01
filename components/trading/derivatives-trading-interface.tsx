"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, BarChart3, Target } from "lucide-react"

interface FuturesContract {
  symbol: string
  baseAsset: string
  quoteAsset: string
  price: number
  change24h: number
  volume24h: number
  openInterest: number
  fundingRate: number
  nextFundingTime: string
  markPrice: number
  indexPrice: number
}

interface Position {
  symbol: string
  side: "LONG" | "SHORT"
  size: number
  entryPrice: number
  markPrice: number
  pnl: number
  pnlPercentage: number
  margin: number
  leverage: number
}

export default function DerivativesTradingInterface() {
  const [selectedContract, setSelectedContract] = useState<string>("")
  const [orderType, setOrderType] = useState<string>("MARKET")
  const [side, setSide] = useState<string>("BUY")
  const [quantity, setQuantity] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [leverage, setLeverage] = useState<number>(1)
  const [marginType, setMarginType] = useState<string>("ISOLATED")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  // Mock data for futures contracts
  const [futuresContracts] = useState<FuturesContract[]>([
    {
      symbol: "BTCUSDT",
      baseAsset: "BTC",
      quoteAsset: "USDT",
      price: 43250.5,
      change24h: 2.45,
      volume24h: 1250000000,
      openInterest: 45000,
      fundingRate: 0.0001,
      nextFundingTime: "2024-01-15T16:00:00Z",
      markPrice: 43251.2,
      indexPrice: 43250.8,
    },
    {
      symbol: "ETHUSDT",
      baseAsset: "ETH",
      quoteAsset: "USDT",
      price: 2650.75,
      change24h: -1.25,
      volume24h: 850000000,
      openInterest: 125000,
      fundingRate: -0.0002,
      nextFundingTime: "2024-01-15T16:00:00Z",
      markPrice: 2651.1,
      indexPrice: 2650.9,
    },
  ])

  // Mock positions data
  const [positions] = useState<Position[]>([
    {
      symbol: "BTCUSDT",
      side: "LONG",
      size: 0.5,
      entryPrice: 42800.0,
      markPrice: 43250.5,
      pnl: 225.25,
      pnlPercentage: 1.05,
      margin: 2140.0,
      leverage: 10,
    },
  ])

  const handlePlaceOrder = async () => {
    if (!selectedContract || !quantity) {
      setError("Please select a contract and enter quantity")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form
      setQuantity("")
      setPrice("")

      console.log("[v0] Derivatives order placed successfully")
    } catch (err) {
      setError("Failed to place order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateMargin = () => {
    if (!quantity || !price) return 0
    const notional = Number.parseFloat(quantity) * Number.parseFloat(price)
    return notional / leverage
  }

  const selectedContractData = futuresContracts.find((c) => c.symbol === selectedContract)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="futures" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="futures">Futures Trading</TabsTrigger>
          <TabsTrigger value="positions">Positions & Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="futures" className="space-y-6">
          {/* Contract Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Futures Contracts
              </CardTitle>
              <CardDescription>Select a futures contract to trade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {futuresContracts.map((contract) => (
                  <div
                    key={contract.symbol}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedContract === contract.symbol
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedContract(contract.symbol)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold">{contract.symbol}</h3>
                          <p className="text-sm text-muted-foreground">
                            {contract.baseAsset}/{contract.quoteAsset} Perpetual
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">${contract.price.toLocaleString()}</span>
                          <Badge
                            variant={contract.change24h >= 0 ? "default" : "destructive"}
                            className="flex items-center gap-1"
                          >
                            {contract.change24h >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(contract.change24h)}%
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Funding: {(contract.fundingRate * 100).toFixed(4)}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-3 pt-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">24h Volume</p>
                        <p className="text-sm font-medium">${(contract.volume24h / 1000000).toFixed(0)}M</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Open Interest</p>
                        <p className="text-sm font-medium">
                          {contract.openInterest.toLocaleString()} {contract.baseAsset}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Mark Price</p>
                        <p className="text-sm font-medium">${contract.markPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Index Price</p>
                        <p className="text-sm font-medium">${contract.indexPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trading Interface */}
          {selectedContract && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Place Order - {selectedContract}
                  </CardTitle>
                  <CardDescription>Configure your futures order parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Leverage and Margin Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Leverage</Label>
                      <Select
                        value={leverage.toString()}
                        onValueChange={(value) => setLeverage(Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 5, 10, 20, 50, 100].map((lev) => (
                            <SelectItem key={lev} value={lev.toString()}>
                              {lev}x
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Margin Type</Label>
                      <Select value={marginType} onValueChange={setMarginType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ISOLATED">Isolated</SelectItem>
                          <SelectItem value="CROSSED">Cross</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Order Type and Side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Order Type</Label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MARKET">Market</SelectItem>
                          <SelectItem value="LIMIT">Limit</SelectItem>
                          <SelectItem value="STOP">Stop</SelectItem>
                          <SelectItem value="TAKE_PROFIT">Take Profit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Side</Label>
                      <Select value={side} onValueChange={setSide}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BUY">Long</SelectItem>
                          <SelectItem value="SELL">Short</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label>Quantity ({selectedContractData?.baseAsset})</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  {/* Price (for limit orders) */}
                  {orderType === "LIMIT" && (
                    <div className="space-y-2">
                      <Label>Price (USDT)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Order Summary */}
                  {quantity && (
                    <div className="p-3 bg-muted rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Notional Value:</span>
                        <span>
                          ${((Number.parseFloat(quantity) || 0) * (selectedContractData?.price || 0)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Required Margin:</span>
                        <span>
                          $
                          {(
                            ((Number.parseFloat(quantity) || 0) * (selectedContractData?.price || 0)) /
                            leverage
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isLoading || !selectedContract || !quantity}
                    className="w-full"
                    variant={side === "BUY" ? "default" : "destructive"}
                  >
                    {isLoading ? "Placing Order..." : `${side === "BUY" ? "Long" : "Short"} ${selectedContract}`}
                  </Button>
                </CardContent>
              </Card>

              {/* Market Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Market Information</CardTitle>
                  <CardDescription>Real-time market data for {selectedContract}</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedContractData && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Mark Price</p>
                          <p className="text-lg font-semibold">${selectedContractData.markPrice.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Index Price</p>
                          <p className="text-lg font-semibold">${selectedContractData.indexPrice.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Funding Rate</p>
                          <p
                            className={`font-semibold ${
                              selectedContractData.fundingRate >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {(selectedContractData.fundingRate * 100).toFixed(4)}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Next Funding</p>
                          <p className="font-semibold">
                            {new Date(selectedContractData.nextFundingTime).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Open Interest</p>
                        <p className="text-lg font-semibold">
                          {selectedContractData.openInterest.toLocaleString()} {selectedContractData.baseAsset}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">24h Volume</p>
                        <p className="text-lg font-semibold">
                          ${(selectedContractData.volume24h / 1000000).toFixed(0)}M
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          {/* Open Positions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Open Positions
              </CardTitle>
              <CardDescription>Manage your active futures positions</CardDescription>
            </CardHeader>
            <CardContent>
              {positions.length > 0 ? (
                <div className="space-y-4">
                  {positions.map((position, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{position.symbol}</h3>
                          <Badge variant={position.side === "LONG" ? "default" : "destructive"}>{position.side}</Badge>
                          <Badge variant="outline">{position.leverage}x</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Close Position
                          </Button>
                          <Button size="sm" variant="outline">
                            Add Margin
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Size</p>
                          <p className="font-semibold">{position.size} BTC</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Entry Price</p>
                          <p className="font-semibold">${position.entryPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Mark Price</p>
                          <p className="font-semibold">${position.markPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Margin</p>
                          <p className="font-semibold">${position.margin.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Unrealized PnL</span>
                          <div className="text-right">
                            <span className={`font-semibold ${position.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                              ${position.pnl.toFixed(2)}
                            </span>
                            <span
                              className={`ml-2 text-sm ${
                                position.pnlPercentage >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              ({position.pnlPercentage >= 0 ? "+" : ""}
                              {position.pnlPercentage.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No open positions</p>
                  <p className="text-sm">Your futures positions will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
