"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Wallet, TrendingUp, TrendingDown, Wifi, WifiOff, Bell } from "lucide-react"
import { useBalanceUpdates } from "@/hooks/use-balance-updates"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Balance {
  asset: string
  free: number
  locked: number
  total: number
  usdValue?: number
  change24h?: number
}

export function BalanceDisplay() {
  const { exchangeBalances, isRefreshing, lastUpdate, refreshBalances } = useBalanceUpdates()
  const [isRealTimeActive, setIsRealTimeActive] = useState(true)
  const [previousBalances, setPreviousBalances] = useState<typeof exchangeBalances>([])
  const [recentChanges, setRecentChanges] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (previousBalances.length > 0 && exchangeBalances.length > 0) {
      const changes: string[] = []

      exchangeBalances.forEach((currentExchange) => {
        const prevExchange = previousBalances.find((prev) => prev.exchange === currentExchange.exchange)
        if (!prevExchange) return

        currentExchange.balances.forEach((currentBalance) => {
          const prevBalance = prevExchange.balances.find((prev) => prev.asset === currentBalance.asset)
          if (!prevBalance) return

          const totalDiff = currentBalance.total - prevBalance.total
          if (Math.abs(totalDiff) > 0.00001) {
            // Ignore tiny differences
            const changeText = `${currentBalance.asset}: ${totalDiff > 0 ? "+" : ""}${totalDiff.toFixed(8)}`
            changes.push(changeText)
          }
        })
      })

      if (changes.length > 0) {
        setRecentChanges(changes)
        toast({
          title: "Balance Updated",
          description: `${changes.length} balance${changes.length > 1 ? "s" : ""} changed`,
        })
      }
    }

    setPreviousBalances(exchangeBalances)
  }, [exchangeBalances, toast])

  useEffect(() => {
    if (recentChanges.length > 0) {
      const timer = setTimeout(() => {
        setRecentChanges([])
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [recentChanges])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatAssetAmount = (amount: number, asset: string) => {
    const decimals = asset === "BTC" ? 8 : asset === "ETH" ? 6 : 2
    return amount.toFixed(decimals)
  }

  const getTotalPortfolioValue = () => {
    return exchangeBalances.reduce((total, exchange) => {
      return (
        total +
        exchange.balances.reduce((exchangeTotal, balance) => {
          return exchangeTotal + (balance.usdValue || 0)
        }, 0)
      )
    }, 0)
  }

  const getSignificantBalances = (balances: Balance[]) => {
    return balances.filter((balance) => balance.total > 0.001 || (balance.usdValue && balance.usdValue > 1))
  }

  const totalValue = getTotalPortfolioValue()

  const getUpdateFrequency = () => {
    const now = new Date()
    const timeDiff = now.getTime() - lastUpdate.getTime()

    if (timeDiff < 20000) return "Live" // Less than 20 seconds
    if (timeDiff < 60000) return "Recent" // Less than 1 minute
    return "Delayed"
  }

  const updateStatus = getUpdateFrequency()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Portfolio Balance
            <div className="flex items-center gap-2">
              {updateStatus === "Live" ? (
                <div className="flex items-center gap-1 text-green-400">
                  <Wifi className="h-4 w-4" />
                  <span className="text-xs">Live</span>
                </div>
              ) : updateStatus === "Recent" ? (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Wifi className="h-4 w-4" />
                  <span className="text-xs">Recent</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-400">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-xs">Delayed</span>
                </div>
              )}
              {recentChanges.length > 0 && (
                <div className="flex items-center gap-1 text-blue-400">
                  <Bell className="h-4 w-4 animate-pulse" />
                  <span className="text-xs">{recentChanges.length} updates</span>
                </div>
              )}
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Updated: {lastUpdate.toLocaleTimeString()}</div>
            <Button variant="outline" size="sm" onClick={refreshBalances} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{formatCurrency(totalValue)}</div>
            <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${updateStatus === "Live" ? "bg-green-400 animate-pulse" : updateStatus === "Recent" ? "bg-yellow-400" : "bg-red-400"}`}
              />
              <span className="text-xs text-muted-foreground">
                {updateStatus === "Live"
                  ? "Real-time updates active"
                  : updateStatus === "Recent"
                    ? "Recently updated"
                    : "Connection delayed"}
              </span>
            </div>
          </div>
        </div>

        {recentChanges.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Recent Changes</span>
            </div>
            <div className="space-y-1">
              {recentChanges.slice(0, 3).map((change, index) => (
                <div key={index} className="text-xs font-mono text-muted-foreground">
                  {change}
                </div>
              ))}
              {recentChanges.length > 3 && (
                <div className="text-xs text-muted-foreground">+{recentChanges.length - 3} more changes</div>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {exchangeBalances.map((exchangeBalance) => (
            <div key={exchangeBalance.exchange} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold capitalize">{exchangeBalance.exchange}</h3>
                  <Badge variant="default" className="bg-green-500/20 text-green-400">
                    Connected
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {new Date(exchangeBalance.lastUpdated).toLocaleTimeString()}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getSignificantBalances(exchangeBalance.balances).length} assets
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSignificantBalances(exchangeBalance.balances).map((balance) => (
                  <div
                    key={`${exchangeBalance.exchange}-${balance.asset}`}
                    className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{balance.asset}</div>
                        {balance.change24h !== undefined && (
                          <div
                            className={`flex items-center gap-1 text-xs ${
                              balance.change24h >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {balance.change24h >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(balance.change24h).toFixed(2)}%
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Available</span>
                        <span className="font-mono text-sm">{formatAssetAmount(balance.free, balance.asset)}</span>
                      </div>

                      {balance.locked > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Locked</span>
                          <span className="font-mono text-sm text-yellow-400">
                            {formatAssetAmount(balance.locked, balance.asset)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-white/10">
                        <span className="text-sm font-medium">Total</span>
                        <div className="text-right">
                          <div className="font-mono text-sm">
                            {formatAssetAmount(balance.total, balance.asset)} {balance.asset}
                          </div>
                          {balance.usdValue && balance.usdValue > 0.01 && (
                            <div className="text-xs text-muted-foreground">{formatCurrency(balance.usdValue)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {getSignificantBalances(exchangeBalance.balances).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No significant balances found</div>
              )}
            </div>
          ))}

          {exchangeBalances.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No connected exchanges found. Connect an exchange to view balances.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
