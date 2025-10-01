"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Search,
  Star,
  ExternalLink,
  DollarSign,
  Globe,
  Smartphone,
  Shield,
  Clock,
  TrendingUp,
  Users,
  X,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  TrendingDown,
  Minus,
} from "lucide-react"

const exchangeTypes = [
  { id: "all", name: "All Exchanges" },
  { id: "centralized", name: "Centralized (CEX)" },
  { id: "decentralized", name: "Decentralized (DEX)" },
  { id: "hybrid", name: "Hybrid" },
]

const regions = [
  { id: "all", name: "All Regions" },
  { id: "global", name: "Global" },
  { id: "us", name: "United States" },
  { id: "eu", name: "Europe" },
  { id: "asia", name: "Asia" },
]

const exchanges = [
  {
    id: 1,
    name: "Binance",
    type: "centralized",
    region: "global",
    rating: 4.5,
    reviews: 125000,
    volume24h: "$14.2B",
    tradingFee: "0.1%",
    withdrawalFee: "Variable",
    makerFee: "0.1%",
    takerFee: "0.1%",
    withdrawalFees: {
      BTC: "0.0005 BTC",
      ETH: "0.005 ETH",
      USDT: "1 USDT",
    },
    depositMethods: ["Bank Transfer", "Credit Card", "Crypto", "P2P"],
    withdrawalMethods: ["Bank Transfer", "Crypto"],
    kycRequired: true,
    kycLevels: ["Basic (2 BTC/day)", "Intermediate (100 BTC/day)", "Advanced (Unlimited)"],
    insuranceFund: "$1B+",
    regulatoryLicenses: ["Malta", "France", "Italy", "Spain"],
    customerSupport: {
      availability: "24/7",
      channels: ["Live Chat", "Email", "Phone"],
      avgResponseTime: "< 2 hours",
    },
    apiFeatures: {
      restApi: true,
      websocket: true,
      rateLimit: "1200 requests/minute",
      documentation: "Excellent",
    },
    advancedFeatures: {
      marginTrading: true,
      futuresTrading: true,
      optionsTrading: true,
      copyTrading: false,
      algorithmicTrading: true,
      darkPool: false,
    },
    securityScore: 9.2,
    liquidityScore: 9.8,
    userExperienceScore: 8.5,
    supportedCoins: 600,
    founded: "2017",
    headquarters: "Malta",
    features: ["Spot Trading", "Futures", "Options", "Staking", "NFT Marketplace", "Launchpad"],
    securityFeatures: ["2FA", "Cold Storage", "Insurance Fund", "Whitelist"],
    mobileApp: true,
    webTrading: true,
    apiTrading: true,
    fiatSupport: true,
    pros: ["Largest trading volume", "Low fees", "Wide coin selection", "Advanced features"],
    cons: ["Regulatory issues", "Complex interface", "Customer support", "Restricted in some countries"],
    logo: "/placeholder.svg?height=60&width=60&text=BN",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: 2,
    name: "Coinbase",
    type: "centralized",
    region: "global",
    rating: 4.2,
    reviews: 89000,
    volume24h: "$2.8B",
    tradingFee: "0.5%",
    withdrawalFee: "Variable",
    makerFee: "0.5%",
    takerFee: "0.5%",
    withdrawalFees: {
      BTC: "Network fee",
      ETH: "Network fee",
      USDT: "Network fee",
    },
    depositMethods: ["Bank Transfer", "Credit Card", "Debit Card", "PayPal", "Crypto"],
    withdrawalMethods: ["Bank Transfer", "PayPal", "Crypto"],
    kycRequired: true,
    kycLevels: ["Basic ($1K/day)", "Full (Unlimited)"],
    insuranceFund: "FDIC Insured (USD)",
    regulatoryLicenses: ["US (All 50 states)", "UK", "Germany", "Canada"],
    customerSupport: {
      availability: "24/7",
      channels: ["Live Chat", "Email", "Phone"],
      avgResponseTime: "< 4 hours",
    },
    apiFeatures: {
      restApi: true,
      websocket: true,
      rateLimit: "10,000 requests/hour",
      documentation: "Excellent",
    },
    advancedFeatures: {
      marginTrading: false,
      futuresTrading: false,
      optionsTrading: false,
      copyTrading: false,
      algorithmicTrading: true,
      darkPool: false,
    },
    securityScore: 9.5,
    liquidityScore: 8.2,
    userExperienceScore: 9.1,
    supportedCoins: 200,
    founded: "2012",
    headquarters: "United States",
    features: ["Spot Trading", "Coinbase Pro", "Staking", "NFT Marketplace", "Earn Program", "Vault Storage"],
    securityFeatures: ["2FA", "Cold Storage", "Insurance", "Biometric Login"],
    mobileApp: true,
    webTrading: true,
    apiTrading: true,
    fiatSupport: true,
    pros: ["User-friendly", "Regulated", "Strong security", "Educational resources"],
    cons: ["Higher fees", "Limited advanced features", "Geographic restrictions", "Customer support delays"],
    logo: "/placeholder.svg?height=60&width=60&text=CB",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 3,
    name: "Kraken",
    type: "centralized",
    region: "global",
    rating: 4.3,
    reviews: 45000,
    volume24h: "$1.2B",
    tradingFee: "0.26%",
    withdrawalFee: "Variable",
    makerFee: "0.16%",
    takerFee: "0.26%",
    withdrawalFees: {
      BTC: "0.00015 BTC",
      ETH: "0.0025 ETH",
      USDT: "5 USDT",
    },
    depositMethods: ["Bank Transfer", "Crypto"],
    withdrawalMethods: ["Bank Transfer", "Crypto"],
    kycRequired: true,
    kycLevels: ["Starter ($2K)", "Intermediate ($5K)", "Pro (Unlimited)"],
    insuranceFund: "Undisclosed",
    regulatoryLicenses: ["US (Money Transmitter)", "UK", "Canada", "Australia"],
    customerSupport: {
      availability: "24/7",
      channels: ["Live Chat", "Email"],
      avgResponseTime: "< 1 hour",
    },
    apiFeatures: {
      restApi: true,
      websocket: true,
      rateLimit: "1 request/second",
      documentation: "Good",
    },
    advancedFeatures: {
      marginTrading: true,
      futuresTrading: true,
      optionsTrading: false,
      copyTrading: false,
      algorithmicTrading: true,
      darkPool: true,
    },
    securityScore: 9.3,
    liquidityScore: 7.8,
    userExperienceScore: 7.9,
    supportedCoins: 190,
    founded: "2011",
    headquarters: "United States",
    features: ["Spot Trading", "Futures", "Margin Trading", "Staking", "OTC Trading", "Dark Pool"],
    securityFeatures: ["2FA", "Cold Storage", "PGP Encryption", "Global Settings Lock"],
    mobileApp: true,
    webTrading: true,
    apiTrading: true,
    fiatSupport: true,
    pros: ["Strong security", "Transparent", "Good customer support", "Advanced trading"],
    cons: ["Complex for beginners", "Limited mobile features", "Slower verification", "Higher spreads"],
    logo: "/placeholder.svg?height=60&width=60&text=KR",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: 4,
    name: "Uniswap",
    type: "decentralized",
    region: "global",
    rating: 4.1,
    reviews: 28000,
    volume24h: "$1.8B",
    tradingFee: "0.3%",
    withdrawalFee: "Gas fees",
    makerFee: "0.05% - 1%",
    takerFee: "0.05% - 1%",
    withdrawalFees: {
      BTC: "N/A",
      ETH: "Gas fees",
      USDT: "Gas fees",
    },
    depositMethods: ["Crypto Wallet"],
    withdrawalMethods: ["Crypto Wallet"],
    kycRequired: false,
    kycLevels: ["None"],
    insuranceFund: "N/A (Non-custodial)",
    regulatoryLicenses: ["Decentralized"],
    customerSupport: {
      availability: "Community",
      channels: ["Discord", "Forum", "Documentation"],
      avgResponseTime: "Variable",
    },
    apiFeatures: {
      restApi: true,
      websocket: false,
      rateLimit: "No limit",
      documentation: "Good",
    },
    advancedFeatures: {
      marginTrading: false,
      futuresTrading: false,
      optionsTrading: false,
      copyTrading: false,
      algorithmicTrading: true,
      darkPool: false,
    },
    securityScore: 8.5,
    liquidityScore: 8.9,
    userExperienceScore: 7.2,
    supportedCoins: 1000,
    founded: "2018",
    headquarters: "Decentralized",
    features: ["AMM Trading", "Liquidity Pools", "Yield Farming", "Governance", "V3 Concentrated Liquidity"],
    securityFeatures: ["Non-custodial", "Smart Contract Audits", "Decentralized", "Open Source"],
    mobileApp: true,
    webTrading: true,
    apiTrading: true,
    fiatSupport: false,
    pros: ["Decentralized", "No KYC", "Wide token selection", "Innovative features"],
    cons: ["Gas fees", "Impermanent loss", "Complex for beginners", "No fiat support"],
    logo: "/placeholder.svg?height=60&width=60&text=UNI",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 5,
    name: "FTX",
    type: "centralized",
    region: "global",
    rating: 2.1,
    reviews: 15000,
    volume24h: "$0",
    tradingFee: "N/A",
    withdrawalFee: "N/A",
    makerFee: "N/A",
    takerFee: "N/A",
    withdrawalFees: {
      BTC: "N/A",
      ETH: "N/A",
      USDT: "N/A",
    },
    depositMethods: [],
    withdrawalMethods: [],
    kycRequired: false,
    kycLevels: ["Service Discontinued"],
    insuranceFund: "Bankrupt",
    regulatoryLicenses: ["Revoked"],
    customerSupport: {
      availability: "None",
      channels: [],
      avgResponseTime: "N/A",
    },
    apiFeatures: {
      restApi: false,
      websocket: false,
      rateLimit: "N/A",
      documentation: "Discontinued",
    },
    advancedFeatures: {
      marginTrading: false,
      futuresTrading: false,
      optionsTrading: false,
      copyTrading: false,
      algorithmicTrading: false,
      darkPool: false,
    },
    securityScore: 0,
    liquidityScore: 0,
    userExperienceScore: 0,
    supportedCoins: 0,
    founded: "2019",
    headquarters: "Bahamas",
    features: ["Spot Trading", "Futures", "Options", "Tokenized Stocks", "Prediction Markets"],
    securityFeatures: ["2FA", "Cold Storage", "Insurance Fund"],
    mobileApp: false,
    webTrading: false,
    apiTrading: false,
    fiatSupport: false,
    pros: ["Advanced features", "Low fees", "Innovation"],
    cons: ["Bankruptcy", "Funds frozen", "Legal issues", "Service discontinued"],
    logo: "/placeholder.svg?height=60&width=60&text=FTX",
    color: "from-gray-400 to-gray-500",
    status: "defunct",
  },
  {
    id: 6,
    name: "Bybit",
    type: "centralized",
    region: "global",
    rating: 4.0,
    reviews: 32000,
    volume24h: "$3.5B",
    tradingFee: "0.1%",
    withdrawalFee: "Variable",
    makerFee: "0.1%",
    takerFee: "0.1%",
    withdrawalFees: {
      BTC: "0.0005 BTC",
      ETH: "0.005 ETH",
      USDT: "1 USDT",
    },
    depositMethods: ["Credit Card", "Crypto", "P2P"],
    withdrawalMethods: ["Crypto"],
    kycRequired: true,
    kycLevels: ["Basic (2 BTC/day)", "Advanced (Unlimited)"],
    insuranceFund: "$300M+",
    regulatoryLicenses: ["Dubai", "Cyprus"],
    customerSupport: {
      availability: "24/7",
      channels: ["Live Chat", "Email"],
      avgResponseTime: "< 3 hours",
    },
    apiFeatures: {
      restApi: true,
      websocket: true,
      rateLimit: "120 requests/minute",
      documentation: "Good",
    },
    advancedFeatures: {
      marginTrading: true,
      futuresTrading: true,
      optionsTrading: true,
      copyTrading: true,
      algorithmicTrading: true,
      darkPool: false,
    },
    securityScore: 8.7,
    liquidityScore: 8.4,
    userExperienceScore: 8.2,
    supportedCoins: 300,
    founded: "2018",
    headquarters: "Singapore",
    features: ["Spot Trading", "Derivatives", "Copy Trading", "Launchpad", "NFT Marketplace", "Earn"],
    securityFeatures: ["2FA", "Cold Storage", "Multi-signature", "Risk Management"],
    mobileApp: true,
    webTrading: true,
    apiTrading: true,
    fiatSupport: true,
    pros: ["Derivatives focus", "Copy trading", "Good mobile app", "Competitive fees"],
    cons: ["Regulatory uncertainty", "Limited in some regions", "Newer platform", "Customer support"],
    logo: "/placeholder.svg?height=60&width=60&text=BY",
    color: "from-orange-500 to-red-500",
  },
]

