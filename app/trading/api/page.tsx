"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, BarChart3, TrendingUp, Percent } from "lucide-react"
import { ApiKeyManagement } from "@/components/trading/api-key-management"
import { SpotTradingInterface } from "@/components/trading/spot-trading-interface"
import { ConnectionManager } from "@/lib/binance-api"
import DerivativesTradingInterface from "@/components/trading/derivatives-trading-interface"
import { WebSocketManager, type PriceUpdate, type AccountUpdate } from "@/lib/websocket-manager"

export default function ApiTradingPage() {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState("spot")
  const [accountStats, setAccountStats] = useState({
    totalBalance: 0,
    openOrders: 0,
    dailyPnL: 1234.56,
    successRate: 78.5,
  })
  const [liveData, setLiveData] = useState<Map<string, PriceUpdate>>(new Map())
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isMounted, setIsMounted] = useState(false)

  const connectionManager = ConnectionManager.getInstance()
  const wsManager = WebSocketManager.getInstance()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    setIsConnected(connectionManager.isConnected())

    const statusListener = (status: string) => {
      setIsConnected(status === "connected")
    }

    connectionManager.addStatusListener(statusListener)
    return () => connectionManager.removeStatusListener(statusListener)
  }, [isMounted])

  useEffect(() => {
    if (isConnected) {
      console.log("[v0] Setting up real-time data subscriptions")

      // Subscribe to major trading pairs
      const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "SOLUSDT"]

      const unsubscribePrice = wsManager.subscribeToPrices(symbols, (priceUpdate: PriceUpdate) => {
        setLiveData((prev) => {
          const newData = new Map(prev)
          newData.set(priceUpdate.symbol, priceUpdate)
          return newData
        })
        setLastUpdate(new Date())
      })

      const unsubscribeAccount = wsManager.subscribeToAccount((accountUpdate: AccountUpdate) => {
        // Update account stats based on real-time balance changes
        const totalBalance = accountUpdate.balances.reduce((total, balance) => {
          if (balance.asset === "USDT") {
            return total + Number.parseFloat(balance.free) + Number.parseFloat(balance.locked)
          }
          return total
        }, 0)

        setAccountStats((prev) => ({
          ...prev,
          totalBalance,
        }))
      })

      return () => {
        unsubscribePrice()
        unsubscribeAccount()
      }
    }
  }, [isConnected])

  useEffect(() => {
    return () => {
      wsManager.disconnect()
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">Trade using API</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Connect to Binance API for advanced spot and derivatives trading
          </p>
          {isConnected && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">
                Live data • Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* API Key Management */}
      <ApiKeyManagement onConnectionChange={setIsConnected} />

      {isConnected && (
        <div className="space-y-6">
          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Balance</p>
                    <p className="text-2xl font-bold">{formatPrice(accountStats.totalBalance)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Orders</p>
                    <p className="text-2xl font-bold">{accountStats.openOrders}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">24h P&L</p>
                    <p className="text-2xl font-bold text-green-500">+{formatPrice(accountStats.dailyPnL)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">{accountStats.successRate}%</p>
                  </div>
                  <Percent className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="spot">Spot Trading</TabsTrigger>
              <TabsTrigger value="derivatives">Derivatives</TabsTrigger>
            </TabsList>

            <TabsContent value="spot" className="space-y-6">
              <SpotTradingInterface onStatsUpdate={setAccountStats} liveData={liveData} />
            </TabsContent>

            <TabsContent value="derivatives" className="space-y-6">
              <DerivativesTradingInterface />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
