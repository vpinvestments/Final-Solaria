"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Brain, Zap, AlertTriangle, Clock, BarChart3, Activity, Layers } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, Bar } from "recharts"

interface MarketPredictions {
  overallMarketForecast: {
    direction: string
    confidence: number
    timeframe: string
    keyDrivers: string[]
    riskFactors: string[]
  }
  assetPredictions: Array<{
    symbol: string
    currentPrice: number
    predictions: {
      oneDay: { price: number; change: number; confidence: number }
      oneWeek: { price: number; change: number; confidence: number }
      oneMonth: { price: number; change: number; confidence: number }
      threeMonths: { price: number; change: number; confidence: number }
    }
    technicalIndicators: {
      rsi: number
      macd: string
      movingAverages: string
      support: number
      resistance: number
    }
    onChainMetrics: {
      networkActivity: number
      whaleActivity: string
      developerActivity: number
      socialSentiment: number
    }
    catalysts: string[]
    risks: string[]
  }>
  marketScenarios: Array<{
    name: string
    probability: number
    description: string
    impact: string
    affectedAssets: string[]
    timeframe: string
  }>
  tradingSignals: Array<{
    asset: string
    signal: string
    strength: number
    entry?: number
    target?: number
    stopLoss?: number
    reasoning: string
    timeframe: string
  }>
}

const mockMarketData = {
  totalMarketCap: 1200000000000,
  volume24h: 45000000000,
  dominance: { BTC: 42.5, ETH: 18.2 },
  fearGreedIndex: 65,
  volatilityIndex: 72,
}

