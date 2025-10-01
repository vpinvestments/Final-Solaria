"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { BarChart3, Users, Award, AlertCircle } from "lucide-react"

const comparisonData = [
  { date: "Jan", myPortfolio: 25000, benchmark: 24000, peers: 23500, market: 22000 },
  { date: "Feb", myPortfolio: 28000, benchmark: 25500, peers: 25000, market: 24000 },
  { date: "Mar", myPortfolio: 32000, benchmark: 27000, peers: 26800, market: 25500 },
  { date: "Apr", myPortfolio: 29000, benchmark: 28500, peers: 28000, market: 27000 },
  { date: "May", myPortfolio: 35000, benchmark: 30000, peers: 29500, market: 28500 },
  { date: "Jun", myPortfolio: 42000, benchmark: 32000, peers: 31000, market: 30000 },
]

const performanceMetrics = [
  {
    metric: "Total Return",
    myPortfolio: { value: 68.2, rank: 1 },
    benchmark: { value: 42.1, rank: 2 },
    peers: { value: 38.5, rank: 3 },
    market: { value: 36.4, rank: 4 },
  },
  {
    metric: "Sharpe Ratio",
    myPortfolio: { value: 1.85, rank: 1 },
    benchmark: { value: 1.42, rank: 2 },
    peers: { value: 1.28, rank: 3 },
    market: { value: 1.15, rank: 4 },
  },
  {
    metric: "Max Drawdown",
    myPortfolio: { value: -9.4, rank: 2 },
    benchmark: { value: -12.1, rank: 3 },
    peers: { value: -8.8, rank: 1 },
    market: { value: -15.2, rank: 4 },
  },
  {
    metric: "Volatility",
    myPortfolio: { value: 22.5, rank: 3 },
    benchmark: { value: 18.3, rank: 1 },
    peers: { value: 20.1, rank: 2 },
    market: { value: 25.8, rank: 4 },
  },
]

const radarData = [
  { subject: "Returns", myPortfolio: 90, benchmark: 70, peers: 65, fullMark: 100 },
  { subject: "Risk Management", myPortfolio: 75, benchmark: 85, peers: 80, fullMark: 100 },
  { subject: "Diversification", myPortfolio: 60, benchmark: 90, peers: 85, fullMark: 100 },
  { subject: "Consistency", myPortfolio: 80, benchmark: 75, peers: 70, fullMark: 100 },
  { subject: "Liquidity", myPortfolio: 85, benchmark: 95, peers: 90, fullMark: 100 },
]

const allocationComparison = [
  { category: "Bitcoin", myPortfolio: 45, benchmark: 35, peers: 40 },
  { category: "Ethereum", myPortfolio: 25, benchmark: 30, peers: 28 },
  { category: "Altcoins", myPortfolio: 20, benchmark: 25, peers: 22 },
  { category: "Stablecoins", myPortfolio: 10, benchmark: 10, peers: 10 },
]

const peerPortfolios = [
  {
    id: "crypto-whale",
    name: "Crypto Whale",
    return: 72.5,
    risk: 28.2,
    sharpe: 1.92,
    followers: 15420,
    verified: true,
  },
  {
    id: "defi-master",
    name: "DeFi Master",
    return: 58.3,
    risk: 31.5,
    sharpe: 1.65,
    followers: 8930,
    verified: true,
  },
  {
    id: "hodl-king",
    name: "HODL King",
    return: 45.2,
    risk: 18.7,
    sharpe: 1.78,
    followers: 12340,
    verified: false,
  },
  {
    id: "alt-hunter",
    name: "Alt Hunter",
    return: 89.1,
    risk: 42.3,
    sharpe: 1.45,
    followers: 6780,
    verified: true,
  },
]

