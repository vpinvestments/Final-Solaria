const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

export interface CryptoCurrency {
  id: string
  rank: number
  name: string
  symbol: string
  price: number
  change24h: number
  change7d: number
  volume24h: number
  marketCap: number
  image: string
}

export interface MarketStats {
  totalMarketCap: number
  totalVolume: number
  bitcoinDominance: number
  activeCryptocurrencies: number
  marketCapChange24h: number
  volumeChange24h: number
}

export interface TrendingCoin {
  id: string
  name: string
  symbol: string
  price: number
  change: number
  image: string
}

// Fetch top cryptocurrencies
export async function getTopCryptocurrencies(limit = 100): Promise<CryptoCurrency[]> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h,7d`,
      { next: { revalidate: 60 } }, // Cache for 1 minute
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return data.map((coin: any, index: number) => ({
      id: coin.id,
      rank: coin.market_cap_rank || index + 1,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price || 0,
      change24h: coin.price_change_percentage_24h || 0,
      change7d: coin.price_change_percentage_7d_in_currency || 0,
      volume24h: coin.total_volume || 0,
      marketCap: coin.market_cap || 0,
      image: coin.image || "/placeholder.svg",
    }))
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error)
    // Return fallback data if API fails
    return getFallbackCryptoData()
  }
}

// Fetch global market statistics
export async function getGlobalMarketStats(): Promise<MarketStats> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/global`,
      { next: { revalidate: 300 } }, // Cache for 5 minutes
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const global = data.data

    return {
      totalMarketCap: global.total_market_cap?.usd || 0,
      totalVolume: global.total_volume?.usd || 0,
      bitcoinDominance: global.market_cap_percentage?.btc || 0,
      activeCryptocurrencies: global.active_cryptocurrencies || 0,
      marketCapChange24h: global.market_cap_change_percentage_24h_usd || 0,
      volumeChange24h: 0, // Not available in this endpoint
    }
  } catch (error) {
    console.error("Error fetching global market stats:", error)
    return getFallbackMarketStats()
  }
}

// Fetch trending cryptocurrencies
export async function getTrendingCoins(): Promise<{
  trending: TrendingCoin[]
  topGainers: TrendingCoin[]
  topLosers: TrendingCoin[]
}> {
  try {
    // Get trending coins
    const trendingResponse = await fetch(`${COINGECKO_BASE_URL}/search/trending`, { next: { revalidate: 300 } })

    // Get top gainers and losers from market data
    const marketResponse = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`,
      { next: { revalidate: 60 } },
    )

    if (!trendingResponse.ok || !marketResponse.ok) {
      throw new Error("API request failed")
    }

    const trendingData = await trendingResponse.json()
    const marketData = await marketResponse.json()

    // Process trending coins
    const trending: TrendingCoin[] = trendingData.coins.slice(0, 3).map((item: any) => ({
      id: item.item.id,
      name: item.item.name,
      symbol: item.item.symbol.toUpperCase(),
      price: item.item.data?.price || 0,
      change: item.item.data?.price_change_percentage_24h?.usd || 0,
      image: item.item.large || "/placeholder.svg",
    }))

    // Process top gainers (positive changes)
    const gainers = marketData.filter((coin: any) => coin.price_change_percentage_24h > 0).slice(0, 3)

    const topGainers: TrendingCoin[] = gainers.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price || 0,
      change: coin.price_change_percentage_24h || 0,
      image: coin.image || "/placeholder.svg",
    }))

    // Process top losers (negative changes)
    const losers = marketData
      .filter((coin: any) => coin.price_change_percentage_24h < 0)
      .sort((a: any, b: any) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 3)

    const topLosers: TrendingCoin[] = losers.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price || 0,
      change: coin.price_change_percentage_24h || 0,
      image: coin.image || "/placeholder.svg",
    }))

    return { trending, topGainers, topLosers }
  } catch (error) {
    console.error("Error fetching trending coins:", error)
    return getFallbackTrendingData()
  }
}

// Search functionality for cryptocurrencies
export async function searchCryptocurrencies(query: string): Promise<CryptoCurrency[]> {
  if (!query.trim()) return []

  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(query)}`,
      { next: { revalidate: 300 } }, // Cache for 5 minutes
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Get detailed data for the search results
    if (data.coins && data.coins.length > 0) {
      const coinIds = data.coins
        .slice(0, 10)
        .map((coin: any) => coin.id)
        .join(",")

      const detailResponse = await fetch(
        `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`,
        { next: { revalidate: 60 } },
      )

      if (detailResponse.ok) {
        const detailData = await detailResponse.json()

        return detailData.map((coin: any, index: number) => ({
          id: coin.id,
          rank: coin.market_cap_rank || index + 1,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price || 0,
          change24h: coin.price_change_percentage_24h || 0,
          change7d: 0, // Not available in this endpoint
          volume24h: coin.total_volume || 0,
          marketCap: coin.market_cap || 0,
          image: coin.image || "/placeholder.svg",
        }))
      }
    }

    return []
  } catch (error) {
    console.error("Error searching cryptocurrencies:", error)
    return []
  }
}

// Fallback data in case API fails
function getFallbackCryptoData(): CryptoCurrency[] {
  return [
    {
      id: "bitcoin",
      rank: 1,
      name: "Bitcoin",
      symbol: "BTC",
      price: 67234.56,
      change24h: 2.34,
      change7d: -1.23,
      volume24h: 28500000000,
      marketCap: 1320000000000,
      image: "/bitcoin-concept.png",
    },
    {
      id: "ethereum",
      rank: 2,
      name: "Ethereum",
      symbol: "ETH",
      price: 3456.78,
      change24h: -0.87,
      change7d: 4.56,
      volume24h: 15200000000,
      marketCap: 415000000000,
      image: "/ethereum-abstract.png",
    },
  ]
}

function getFallbackMarketStats(): MarketStats {
  return {
    totalMarketCap: 2450000000000,
    totalVolume: 89200000000,
    bitcoinDominance: 52.3,
    activeCryptocurrencies: 13247,
    marketCapChange24h: 2.34,
    volumeChange24h: -1.23,
  }
}

function getFallbackTrendingData() {
  return {
    trending: [
      {
        id: "pepe",
        name: "Pepe",
        symbol: "PEPE",
        price: 0.00001234,
        change: 45.67,
        image: "/stylized-green-character.png",
      },
    ],
    topGainers: [
      {
        id: "arbitrum",
        name: "Arbitrum",
        symbol: "ARB",
        price: 1.23,
        change: 34.56,
        image: "/arbitrum-abstract.png",
      },
    ],
    topLosers: [
      {
        id: "terra-luna",
        name: "Terra Luna Classic",
        symbol: "LUNC",
        price: 0.000123,
        change: -15.67,
        image: "/terra.jpg",
      },
    ],
  }
}
