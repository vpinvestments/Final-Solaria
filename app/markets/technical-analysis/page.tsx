"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { getTopCryptocurrencies, type CryptoCurrency } from "@/lib/crypto-api"
import { getTechnicalAnalysis, getSignalColor, getRiskColor, type TechnicalAnalysis } from "@/lib/technical-analysis"
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Shield,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

export default function TechnicalAnalysisPage() {
  const [topCoins, setTopCoins] = useState<CryptoCurrency[]>([])
  const [analyses, setAnalyses] = useState<TechnicalAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState<string>("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function fetchData() {
      try {
        const coins = await getTopCryptocurrencies(10)
        setTopCoins(coins)

        // Generate technical analysis for top 10 coins
        const analysisPromises = coins.map((coin) => getTechnicalAnalysis(coin.id, coin.price, coin.change24h))
        const analysisResults = await Promise.all(analysisPromises)
        setAnalyses(analysisResults)

        if (coins.length > 0) {
          setSelectedCoin(coins[0].id)
        }
      } catch (error) {
        console.error("Error fetching technical analysis data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const selectedAnalysis = analyses.find((a) => a.coinId === selectedCoin)

  const handleViewDetails = (coinId: string) => {
    setSelectedCoin(coinId)
    setActiveTab("detailed")
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Analyzing market data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">AI Technical Analysis</h1>
          <p className="text-muted-foreground text-pretty">
            Advanced AI-powered technical analysis for the top 10 cryptocurrencies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">AI Powered</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
          <TabsTrigger value="premium">Premium Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Strong Buy</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {analyses.filter((a) => a.overallSignal === "STRONG_BUY").length}
                </p>
                <p className="text-xs text-muted-foreground">Coins</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Strong Sell</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {analyses.filter((a) => a.overallSignal === "STRONG_SELL").length}
                </p>
                <p className="text-xs text-muted-foreground">Coins</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Low Risk</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {analyses.filter((a) => a.riskLevel === "LOW").length}
                </p>
                <p className="text-xs text-muted-foreground">Coins</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Avg Confidence</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(analyses.reduce((acc, a) => acc + a.confidence, 0) / analyses.length)}%
                </p>
                <p className="text-xs text-muted-foreground">AI Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Top 10 Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyses.map((analysis) => (
              <Card key={analysis.coinId} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={analysis.image || "/placeholder.svg"}
                        alt={analysis.coinName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <CardTitle className="text-lg">{analysis.coinName}</CardTitle>
                        <CardDescription>{analysis.symbol}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getSignalColor(analysis.overallSignal)}>
                      {analysis.overallSignal.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${analysis.price.toLocaleString()}</span>
                    <span
                      className={`text-sm font-medium ${analysis.change24h >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {analysis.change24h >= 0 ? "+" : ""}
                      {analysis.change24h.toFixed(2)}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Confidence</span>
                      <span className="font-medium">{analysis.confidence}%</span>
                    </div>
                    <Progress value={analysis.confidence} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span>Risk Level</span>
                    <Badge className={getRiskColor(analysis.riskLevel)}>{analysis.riskLevel}</Badge>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => handleViewDetails(analysis.coinId)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {selectedAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coin Selector */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Select Cryptocurrency</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analyses.map((analysis) => (
                    <Button
                      key={analysis.coinId}
                      variant={selectedCoin === analysis.coinId ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCoin(analysis.coinId)}
                    >
                      <img
                        src={analysis.image || "/placeholder.svg"}
                        alt={analysis.coinName}
                        className="w-4 h-4 mr-2"
                      />
                      {analysis.coinName}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Detailed Analysis */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedAnalysis.image || "/placeholder.svg"}
                        alt={selectedAnalysis.coinName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <CardTitle>{selectedAnalysis.coinName} Analysis</CardTitle>
                        <CardDescription>AI-powered technical insights</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* AI Insight */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-900">AI Insight</span>
                      </div>
                      <p className="text-blue-800 text-sm text-pretty">{selectedAnalysis.aiInsight}</p>
                    </div>

                    {/* Technical Indicators */}
                    <div>
                      <h4 className="font-semibold mb-3">Technical Indicators</h4>
                      <div className="space-y-3">
                        {selectedAnalysis.indicators.map((indicator, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                          >
                            <div>
                              <span className="font-medium">{indicator.name}</span>
                              <p className="text-xs text-muted-foreground text-pretty">{indicator.description}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={getSignalColor(indicator.signal)}>{indicator.signal}</Badge>
                              <p className="text-sm font-mono mt-1">{indicator.value.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Targets */}
                    <div>
                      <h4 className="font-semibold mb-3">Price Targets</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <Target className="h-4 w-4 mx-auto mb-1 text-green-600 dark:text-green-400" />
                          <p className="text-xs text-green-700 dark:text-green-300">Short Term</p>
                          <p className="font-bold text-green-800 dark:text-green-200">
                            ${selectedAnalysis.priceTarget.short.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <Target className="h-4 w-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                          <p className="text-xs text-blue-700 dark:text-blue-300">Medium Term</p>
                          <p className="font-bold text-blue-800 dark:text-blue-200">
                            ${selectedAnalysis.priceTarget.medium.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                          <Target className="h-4 w-4 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                          <p className="text-xs text-purple-700 dark:text-purple-300">Long Term</p>
                          <p className="font-bold text-purple-800 dark:text-purple-200">
                            ${selectedAnalysis.priceTarget.long.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buy Signals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Buy Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyses
                  .filter((a) => a.overallSignal === "STRONG_BUY" || a.overallSignal === "BUY")
                  .map((analysis) => (
                    <div
                      key={analysis.coinId}
                      className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img src={analysis.image || "/placeholder.svg"} alt={analysis.coinName} className="w-6 h-6" />
                        <div>
                          <span className="font-medium">{analysis.coinName}</span>
                          <p className="text-xs text-muted-foreground">{analysis.confidence}% confidence</p>
                        </div>
                      </div>
                      <Badge className={getSignalColor(analysis.overallSignal)}>
                        {analysis.overallSignal.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Sell Signals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-5 w-5" />
                  Sell Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyses
                  .filter((a) => a.overallSignal === "STRONG_SELL" || a.overallSignal === "SELL")
                  .map((analysis) => (
                    <div
                      key={analysis.coinId}
                      className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img src={analysis.image || "/placeholder.svg"} alt={analysis.coinName} className="w-6 h-6" />
                        <div>
                          <span className="font-medium">{analysis.coinName}</span>
                          <p className="text-xs text-muted-foreground">{analysis.confidence}% confidence</p>
                        </div>
                      </div>
                      <Badge className={getSignalColor(analysis.overallSignal)}>
                        {analysis.overallSignal.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          {/* Premium Upsell Section */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-balance">Unlock Advanced Technical Analysis</h2>
              <p className="text-muted-foreground text-lg text-pretty">
                Get AI-powered analysis for all 5,000+ cryptocurrencies with premium features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Free Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Free Plan
                  </CardTitle>
                  <CardDescription>Current plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    $0<span className="text-sm font-normal">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Top 10 cryptocurrencies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Basic technical indicators
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      AI insights
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Daily updates
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Current Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="relative border-primary shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Pro Plan
                  </CardTitle>
                  <CardDescription>For serious traders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    $29<span className="text-sm font-normal">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Top 500 cryptocurrencies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Advanced technical indicators
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Real-time alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Portfolio integration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Custom watchlists
                    </li>
                  </ul>
                  <Button className="w-full">
                    Upgrade to Pro
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Enterprise
                  </CardTitle>
                  <CardDescription>For institutions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    $99<span className="text-sm font-normal">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      All 5,000+ cryptocurrencies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      AI-powered predictions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      API access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      White-label solutions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Priority support
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-8" />

            {/* Feature Comparison */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Why Upgrade?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h4 className="font-semibold">Advanced AI</h4>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Machine learning models trained on years of market data
                  </p>
                </Card>
                <Card className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h4 className="font-semibold">Precise Targets</h4>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Accurate price predictions with confidence intervals
                  </p>
                </Card>
                <Card className="p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h4 className="font-semibold">Risk Management</h4>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Advanced risk assessment and portfolio optimization
                  </p>
                </Card>
                <Card className="p-4 text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <h4 className="font-semibold">Real-time Alerts</h4>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Instant notifications for trading opportunities
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
