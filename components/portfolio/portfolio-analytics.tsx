"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Target, AlertTriangle, TrendingUp, Shield, PieChartIcon, BarChart3, Search, Download } from "lucide-react"
import React from "react"

import {
  generateCorrelationMatrix,
  calculateAdvancedMetrics,
  calculateAdvancedRiskMetrics,
  assessPortfolioRisk,
  getCorrelationColor,
  type CorrelationMatrix,
  type AdvancedMetrics,
  type AdvancedRiskMetrics,
  type RiskAssessment,
} from "@/lib/correlation-analysis"

const performanceData = [
  { month: "Jan", portfolio: 25000, benchmark: 24000 },
  { month: "Feb", portfolio: 28000, benchmark: 25500 },
  { month: "Mar", portfolio: 32000, benchmark: 27000 },
  { month: "Apr", portfolio: 29000, benchmark: 28500 },
  { month: "May", portfolio: 35000, benchmark: 30000 },
  { month: "Jun", portfolio: 42000, benchmark: 32000 },
]

const sectorAllocation = [
  { name: "DeFi", value: 35, color: "#3b82f6" },
  { name: "Layer 1", value: 28, color: "#8b5cf6" },
  { name: "Gaming", value: 15, color: "#06d6a0" },
  { name: "NFTs", value: 12, color: "#f59e0b" },
  { name: "Others", value: 10, color: "#ef4444" },
]

const holdings = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    amount: 0.67234,
    avgPrice: 45000,
    currentPrice: 67234.56,
    value: 45234.56,
    change24h: 2.34,
    pnl: 14934.56,
    pnlPercent: 49.41,
    allocation: 52.3,
    riskLevel: "Medium",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    amount: 3.2456,
    avgPrice: 2800,
    currentPrice: 3456.78,
    value: 11234.56,
    change24h: -0.87,
    pnl: 2134.56,
    pnlPercent: 23.45,
    allocation: 13.0,
    riskLevel: "Medium",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    amount: 42.567,
    avgPrice: 120,
    currentPrice: 178.92,
    value: 7618.92,
    change24h: 5.67,
    pnl: 2508.92,
    pnlPercent: 49.12,
    allocation: 8.8,
    riskLevel: "High",
  },
]

