"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Search, Star, ExternalLink, Check } from "lucide-react"

const cardTypes = [
  { id: "all", name: "All Cards" },
  { id: "debit", name: "Debit Cards" },
  { id: "credit", name: "Credit Cards" },
  { id: "prepaid", name: "Prepaid Cards" },
  { id: "virtual", name: "Virtual Cards" },
]

const regions = [
  { id: "all", name: "All Regions" },
  { id: "global", name: "Global" },
  { id: "us", name: "United States" },
  { id: "eu", name: "Europe" },
  { id: "uk", name: "United Kingdom" },
  { id: "asia", name: "Asia Pacific" },
]

const cryptoCards = [
  {
    id: 1,
    name: "Coinbase Card",
    provider: "Coinbase",
    type: "debit",
    region: "global",
    rating: 4.5,
    reviews: 12500,
    cashback: "4%",
    annualFee: "$0",
    features: ["No annual fee", "4% crypto rewards", "Apple/Google Pay", "ATM withdrawals"],
    supportedCrypto: ["BTC", "ETH", "LTC", "BCH", "BAT", "REP", "ZRX"],
    limits: {
      daily: "$2,500",
      monthly: "$10,000",
      atm: "$1,000",
    },
    pros: ["High cashback rate", "Wide crypto support", "No annual fee", "Global acceptance"],
    cons: ["Limited to Coinbase ecosystem", "KYC required", "Conversion fees"],
    image: "/placeholder.svg?height=200&width=320&text=Coinbase+Card",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Crypto.com Visa Card",
    provider: "Crypto.com",
    type: "debit",
    region: "global",
    rating: 4.3,
    reviews: 8900,
    cashback: "8%",
    annualFee: "$0",
    features: ["Up to 8% cashback", "Netflix/Spotify rebates", "Airport lounge access", "Metal card"],
    supportedCrypto: ["CRO", "BTC", "ETH", "LTC", "XRP", "ADA", "DOT"],
    limits: {
      daily: "$5,000",
      monthly: "$25,000",
      atm: "$2,000",
    },
    pros: ["Highest cashback potential", "Premium benefits", "Metal card design", "CRO staking rewards"],
    cons: ["CRO staking required", "Complex tier system", "Geographic restrictions"],
    image: "/placeholder.svg?height=200&width=320&text=Crypto.com+Card",
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: 3,
    name: "BlockFi Rewards Card",
    provider: "BlockFi",
    type: "credit",
    region: "us",
    rating: 4.1,
    reviews: 3400,
    cashback: "1.5%",
    annualFee: "$0",
    features: ["1.5% Bitcoin rewards", "No annual fee", "Standard credit features", "Bitcoin auto-invest"],
    supportedCrypto: ["BTC"],
    limits: {
      daily: "Credit limit dependent",
      monthly: "Credit limit dependent",
      atm: "N/A",
    },
    pros: ["Bitcoin rewards", "No annual fee", "Credit building", "Auto-invest feature"],
    cons: ["US only", "Limited to Bitcoin", "Credit approval required", "Service discontinued"],
    image: "/placeholder.svg?height=200&width=320&text=BlockFi+Card",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    name: "Binance Card",
    provider: "Binance",
    type: "debit",
    region: "eu",
    rating: 4.2,
    reviews: 15600,
    cashback: "8%",
    annualFee: "$0",
    features: ["Up to 8% cashback", "Real-time conversion", "BNB rewards", "Mobile app control"],
    supportedCrypto: ["BNB", "BTC", "ETH", "BUSD", "SXP", "SWIPE"],
    limits: {
      daily: "€8,700",
      monthly: "€87,000",
      atm: "€290",
    },
    pros: ["High cashback with BNB", "Large crypto selection", "Real-time rates", "Mobile control"],
    cons: ["EU only", "BNB holding required", "Complex fee structure", "Regulatory issues"],
    image: "/placeholder.svg?height=200&width=320&text=Binance+Card",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 5,
    name: "Nexo Card",
    provider: "Nexo",
    type: "debit",
    region: "global",
    rating: 4.0,
    reviews: 2800,
    cashback: "2%",
    annualFee: "$0",
    features: ["2% cashback", "No FX fees", "Instant settlements", "Premium support"],
    supportedCrypto: ["NEXO", "BTC", "ETH", "USDC", "USDT"],
    limits: {
      daily: "$5,000",
      monthly: "$50,000",
      atm: "$2,000",
    },
    pros: ["No foreign exchange fees", "Instant settlements", "Premium support", "Global availability"],
    cons: ["Lower cashback rate", "NEXO token required", "Limited crypto options", "Newer platform"],
    image: "/placeholder.svg?height=200&width=320&text=Nexo+Card",
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: 6,
    name: "Wirex Card",
    provider: "Wirex",
    type: "debit",
    region: "global",
    rating: 3.8,
    reviews: 5200,
    cashback: "1.5%",
    annualFee: "$0",
    features: ["Multi-currency support", "Cryptoback rewards", "OTC trading", "Savings accounts"],
    supportedCrypto: ["WXT", "BTC", "ETH", "LTC", "XRP", "WAVES"],
    limits: {
      daily: "$5,000",
      monthly: "$20,000",
      atm: "$500",
    },
    pros: ["Multi-currency", "OTC trading", "Savings features", "Established platform"],
    cons: ["Lower rewards", "Complex interface", "Limited customer support", "Regulatory challenges"],
    image: "/placeholder.svg?height=200&width=320&text=Wirex+Card",
    color: "from-green-500 to-teal-500",
  },
]

