"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader2,
  BarChart3,
  Globe,
  Building2,
  Layers,
  ArrowLeftRight,
  Target,
} from "lucide-react"
import {
  getNetworkMetrics,
  getTopProtocols,
  getDeFiMetrics,
  getNFTMetrics,
  getWhaleTransactions,
  getBlockchainMetrics,
  getDerivativesData,
  getCrossChainMetrics,
  getInstitutionalData,
  type NetworkMetrics,
  type TopProtocol,
  type DeFiMetrics,
  type NFTMetrics,
  type WhaleTransaction,
  type BlockchainMetrics,
  type DerivativesData,
  type CrossChainMetrics,
  type InstitutionalData,
} from "@/lib/onchain-api"

export default function OnChainAnalyticsPage() {
  const [networkData, setNetworkData] = useState<NetworkMetrics | null>(null)
  const [protocolsData, setProtocolsData] = useState<TopProtocol[]>([])
  const [defiData, setDefiData] = useState<DeFiMetrics | null>(null)
  const [nftData, setNftData] = useState<NFTMetrics | null>(null)
  const [whaleData, setWhaleData] = useState<WhaleTransaction[]>([])
  const [blockchainData, setBlockchainData] = useState<BlockchainMetrics[]>([])
  const [derivativesData, setDerivativesData] = useState<DerivativesData | null>(null)
  const [crossChainData, setCrossChainData] = useState<CrossChainMetrics | null>(null)
  const [institutionalData, setInstitutionalData] = useState<InstitutionalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAllData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      console.log("[v0] Starting to fetch all onchain data...")

      const [network, protocols, defi, nft, whale, blockchain, derivatives, crossChain, institutional] =
        await Promise.all([
          getNetworkMetrics(),
          getTopProtocols(),
          getDeFiMetrics(),
          getNFTMetrics(),
          getWhaleTransactions(),
          getBlockchainMetrics(),
          getDerivativesData(),
          getCrossChainMetrics(),
          getInstitutionalData(),
        ])

      console.log("[v0] Derivatives data received:", derivatives)
      console.log("[v0] All data fetched successfully")

      setNetworkData(network)
      setProtocolsData(protocols)
      setDefiData(defi)
      setNftData(nft)
      setWhaleData(whale)
      setBlockchainData(blockchain)
      setDerivativesData(derivatives)
      setCrossChainData(crossChain)
      setInstitutionalData(institutional)
    } catch (error) {
      console.error("Error fetching onchain data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAllData()

    const refreshInterval = setInterval(() => {
      console.log("[v0] Auto-refreshing blockchain data...")
      fetchAllData(true)
    }, 300000) // 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval)
  }, [])

  const handleRefresh = () => {
    fetchAllData(true)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
    return `$${num.toFixed(2)}`
  }

  const formatChange = (change: number): { text: string; color: string; icon: any } => {
    const isPositive = change >= 0
    return {
      text: `${isPositive ? "+" : ""}${change.toFixed(1)}%`,
      color: isPositive ? "text-green-500" : "text-red-500",
      icon: isPositive ? ArrowUpRight : ArrowDownRight,
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OnChain Analytics</h1>
          <p className="text-muted-foreground">Comprehensive multi-chain blockchain data and market analysis</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blockchains">Blockchains</TabsTrigger>
          <TabsTrigger value="defi">DeFi</TabsTrigger>
          <TabsTrigger value="derivatives">Derivatives</TabsTrigger>
          <TabsTrigger value="crosschain">Cross-Chain</TabsTrigger>
          <TabsTrigger value="institutional">Institutional</TabsTrigger>
          <TabsTrigger value="nft">NFT & Whale</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(networkData?.networkValue || 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`flex items-center ${formatChange(networkData?.valueChange24h || 0).color}`}>
                        {(() => {
                          const Icon = formatChange(networkData?.valueChange24h || 0).icon
                          return <Icon className="h-3 w-3 mr-1" />
                        })()}
                        {formatChange(networkData?.valueChange24h || 0).text}
                      </span>
                      from last 24h
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total DeFi TVL</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(defiData?.totalValueLocked || 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`flex items-center ${formatChange(defiData?.tvlChange || 0).color}`}>
                        {(() => {
                          const Icon = formatChange(defiData?.tvlChange || 0).icon
                          return <Icon className="h-3 w-3 mr-1" />
                        })()}
                        {formatChange(defiData?.tvlChange || 0).text}
                      </span>
                      from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Derivatives OI</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(derivativesData?.openInterest || 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="flex items-center text-blue-500">
                        <Target className="h-3 w-3 mr-1" />
                        {((derivativesData?.longShortRatio || 0.5) * 100).toFixed(1)}% Long
                      </span>
                      Long/Short Ratio
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bridge Volume</CardTitle>
                    <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(crossChainData?.totalBridgeVolume || 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="flex items-center text-purple-500">
                        <Activity className="h-3 w-3 mr-1" />
                        {(crossChainData?.bridgeTransactions || 0).toLocaleString()}
                      </span>
                      transactions today
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Institutional Adoption</CardTitle>
                <CardDescription>Corporate Bitcoin holdings and ETF flows</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Holdings</span>
                      <span className="text-sm font-bold">
                        {formatNumber(institutionalData?.institutionalHoldings || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">ETF Flows (24h)</span>
                      <span
                        className={`text-sm font-bold ${(institutionalData?.etfFlows || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {formatNumber(Math.abs(institutionalData?.etfFlows || 0))}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Top Corporate Holders:</p>
                      {institutionalData?.corporateAdoption.slice(0, 3).map((company, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span>{company.company}</span>
                          <span>{company.holdings.toLocaleString()} BTC</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Chain Activity</CardTitle>
                <CardDescription>Transaction volume across major blockchains</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blockchainData.slice(0, 4).map((blockchain, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{blockchain.name}</span>
                          <span className="text-sm text-muted-foreground">{blockchain.dominance.toFixed(1)}%</span>
                        </div>
                        <Progress value={blockchain.dominance} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blockchains" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blockchain Comparison</CardTitle>
                    <CardDescription>
                      Real-time performance metrics across major blockchain networks
                      <span className="text-xs text-muted-foreground ml-2">• Auto-refreshes every 5 minutes</span>
                    </CardDescription>
                  </div>
                  {refreshing && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating data...
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="grid grid-cols-9 gap-4 p-4 border rounded-lg">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-9 gap-4 p-4 bg-muted/50 rounded-lg text-sm font-medium">
                      <div>Network</div>
                      <div>Market Cap</div>
                      <div>TVL</div>
                      <div>24h Txns</div>
                      <div>Active Users</div>
                      <div>TPS</div>
                      <div>Block Time</div>
                      <div>24h Fees</div>
                      <div>24h Change</div>
                    </div>
                    {blockchainData.map((blockchain, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-9 gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{blockchain.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {blockchain.symbol}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">{formatNumber(blockchain.marketCap)}</div>
                        <div className="text-sm">{formatNumber(blockchain.tvl)}</div>
                        <div className="text-sm">
                          {blockchain.transactions24h >= 1000000
                            ? `${(blockchain.transactions24h / 1000000).toFixed(1)}M`
                            : `${(blockchain.transactions24h / 1000).toFixed(0)}K`}
                        </div>
                        <div className="text-sm">
                          {blockchain.activeAddresses >= 1000000
                            ? `${(blockchain.activeAddresses / 1000000).toFixed(1)}M`
                            : `${(blockchain.activeAddresses / 1000).toFixed(0)}K`}
                        </div>
                        <div className="text-sm font-mono">
                          {blockchain.tps >= 1000
                            ? `${(blockchain.tps / 1000).toFixed(0)}K`
                            : blockchain.tps.toLocaleString()}
                        </div>
                        <div className="text-sm">{blockchain.blockTime}s</div>
                        <div className="text-sm">{formatNumber(blockchain.fees24h)}</div>
                        <div className={`text-sm font-medium ${formatChange(blockchain.change24h).color}`}>
                          {formatChange(blockchain.change24h).text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Networks</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{blockchainData.length}</div>
                  <p className="text-xs text-muted-foreground">Active blockchains</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Combined TVL</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(blockchainData.reduce((sum, chain) => sum + chain.tvl, 0))}
                  </div>
                  <p className="text-xs text-muted-foreground">Across all chains</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Transactions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(blockchainData.reduce((sum, chain) => sum + chain.transactions24h, 0) / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-xs text-muted-foreground">24h volume</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(blockchainData.reduce((sum, chain) => sum + chain.fees24h, 0))}
                  </div>
                  <p className="text-xs text-muted-foreground">24h network fees</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{networkData?.totalTransactions.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span
                        className={`flex items-center ${formatChange(networkData?.transactionChange24h || 0).color}`}
                      >
                        {(() => {
                          const Icon = formatChange(networkData?.transactionChange24h || 0).icon
                          return <Icon className="h-3 w-3 mr-1" />
                        })()}
                        {formatChange(networkData?.transactionChange24h || 0).text}
                      </span>
                      from last 24h
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Addresses</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{networkData?.activeAddresses.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`flex items-center ${formatChange(networkData?.addressChange24h || 0).color}`}>
                        {(() => {
                          const Icon = formatChange(networkData?.addressChange24h || 0).icon
                          return <Icon className="h-3 w-3 mr-1" />
                        })()}
                        {formatChange(networkData?.addressChange24h || 0).text}
                      </span>
                      from last 24h
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gas Usage</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{networkData?.gasUsage.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`flex items-center ${formatChange(networkData?.gasChange24h || 0).color}`}>
                        {(() => {
                          const Icon = formatChange(networkData?.gasChange24h || 0).icon
                          return <Icon className="h-3 w-3 mr-1" />
                        })()}
                        {formatChange(networkData?.gasChange24h || 0).text}
                      </span>
                      from last 24h
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Network Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(networkData?.networkValue || 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`flex items-center ${formatChange(networkData?.valueChange24h || 0).color}`}>
                        {(() => {
                          const Icon = formatChange(networkData?.valueChange24h || 0).icon
                          return <Icon className="h-3 w-3 mr-1" />
                        })()}
                        {formatChange(networkData?.valueChange24h || 0).text}
                      </span>
                      from last 24h
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Network Health</CardTitle>
                <CardDescription>Key network performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Block Time</span>
                        <span className="text-sm text-muted-foreground">{networkData?.blockTime}s</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Network Congestion</span>
                        <span className="text-sm text-muted-foreground">{networkData?.networkCongestion}</span>
                      </div>
                      <Progress
                        value={
                          networkData?.networkCongestion === "High"
                            ? 80
                            : networkData?.networkCongestion === "Medium"
                              ? 60
                              : 40
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Validator Uptime</span>
                        <span className="text-sm text-muted-foreground">{networkData?.validatorUptime}%</span>
                      </div>
                      <Progress value={networkData?.validatorUptime || 99} className="h-2" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Protocols</CardTitle>
                <CardDescription>Most active protocols by transaction volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-6 w-12" />
                        </div>
                      ))
                    : protocolsData.map((protocol, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{protocol.name}</p>
                            <p className="text-xs text-muted-foreground">{protocol.volume}</p>
                          </div>
                          <Badge variant={protocol.change.startsWith("+") ? "default" : "destructive"}>
                            {protocol.change}
                          </Badge>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="defi" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Value Locked</CardTitle>
                    <CardDescription>Across all DeFi protocols</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(defiData?.totalValueLocked || 0)}</div>
                    <p className={`text-sm flex items-center mt-2 ${formatChange(defiData?.tvlChange || 0).color}`}>
                      {(() => {
                        const Icon =
                          formatChange(defiData?.tvlChange || 0).icon === ArrowUpRight ? TrendingUp : TrendingDown
                        return <Icon className="h-4 w-4 mr-1" />
                      })()}
                      {formatChange(defiData?.tvlChange || 0).text} from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>DEX Volume</CardTitle>
                    <CardDescription>24h trading volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(defiData?.dexVolume || 0)}</div>
                    <p className={`text-sm flex items-center mt-2 ${formatChange(defiData?.volumeChange || 0).color}`}>
                      {(() => {
                        const Icon =
                          formatChange(defiData?.volumeChange || 0).icon === ArrowUpRight ? TrendingUp : TrendingDown
                        return <Icon className="h-4 w-4 mr-1" />
                      })()}
                      {formatChange(defiData?.volumeChange || 0).text} from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lending Protocols</CardTitle>
                    <CardDescription>Total borrowed amount</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(defiData?.lendingAmount || 0)}</div>
                    <p className={`text-sm flex items-center mt-2 ${formatChange(defiData?.lendingChange || 0).color}`}>
                      {(() => {
                        const Icon =
                          formatChange(defiData?.lendingChange || 0).icon === ArrowUpRight ? TrendingUp : TrendingDown
                        return <Icon className="h-4 w-4 mr-1" />
                      })()}
                      {formatChange(defiData?.lendingChange || 0).text} from last week
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="derivatives" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Open Interest</CardTitle>
                    <CardDescription>Total futures OI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(derivativesData?.openInterest || 0)}</div>
                    <p className="text-xs text-muted-foreground mt-2">Across all exchanges</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>24h Volume</CardTitle>
                    <CardDescription>Derivatives trading</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(derivativesData?.volume24h || 0)}</div>
                    <p className="text-xs text-muted-foreground mt-2">Futures & options</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Long/Short Ratio</CardTitle>
                    <CardDescription>Market sentiment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {((derivativesData?.longShortRatio || 0.5) * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Long positions</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Funding Rate</CardTitle>
                    <CardDescription>Perpetual swaps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-3xl font-bold ${(derivativesData?.fundingRate || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {((derivativesData?.fundingRate || 0) * 100).toFixed(3)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">8h funding rate</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Derivatives Exchanges</CardTitle>
              <CardDescription>24h trading volume and market share</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {derivativesData?.topExchanges.map((exchange, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{exchange.name}</p>
                        <p className="text-sm text-muted-foreground">{formatNumber(exchange.volume)}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{exchange.share.toFixed(1)}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crosschain" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Bridge Volume</CardTitle>
                    <CardDescription>Total cross-chain value</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(crossChainData?.totalBridgeVolume || 0)}</div>
                    <p className="text-xs text-muted-foreground mt-2">Across all bridges</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bridge Transactions</CardTitle>
                    <CardDescription>24h cross-chain txns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {(crossChainData?.bridgeTransactions || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Cross-chain transfers</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Bridges</CardTitle>
                    <CardDescription>Operating protocols</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{crossChainData?.topBridges.length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-2">Major bridge protocols</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Bridge Protocols</CardTitle>
              <CardDescription>Volume and supported chains</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {crossChainData?.topBridges.map((bridge, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{bridge.name}</p>
                        <p className="text-sm text-muted-foreground">{bridge.chains.join(" • ")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatNumber(bridge.volume)}</p>
                        <p className="text-xs text-muted-foreground">24h volume</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institutional" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Corporate Holdings</CardTitle>
                    <CardDescription>Total BTC held by companies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {formatNumber(institutionalData?.institutionalHoldings || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Public companies</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ETF Flows</CardTitle>
                    <CardDescription>24h net inflows</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-3xl font-bold ${(institutionalData?.etfFlows || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {formatNumber(Math.abs(institutionalData?.etfFlows || 0))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {(institutionalData?.etfFlows || 0) >= 0 ? "Net inflows" : "Net outflows"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Companies</CardTitle>
                    <CardDescription>With BTC holdings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{institutionalData?.corporateAdoption.length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-2">Public companies</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Corporate Bitcoin Holdings</CardTitle>
              <CardDescription>Top companies by BTC holdings</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <Skeleton className="h-4 w-24" />
                      <div className="text-right space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {institutionalData?.corporateAdoption.map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{company.company}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{company.holdings.toLocaleString()} BTC</p>
                        <p className="text-sm text-muted-foreground">{formatNumber(company.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nft" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-16 mb-1" />
                    <Skeleton className="h-4 w-12" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>NFT Sales Volume</CardTitle>
                    <CardDescription>24h volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(nftData?.salesVolume || 0)}</div>
                    <p className={`text-sm ${formatChange(nftData?.volumeChange || 0).color}`}>
                      {formatChange(nftData?.volumeChange || 0).text}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Collections</CardTitle>
                    <CardDescription>Collections with sales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{nftData?.activeCollections.toLocaleString()}</div>
                    <p className={`text-sm ${formatChange(nftData?.collectionsChange || 0).color}`}>
                      {formatChange(nftData?.collectionsChange || 0).text}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Unique Buyers</CardTitle>
                    <CardDescription>24h active buyers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{nftData?.uniqueBuyers.toLocaleString()}</div>
                    <p className={`text-sm ${formatChange(nftData?.buyersChange || 0).color}`}>
                      {formatChange(nftData?.buyersChange || 0).text}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Floor Price Index</CardTitle>
                    <CardDescription>Top 100 collections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{nftData?.floorPriceIndex.toFixed(2)} ETH</div>
                    <p className={`text-sm ${formatChange(nftData?.floorChange || 0).color}`}>
                      {formatChange(nftData?.floorChange || 0).text}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Whale Activity</CardTitle>
              <CardDescription>Large transactions and wallet movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-20" />
                          </div>
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))
                  : whaleData.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{transaction.type}</Badge>
                            <span className="font-medium">{transaction.amount}</span>
                            <span className="text-muted-foreground">({transaction.value})</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {transaction.from} → {transaction.to}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{transaction.time}</p>
                        </div>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
