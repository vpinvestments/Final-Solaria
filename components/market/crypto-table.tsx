"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, TrendingDown, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { getTopCryptocurrencies, type CryptoCurrency } from "@/lib/crypto-api"

export function CryptoTable() {
  const [cryptoData, setCryptoData] = useState<CryptoCurrency[]>([])
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [displayLimit, setDisplayLimit] = useState(20)
  const [isExpanded, setIsExpanded] = useState(false)

  const fetchCryptoData = async () => {
    setLoading(true)
    try {
      const data = await getTopCryptocurrencies(100)
      setCryptoData(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch crypto data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleToggleExpand = () => {
    if (isExpanded) {
      setDisplayLimit(20)
      setIsExpanded(false)
    } else {
      setDisplayLimit(100)
      setIsExpanded(true)
    }
  }

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`
    }
    return `$${volume.toLocaleString()}`
  }

  const displayedData = cryptoData.slice(0, displayLimit)
  const hasMoreData = cryptoData.length > displayLimit

  return (
    <Card className="glass-panel border-white/30 shadow-2xl">
      <CardHeader className="border-b border-white/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl text-white drop-shadow-lg">
            Top Cryptocurrencies
            <span className="text-sm font-normal text-white/60 ml-2">
              (Showing {displayedData.length} of {cryptoData.length})
            </span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {lastUpdated && <span className="text-xs text-white/60">Updated: {lastUpdated.toLocaleTimeString()}</span>}
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchCryptoData}
              disabled={loading}
              className="h-8 w-8 hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 text-white ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading && cryptoData.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin text-white/60 mr-2" />
            <span className="text-white/60">Loading cryptocurrency data...</span>
          </div>
        ) : (
          <>
            <div className="block sm:hidden">
              <div className="space-y-3 p-4">
                {displayedData.map((crypto) => (
                  <div
                    key={crypto.id}
                    className="glass-panel border-white/20 rounded-xl p-4 hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Link href={`/coin/${crypto.id}`} className="flex items-center space-x-3 flex-1">
                        <img
                          src={crypto.image || "/placeholder.svg"}
                          alt={crypto.name}
                          className="h-8 w-8 rounded-full shadow-lg"
                        />
                        <div>
                          <div className="font-medium text-white text-sm">{crypto.name}</div>
                          <div className="text-xs text-white/60">{crypto.symbol}</div>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/20 transition-all duration-300"
                        onClick={() => toggleWatchlist(crypto.id)}
                      >
                        <Star
                          className={`h-4 w-4 transition-all duration-300 ${
                            watchlist.includes(crypto.id)
                              ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                              : "text-white/60"
                          }`}
                        />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-white/60 text-xs">Price</div>
                        <div className="font-mono text-white font-medium">{formatPrice(crypto.price)}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">24h Change</div>
                        <div
                          className={`flex items-center font-medium ${crypto.change24h >= 0 ? "text-green-300" : "text-red-300"}`}
                        >
                          {crypto.change24h >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(crypto.change24h).toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">Market Cap</div>
                        <div className="font-mono text-white/90 text-sm">{formatVolume(crypto.marketCap)}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">Volume</div>
                        <div className="font-mono text-white/90 text-sm">{formatVolume(crypto.volume24h)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-12"></th>
                    <th className="w-12">#</th>
                    <th>Name</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">24h %</th>
                    <th className="text-right hidden lg:table-cell">7d %</th>
                    <th className="text-right hidden xl:table-cell">Market Cap</th>
                    <th className="text-right hidden xl:table-cell">Volume (24h)</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData.map((crypto) => (
                    <tr key={crypto.id} className="hover:bg-white/10 transition-all duration-300 group">
                      <td>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/20 transition-all duration-300"
                          onClick={() => toggleWatchlist(crypto.id)}
                        >
                          <Star
                            className={`h-4 w-4 transition-all duration-300 ${
                              watchlist.includes(crypto.id)
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                                : "text-white/60 group-hover:text-white/80"
                            }`}
                          />
                        </Button>
                      </td>
                      <td className="font-medium text-white/80">{crypto.rank}</td>
                      <td>
                        <Link
                          href={`/coin/${crypto.id}`}
                          className="flex items-center space-x-3 hover:text-white transition-all duration-300 group-hover:scale-105"
                        >
                          <div className="relative">
                            <img
                              src={crypto.image || "/placeholder.svg"}
                              alt={crypto.name}
                              className="h-8 w-8 rounded-full shadow-lg"
                            />
                            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div>
                            <div className="font-medium text-white">{crypto.name}</div>
                            <div className="text-sm text-white/60">{crypto.symbol}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="text-right font-mono text-white font-medium">{formatPrice(crypto.price)}</td>
                      <td className="text-right">
                        <div
                          className={`flex items-center justify-end font-medium ${
                            crypto.change24h >= 0 ? "text-green-300" : "text-red-300"
                          }`}
                        >
                          {crypto.change24h >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(crypto.change24h).toFixed(2)}%
                        </div>
                      </td>
                      <td className="text-right hidden lg:table-cell">
                        <div className={`font-medium ${crypto.change7d >= 0 ? "text-green-300" : "text-red-300"}`}>
                          {crypto.change7d >= 0 ? "+" : ""}
                          {crypto.change7d.toFixed(2)}%
                        </div>
                      </td>
                      <td className="text-right font-mono text-white/90 hidden xl:table-cell">
                        {formatVolume(crypto.marketCap)}
                      </td>
                      <td className="text-right font-mono text-white/90 hidden xl:table-cell">
                        {formatVolume(crypto.volume24h)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasMoreData && (
              <div className="flex justify-center p-4 border-t border-white/20">
                <Button
                  variant="ghost"
                  onClick={handleToggleExpand}
                  className="text-white hover:bg-white/20 transition-all duration-300"
                  disabled={loading}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Show More ({cryptoData.length - displayLimit} more)
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