export default function Exchanges() {
  const [selectedType, setSelectedType] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [compareExchanges, setCompareExchanges] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("exchanges")

  const filteredExchanges = exchanges.filter((exchange) => {
    const matchesType = selectedType === "all" || exchange.type === selectedType
    const matchesRegion = selectedRegion === "all" || exchange.region === selectedRegion || exchange.region === "global"
    const matchesSearch =
      exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exchange.headquarters.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesRegion && matchesSearch
  })

  const toggleCompare = (exchangeId: number) => {
    setCompareExchanges((prev) => {
      if (prev.includes(exchangeId)) {
        // Remove if already selected
        return prev.filter((id) => id !== exchangeId)
      } else if (prev.length < 2) {
        // Add if less than 2 selected
        return [...prev, exchangeId]
      } else {
        // Replace the first one if 2 are already selected
        return [prev[1], exchangeId]
      }
    })
  }

  const compareExchangesData = exchanges.filter((exchange) => compareExchanges.includes(exchange.id))

  const viewComparison = () => {
    setActiveTab("comparison")
    setTimeout(() => {
      document.getElementById("comparison")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const getComparisonIndicator = (value1: any, value2: any, type: "higher-better" | "lower-better" | "neutral") => {
    if (type === "neutral") return "neutral"

    const num1 = typeof value1 === "string" ? Number.parseFloat(value1.replace(/[^0-9.]/g, "")) : value1
    const num2 = typeof value2 === "string" ? Number.parseFloat(value2.replace(/[^0-9.]/g, "")) : value2

    if (isNaN(num1) || isNaN(num2)) return "neutral"

    if (type === "higher-better") {
      return num1 > num2 ? "better" : num1 < num2 ? "worse" : "neutral"
    } else {
      return num1 < num2 ? "better" : num1 > num2 ? "worse" : "neutral"
    }
  }

  const ComparisonIndicator = ({ status }: { status: "better" | "worse" | "neutral" }) => {
    if (status === "better") {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (status === "worse") {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Cryptocurrency Exchanges</h1>
        <p className="text-muted-foreground text-lg">
          Compare and choose the best cryptocurrency exchanges for trading, investing, and managing your digital assets.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search exchanges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Exchange Type" />
            </SelectTrigger>
            <SelectContent>
              {exchangeTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {compareExchanges.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  {compareExchanges.length === 1
                    ? "Select one more exchange to compare"
                    : "Ready to compare 2 exchanges"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {compareExchangesData.map((exchange, index) => (
                  <div key={exchange.id} className="flex items-center gap-1">
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-md border">
                      <span className="text-sm font-medium">{exchange.name}</span>
                      <button
                        onClick={() => toggleCompare(exchange.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    {index === 0 && compareExchanges.length === 2 && (
                      <ArrowRight className="h-4 w-4 text-blue-600 mx-1" />
                    )}
                  </div>
                ))}
                {compareExchanges.length === 1 && (
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <span className="text-sm text-gray-500">Select another exchange</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {compareExchanges.length === 2 && (
                <Button variant="default" size="sm" onClick={viewComparison} className="bg-blue-600 hover:bg-blue-700">
                  Compare Now
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setCompareExchanges([])}>
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exchanges" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Browse Exchanges
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Compare Exchanges
            {compareExchanges.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {compareExchanges.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Exchanges Tab */}
        <TabsContent value="exchanges" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredExchanges.map((exchange) => (
              <Card
                key={exchange.id}
                className={`overflow-hidden hover:shadow-lg transition-shadow ${
                  exchange.status === "defunct" ? "opacity-60" : ""
                } ${compareExchanges.includes(exchange.id) ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
              >
                <div className={`h-32 bg-gradient-to-r ${exchange.color} relative`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{exchange.name}</h3>
                    <p className="text-white/80">{exchange.headquarters}</p>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 capitalize">
                      {exchange.type}
                    </Badge>
                    {exchange.status === "defunct" && (
                      <Badge variant="destructive" className="bg-red-500 text-white">
                        Defunct
                      </Badge>
                    )}
                    {compareExchanges.includes(exchange.id) && (
                      <Badge className="bg-blue-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{exchange.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({exchange.reviews.toLocaleString()} reviews)
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={compareExchanges.includes(exchange.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCompare(exchange.id)}
                      disabled={exchange.status === "defunct"}
                      className={compareExchanges.includes(exchange.id) ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {compareExchanges.includes(exchange.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Selected
                        </>
                      ) : compareExchanges.length === 2 ? (
                        "Replace"
                      ) : (
                        "Compare"
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">24h Volume</p>
                      <p className="font-semibold text-green-600">{exchange.volume24h}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trading Fee</p>
                      <p className="font-semibold">{exchange.tradingFee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Supported Coins</p>
                      <p className="font-semibold">{exchange.supportedCoins}+</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p className="font-semibold">{exchange.founded}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span className="text-xs text-muted-foreground">Security</span>
                      </div>
                      <p className="font-semibold text-sm">{exchange.securityScore}/10</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-muted-foreground">Liquidity</span>
                      </div>
                      <p className="font-semibold text-sm">{exchange.liquidityScore}/10</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="text-xs text-muted-foreground">UX</span>
                      </div>
                      <p className="font-semibold text-sm">{exchange.userExperienceScore}/10</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Fee Structure</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Maker:</span>
                        <span className="font-medium">{exchange.makerFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taker:</span>
                        <span className="font-medium">{exchange.takerFee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {exchange.features.slice(0, 4).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {exchange.features.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{exchange.features.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Advanced Trading</h4>
                    <div className="flex flex-wrap gap-1">
                      {exchange.advancedFeatures.marginTrading && (
                        <Badge variant="secondary" className="text-xs">
                          Margin
                        </Badge>
                      )}
                      {exchange.advancedFeatures.futuresTrading && (
                        <Badge variant="secondary" className="text-xs">
                          Futures
                        </Badge>
                      )}
                      {exchange.advancedFeatures.optionsTrading && (
                        <Badge variant="secondary" className="text-xs">
                          Options
                        </Badge>
                      )}
                      {exchange.advancedFeatures.copyTrading && (
                        <Badge variant="secondary" className="text-xs">
                          Copy Trading
                        </Badge>
                      )}
                      {exchange.advancedFeatures.darkPool && (
                        <Badge variant="secondary" className="text-xs">
                          Dark Pool
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Platform Support</h4>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Smartphone className={`h-4 w-4 ${exchange.mobileApp ? "text-green-500" : "text-gray-400"}`} />
                        <span className={exchange.mobileApp ? "text-green-600" : "text-gray-400"}>Mobile</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className={`h-4 w-4 ${exchange.webTrading ? "text-green-500" : "text-gray-400"}`} />
                        <span className={exchange.webTrading ? "text-green-600" : "text-gray-400"}>Web</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign
                          className={`h-4 w-4 ${exchange.fiatSupport ? "text-green-500" : "text-gray-400"}`}
                        />
                        <span className={exchange.fiatSupport ? "text-green-600" : "text-gray-400"}>Fiat</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" disabled={exchange.status === "defunct"}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {exchange.status === "defunct" ? "Service Discontinued" : "Visit Exchange"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="mt-6" id="comparison">
          {compareExchangesData.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Exchanges Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Select 2 exchanges from the browse section to see a detailed side-by-side comparison.
                </p>
                <Button variant="outline" onClick={() => setActiveTab("exchanges")}>
                  Browse Exchanges
                </Button>
              </CardContent>
            </Card>
          ) : compareExchangesData.length === 1 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select One More Exchange</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You've selected <strong>{compareExchangesData[0].name}</strong>. Choose another exchange to compare.
                </p>
                <Button variant="outline" onClick={() => setActiveTab("exchanges")}>
                  Select Another Exchange
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-2">Head-to-Head Comparison</h2>
                <p className="text-muted-foreground mb-4">
                  Detailed comparison between your selected exchanges with difference indicators
                </p>
                <div className="flex items-center justify-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-8 bg-gradient-to-r ${compareExchangesData[0].color} rounded`} />
                    <div>
                      <h3 className="font-bold text-lg">{compareExchangesData[0].name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{compareExchangesData[0].type}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">VS</div>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-8 bg-gradient-to-r ${compareExchangesData[1].color} rounded`} />
                    <div>
                      <h3 className="font-bold text-lg">{compareExchangesData[1].name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{compareExchangesData[1].type}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="text-left p-4 font-medium">Feature</th>
                      <th className="text-center p-4 min-w-48">
                        <div className="flex flex-col items-center">
                          <div className={`w-16 h-10 bg-gradient-to-r ${compareExchangesData[0].color} rounded mb-2`} />
                          <h3 className="font-medium">{compareExchangesData[0].name}</h3>
                        </div>
                      </th>
                      <th className="text-center p-4 min-w-48">
                        <div className="flex flex-col items-center">
                          <div className={`w-16 h-10 bg-gradient-to-r ${compareExchangesData[1].color} rounded mb-2`} />
                          <h3 className="font-medium">{compareExchangesData[1].name}</h3>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">Overall Rating</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[0].rating,
                              compareExchangesData[1].rating,
                              "higher-better",
                            )}
                          />
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{compareExchangesData[0].rating}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[1].rating,
                              compareExchangesData[0].rating,
                              "higher-better",
                            )}
                          />
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{compareExchangesData[1].rating}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">24h Trading Volume</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[0].volume24h,
                              compareExchangesData[1].volume24h,
                              "higher-better",
                            )}
                          />
                          <span className="font-semibold text-green-600">{compareExchangesData[0].volume24h}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[1].volume24h,
                              compareExchangesData[0].volume24h,
                              "higher-better",
                            )}
                          />
                          <span className="font-semibold text-green-600">{compareExchangesData[1].volume24h}</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">Maker Fee</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[0].makerFee,
                              compareExchangesData[1].makerFee,
                              "lower-better",
                            )}
                          />
                          <span className="font-semibold">{compareExchangesData[0].makerFee}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[1].makerFee,
                              compareExchangesData[0].makerFee,
                              "lower-better",
                            )}
                          />
                          <span className="font-semibold">{compareExchangesData[1].makerFee}</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">Taker Fee</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[0].takerFee,
                              compareExchangesData[1].takerFee,
                              "lower-better",
                            )}
                          />
                          <span className="font-semibold">{compareExchangesData[0].takerFee}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[1].takerFee,
                              compareExchangesData[0].takerFee,
                              "lower-better",
                            )}
                          />
                          <span className="font-semibold">{compareExchangesData[1].takerFee}</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">Security Score</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[0].securityScore,
                              compareExchangesData[1].securityScore,
                              "higher-better",
                            )}
                          />
                          <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold">{compareExchangesData[0].securityScore}/10</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[1].securityScore,
                              compareExchangesData[0].securityScore,
                              "higher-better",
                            )}
                          />
                          <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold">{compareExchangesData[1].securityScore}/10</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">Liquidity Score</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[0].liquidityScore,
                              compareExchangesData[1].liquidityScore,
                              "higher-better",
                            )}
                          />
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="font-semibold">{compareExchangesData[0].liquidityScore}/10</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[1].liquidityScore,
                              compareExchangesData[0].liquidityScore,
                              "higher-better",
                            )}
                          />
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="font-semibold">{compareExchangesData[1].liquidityScore}/10</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">User Experience Score</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[0].userExperienceScore,
                              compareExchangesData[1].userExperienceScore,
                              "higher-better",
                            )}
                          />
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span className="font-semibold">{compareExchangesData[0].userExperienceScore}/10</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[1].userExperienceScore,
                              compareExchangesData[0].userExperienceScore,
                              "higher-better",
                            )}
                          />
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span className="font-semibold">{compareExchangesData[1].userExperienceScore}/10</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">Supported Coins</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[0].supportedCoins,
                              compareExchangesData[1].supportedCoins,
                              "higher-better",
                            )}
                          />
                          <span className="font-semibold">{compareExchangesData[0].supportedCoins}+</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ComparisonIndicator
                            status={getComparisonIndicator(
                              compareExchangesData[1].supportedCoins,
                              compareExchangesData[0].supportedCoins,
                              "higher-better",
                            )}
                          />
                          <span className="font-semibold">{compareExchangesData[1].supportedCoins}+</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">KYC Required</td>
                      <td className="p-4 text-center">
                        <span
                          className={`font-medium ${compareExchangesData[0].kycRequired ? "text-orange-600" : "text-green-600"}`}
                        >
                          {compareExchangesData[0].kycRequired ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`font-medium ${compareExchangesData[1].kycRequired ? "text-orange-600" : "text-green-600"}`}
                        >
                          {compareExchangesData[1].kycRequired ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">Customer Support Response</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{compareExchangesData[0].customerSupport.avgResponseTime}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{compareExchangesData[1].customerSupport.avgResponseTime}</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">Advanced Features</td>
                      <td className="p-4 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {compareExchangesData[0].advancedFeatures.marginTrading && (
                            <Badge variant="secondary" className="text-xs">
                              Margin
                            </Badge>
                          )}
                          {compareExchangesData[0].advancedFeatures.futuresTrading && (
                            <Badge variant="secondary" className="text-xs">
                              Futures
                            </Badge>
                          )}
                          {compareExchangesData[0].advancedFeatures.optionsTrading && (
                            <Badge variant="secondary" className="text-xs">
                              Options
                            </Badge>
                          )}
                          {compareExchangesData[0].advancedFeatures.copyTrading && (
                            <Badge variant="secondary" className="text-xs">
                              Copy Trading
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {compareExchangesData[1].advancedFeatures.marginTrading && (
                            <Badge variant="secondary" className="text-xs">
                              Margin
                            </Badge>
                          )}
                          {compareExchangesData[1].advancedFeatures.futuresTrading && (
                            <Badge variant="secondary" className="text-xs">
                              Futures
                            </Badge>
                          )}
                          {compareExchangesData[1].advancedFeatures.optionsTrading && (
                            <Badge variant="secondary" className="text-xs">
                              Options
                            </Badge>
                          )}
                          {compareExchangesData[1].advancedFeatures.copyTrading && (
                            <Badge variant="secondary" className="text-xs">
                              Copy Trading
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Action</td>
                      <td className="p-4 text-center">
                        <Button size="sm" className="w-full" disabled={compareExchangesData[0].status === "defunct"}>
                          {compareExchangesData[0].status === "defunct" ? "Defunct" : "Visit Exchange"}
                        </Button>
                      </td>
                      <td className="p-4 text-center">
                        <Button size="sm" className="w-full" disabled={compareExchangesData[1].status === "defunct"}>
                          {compareExchangesData[1].status === "defunct" ? "Defunct" : "Visit Exchange"}
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
