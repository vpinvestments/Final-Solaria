"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingUp, Shield, Target, ArrowRight } from "lucide-react"

const insights = [
  {
    id: 1,
    type: "optimization",
    title: "Rebalancing Opportunity",
    description: "Consider reducing BTC allocation by 3% to maintain target weights",
    impact: "Medium",
    action: "Rebalance",
    icon: Target,
  },
  {
    id: 2,
    type: "risk",
    title: "Diversification Tip",
    description: "Adding stablecoins could reduce portfolio volatility by 8%",
    impact: "High",
    action: "Diversify",
    icon: Shield,
  },
  {
    id: 3,
    type: "performance",
    title: "Tax Optimization",
    description: "Harvest losses on DOGE to offset gains and reduce tax burden",
    impact: "Medium",
    action: "Review",
    icon: TrendingUp,
  },
]

export function PortfolioInsights() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {insights.map((insight) => {
            const Icon = insight.icon
            return (
              <div
                key={insight.id}
                className="w-full min-w-0 p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-500/20 text-blue-400 flex-shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{insight.title}</h4>
                      <Badge
                        variant={insight.impact === "High" ? "default" : "secondary"}
                        className="text-xs flex-shrink-0"
                      >
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{insight.description}</p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      {insight.action}
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="w-full min-w-0 p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Button variant="outline" className="bg-transparent">
              View All Insights
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
