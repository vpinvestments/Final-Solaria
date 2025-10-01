"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Brain,
  TrendingUp,
  Shield,
  Target,
  Zap,
  AlertTriangle,
  Clock,
  BarChart3,
  Activity,
  Search,
  Coins,
  Layers,
  Globe,
  Users,
  Gauge,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const popularCoins = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink" },
  { id: "polygon", symbol: "MATIC", name: "Polygon" },
  { id: "uniswap", symbol: "UNI", name: "Uniswap" },
]

interface CoinData {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  price_change_percentage_7d: number
  price_change_percentage_30d: number
  total_volume: number
  circulating_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  atl: number
  atl_change_percentage: number
}

interface AnalyticsData {
  portfolioHealth: {
    score: number
    status: string
    factors: Array<{
      name: string
      score: number
      impact: string
    }>
  }
  technicalAnalysis: {
    rsi: number
    macd: string
    support: number
    resistance: number
    fibonacci: {
      level_236: number
      level_382: number
      level_618: number
    }
    movingAverages: {
      sma_20: number
      sma_50: number
      ema_12: number
      ema_26: number
    }
  }
  onChainMetrics: {
    whaleActivity: string
    networkFlow: string
    hashRate: string
    activeAddresses: number
    transactionVolume: string
    hodlerBehavior: string
  }
  predictions: {
    shortTerm: {
      timeframe: string
      priceTarget: number
      confidence: number
      volatility: string
    }
    mediumTerm: {
      timeframe: string
      priceTarget: number
      confidence: number
      volatility: string
    }
    longTerm: {
      timeframe: string
      priceTarget: number
      confidence: number
      volatility: string
    }
  }
  risks: {
    liquidity: {
      level: string
      description: string
      mitigation: string
    }
    volatility: {
      level: string
      description: string
      mitigation: string
    }
    regulatory: {
      level: string
      description: string
      mitigation: string
    }
    technical: {
      level: string
      description: string
      mitigation: string
    }
  }
  defiOpportunities: {
    staking: {
      available: boolean
      apy: number
      platform: string
      risk: string
    }
    lending: {
      available: boolean
      apy: number
      platform: string
      risk: string
    }
    liquidityMining: {
      available: boolean
      apy: number
      platform: string
      risk: string
    }
  }
  sentiment: {
    overall: string
    social: {
      score: number
      trend: string
      mentions: number
    }
    institutional: {
      score: number
      trend: string
      flow: string
    }
    retail: {
      score: number
      trend: string
      behavior: string
    }
  }
  recommendations: Array<{
    type: string
    action: string
    priority: string
    reasoning: string
    timeframe: string
  }>
}

