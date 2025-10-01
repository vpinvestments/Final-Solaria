"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Activity, RefreshCw } from "lucide-react"
import { getGlobalMarketStats, type GlobalMarketStats } from "@/lib/crypto-api"

export function MarketStats() {
  const [marketStats, setMarketStats] = useState<GlobalMarketStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMarketStats = async () => {
    setLoading(true)
    try {
      const stats = await getGlobalMarketStats()
      setMarketStats(stats)
    } catch (error) {
      console.error("Failed to fetch market stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketStats()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchMarketStats, 300000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    }
    return `$${value.toLocaleString()}`
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString()
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  if (loading && !marketStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="glass-panel border-white/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-white/60" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!marketStats) return null

  const stats = [
    {
      title: "Total Market Cap",
      value: formatCurrency(marketStats.totalMarketCap),
      change: `${marketStats.marketCapChange24h >= 0 ? "+" : ""}${marketStats.marketCapChange24h.toFixed(2)}%`,
      isPositive: marketStats.marketCapChange24h >= 0,
      icon: DollarSign,
    },
    {
      title: "24h Volume",
      value: formatCurrency(marketStats.totalVolume),
      change: `${marketStats.volumeChange24h >= 0 ? "+" : ""}${marketStats.volumeChange24h.toFixed(2)}%`,
      isPositive: marketStats.volumeChange24h >= 0,
      icon: Activity,
    },
    {
      title: "Bitcoin Dominance",
      value: formatPercentage(marketStats.bitcoinDominance),
      change: "Live",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Active Cryptocurrencies",
      value: formatNumber(marketStats.activeCryptocurrencies),
      change: "Live",
      isPositive: true,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className={`glass-panel floating-element border-white/30 hover:scale-105 transition-all duration-300 ${index % 2 === 0 ? "animate-delay-100" : "animate-delay-200"}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">{stat.title}</CardTitle>
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white drop-shadow-lg">{stat.value}</div>
              <div className={`text-xs flex items-center mt-2 ${stat.isPositive ? "text-green-300" : "text-red-300"}`}>
                {stat.change !== "Live" && (
                  <>
                    {stat.isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                  </>
                )}
                <span className="font-medium">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
