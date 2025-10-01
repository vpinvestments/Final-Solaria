"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CoinStatsProps {
  stats: {
    marketCap: number
    volume24h: number
    circulatingSupply: number
    totalSupply: number
    maxSupply: number
    allTimeHigh: number
    allTimeLow: number
    marketCapRank: number
  }
}

export function CoinStats({ stats }: CoinStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  const formatSupply = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    return num.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap</span>
              <span className="font-mono">{formatNumber(stats.marketCap)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Volume</span>
              <span className="font-mono">{formatNumber(stats.volume24h)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap Rank</span>
              <span className="font-mono">#{stats.marketCapRank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">All-Time High</span>
              <span className="font-mono">{formatNumber(stats.allTimeHigh)}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Circulating Supply</span>
              <span className="font-mono">{formatSupply(stats.circulatingSupply)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Supply</span>
              <span className="font-mono">{formatSupply(stats.totalSupply)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Supply</span>
              <span className="font-mono">{stats.maxSupply ? formatSupply(stats.maxSupply) : "∞"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">All-Time Low</span>
              <span className="font-mono">{formatNumber(stats.allTimeLow)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
