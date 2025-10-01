import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, TrendingDown, Globe, FileText } from "lucide-react"
import { PriceChart } from "@/components/coin/price-chart"
import { CoinStats } from "@/components/coin/coin-stats"
import { TradingPanel } from "@/components/coin/trading-panel"

async function getCoinData(id: string) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      { next: { revalidate: 300 } }, // Cache for 5 minutes
    )

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching coin data:", error)
    return null
  }
}

export default async function CoinPage({ params }: { params: { id: string } }) {
  const coinData = await getCoinData(params.id)

  if (!coinData) {
    notFound()
  }

  const coin = {
    id: coinData.id,
    name: coinData.name,
    symbol: coinData.symbol?.toUpperCase(),
    price: coinData.market_data?.current_price?.usd || 0,
    change24h: coinData.market_data?.price_change_percentage_24h || 0,
    change7d: coinData.market_data?.price_change_percentage_7d || 0,
    volume24h: coinData.market_data?.total_volume?.usd || 0,
    marketCap: coinData.market_data?.market_cap?.usd || 0,
    image: coinData.image?.large || coinData.image?.small,
    description: coinData.description?.en || "No description available.",
    website: coinData.links?.homepage?.[0],
    whitepaper: coinData.links?.whitepaper,
    stats: {
      marketCap: coinData.market_data?.market_cap?.usd || 0,
      volume24h: coinData.market_data?.total_volume?.usd || 0,
      circulatingSupply: coinData.market_data?.circulating_supply || 0,
      totalSupply: coinData.market_data?.total_supply || 0,
      maxSupply: coinData.market_data?.max_supply || 0,
      allTimeHigh: coinData.market_data?.ath?.usd || 0,
      allTimeLow: coinData.market_data?.atl?.usd || 0,
      marketCapRank: coinData.market_cap_rank || 0,
    },
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
  }

  const cleanDescription =
    coin.description.replace(/<[^>]*>/g, "").substring(0, 500) + (coin.description.length > 500 ? "..." : "")

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <img
            src={coin.image || "/placeholder.svg"}
            alt={coin.name}
            className="h-12 w-12 rounded-full self-start sm:self-center"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-balance">{coin.name}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{coin.symbol}</Badge>
                {coin.stats.marketCapRank > 0 && <Badge variant="outline">Rank #{coin.stats.marketCapRank}</Badge>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono">{formatPrice(coin.price)}</span>
              <div className={`flex items-center space-x-1 ${coin.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                {coin.change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-medium">{Math.abs(coin.change24h).toFixed(2)}%</span>
                <span className="text-muted-foreground text-sm">(24h)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 self-start lg:self-center">
          <Button variant="outline" size="icon" className="flex-shrink-0 bg-transparent">
            <Star className="h-4 w-4" />
          </Button>
          {coin.website && (
            <Button variant="outline" asChild className="text-sm bg-transparent">
              <a href={coin.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Website</span>
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <PriceChart coinId={coin.id} />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">About {coin.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">{cleanDescription}</p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                {coin.website && (
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto bg-transparent">
                    <a href={coin.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-3 w-3 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {coin.whitepaper && (
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto bg-transparent">
                    <a href={coin.whitepaper} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-3 w-3 mr-2" />
                      Whitepaper
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 order-1 lg:order-2">
          <TradingPanel coinSymbol={coin.symbol} currentPrice={coin.price} />
          <CoinStats stats={coin.stats} />
        </div>
      </div>
    </div>
  )
}
