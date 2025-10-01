"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import Link from "next/link"
import { getTrendingCoins, type TrendingCoin } from "@/lib/crypto-api"

function CoinList({ coins, title, loading }: { coins: TrendingCoin[]; title: string; loading: boolean }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
  }

  return (
    <Card className="glass-panel border-white/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="h-4 w-4 animate-spin text-white/60 mr-2" />
            <span className="text-white/60 text-sm">Loading...</span>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {coins.map((coin, index) => (
              <Link
                key={coin.id}
                href={`/coin/${coin.id}`}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-white/60 w-3 sm:w-4 flex-shrink-0">{index + 1}</span>
                  <img
                    src={coin.image || "/placeholder.svg"}
                    alt={coin.name}
                    className="h-5 w-5 sm:h-6 sm:w-6 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm text-white truncate">{coin.name}</div>
                    <div className="text-xs text-white/60">{coin.symbol}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs sm:text-sm font-mono text-white">{formatPrice(coin.price)}</div>
                  <div
                    className={`text-xs flex items-center justify-end ${coin.change >= 0 ? "text-green-300" : "text-red-300"}`}
                  >
                    {coin.change >= 0 ? (
                      <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    )}
                    {Math.abs(coin.change).toFixed(2)}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function TrendingCoins() {
  const [trendingData, setTrendingData] = useState<{
    trending: TrendingCoin[]
    topGainers: TrendingCoin[]
    topLosers: TrendingCoin[]
  }>({
    trending: [],
    topGainers: [],
    topLosers: [],
  })
  const [loading, setLoading] = useState(true)

  const fetchTrendingData = async () => {
    setLoading(true)
    try {
      const data = await getTrendingCoins()
      setTrendingData(data)
    } catch (error) {
      console.error("Failed to fetch trending data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendingData()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchTrendingData, 300000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      <CoinList coins={trendingData.trending} title="🔥 Trending" loading={loading} />
      <CoinList coins={trendingData.topGainers} title="📈 Top Gainers" loading={loading} />
      <CoinList coins={trendingData.topLosers} title="📉 Top Losers" loading={loading} />
    </div>
  )
}
