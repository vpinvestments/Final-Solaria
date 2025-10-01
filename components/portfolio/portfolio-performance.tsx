"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  ComposedChart,
} from "recharts"
import { TrendingUp, Target, Award, AlertTriangle } from "lucide-react"

const performanceData = [
  { date: "2024-01-01", portfolio: 25000, benchmark: 24000, drawdown: 0, volatility: 15 },
  { date: "2024-01-08", portfolio: 28000, benchmark: 25500, drawdown: -2.1, volatility: 18 },
  { date: "2024-01-15", portfolio: 32000, benchmark: 27000, drawdown: -1.5, volatility: 22 },
  { date: "2024-01-22", portfolio: 29000, benchmark: 28500, drawdown: -9.4, volatility: 28 },
  { date: "2024-01-29", portfolio: 35000, benchmark: 30000, drawdown: -3.2, volatility: 25 },
  { date: "2024-02-05", portfolio: 42000, benchmark: 32000, drawdown: 0, volatility: 20 },
]

const monthlyReturns = [
  { month: "Jan", portfolio: 8.5, benchmark: 6.2, market: 5.8 },
  { month: "Feb", portfolio: 12.3, benchmark: 8.1, market: 7.5 },
  { month: "Mar", portfolio: -2.1, benchmark: 1.2, market: 2.1 },
  { month: "Apr", portfolio: 15.7, benchmark: 9.8, market: 8.9 },
  { month: "May", portfolio: 6.4, benchmark: 4.2, market: 3.8 },
  { month: "Jun", portfolio: 9.2, benchmark: 7.1, market: 6.5 },
]

const riskMetrics = [
  { name: "Sharpe Ratio", value: 1.85, benchmark: 1.42, status: "good" },
  { name: "Sortino Ratio", value: 2.31, benchmark: 1.78, status: "good" },
  { name: "Max Drawdown", value: -9.4, benchmark: -12.1, status: "good" },
  { name: "Volatility", value: 22.5, benchmark: 18.3, status: "medium" },
  { name: "Beta", value: 1.15, benchmark: 1.0, status: "medium" },
  { name: "Alpha", value: 8.2, benchmark: 0, status: "good" },
]

const performanceMetrics = [
  { period: "1 Week", portfolio: "+2.3%", benchmark: "+1.8%", outperformance: "+0.5%" },
  { period: "1 Month", portfolio: "+9.2%", benchmark: "+7.1%", outperformance: "+2.1%" },
  { period: "3 Months", portfolio: "+24.8%", benchmark: "+18.5%", outperformance: "+6.3%" },
  { period: "6 Months", portfolio: "+68.2%", benchmark: "+42.1%", outperformance: "+26.1%" },
  { period: "1 Year", portfolio: "+125.4%", benchmark: "+78.9%", outperformance: "+46.5%" },
  { period: "All Time", portfolio: "+168.2%", benchmark: "+95.3%", outperformance: "+72.9%" },
]

export function PortfolioPerformance() {
  const [selectedPeriod, setSelectedPeriod] = useState("6M")
  const [comparisonMode, setComparisonMode] = useState("benchmark")

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="ALL">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Select value={comparisonMode} onValueChange={setComparisonMode}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="benchmark">vs Benchmark</SelectItem>
                  <SelectItem value="market">vs Market</SelectItem>
                  <SelectItem value="peers">vs Peers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" strokeWidth={3} name="Portfolio" />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Benchmark"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-6 gap-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.period} className="text-center p-4 rounded-lg bg-white/5">
                    <div className="text-sm text-muted-foreground mb-1">{metric.period}</div>
                    <div className="text-lg font-bold text-green-400">{metric.portfolio}</div>
                    <div className="text-xs text-muted-foreground">{metric.benchmark}</div>
                    <div className="text-xs text-blue-400 mt-1">{metric.outperformance}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="returns" className="space-y-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="portfolio" fill="#3b82f6" name="Portfolio" />
                    <Bar dataKey="benchmark" fill="#8b5cf6" name="Benchmark" />
                    <Bar dataKey="market" fill="#06d6a0" name="Market" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-green-400">+68.2%</div>
                  <div className="text-sm text-muted-foreground">Total Return</div>
                  <div className="text-xs text-blue-400 mt-1">vs +42.1% benchmark</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-purple-400">12.8%</div>
                  <div className="text-sm text-muted-foreground">Annualized Return</div>
                  <div className="text-xs text-blue-400 mt-1">vs 8.4% benchmark</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-blue-400">85%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                  <div className="text-xs text-muted-foreground mt-1">17/20 months positive</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {riskMetrics.map((metric) => (
                  <div key={metric.name} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          metric.status === "good"
                            ? "bg-green-500/20 text-green-400"
                            : metric.status === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {metric.status === "good" ? (
                          <Award className="h-4 w-4" />
                        ) : metric.status === "medium" ? (
                          <Target className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{metric.name}</div>
                        <div className="text-sm text-muted-foreground">vs {metric.benchmark} benchmark</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{metric.value}%</div>
                      <Badge
                        variant={
                          metric.status === "good"
                            ? "default"
                            : metric.status === "medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drawdown" className="space-y-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
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
                      dataKey="drawdown"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      stroke="#ef4444"
                      name="Drawdown %"
                    />
                    <Line type="monotone" dataKey="volatility" stroke="#f59e0b" strokeWidth={2} name="Volatility %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-red-400">-9.4%</div>
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                  <div className="text-xs text-muted-foreground mt-1">Jan 22, 2024</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-yellow-400">22.5%</div>
                  <div className="text-sm text-muted-foreground">Current Volatility</div>
                  <div className="text-xs text-muted-foreground mt-1">30-day rolling</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-green-400">12 days</div>
                  <div className="text-sm text-muted-foreground">Recovery Time</div>
                  <div className="text-xs text-muted-foreground mt-1">Average</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-blue-400">1.85</div>
                  <div className="text-sm text-muted-foreground">Calmar Ratio</div>
                  <div className="text-xs text-muted-foreground mt-1">Return/Max DD</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
