"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Clock, ExternalLink, AlertTriangle, Target } from "lucide-react"
import {
  getDerivativesExchanges,
  getFuturesData,
  getDerivativesStats,
  type DerivativeExchange,
  type FuturesData,
  type DerivativesStats,
} from "@/lib/derivatives-api"

export default function DerivativesPage() {
  const [exchanges, setExchanges] = useState<DerivativeExchange[]>([])
  const [futures, setFutures] = useState<FuturesData[]>([])
  const [stats, setStats] = useState<DerivativesStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [exchangesData, futuresData, statsData] = await Promise.all([
          getDerivativesExchanges(),
          getFuturesData(),
          getDerivativesStats(),
        ])

        setExchanges(exchangesData)
        setFutures(futuresData)
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching derivatives data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Derivatives Market</h1>
          <p className="text-muted-foreground">
            Comprehensive derivatives data including futures, perpetuals, and options
          </p>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Market Overview Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Open Interest</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalOpenInterest)}</div>
              <p className="text-xs text-muted-foreground">Across all derivatives</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalVolume24h)}</div>
              <p className="text-xs text-muted-foreground">Derivatives trading volume</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Liquidations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.liquidations24h)}</div>
              <p className="text-xs text-muted-foreground">Total liquidated positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Long/Short Ratio</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.longShortRatio * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Long positions ratio</p>
              <Progress value={stats.longShortRatio * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="futures" className="space-y-4">
        <TabsList>
          <TabsTrigger value="futures">Futures & Perpetuals</TabsTrigger>
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          <TabsTrigger value="analytics">Market Analytics</TabsTrigger>
          <TabsTrigger value="funding">Funding Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="futures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Futures & Perpetual Contracts</CardTitle>
              <CardDescription>Real-time data for major cryptocurrency derivatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {futures.map((future) => (
                  <div key={future.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{future.baseAsset}</span>
                      </div>
                      <div>
                        <div className="font-medium">{future.symbol}</div>
                        <div className="text-sm text-muted-foreground">{future.exchange}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(future.price)}</div>
                      <div
                        className={`text-sm flex items-center ${
                          future.change24h >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {future.change24h >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {formatPercentage(future.change24h)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Volume 24h</div>
                      <div className="font-medium">{formatCurrency(future.volume24h)}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Open Interest</div>
                      <div className="font-medium">{formatCurrency(future.openInterest)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchanges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Derivatives Exchanges</CardTitle>
              <CardDescription>Leading platforms for cryptocurrency derivatives trading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exchanges.map((exchange) => (
                  <div key={exchange.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={exchange.image || "/placeholder.svg"}
                        alt={exchange.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{exchange.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {exchange.country} • Est. {exchange.yearEstablished}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Trust Score</div>
                        <div className="font-medium">{exchange.trustScore.toFixed(1)}/10</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">24h Volume</div>
                        <div className="font-medium">{exchange.tradeVolume24hBtc.toFixed(0)} BTC</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Open Interest</div>
                        <div className="font-medium">{exchange.openInterestBtc.toFixed(0)} BTC</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Pairs</div>
                        <div className="font-medium">
                          {exchange.numberOfPerpetualPairs + exchange.numberOfFuturesPairs}
                        </div>
                      </div>

                      {exchange.hasTradingIncentive && <Badge variant="secondary">Incentives</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Dominance</CardTitle>
                  <CardDescription>Derivatives market share by asset</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Bitcoin (BTC)</span>
                      <span>{stats.btcDominance.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.btcDominance} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Ethereum (ETH)</span>
                      <span>{stats.ethDominance.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.ethDominance} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Others</span>
                      <span>{(100 - stats.btcDominance - stats.ethDominance).toFixed(1)}%</span>
                    </div>
                    <Progress value={100 - stats.btcDominance - stats.ethDominance} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Long/Short Analysis</CardTitle>
                  <CardDescription>Current market sentiment distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-green-600">Long Positions</span>
                      <span>{(stats.longShortRatio * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.longShortRatio * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-red-600">Short Positions</span>
                      <span>{((1 - stats.longShortRatio) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(1 - stats.longShortRatio) * 100} className="h-2" />
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Market Sentiment:{" "}
                      {stats.longShortRatio > 0.6 ? "Bullish" : stats.longShortRatio < 0.4 ? "Bearish" : "Neutral"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="funding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funding Rates</CardTitle>
              <CardDescription>Current funding rates for perpetual contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {futures.map((future) => (
                  <div
                    key={`${future.symbol}-funding`}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{future.baseAsset}</span>
                      </div>
                      <div>
                        <div className="font-medium">{future.symbol}</div>
                        <div className="text-sm text-muted-foreground">{future.exchange}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Funding Rate</div>
                      <div className={`font-medium ${future.fundingRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatPercentage(future.fundingRate * 100)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Next Funding</div>
                      <div className="font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(future.nextFundingTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">8h Rate</div>
                      <div className="font-medium">{formatPercentage(future.fundingRate * 100 * 3)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