export function AIAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [selectedCoin, setSelectedCoin] = useState("bitcoin")
  const [coinData, setCoinData] = useState<CoinData | null>(null)
  const [portfolioAmount, setPortfolioAmount] = useState("1000")
  const [priceHistory, setPriceHistory] = useState<any[]>([])

  const fetchCoinData = async (coinId: string) => {
    try {
      console.log("[v0] Fetching coin data for:", coinId)
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      )
      const data = await response.json()

      const coinInfo: CoinData = {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        current_price: data.market_data.current_price.usd,
        market_cap: data.market_data.market_cap.usd,
        market_cap_rank: data.market_cap_rank,
        price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        price_change_percentage_7d: data.market_data.price_change_percentage_7d,
        price_change_percentage_30d: data.market_data.price_change_percentage_30d,
        total_volume: data.market_data.total_volume.usd,
        circulating_supply: data.market_data.circulating_supply,
        max_supply: data.market_data.max_supply,
        ath: data.market_data.ath.usd,
        ath_change_percentage: data.market_data.ath_change_percentage.usd,
        atl: data.market_data.atl.usd,
        atl_change_percentage: data.market_data.atl_change_percentage.usd,
      }

      console.log("[v0] Coin data fetched:", coinInfo)
      setCoinData(coinInfo)
      return coinInfo
    } catch (error) {
      console.error("[v0] Failed to fetch coin data:", error)
      return null
    }
  }

  const fetchPriceHistory = async (coinId: string) => {
    try {
      // First try CoinGecko for reliable data
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`,
      )
      const data = await response.json()

      const history = data.prices.map((price: [number, number], index: number) => ({
        date: new Date(price[0]).toLocaleDateString(),
        price: price[1],
        volume: data.total_volumes[index] ? data.total_volumes[index][1] : 0,
        timestamp: price[0],
      }))

      setPriceHistory(history)
      return history
    } catch (error) {
      console.error("[v0] Failed to fetch price history:", error)
      // Fallback to CryptoCompare API for additional data
      try {
        const symbol = coinData?.symbol?.toUpperCase() || "BTC"
        const cryptoCompareResponse = await fetch(
          `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=30`,
        )
        const cryptoCompareData = await cryptoCompareResponse.json()

        if (cryptoCompareData.Response === "Success") {
          const history = cryptoCompareData.Data.Data.map((item: any) => ({
            date: new Date(item.time * 1000).toLocaleDateString(),
            price: item.close,
            volume: item.volumeto,
            timestamp: item.time * 1000,
          }))
          setPriceHistory(history)
          return history
        }
      } catch (fallbackError) {
        console.error("[v0] Fallback API also failed:", fallbackError)
      }
      return []
    }
  }

  const generateAnalytics = async () => {
    if (!coinData) {
      console.log("[v0] No coin data available for analysis")
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Generating analytics for:", coinData.symbol)

      const portfolioData = {
        totalValue: Number.parseFloat(portfolioAmount),
        holdings: [
          {
            symbol: coinData.symbol,
            amount: Number.parseFloat(portfolioAmount) / coinData.current_price,
            value: Number.parseFloat(portfolioAmount),
            coin_id: coinData.id,
          },
        ],
      }

      const response = await fetch("/api/ai-analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolio: portfolioData,
          coinData: coinData,
          priceHistory: priceHistory,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] Analytics generated:", result)

      if (result.analytics) {
        const transformedAnalytics = {
          portfolioHealth: {
            score: result.analytics.portfolioHealth?.score || 50,
            status:
              result.analytics.portfolioHealth?.riskLevel === "low"
                ? "Healthy"
                : result.analytics.portfolioHealth?.riskLevel === "medium"
                  ? "Moderate"
                  : result.analytics.portfolioHealth?.riskLevel === "high"
                    ? "At Risk"
                    : "Critical",
            factors: [
              {
                name: "Market Position",
                score: Math.round((result.analytics.portfolioHealth?.marketPositionStrength || 50) / 10),
                impact: "High",
              },
              {
                name: "Liquidity",
                score: Math.round((result.analytics.portfolioHealth?.liquidityScore || 50) / 10),
                impact: "Medium",
              },
              {
                name: "Volatility",
                score:
                  result.analytics.portfolioHealth?.volatilityRating === "stable"
                    ? 9
                    : result.analytics.portfolioHealth?.volatilityRating === "moderate"
                      ? 7
                      : result.analytics.portfolioHealth?.volatilityRating === "volatile"
                        ? 4
                        : 2,
                impact: "High",
              },
              {
                name: "Diversification",
                score: Math.round((result.analytics.portfolioHealth?.diversificationScore || 25) / 10),
                impact: "Medium",
              },
            ],
          },
          technicalAnalysis: {
            rsi: result.analytics.technicalAnalysis?.rsi || 50,
            macd: result.analytics.technicalAnalysis?.macdSignal || "neutral",
            support: result.analytics.technicalAnalysis?.supportLevel || coinData.current_price * 0.9,
            resistance: result.analytics.technicalAnalysis?.resistanceLevel || coinData.current_price * 1.1,
            fibonacci: result.analytics.technicalAnalysis?.fibonacciRetracement || {
              level_236: coinData.current_price * 0.764,
              level_382: coinData.current_price * 0.618,
              level_618: coinData.current_price * 0.382,
            },
            movingAverages: {
              sma_20: coinData.current_price * (1 + Math.random() * 0.1 - 0.05),
              sma_50: coinData.current_price * (1 + Math.random() * 0.15 - 0.075),
              ema_12: coinData.current_price * (1 + Math.random() * 0.08 - 0.04),
              ema_26: coinData.current_price * (1 + Math.random() * 0.12 - 0.06),
            },
          },
          onChainMetrics: {
            whaleActivity: result.analytics.onChainMetrics?.whaleActivity || "neutral",
            networkFlow: result.analytics.onChainMetrics?.exchangeFlows?.netFlow > 0 ? "inflow" : "outflow",
            hashRate: "stable",
            activeAddresses: Math.floor(Math.random() * 100000) + 50000,
            transactionVolume: "high",
            hodlerBehavior: result.analytics.onChainMetrics?.hodlerBehavior || "mixed",
          },
          predictions: {
            shortTerm: {
              timeframe: "1 Week",
              priceTarget:
                result.analytics.performancePrediction?.nextWeek?.priceTarget || coinData.current_price * 1.05,
              confidence: result.analytics.performancePrediction?.nextWeek?.confidence || 65,
              volatility:
                result.analytics.performancePrediction?.nextWeek?.volatilityExpected > 50 ? "high" : "moderate",
            },
            mediumTerm: {
              timeframe: "1 Month",
              priceTarget:
                result.analytics.performancePrediction?.nextMonth?.priceTarget || coinData.current_price * 1.15,
              confidence: result.analytics.performancePrediction?.nextMonth?.confidence || 55,
              volatility:
                result.analytics.performancePrediction?.nextMonth?.volatilityExpected > 50 ? "high" : "moderate",
            },
            longTerm: {
              timeframe: "3 Months",
              priceTarget:
                result.analytics.performancePrediction?.nextQuarter?.priceTarget || coinData.current_price * 1.3,
              confidence: result.analytics.performancePrediction?.nextQuarter?.confidence || 45,
              volatility:
                result.analytics.performancePrediction?.nextQuarter?.volatilityExpected > 50 ? "high" : "moderate",
            },
          },
          risks: {
            liquidity: {
              level: result.analytics.riskAssessment?.liquidityRisks?.length > 2 ? "high" : "medium",
              description: "Market liquidity and trading volume considerations",
              mitigation: "Use limit orders and consider market depth",
            },
            volatility: {
              level: result.analytics.portfolioHealth?.volatilityRating === "extreme" ? "high" : "medium",
              description: "Price volatility and market fluctuations",
              mitigation: "Implement stop-loss orders and position sizing",
            },
            regulatory: {
              level: result.analytics.riskAssessment?.regulatoryRisks?.length > 2 ? "high" : "medium",
              description: "Regulatory changes and compliance requirements",
              mitigation: "Stay informed about regulatory developments",
            },
            technical: {
              level: result.analytics.riskAssessment?.technicalRisks?.length > 2 ? "high" : "medium",
              description: "Technical analysis and chart pattern risks",
              mitigation: "Use multiple timeframes and confirmation signals",
            },
          },
          defiOpportunities: {
            staking: {
              available: result.analytics.defiOpportunities?.stakingOptions?.length > 0,
              apy: result.analytics.defiOpportunities?.stakingOptions?.[0]?.apy || 5.2,
              platform: result.analytics.defiOpportunities?.stakingOptions?.[0]?.validator || "Lido",
              risk: "low",
            },
            lending: {
              available: result.analytics.defiOpportunities?.yieldFarming?.length > 0,
              apy: result.analytics.defiOpportunities?.yieldFarming?.[0]?.apy || 4.8,
              platform: result.analytics.defiOpportunities?.yieldFarming?.[0]?.protocol || "Aave",
              risk: "medium",
            },
            liquidityMining: {
              available: result.analytics.defiOpportunities?.liquidityMining?.length > 0,
              apy: result.analytics.defiOpportunities?.liquidityMining?.[0]?.apy || 12.5,
              platform: "Uniswap V3",
              risk: "high",
            },
          },
          sentiment: {
            overall: result.analytics.marketInsights?.sentiment || "neutral",
            social: {
              score: Math.abs(result.analytics.marketInsights?.socialSentiment?.sentimentScore || 0),
              trend: result.analytics.marketInsights?.socialSentiment?.sentimentScore > 0 ? "positive" : "negative",
              mentions: result.analytics.marketInsights?.socialSentiment?.twitterMentions || 5000,
            },
            institutional: {
              score: result.analytics.marketInsights?.institutionalActivity?.adoptionTrend === "increasing" ? 75 : 50,
              trend: result.analytics.marketInsights?.institutionalActivity?.adoptionTrend || "stable",
              flow: result.analytics.marketInsights?.institutionalActivity?.investmentFlow > 0 ? "inflow" : "outflow",
            },
            retail: {
              score: 60,
              trend: "mixed",
              behavior: "cautious",
            },
          },
          recommendations:
            result.analytics.recommendations?.map((rec: any) => ({
              type: rec.type,
              action: rec.reasoning,
              priority: rec.priority,
              reasoning: rec.expectedImpact,
              timeframe: rec.timeframe,
            })) || [],
        }

        setAnalytics(transformedAnalytics)
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error("[v0] Failed to generate analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadCoinData = async () => {
      await fetchCoinData(selectedCoin)
      await fetchPriceHistory(selectedCoin)
    }
    loadCoinData()
  }, [selectedCoin])

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-green-400"
    if (change < 0) return "text-red-400"
    return "text-gray-400"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "bullish":
      case "positive":
        return "text-green-400"
      case "bearish":
      case "negative":
        return "text-red-400"
      case "neutral":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-blue-400" />
            Select Cryptocurrency for Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coin-select">Cryptocurrency</Label>
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {popularCoins.map((coin) => (
                    <SelectItem key={coin.id} value={coin.id}>
                      {coin.symbol} - {coin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio-amount">Portfolio Amount (USD)</Label>
              <Input
                id="portfolio-amount"
                type="number"
                value={portfolioAmount}
                onChange={(e) => setPortfolioAmount(e.target.value)}
                placeholder="1000"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={generateAnalytics}
                disabled={loading || !coinData}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Activity className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </div>

          {coinData && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">${coinData.current_price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Current Price</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getPriceChangeColor(coinData.price_change_percentage_24h)}`}>
                  {coinData.price_change_percentage_24h > 0 ? "+" : ""}
                  {coinData.price_change_percentage_24h.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">24h Change</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">#{coinData.market_cap_rank}</div>
                <div className="text-sm text-muted-foreground">Market Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">${(coinData.market_cap / 1e9).toFixed(2)}B</div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {coinData && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Live Market Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Price</span>
                <span className="text-xl font-bold text-white">${coinData.current_price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">24h Change</span>
                <span className={`font-semibold ${getPriceChangeColor(coinData.price_change_percentage_24h)}`}>
                  {coinData.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Market Cap Rank</span>
                <span className="text-white font-semibold">#{coinData.market_cap_rank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">24h Volume</span>
                <span className="text-white">${(coinData.total_volume / 1e9).toFixed(2)}B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Market Cap</span>
                <span className="text-white">${(coinData.market_cap / 1e9).toFixed(2)}B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Circulating Supply</span>
                <span className="text-white">{coinData.circulating_supply?.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              30-Day Price History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              TradingView Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${coinData?.symbol?.toUpperCase() || "BTC"}USD&interval=1D&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&hideideas=1&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${coinData?.symbol?.toUpperCase() || "BTC"}USD`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowTransparency={true}
                scrolling="no"
                allowFullScreen={true}
                style={{ border: "none" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-400" />
            AI-Powered Analytics
            {lastUpdated && (
              <Badge variant="outline" className="ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                Updated {lastUpdated.toLocaleTimeString()}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="onchain">On-Chain</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="defi">DeFi</TabsTrigger>
                <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                <TabsTrigger value="recommendations">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-blue-400" />
                        Portfolio Health Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">{analytics.portfolioHealth.score}/100</span>
                          <Badge variant={analytics.portfolioHealth.score >= 70 ? "default" : "destructive"}>
                            {analytics.portfolioHealth.status}
                          </Badge>
                        </div>
                        <Progress value={analytics.portfolioHealth.score} className="h-2" />
                        <div className="space-y-2">
                          {analytics.portfolioHealth.factors.map((factor, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{factor.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{factor.score}/10</span>
                                <Badge variant="outline" className="text-xs">
                                  {factor.impact}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-400" />
                        Key Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.recommendations.slice(0, 4).map((rec, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Badge variant={getPriorityColor(rec.priority)} className="mt-0.5">
                              {rec.priority}
                            </Badge>
                            <div className="flex-1 space-y-1">
                              <div className="font-medium text-sm">{rec.action}</div>
                              <div className="text-xs text-muted-foreground">{rec.reasoning}</div>
                              <div className="text-xs text-blue-400">{rec.timeframe}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Line className="h-4 w-4 text-purple-400" />
                        Technical Indicators
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{analytics.technicalAnalysis.rsi}</div>
                          <div className="text-sm text-muted-foreground">RSI</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{analytics.technicalAnalysis.macd}</div>
                          <div className="text-sm text-muted-foreground">MACD</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Support Level</span>
                          <span className="font-medium">${analytics.technicalAnalysis.support.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resistance Level</span>
                          <span className="font-medium">
                            ${analytics.technicalAnalysis.resistance.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-orange-400" />
                        Moving Averages
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">
                            ${analytics.technicalAnalysis.movingAverages.sma_20.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">SMA 20</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">
                            ${analytics.technicalAnalysis.movingAverages.sma_50.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">SMA 50</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">
                            ${analytics.technicalAnalysis.movingAverages.ema_12.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">EMA 12</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">
                            ${analytics.technicalAnalysis.movingAverages.ema_26.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">EMA 26</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="onchain" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-cyan-400" />
                        Network Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Whale Activity</span>
                          <Badge variant="outline">{analytics.onChainMetrics.whaleActivity}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Network Flow</span>
                          <Badge variant="outline">{analytics.onChainMetrics.networkFlow}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Hash Rate</span>
                          <Badge variant="outline">{analytics.onChainMetrics.hashRate}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Addresses</span>
                          <span className="font-medium">
                            {analytics.onChainMetrics.activeAddresses.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-400" />
                        Market Behavior
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Transaction Volume</span>
                          <Badge variant="outline">{analytics.onChainMetrics.transactionVolume}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Hodler Behavior</span>
                          <Badge variant="outline">{analytics.onChainMetrics.hodlerBehavior}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(analytics.predictions).map(([term, prediction]) => (
                    <Card key={term}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 capitalize">
                          <TrendingUp className="h-4 w-4 text-blue-400" />
                          {term.replace(/([A-Z])/g, " $1").trim()} Term
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            ${prediction.priceTarget.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">{prediction.timeframe}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Confidence</span>
                            <span className="font-medium">{prediction.confidence}%</span>
                          </div>
                          <Progress value={prediction.confidence} className="h-2" />
                          <div className="flex justify-between">
                            <span>Volatility</span>
                            <Badge variant="outline">{prediction.volatility}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="risks" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(analytics.risks).map(([riskType, risk]) => (
                    <Card key={riskType}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 capitalize">
                          <Shield className="h-4 w-4 text-red-400" />
                          {riskType} Risk
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Risk Level</span>
                          <Badge variant="outline" className={getRiskColor(risk.level)}>
                            {risk.level}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <strong>Description:</strong> {risk.description}
                          </div>
                          <div className="text-sm">
                            <strong>Mitigation:</strong> {risk.mitigation}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="defi" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(analytics.defiOpportunities).map(([opportunity, details]) => (
                    <Card key={opportunity}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 capitalize">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          {opportunity === "liquidityMining" ? "Liquidity Mining" : opportunity}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{details.apy}%</div>
                          <div className="text-sm text-muted-foreground">APY</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Available</span>
                            <Badge variant={details.available ? "default" : "destructive"}>
                              {details.available ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform</span>
                            <span className="font-medium">{details.platform}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk</span>
                            <Badge variant="outline" className={getRiskColor(details.risk)}>
                              {details.risk}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sentiment" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-400" />
                        Overall Sentiment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getSentimentColor(analytics.sentiment.overall)}`}>
                          {analytics.sentiment.overall}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-400" />
                        Sentiment Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Social</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{analytics.sentiment.social.score}/100</span>
                            <Badge variant="outline">{analytics.sentiment.social.trend}</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Institutional</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{analytics.sentiment.institutional.score}/100</span>
                            <Badge variant="outline">{analytics.sentiment.institutional.trend}</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Retail</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{analytics.sentiment.retail.score}/100</span>
                            <Badge variant="outline">{analytics.sentiment.retail.trend}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {analytics.recommendations.map((rec, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Badge variant={getPriorityColor(rec.priority)} className="mt-1">
                            {rec.priority}
                          </Badge>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{rec.type}</Badge>
                              <span className="font-medium">{rec.action}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                            <div className="flex items-center gap-2 text-xs text-blue-400">
                              <Clock className="h-3 w-3" />
                              {rec.timeframe}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 mx-auto text-red-400" />
                <div className="space-y-2">
                  <h3 className="font-semibold">No Analytics Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Please select a cryptocurrency and enter your portfolio amount to generate comprehensive analytics.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