const comparisonFeatures = [
  "No Annual Fee",
  "High Cashback Rate",
  "Global Acceptance",
  "Mobile App Control",
  "ATM Withdrawals",
  "Foreign Exchange",
  "Premium Support",
  "Metal Card Design",
]

export default function CryptoCards() {
  const [selectedType, setSelectedType] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [compareCards, setCompareCards] = useState<number[]>([])

  const filteredCards = cryptoCards.filter((card) => {
    const matchesType = selectedType === "all" || card.type === selectedType
    const matchesRegion = selectedRegion === "all" || card.region === selectedRegion || card.region === "global"
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.provider.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesRegion && matchesSearch
  })

  const toggleCompare = (cardId: number) => {
    setCompareCards((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : prev.length < 3 ? [...prev, cardId] : prev,
    )
  }

  const compareCardsData = cryptoCards.filter((card) => compareCards.includes(card.id))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Crypto Cards</h1>
        <p className="text-muted-foreground text-lg">
          Compare and find the best cryptocurrency debit and credit cards with rewards, cashback, and global acceptance.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search crypto cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Card Type" />
            </SelectTrigger>
            <SelectContent>
              {cardTypes.map((type) => (
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

        {compareCards.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">
              {compareCards.length} card{compareCards.length > 1 ? "s" : ""} selected for comparison
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("comparison")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Comparison
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCompareCards([])}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Browse Cards
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Compare Cards
          </TabsTrigger>
        </TabsList>

        {/* Cards Tab */}
        <TabsContent value="cards" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCards.map((card) => (
              <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-48 bg-gradient-to-r ${card.color} relative`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{card.name}</h3>
                    <p className="text-white/80">{card.provider}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {card.type}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{card.rating}</span>
                        <span className="text-sm text-muted-foreground">({card.reviews.toLocaleString()} reviews)</span>
                      </div>
                    </div>
                    <Button
                      variant={compareCards.includes(card.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCompare(card.id)}
                      disabled={!compareCards.includes(card.id) && compareCards.length >= 3}
                    >
                      {compareCards.includes(card.id) ? "Remove" : "Compare"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cashback</p>
                      <p className="font-semibold text-green-600">{card.cashback}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Fee</p>
                      <p className="font-semibold">{card.annualFee}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Key Features</h4>
                    <div className="space-y-1">
                      {card.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Supported Crypto</h4>
                    <div className="flex flex-wrap gap-1">
                      {card.supportedCrypto.slice(0, 4).map((crypto) => (
                        <Badge key={crypto} variant="secondary" className="text-xs">
                          {crypto}
                        </Badge>
                      ))}
                      {card.supportedCrypto.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{card.supportedCrypto.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="mt-6" id="comparison">
          {compareCardsData.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Cards Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Select up to 3 cards from the browse section to compare their features, fees, and benefits.
                </p>
                <Button variant="outline" onClick={() => document.querySelector('[value="cards"]')?.click()}>
                  Browse Cards
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Feature</th>
                    {compareCardsData.map((card) => (
                      <th key={card.id} className="text-center p-4 min-w-48">
                        <div className="flex flex-col items-center">
                          <div className={`w-16 h-10 bg-gradient-to-r ${card.color} rounded mb-2`} />
                          <h3 className="font-medium">{card.name}</h3>
                          <p className="text-sm text-muted-foreground">{card.provider}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Rating</td>
                    {compareCardsData.map((card) => (
                      <td key={card.id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {card.rating}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Cashback</td>
                    {compareCardsData.map((card) => (
                      <td key={card.id} className="p-4 text-center font-semibold text-green-600">
                        {card.cashback}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Annual Fee</td>
                    {compareCardsData.map((card) => (
                      <td key={card.id} className="p-4 text-center font-semibold">
                        {card.annualFee}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Daily Limit</td>
                    {compareCardsData.map((card) => (
                      <td key={card.id} className="p-4 text-center">
                        {card.limits.daily}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Supported Crypto</td>
                    {compareCardsData.map((card) => (
                      <td key={card.id} className="p-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {card.supportedCrypto.slice(0, 3).map((crypto) => (
                            <Badge key={crypto} variant="secondary" className="text-xs">
                              {crypto}
                            </Badge>
                          ))}
                          {card.supportedCrypto.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{card.supportedCrypto.length - 3}
                            </Badge>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Action</td>
                    {compareCardsData.map((card) => (
                      <td key={card.id} className="p-4 text-center">
                        <Button size="sm" className="w-full">
                          Apply Now
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
