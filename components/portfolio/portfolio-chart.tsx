"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const portfolioData = {
  "1D": [
    { time: "00:00", value: 42000 },
    { time: "04:00", value: 42500 },
    { time: "08:00", value: 43200 },
    { time: "12:00", value: 44100 },
    { time: "16:00", value: 44800 },
    { time: "20:00", value: 45000 },
    { time: "24:00", value: 45234 },
  ],
  "7D": [
    { time: "Mon", value: 41000 },
    { time: "Tue", value: 42000 },
    { time: "Wed", value: 43500 },
    { time: "Thu", value: 44200 },
    { time: "Fri", value: 44800 },
    { time: "Sat", value: 45000 },
    { time: "Sun", value: 45234 },
  ],
  "1M": [
    { time: "Week 1", value: 38000 },
    { time: "Week 2", value: 40000 },
    { time: "Week 3", value: 42500 },
    { time: "Week 4", value: 45234 },
  ],
}

const allocationData = [
  { name: "Bitcoin", value: 45, color: "#f7931a" },
  { name: "Ethereum", value: 25, color: "#627eea" },
  { name: "Solana", value: 15, color: "#9945ff" },
  { name: "Others", value: 15, color: "#6b7280" },
]

const timeframes = ["1D", "7D", "1M"] as const

export function PortfolioChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<keyof typeof portfolioData>("7D")
  const [chartType, setChartType] = useState<"performance" | "allocation">("performance")

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-semibold">Portfolio Performance</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="w-full min-w-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="truncate">Performance Chart</CardTitle>
              <div className="flex gap-1 flex-wrap">
                {timeframes.map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={selectedTimeframe === timeframe ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className="text-xs"
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="w-full">
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData[selectedTimeframe]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Portfolio Value"]}
                  />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full min-w-0">
          <CardHeader>
            <CardTitle className="truncate">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <div className="h-64 sm:h-80 w-full">
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 w-full">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-sm truncate">{item.name}</span>
                      <span className="text-sm text-muted-foreground flex-shrink-0">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