export function PredictiveMarketAnalysis() {
  const [predictions, setPredictions] = useState<MarketPredictions | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState(["BTC", "ETH", "SOL"])
  const [timeframe, setTimeframe] = useState("medium-term")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const generatePredictions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/market-predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assets: selectedAssets,
          marketData: mockMarketData,
          timeframe,
        }),
      })

      const data = await response.json()
      setPredictions(data.predictions)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to generate predictions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generatePredictions()
  }, [selectedAssets, timeframe])

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "strong_buy":
        return "bg-green-600 text-white"
      case "buy":
        return "bg-green-500 text-white"
      case "hold":
        return "bg-yellow-500 text-black"
      case "sell":
        return "bg-red-500 text-white"
      case "strong_sell":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <BarChart3 className="h-4 w-4 text-yellow-400" />
    }
  }

  const getPredictionData = (asset: any) => [
    { period: "Current", price: asset.currentPrice, confidence: 100 },
    { period: "1D", price: asset.predictions.oneDay.price, confidence: asset.predictions.oneDay.confidence },
    { period: "1W", price: asset.predictions.oneWeek.price, confidence: asset.predictions.oneWeek.confidence },
    { period: "1M", price: asset.predictions.oneMonth.price, confidence: asset.predictions.oneMonth.confidence },
    { period: "3M", price: asset.predictions.threeMonths.price, confidence: asset.predictions.threeMonths.confidence },
  ]

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Predictive Market Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short-term">Short Term</SelectItem>
                  <SelectItem value="medium-term">Medium Term</SelectItem>
                  <SelectItem value="long-term">Long Term</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Updated {lastUpdated.toLocaleTimeString()}
              </Badge>
              <Button
                onClick={generatePredictions}
                disabled={loading}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? <Activity className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {loading ? "Analyzing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Brain className="h-12 w-12 animate-pulse mx-auto text-purple-400" />
                <div className="space-y-2">
                  <h3 className="font-semibold">AI Prediction Engine Running</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzing market patterns, on-chain data, and sentiment...
                  </p>
                </div>
              </div>
            </div>
          ) : predictions ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="predictions">Price Predictions</TabsTrigger>
                <TabsTrigger value="signals">Trading Signals</TabsTrigger>
                <TabsTrigger value="scenarios">Market Scenarios</TabsTrigger>
                <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getDirectionIcon(predictions.overallMarketForecast.direction)}
                        <div>
                          <h3 className="text-xl font-bold capitalize">
                            {predictions.overallMarketForecast.direction} Market
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {predictions.overallMarketForecast.timeframe} outlook
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">
                          {predictions.overallMarketForecast.confidence}%
                        </div>
                        <div className="text-sm text-muted-foreground">Confidence</div>
                      </div>
                    </div>
                    <Progress value={predictions.overallMarketForecast.confidence} className="mb-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          Key Drivers
                        </h4>
                        <div className="space-y-1">
                          {predictions.overallMarketForecast.keyDrivers.map((driver, index) => (
                            <div key={index} className="text-sm p-2 rounded bg-green-500/10 border border-green-500/20">
                              {driver}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          Risk Factors
                        </h4>
                        <div className="space-y-1">
                          {predictions.overallMarketForecast.riskFactors.map((risk, index) => (
                            <div key={index} className="text-sm p-2 rounded bg-red-500/10 border border-red-500/20">
                              {risk}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {predictions.assetPredictions.slice(0, 3).map((asset) => (
                    <Card key={asset.symbol} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-lg">{asset.symbol}</h3>
                          <div className="text-right">
                            <div className="font-semibold">${asset.currentPrice.toLocaleString()}</div>
                            <div
                              className={`text-sm ${asset.predictions.oneWeek.change >= 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              {asset.predictions.oneWeek.change >= 0 ? "+" : ""}
                              {asset.predictions.oneWeek.change.toFixed(2)}%
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>1W Target:</span>
                            <span className="font-semibold">${asset.predictions.oneWeek.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>1M Target:</span>
                            <span className="font-semibold">${asset.predictions.oneMonth.price.toLocaleString()}</span>
                          </div>
                          <Progress value={asset.predictions.oneWeek.confidence} className="mt-2" />
                          <div className="text-xs text-muted-foreground text-center">
                            {asset.predictions.oneWeek.confidence}% confidence
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-6">
                {predictions.assetPredictions.map((asset) => (
                  <Card key={asset.symbol} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{asset.symbol} Price Predictions</span>
                        <Badge variant="outline">${asset.currentPrice.toLocaleString()}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={getPredictionData(asset)}>
                              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                              <XAxis dataKey="period" />
                              <YAxis />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                  backdropFilter: "blur(10px)",
                                  border: "1px solid rgba(255, 255, 255, 0.2)",
                                  borderRadius: "8px",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="price"
                                fill="#8b5cf6"
                                fillOpacity={0.3}
                                stroke="#8b5cf6"
                                strokeWidth={2}
                              />
                              <Bar dataKey="confidence" fill="#3b82f6" fillOpacity={0.6} />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded bg-white/5">
                              <div className="text-sm text-muted-foreground">1 Day</div>
                              <div className="font-bold">${asset.predictions.oneDay.price.toLocaleString()}</div>
                              <div
                                className={`text-sm ${asset.predictions.oneDay.change >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {asset.predictions.oneDay.change >= 0 ? "+" : ""}
                                {asset.predictions.oneDay.change.toFixed(2)}%
                              </div>
                            </div>
                            <div className="p-3 rounded bg-white/5">
                              <div className="text-sm text-muted-foreground">1 Week</div>
                              <div className="font-bold">${asset.predictions.oneWeek.price.toLocaleString()}</div>
                              <div
                                className={`text-sm ${asset.predictions.oneWeek.change >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {asset.predictions.oneWeek.change >= 0 ? "+" : ""}
                                {asset.predictions.oneWeek.change.toFixed(2)}%
                              </div>
                            </div>
                            <div className="p-3 rounded bg-white/5">
                              <div className="text-sm text-muted-foreground">1 Month</div>
                              <div className="font-bold">${asset.predictions.oneMonth.price.toLocaleString()}</div>
                              <div
                                className={`text-sm ${asset.predictions.oneMonth.change >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {asset.predictions.oneMonth.change >= 0 ? "+" : ""}
                                {asset.predictions.oneMonth.change.toFixed(2)}%
                              </div>
                            </div>
                            <div className="p-3 rounded bg-white/5">
                              <div className="text-sm text-muted-foreground">3 Months</div>
                              <div className="font-bold">${asset.predictions.threeMonths.price.toLocaleString()}</div>
                              <div
                                className={`text-sm ${asset.predictions.threeMonths.change >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {asset.predictions.threeMonths.change >= 0 ? "+" : ""}
                                {asset.predictions.threeMonths.change.toFixed(2)}%
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold">Key Levels</h4>
                            <div className="flex justify-between text-sm">
                              <span>Support:</span>
                              <span className="font-semibold text-green-400">
                                ${asset.technicalIndicators.support.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Resistance:</span>
                              <span className="font-semibold text-red-400">
                                ${asset.technicalIndicators.resistance.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="signals" className="space-y-4">
                <div className="grid gap-4">
                  {predictions.tradingSignals.map((signal, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={getSignalColor(signal.signal)}>
                              {signal.signal.replace("_", " ").toUpperCase()}
                            </Badge>
                            <span className="font-bold text-lg">{signal.asset}</span>
                            <Badge variant="outline">{signal.timeframe}</Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Strength</div>
                            <div className="font-bold">{signal.strength}%</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          {signal.entry && (
                            <div className="text-center p-2 rounded bg-blue-500/10">
                              <div className="text-sm text-muted-foreground">Entry</div>
                              <div className="font-semibold">${signal.entry.toLocaleString()}</div>
                            </div>
                          )}
                          {signal.target && (
                            <div className="text-center p-2 rounded bg-green-500/10">
                              <div className="text-sm text-muted-foreground">Target</div>
                              <div className="font-semibold">${signal.target.toLocaleString()}</div>
                            </div>
                          )}
                          {signal.stopLoss && (
                            <div className="text-center p-2 rounded bg-red-500/10">
                              <div className="text-sm text-muted-foreground">Stop Loss</div>
                              <div className="font-semibold">${signal.stopLoss.toLocaleString()}</div>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">{signal.reasoning}</p>
                        <Progress value={signal.strength} className="mt-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="scenarios" className="space-y-4">
                <div className="grid gap-4">
                  {predictions.marketScenarios.map((scenario, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-lg">{scenario.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                scenario.impact === "positive"
                                  ? "default"
                                  : scenario.impact === "negative"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {scenario.impact.toUpperCase()}
                            </Badge>
                            <div className="text-right">
                              <div className="font-bold">{scenario.probability}%</div>
                              <div className="text-xs text-muted-foreground">Probability</div>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold mb-1">Affected Assets:</div>
                            <div className="flex gap-1">
                              {scenario.affectedAssets.map((asset, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {asset}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Badge variant="secondary">{scenario.timeframe}</Badge>
                        </div>

                        <Progress value={scenario.probability} className="mt-3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-6">
                {predictions.assetPredictions.map((asset) => (
                  <Card key={asset.symbol} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle>{asset.symbol} Technical & On-Chain Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Technical Indicators
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span>RSI:</span>
                              <div className="flex items-center gap-2">
                                <Progress value={asset.technicalIndicators.rsi} className="w-20" />
                                <span className="font-semibold">{asset.technicalIndicators.rsi}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>MACD:</span>
                              <Badge
                                variant={
                                  asset.technicalIndicators.macd === "bullish"
                                    ? "default"
                                    : asset.technicalIndicators.macd === "bearish"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {asset.technicalIndicators.macd.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Moving Averages:</span>
                              <Badge variant="outline">{asset.technicalIndicators.movingAverages.toUpperCase()}</Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            On-Chain Metrics
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span>Network Activity:</span>
                              <div className="flex items-center gap-2">
                                <Progress value={asset.onChainMetrics.networkActivity} className="w-20" />
                                <span className="font-semibold">{asset.onChainMetrics.networkActivity}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>Whale Activity:</span>
                              <Badge
                                variant={
                                  asset.onChainMetrics.whaleActivity === "accumulating"
                                    ? "default"
                                    : asset.onChainMetrics.whaleActivity === "distributing"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {asset.onChainMetrics.whaleActivity.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Developer Activity:</span>
                              <div className="flex items-center gap-2">
                                <Progress value={asset.onChainMetrics.developerActivity} className="w-20" />
                                <span className="font-semibold">{asset.onChainMetrics.developerActivity}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Social Sentiment:</span>
                              <div className="flex items-center gap-2">
                                <Progress value={asset.onChainMetrics.socialSentiment} className="w-20" />
                                <span className="font-semibold">{asset.onChainMetrics.socialSentiment}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            Catalysts
                          </h4>
                          <div className="space-y-1">
                            {asset.catalysts.map((catalyst, index) => (
                              <div
                                key={index}
                                className="text-sm p-2 rounded bg-green-500/10 border border-green-500/20"
                              >
                                {catalyst}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            Risks
                          </h4>
                          <div className="space-y-1">
                            {asset.risks.map((risk, index) => (
                              <div key={index} className="text-sm p-2 rounded bg-red-500/10 border border-red-500/20">
                                {risk}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Predictions Available</h3>
              <p className="text-muted-foreground mb-4">Generate AI-powered market predictions and analysis</p>
              <Button onClick={generatePredictions} className="bg-purple-600 hover:bg-purple-700">
                Generate Predictions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
