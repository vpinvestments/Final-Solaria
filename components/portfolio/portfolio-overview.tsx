"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"

const portfolioStats = [
  {
    title: "Total Portfolio Value",
    value: "$45,234.56",
    change: "+$2,345.67",
    changePercent: "+5.47%",
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: "24h Change",
    value: "+$1,234.56",
    change: "+2.81%",
    changePercent: "vs yesterday",
    isPositive: true,
    icon: TrendingUp,
  },
  {
    title: "Total Invested",
    value: "$42,000.00",
    change: "+$3,234.56",
    changePercent: "profit",
    isPositive: true,
    icon: PieChart,
  },
  {
    title: "Best Performer",
    value: "SOL",
    change: "+23.45%",
    changePercent: "this week",
    isPositive: true,
    icon: TrendingUp,
  },
]

export function PortfolioOverview() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {portfolioStats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="w-full min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground truncate">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold truncate">{stat.value}</div>
              <div
                className={`text-xs flex items-center truncate ${stat.isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {stat.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 flex-shrink-0" />
                )}
                <span className="truncate">
                  {stat.change} {stat.changePercent}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
