"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Crown,
  Zap,
} from "lucide-react"
import {
  getCryptoETFs,
  getETFStats,
  getInvestmentFunds,
  getCategoryColor,
  formatCurrency,
  formatVolume,
  type CryptoETF,
  type ETFStats,
  type InvestmentFund,
} from "@/lib/etf-api"

export default function CryptoETFsPage() {
  const [etfs, setETFs] = useState<CryptoETF[]>([])
  const [stats, setStats] = useState<ETFStats | null>(null)
  const [funds, setFunds] = useState<InvestmentFund[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etfData, statsData, fundsData] = await Promise.all([
          getCryptoETFs(),
          getETFStats(),
          getInvestmentFunds(),
        ])
        setETFs(etfData)
        setStats(statsData)
        setFunds(fundsData)
      } catch (error) {
        console.error("Error fetching ETF data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredETFs = selectedCategory === "all" ? etfs : etfs.filter((etf) => etf.category === selectedCategory)

  const categories = [
    { value: "all", label: "All ETFs", count: etfs.length },
    { value: "spot-bitcoin", label: "Bitcoin Spot", count: etfs.filter((e) => e.category === "spot-bitcoin").length },
    {
      value: "spot-ethereum",
      label: "Ethereum Spot",
      count: etfs.filter((e) => e.category === "spot-ethereum").length,
    },
    { value: "futures", label: "Futures", count: etfs.filter((e) => e.category === "futures").length },
    { value: "blockchain", label: "Blockchain", count: etfs.filter((e) => e.category === "blockchain").length },
  ]

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-balance">Crypto ETFs & Investment Funds</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Professional cryptocurrency investment vehicles and institutional-grade funds
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Crypto ETF AUM</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalAUM}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Crypto ETFs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeETFs}</div>
              <p className="text-xs text-muted-foreground">+3 new launches this year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Institutional Investors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.institutionalInvestors}</div>
              <p className="text-xs text-muted-foreground">+18% growth this quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Expense Ratio</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.avgExpenseRatio}%</div>
              <p className="text-xs text-muted-foreground">Decreasing due to competition</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="etfs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="etfs">Cryptocurrency ETFs</TabsTrigger>
          <TabsTrigger value="funds">Investment Funds</TabsTrigger>
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="etfs" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="text-sm"
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>

          {/* ETF Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredETFs.map((etf) => (
              <Card key={etf.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{etf.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="font-mono">
                          {etf.symbol}
                        </Badge>
                        <Badge className={getCategoryColor(etf.category)}>
                          {etf.category.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatCurrency(etf.price)}</div>
                      <div
                        className={`flex items-center text-sm ${
                          etf.change24h >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {etf.change24h >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(etf.change24h)}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{etf.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">AUM:</span>
                      <span className="ml-2 font-semibold">{etf.aum}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expense Ratio:</span>
                      <span className="ml-2 font-semibold">{etf.expenseRatio}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Launch Date:</span>
                      <span className="ml-2 font-semibold">{etf.launchDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">24h Volume:</span>
                      <span className="ml-2 font-semibold">{formatVolume(etf.volume24h)}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Top Holdings:</h4>
                    <div className="flex flex-wrap gap-1">
                      {etf.topHoldings.map((holding, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {holding}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      NAV: {formatCurrency(etf.nav)} | Premium: {etf.premium}%
                    </div>
                    <Button size="sm" variant="outline">
                      View Details <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="funds" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {funds.map((fund) => (
              <Card key={fund.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{fund.name}</CardTitle>
                      <Badge variant="secondary">{fund.type}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-xl font-bold">+{fund.performance}%</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{fund.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">AUM:</span>
                      <span className="ml-2 font-semibold">{fund.aum}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Min Investment:</span>
                      <span className="ml-2 font-semibold">{fund.minInvestment}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Investment Strategy:</h4>
                    <p className="text-sm text-muted-foreground">{fund.strategy}</p>
                  </div>

                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Learn More <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Dominance */}
            <Card>
              <CardHeader>
                <CardTitle>ETF Category Distribution</CardTitle>
                <CardDescription>Market share by ETF category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bitcoin Spot ETFs</span>
                    <span className="text-sm font-semibold">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blockchain ETFs</span>
                    <span className="text-sm font-semibold">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ethereum Spot ETFs</span>
                    <span className="text-sm font-semibold">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Futures ETFs</span>
                    <span className="text-sm font-semibold">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Premium Features Upsell */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <CardTitle>Premium ETF Analytics</CardTitle>
                </div>
                <CardDescription>Unlock advanced ETF analysis and institutional insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Star className="h-4 w-4 text-primary" />
                    <span>Real-time premium/discount tracking</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Advanced flow analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>Institutional holdings data</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Historical performance analytics</span>
                  </div>
                </div>
                <Button className="w-full">
                  Upgrade to Premium
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing ETFs (YTD)</CardTitle>
                <CardDescription>Best performing crypto ETFs this year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {etfs.slice(0, 5).map((etf, index) => (
                    <div key={etf.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{etf.symbol}</div>
                          <div className="text-xs text-muted-foreground">{etf.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">+{(etf.change24h * 15).toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">{etf.aum}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Investment Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Invest in Crypto ETFs?</CardTitle>
                <CardDescription>Get professional guidance on cryptocurrency investment strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Crypto ETFs offer institutional-grade exposure to digital assets with traditional brokerage
                  convenience.
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    Portfolio Calculator
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Investment Guide
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Disclaimer:</strong> Past performance does not guarantee future results. Cryptocurrency
                  investments are subject to high volatility and risk.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
