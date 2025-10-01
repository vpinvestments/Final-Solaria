"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, Shield, TrendingUp, Zap, Clock } from "lucide-react"

interface SmartRecommendations {
  portfolioOptimization: {
    currentScore: number
    optimizedScore: number
    improvements: Array<{
      action: string
      asset: string
      currentAllocation: number
      recommendedAllocation: number
      reasoning: string
      expectedImpact: string
      priority: string
      timeframe: string
    }>
  }
  defiOpportunities: Array<{
    protocol: string
    opportunity: string
    apy: number
    risk: string
    tvl: number
    description: string
    requirements: string[]
    steps: string[]
  }>
  riskManagement: {
    currentRiskLevel: string
    recommendedActions: Array<{
      type: string
      description: string
      urgency: string
      expectedReduction: number
    }>
    hedgingStrategies: string[]
  }
  marketTiming: {
    currentPhase: string
    recommendations: Array<{
      action: string
      asset: string
      timing: string
      confidence: number
      reasoning: string
    }>
  }
  taxOptimization: Array<{
    strategy: string
    description: string
    potentialSavings: number
    requirements: string[]
    deadline?: string
  }>
}

const mockPortfolioData = {
  totalValue: 125000,
  holdings: [
    { symbol: "BTC", allocation: 45, value: 56250 },
    { symbol: "ETH", allocation: 30, value: 37500 },
    { symbol: "SOL", allocation: 15, value: 18750 },
    { symbol: "USDC", allocation: 10, value: 12500 },
  ],
}

const mockUserPreferences = {
  riskTolerance: "moderate",
  investmentGoal: "growth",
  timeHorizon: "long-term",
  defiExperience: "intermediate",
}

export function SmartRecommendations() {
  const [recommendations, setRecommendations] = useState<SmartRecommendations | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/smart-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioData: mockPortfolioData,
          userPreferences: mockUserPreferences,
          marketConditions: { phase: "accumulation", volatility: "medium" },
        }),
      })

      const data = await response.json()
      setRecommendations(data.recommendations)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to generate recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateRecommendations()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              Smart Portfolio Recommendations
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Updated {lastUpdated.toLocaleTimeString()}
              </Badge>
              <Button
                onClick={generateRecommendations}
                disabled={loading}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {loading ? <Zap className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {loading ? "Analyzing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Lightbulb className="h-12 w-12 animate-pulse mx-auto text-yellow-400" />
                <div className="space-y-2">
                  <h3 className="font-semibold">Generating Smart Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzing your portfolio for optimization opportunities...
                  </p>
                </div>
              </div>
            </div>
          ) : recommendations ? (
            <Tabs defaultValue="optimization" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="optimization">Optimization</TabsTrigger>
                <TabsTrigger value="defi">DeFi Opportunities</TabsTrigger>
                <TabsTrigger value="risk">Risk Management</TabsTrigger>
                <TabsTrigger value="timing">Market Timing</TabsTrigger>
                <TabsTrigger value="tax">Tax Optimization</TabsTrigger>
              </TabsList>

              <TabsContent value="optimization" className="space-y-6">
                <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">Portfolio Optimization</h3>
                        <p className="text-sm text-muted-foreground">Improve your portfolio efficiency</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Current → Optimized</div>
                        <div className="text-2xl font-bold">
                          {recommendations.portfolioOptimization.currentScore}% →{" "}
                          <span className="text-green-400">
                            {recommendations.portfolioOptimization.optimizedScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Progress value={recommendations.portfolioOptimization.optimizedScore} className="mb-4" />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {recommendations.portfolioOptimization.improvements.map((improvement, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(improvement.priority)}>
                              {improvement.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{improvement.action.replace("_", " ").toUpperCase()}</Badge>
                            <span className="font-semibold">{improvement.asset}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {improvement.timeframe}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-muted-foreground">Current Allocation</div>
                            <div className="font-bold">{improvement.currentAllocation}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Recommended Allocation</div>
                            <div className="font-bold text-green-400">{improvement.recommendedAllocation}%</div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">{improvement.reasoning}</p>
                        <div className="text-xs text-blue-400">Expected Impact: {improvement.expectedImpact}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="defi" className="space-y-4">
                <div className="grid gap-4">
                  {recommendations.defiOpportunities.map((opportunity, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{opportunity.protocol}</h3>
                            <p className="text-sm text-muted-foreground">{opportunity.opportunity}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">{opportunity.apy.toFixed(2)}%</div>
                            <div className="text-sm text-muted-foreground">APY</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Risk:</span>
                            <Badge
                              variant={
                                opportunity.risk === "low"
                                  ? "default"
                                  : opportunity.risk === "medium"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {opportunity.risk.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            TVL: <span className="font-semibold">${(opportunity.tvl / 1000000).toFixed(1)}M</span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
                            <ul className="text-xs space-y-1">
                              {opportunity.requirements.map((req, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Steps:</h4>
                            <ol className="text-xs space-y-1">
                              {opportunity.steps.map((step, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-400 font-semibold">{i + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="risk" className="space-y-6">
                <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-red-400" />
                        <div>
                          <h3 className="text-xl font-bold">Risk Management</h3>
                          <p className="text-sm text-muted-foreground">Current risk level assessment</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          recommendations.riskManagement.currentRiskLevel === "low"
                            ? "default"
                            : recommendations.riskManagement.currentRiskLevel === "medium"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-lg px-4 py-2"
                      >
                        {recommendations.riskManagement.currentRiskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {recommendations.riskManagement.recommendedActions.map((action, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                action.urgency === "urgent"
                                  ? "destructive"
                                  : action.urgency === "high"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {action.urgency.toUpperCase()}
                            </Badge>
                            <span className="font-semibold">{action.type.replace("_", " ").toUpperCase()}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-green-400">-{action.expectedReduction}%</div>
                            <div className="text-xs text-muted-foreground">Risk Reduction</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-sm">Hedging Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recommendations.riskManagement.hedgingStrategies.map((strategy, index) => (
                        <div key={index} className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                          <span className="text-sm">{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timing" className="space-y-6">
                <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-purple-400" />
                        <div>
                          <h3 className="text-xl font-bold">Market Timing</h3>
                          <p className="text-sm text-muted-foreground">Current market cycle analysis</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        {recommendations.marketTiming.currentPhase.toUpperCase()} PHASE
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {recommendations.marketTiming.recommendations.map((rec, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                rec.action === "buy" || rec.action === "dca"
                                  ? "default"
                                  : rec.action === "sell" || rec.action === "take_profit"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {rec.action.replace("_", " ").toUpperCase()}
                            </Badge>
                            <span className="font-semibold">{rec.asset}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{rec.confidence}%</div>
                            <div className="text-xs text-muted-foreground">Confidence</div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm text-muted-foreground">Timing: {rec.timing}</div>
                        </div>

                        <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                        <Progress value={rec.confidence} className="mt-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tax" className="space-y-4">
                <div className="space-y-4">
                  {recommendations.taxOptimization.map((strategy, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-lg">{strategy.strategy}</h3>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-400">
                              ${strategy.potentialSavings.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Potential Savings</div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Requirements:</h4>
                          <ul className="text-xs space-y-1">
                            {strategy.requirements.map((req, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-400 rounded-full" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {strategy.deadline && (
                          <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                            <div className="text-sm font-semibold text-yellow-400">Deadline: {strategy.deadline}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Recommendations Available</h3>
              <p className="text-muted-foreground mb-4">Generate personalized portfolio recommendations</p>
              <Button onClick={generateRecommendations} className="bg-yellow-600 hover:bg-yellow-700">
                Generate Recommendations
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