export function PortfolioComparison() {
  const [comparisonType, setComparisonType] = useState("benchmark")
  const [timeframe, setTimeframe] = useState("6M")

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-green-400"
      case 2:
        return "text-blue-400"
      case 3:
        return "text-yellow-400"
      default:
        return "text-red-400"
    }
  }

  const getRankBadge = (rank: number) => {
    const colors = {
      1: "bg-green-500/20 text-green-400",
      2: "bg-blue-500/20 text-blue-400",
      3: "bg-yellow-500/20 text-yellow-400",
      4: "bg-red-500/20 text-red-400",
    }
    return colors[rank as keyof typeof colors] || colors[4]
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Portfolio Comparison
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={comparisonType} onValueChange={setComparisonType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="benchmark">vs Benchmark</SelectItem>
                  <SelectItem value="peers">vs Peers</SelectItem>
                  <SelectItem value="market">vs Market</SelectItem>
                  <SelectItem value="all">All Comparisons</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
              <TabsTrigger value="peers">Peer Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonData}>
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
                    <Line type="monotone" dataKey="myPortfolio" stroke="#3b82f6" strokeWidth={3} name="My Portfolio" />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Benchmark"
                    />
                    <Line
                      type="monotone"
                      dataKey="peers"
                      stroke="#06d6a0"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      name="Peer Average"
                    />
                    <Line
                      type="monotone"
                      dataKey="market"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="1 1"
                      name="Market Index"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-blue-400">+68.2%</div>
                  <div className="text-sm text-muted-foreground">My Portfolio</div>
                  <Badge className="mt-1 bg-green-500/20 text-green-400">Rank #1</Badge>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-purple-400">+42.1%</div>
                  <div className="text-sm text-muted-foreground">Benchmark</div>
                  <Badge className="mt-1 bg-blue-500/20 text-blue-400">Rank #2</Badge>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-green-400">+38.5%</div>
                  <div className="text-sm text-muted-foreground">Peer Average</div>
                  <Badge className="mt-1 bg-yellow-500/20 text-yellow-400">Rank #3</Badge>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-yellow-400">+36.4%</div>
                  <div className="text-sm text-muted-foreground">Market Index</div>
                  <Badge className="mt-1 bg-red-500/20 text-red-400">Rank #4</Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.metric} className="p-4 rounded-lg bg-white/5">
                      <div className="font-medium mb-3">{metric.metric}</div>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <div className={`font-bold ${getRankColor(metric.myPortfolio.rank)}`}>
                            {metric.myPortfolio.value}
                            {metric.metric.includes("Return") || metric.metric.includes("Drawdown") ? "%" : ""}
                          </div>
                          <div className="text-xs text-muted-foreground">My Portfolio</div>
                          <Badge size="sm" className={`mt-1 ${getRankBadge(metric.myPortfolio.rank)}`}>
                            #{metric.myPortfolio.rank}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className={`font-bold ${getRankColor(metric.benchmark.rank)}`}>
                            {metric.benchmark.value}
                            {metric.metric.includes("Return") || metric.metric.includes("Drawdown") ? "%" : ""}
                          </div>
                          <div className="text-xs text-muted-foreground">Benchmark</div>
                          <Badge size="sm" className={`mt-1 ${getRankBadge(metric.benchmark.rank)}`}>
                            #{metric.benchmark.rank}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className={`font-bold ${getRankColor(metric.peers.rank)}`}>
                            {metric.peers.value}
                            {metric.metric.includes("Return") || metric.metric.includes("Drawdown") ? "%" : ""}
                          </div>
                          <div className="text-xs text-muted-foreground">Peers</div>
                          <Badge size="sm" className={`mt-1 ${getRankBadge(metric.peers.rank)}`}>
                            #{metric.peers.rank}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className={`font-bold ${getRankColor(metric.market.rank)}`}>
                            {metric.market.value}
                            {metric.metric.includes("Return") || metric.metric.includes("Drawdown") ? "%" : ""}
                          </div>
                          <div className="text-xs text-muted-foreground">Market</div>
                          <Badge size="sm" className={`mt-1 ${getRankBadge(metric.market.rank)}`}>
                            #{metric.market.rank}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="My Portfolio"
                        dataKey="myPortfolio"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Benchmark"
                        dataKey="benchmark"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Peers"
                        dataKey="peers"
                        stroke="#06d6a0"
                        fill="#06d6a0"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="allocation" className="space-y-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={allocationComparison}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="myPortfolio" fill="#3b82f6" name="My Portfolio" />
                    <Bar dataKey="benchmark" fill="#8b5cf6" name="Benchmark" />
                    <Bar dataKey="peers" fill="#06d6a0" name="Peer Average" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {allocationComparison.map((item) => (
                  <div key={item.category} className="p-4 rounded-lg bg-white/5">
                    <div className="font-medium mb-2">{item.category}</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-400">My Portfolio:</span>
                        <span>{item.myPortfolio}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">Benchmark:</span>
                        <span>{item.benchmark}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">Peers:</span>
                        <span>{item.peers}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="peers" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {peerPortfolios.map((peer) => (
                  <div key={peer.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {peer.name}
                            {peer.verified && <Award className="h-4 w-4 text-blue-400" />}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {peer.followers.toLocaleString()} followers
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Follow
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">+{peer.return}%</div>
                        <div className="text-muted-foreground">Return</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">{peer.risk}%</div>
                        <div className="text-muted-foreground">Risk</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{peer.sharpe}</div>
                        <div className="text-muted-foreground">Sharpe</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-400">Peer Comparison Insights</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Your portfolio outperforms 85% of similar portfolios in your risk category. Consider following top
                      performers to learn new strategies and stay updated with market trends.
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