export function PortfolioAnalytics() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("6m")
  const [filterMetric, setFilterMetric] = useState("all")
  const [correlationMatrix, setCorrelationMatrix] = useState<CorrelationMatrix | null>(null)
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetrics | null>(null)
  const [showCorrelationDetails, setShowCorrelationDetails] = useState(false)
  const [riskMetrics, setRiskMetrics] = useState<AdvancedRiskMetrics | null>(null)
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)
  const [showRiskDetails, setShowRiskDetails] = useState(false)

  const portfolioReturn = 24.5 // Mock data - in real app this would be calculated
  const benchmarkOutperformance = 8.2 // Mock data - in real app this would be calculated

  useEffect(() => {
    const matrix = generateCorrelationMatrix(holdings)
    const metrics = calculateAdvancedMetrics(holdings, matrix)
    const advancedRisk = calculateAdvancedRiskMetrics(holdings)
    const assessment = assessPortfolioRisk(advancedRisk, holdings)

    setCorrelationMatrix(matrix)
    setAdvancedMetrics({
      ...metrics,
      portfolioReturn,
      benchmarkOutperformance,
    })
    setRiskMetrics(advancedRisk)
    setRiskAssessment(assessment)
  }, [])

  const handleExportAnalytics = () => {
    const csvContent = [
      ["Metric", "Value", "Status", "Period"].join(","),
      ["Total Return", `${portfolioReturn.toFixed(2)}%`, "Good", filterPeriod],
      ["Benchmark Outperformance", `${benchmarkOutperformance.toFixed(2)}%`, "Excellent", filterPeriod],
      ["Risk Score", `${riskAssessment?.overallRiskScore || 0}`, riskAssessment?.riskLevel || "Unknown", filterPeriod],
      ["Sharpe Ratio", `${riskMetrics?.sharpeRatio?.toFixed(2) || "N/A"}`, "Good", filterPeriod],
      ["VaR (95%)", `${riskMetrics?.valueAtRisk?.var95?.toFixed(1) || "N/A"}%`, "Medium", filterPeriod],
      ["Max Drawdown", `${riskMetrics?.maxDrawdown?.toFixed(1) || "N/A"}%`, "Low", filterPeriod],
      ["Volatility", `${riskMetrics?.volatility?.toFixed(1) || "N/A"}%`, "Medium", filterPeriod],
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `portfolio-analytics-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="glass-card w-full overflow-x-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Portfolio Analytics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportAnalytics}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl md:text-2xl font-bold text-green-400">+{portfolioReturn.toFixed(2)}%</div>
            <div className="text-sm text-muted-foreground">Total Return</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl md:text-2xl font-bold text-blue-400">+{benchmarkOutperformance.toFixed(2)}%</div>
            <div className="text-sm text-muted-foreground">vs Benchmark</div>
          </div>
          {riskMetrics && (
            <>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-xl md:text-2xl font-bold text-purple-400">
                  {riskMetrics.sharpeRatio?.toFixed(2) || "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-xl md:text-2xl font-bold text-orange-400">
                  {riskMetrics.maxDrawdown?.toFixed(1) || "N/A"}%
                </div>
                <div className="text-sm text-muted-foreground">Max Drawdown</div>
              </div>
            </>
          )}
          {riskAssessment && (
            <div className="text-center p-3 rounded-lg bg-white/5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className={`text-2xl font-bold ${
                    riskAssessment.riskLevel === "Very Low"
                      ? "text-green-400"
                      : riskAssessment.riskLevel === "Low"
                        ? "text-blue-400"
                        : riskAssessment.riskLevel === "Medium"
                          ? "text-yellow-400"
                          : riskAssessment.riskLevel === "High"
                            ? "text-orange-400"
                            : "text-red-400"
                  }`}
                >
                  {riskAssessment.overallRiskScore}
                </div>
                <Badge
                  variant={
                    riskAssessment.riskLevel === "Very Low" || riskAssessment.riskLevel === "Low"
                      ? "default"
                      : riskAssessment.riskLevel === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-xs"
                >
                  {riskAssessment.riskLevel}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">Overall Risk Score</div>
              <Progress value={Math.min(riskAssessment.overallRiskScore, 100)} className="mt-2" />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mt-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search analytics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMetric} onValueChange={setFilterMetric}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="risk">Risk</SelectItem>
                <SelectItem value="allocation">Allocation</SelectItem>
                <SelectItem value="correlation">Correlation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="w-full overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {/* Performance Card */}
          <div className="w-full p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4" />
              <h3 className="font-semibold text-base">Performance</h3>
            </div>
            <div className="h-[200px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" strokeWidth={2} name="Portfolio" />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    name="Benchmark"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">+{portfolioReturn.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">Total Return</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">+{benchmarkOutperformance.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">vs Benchmark</div>
              </div>
            </div>
          </div>

          {/* Advanced Risk Analysis Card */}
          <div className="w-full p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <h3 className="font-semibold text-base">Advanced Risk Analysis</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRiskDetails(!showRiskDetails)}
                className="text-xs"
              >
                {showRiskDetails ? "Hide Details" : "Show Details"}
              </Button>
            </div>

            {riskMetrics && riskAssessment ? (
              <div className="space-y-4">
                {/* Overall Risk Score */}
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div
                      className={`text-2xl font-bold ${
                        riskAssessment.riskLevel === "Very Low"
                          ? "text-green-400"
                          : riskAssessment.riskLevel === "Low"
                            ? "text-blue-400"
                            : riskAssessment.riskLevel === "Medium"
                              ? "text-yellow-400"
                              : riskAssessment.riskLevel === "High"
                                ? "text-orange-400"
                                : "text-red-400"
                      }`}
                    >
                      {riskAssessment.overallRiskScore}
                    </div>
                    <Badge
                      variant={
                        riskAssessment.riskLevel === "Very Low" || riskAssessment.riskLevel === "Low"
                          ? "default"
                          : riskAssessment.riskLevel === "Medium"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {riskAssessment.riskLevel}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Overall Risk Score</div>
                  <Progress value={Math.min(riskAssessment.overallRiskScore, 100)} className="mt-2" />
                </div>

                {/* Key Risk Metrics Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded bg-white/5">
                    <div className="text-sm font-bold text-red-400">
                      {riskMetrics.valueAtRisk?.var95?.toFixed(1) || "N/A"}%
                    </div>
                    <div className="text-xs text-muted-foreground">VaR (95%)</div>
                  </div>
                  <div className="text-center p-2 rounded bg-white/5">
                    <div className="text-sm font-bold text-blue-400">
                      {riskMetrics.sharpeRatio?.toFixed(2) || "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                  </div>
                  <div className="text-center p-2 rounded bg-white/5">
                    <div className="text-sm font-bold text-orange-400">
                      {riskMetrics.maxDrawdown?.toFixed(1) || "N/A"}%
                    </div>
                    <div className="text-xs text-muted-foreground">Max Drawdown</div>
                  </div>
                  <div className="text-center p-2 rounded bg-white/5">
                    <div className="text-sm font-bold text-purple-400">
                      {riskMetrics.volatility?.toFixed(1) || "N/A"}%
                    </div>
                    <div className="text-xs text-muted-foreground">Volatility</div>
                  </div>
                </div>

                {/* Strengths and Warnings */}
                <div className="grid grid-cols-1 gap-2">
                  {riskAssessment.strengths.length > 0 && (
                    <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-1 mb-1">
                        <Shield className="h-3 w-3 text-green-400" />
                        <span className="text-xs font-medium text-green-400">Strengths</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{riskAssessment.strengths[0]}</div>
                    </div>
                  )}

                  {riskAssessment.warnings.length > 0 && (
                    <div className="p-2 rounded bg-orange-500/10 border border-orange-500/20">
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="h-3 w-3 text-orange-400" />
                        <span className="text-xs font-medium text-orange-400">Warning</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{riskAssessment.warnings[0]}</div>
                    </div>
                  )}
                </div>

                {/* Detailed Risk Analysis */}
                {showRiskDetails && (
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    {/* Advanced Metrics */}
                    <div>
                      <h5 className="text-xs font-medium mb-2">Advanced Metrics</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sortino Ratio:</span>
                          <span className="font-medium">{riskMetrics.sortinoRatio?.toFixed(2) || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Beta:</span>
                          <span className="font-medium">{riskMetrics.beta?.toFixed(2) || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Alpha:</span>
                          <span className="font-medium">{riskMetrics.alpha?.toFixed(2) || "N/A"}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Calmar Ratio:</span>
                          <span className="font-medium">{riskMetrics.calmarRatio?.toFixed(2) || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">VaR (99%):</span>
                          <span className="font-medium text-red-400">
                            {riskMetrics.valueAtRisk?.var99?.toFixed(1) || "N/A"}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expected Shortfall:</span>
                          <span className="font-medium text-red-400">
                            {riskMetrics.valueAtRisk?.expectedShortfall?.toFixed(1) || "N/A"}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                      <h5 className="text-xs font-medium mb-1">Risk Factors</h5>
                      <div className="space-y-2">
                        {riskAssessment.riskFactors.slice(0, 2).map((factor, index) => (
                          <div key={index} className="p-2 rounded bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium">{factor.factor}</span>
                              <Badge
                                variant={
                                  factor.impact === "High"
                                    ? "destructive"
                                    : factor.impact === "Medium"
                                      ? "secondary"
                                      : "default"
                                }
                                className="text-xs"
                              >
                                {factor.impact}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">{factor.description}</div>
                            <div className="text-xs text-blue-400">{factor.recommendation}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h5 className="text-xs font-medium mb-1">Recommendations</h5>
                      <div className="space-y-1">
                        {riskAssessment.recommendations.slice(0, 2).map((rec, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                            <span className="text-xs text-muted-foreground">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
                <p className="text-xs text-muted-foreground">Calculating risk metrics...</p>
              </div>
            )}
          </div>

          {/* Allocation Card */}
          <div className="w-full p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="h-4 w-4" />
              <h3 className="font-semibold text-base">Allocation</h3>
            </div>
            <div className="h-[180px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sectorAllocation} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
                    {sectorAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1">
              {sectorAllocation.slice(0, 3).map((sector) => (
                <div key={sector.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sector.color }} />
                    <span className="text-xs truncate">{sector.name}</span>
                  </div>
                  <span className="text-xs font-medium flex-shrink-0">{sector.value}%</span>
                </div>
              ))}
              <div className="text-xs text-muted-foreground text-center pt-1">
                +{sectorAllocation.length - 3} more sectors
              </div>
            </div>
          </div>

          {/* Correlation Card */}
          <div className="w-full p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <h3 className="font-semibold text-base">Correlation Analysis</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCorrelationDetails(!showCorrelationDetails)}
                className="text-xs"
              >
                {showCorrelationDetails ? "Hide Details" : "Show Details"}
              </Button>
            </div>

            {correlationMatrix && advancedMetrics ? (
              <div className="space-y-4">
                {/* Correlation Matrix Heat Map */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Correlation Matrix</h4>
                  <div
                    className="grid gap-1"
                    style={{ gridTemplateColumns: `repeat(${correlationMatrix.assets.length + 1}, 1fr)` }}
                  >
                    {/* Header row */}
                    <div></div>
                    {correlationMatrix.assets.map((asset) => (
                      <div key={asset} className="text-xs text-center font-medium p-1">
                        {asset}
                      </div>
                    ))}

                    {/* Matrix rows */}
                    {correlationMatrix.assets.map((asset1, i) => (
                      <React.Fragment key={asset1}>
                        <div className="text-xs font-medium p-1">{asset1}</div>
                        {correlationMatrix.matrix[i].map((correlation, j) => (
                          <div
                            key={`${i}-${j}`}
                            className="text-xs text-center p-1 rounded text-white font-medium"
                            style={{ backgroundColor: getCorrelationColor(correlation) }}
                            title={`${correlationMatrix.assets[i]} vs ${correlationMatrix.assets[j]}: ${correlation?.toFixed(3) || "N/A"}`}
                          >
                            {correlation?.toFixed(2) || "N/A"}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded bg-white/5">
                    <div className="text-sm font-bold text-blue-400">
                      {advancedMetrics.portfolioDiversification?.toFixed(1) || "N/A"}%
                    </div>
                    <div className="text-xs text-muted-foreground">Diversification</div>
                  </div>
                  <div className="text-center p-2 rounded bg-white/5">
                    <div className="text-sm font-bold text-orange-400">
                      {advancedMetrics.correlationRisk?.toFixed(1) || "N/A"}%
                    </div>
                    <div className="text-xs text-muted-foreground">Correlation Risk</div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                {showCorrelationDetails && (
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div>
                      <h5 className="text-xs font-medium mb-1">Risk Factors</h5>
                      <div className="space-y-1">
                        {advancedMetrics.riskFactors.map((risk, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-orange-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-medium mb-1">Hedging Opportunities</h5>
                      <div className="space-y-1">
                        {advancedMetrics.hedgingOpportunities.map((opportunity, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Shield className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">{opportunity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-medium mb-1">Correlation Summary</h5>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-green-400">
                            {correlationMatrix.minCorrelation?.toFixed(3) || "N/A"}
                          </div>
                          <div className="text-muted-foreground">Min</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-blue-400">
                            {correlationMatrix.averageCorrelation?.toFixed(3) || "N/A"}
                          </div>
                          <div className="text-muted-foreground">Avg</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-red-400">
                            {correlationMatrix.maxCorrelation?.toFixed(3) || "N/A"}
                          </div>
                          <div className="text-muted-foreground">Max</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
                <p className="text-xs text-muted-foreground">Calculating correlations...</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
