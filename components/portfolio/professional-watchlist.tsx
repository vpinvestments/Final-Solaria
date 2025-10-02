"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Star,
  Bell,
  Settings,
  Loader2,
  BarChart3,
  Activity,
  Eye,
  Heart,
  BellRing,
  Trash2,
  Edit,
  AlertCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getTrendingCoins } from "@/lib/crypto-api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface WatchlistItem {
  id: number
  coinId: string
  name: string
  symbol: string
  notes?: string
  isFavorite: boolean
  addedDate: string
  price: number
  change24h: number
  change7d: number
  volume24h: number
  marketCap: number
  image: string
  alerts: Array<{
    type: string
    value: number
    active: boolean
  }>
}

export function ProfessionalWatchlist() {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState<"all" | "favorites" | "gainers" | "losers" | "alerts">("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [totalValue, setTotalValue] = useState(0)
  const [avgChange, setAvgChange] = useState(0)

  const fetchWatchlist = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/watchlist?userId=1")
      const data = await response.json()

      if (data.success) {
        setWatchlistItems(data.data)

        // Calculate portfolio stats
        const total = data.data.reduce((sum: number, item: WatchlistItem) => sum + item.marketCap, 0)
        const avg = data.data.reduce((sum: number, item: WatchlistItem) => sum + item.change24h, 0) / data.data.length
        setTotalValue(total)
        setAvgChange(avg)
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to load watchlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWatchlist()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchWatchlist, 60000)
    return () => clearInterval(interval)
  }, [fetchWatchlist])

  const handleToggleFavorite = async (item: WatchlistItem) => {
    try {
      const response = await fetch(`/api/watchlist/${item.coinId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "1",
          isFavorite: !item.isFavorite,
        }),
      })

      if (response.ok) {
        setWatchlistItems((prev) =>
          prev.map((watchItem) =>
            watchItem.coinId === item.coinId ? { ...watchItem, isFavorite: !watchItem.isFavorite } : watchItem,
          ),
        )
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleRemove = async (coinId: string) => {
    try {
      const response = await fetch(`/api/watchlist?userId=1&coinId=${coinId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWatchlistItems((prev) => prev.filter((item) => item.coinId !== coinId))
        toast({
          title: "Success",
          description: "Removed from watchlist",
        })
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error)
    }
  }

  const filteredItems = watchlistItems
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return false

      switch (filterBy) {
        case "favorites":
          return item.isFavorite
        case "gainers":
          return item.change24h > 0
        case "losers":
          return item.change24h < 0
        case "alerts":
          return item.alerts.some((alert) => alert.active)
        default:
          return true
      }
    })
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return b.marketCap - a.marketCap
    })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="loading-spinner" />
          <p className="text-muted-foreground">Loading watchlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-balance flex items-center gap-3">
            <Eye className="h-8 w-8 text-primary" />
            Watchlist Monitor
          </h1>
          <p className="text-muted-foreground mt-2">Professional cryptocurrency tracking and analysis</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="professional-button gap-2">
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add to Watchlist</DialogTitle>
            </DialogHeader>
            <AddAssetForm onClose={() => setShowAddDialog(false)} onSuccess={fetchWatchlist} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
                <p className="text-3xl font-bold">{watchlistItems.length}</p>
              </div>
              <BarChart3 className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg 24h Change</p>
                <p className={`text-3xl font-bold ${avgChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {avgChange >= 0 ? "+" : ""}
                  {avgChange.toFixed(2)}%
                </p>
              </div>
              <Activity className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
                <p className="text-3xl font-bold">
                  {watchlistItems.reduce((sum, item) => sum + item.alerts.filter((a) => a.active).length, 0)}
                </p>
              </div>
              <BellRing className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Favorites</p>
                <p className="text-3xl font-bold">{watchlistItems.filter((item) => item.isFavorite).length}</p>
              </div>
              <Heart className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="search-bar w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {(["all", "favorites", "gainers", "losers", "alerts"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterBy(filter)}
                  className={`filter-chip ${filterBy === filter ? "filter-chip-active" : "filter-chip-inactive"}`}
                >
                  {filter === "all" && "All Assets"}
                  {filter === "favorites" && "⭐ Favorites"}
                  {filter === "gainers" && "📈 Gainers"}
                  {filter === "losers" && "📉 Losers"}
                  {filter === "alerts" && "🔔 Alerts"}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Watchlist Grid */}
      {filteredItems.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="empty-state">
            <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No assets found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterBy !== "all"
                ? "Try adjusting your filters or search term"
                : "Add some cryptocurrencies to start monitoring"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="watchlist-grid">
          {filteredItems.map((item) => (
            <Card key={item.id} className="watchlist-card">
              <div className="watchlist-header">
                <div className="coin-info">
                  <div className="relative">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="coin-logo" />
                    {item.isFavorite && <Star className="absolute -top-1 -right-1 h-5 w-5 text-primary fill-primary" />}
                  </div>
                  <div className="coin-details">
                    <h3 className="coin-name">{item.name}</h3>
                    <p className="coin-symbol">{item.symbol}</p>
                  </div>
                </div>

                <div className="price-section">
                  <div className="current-price">{formatPrice(item.price)}</div>
                  <div className={`price-change ${item.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {item.change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {item.change24h >= 0 ? "+" : ""}
                    {item.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Market Cap</span>
                  <span className="metric-value">{formatLargeNumber(item.marketCap)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Volume 24h</span>
                  <span className="metric-value">{formatLargeNumber(item.volume24h)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">7d Change</span>
                  <span className={`metric-value ${item.change7d >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {item.change7d >= 0 ? "+" : ""}
                    {item.change7d.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Sparkline Placeholder */}
              <div className="sparkline-container">
                <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                  Price trend visualization
                </div>
              </div>

              <div className="action-bar">
                <div className="flex items-center gap-2">
                  {item.alerts.filter((a) => a.active).length > 0 && (
                    <div className="alert-indicator">
                      <BellRing className="h-3 w-3" />
                      {item.alerts.filter((a) => a.active).length} active
                    </div>
                  )}
                  {item.notes && (
                    <Badge variant="outline" className="text-xs">
                      Has notes
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggleFavorite(item)} className="favorite-button">
                    <Star
                      className={`h-5 w-5 ${item.isFavorite ? "text-primary fill-primary" : "text-muted-foreground"}`}
                    />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card">
                      <DropdownMenuItem>
                        <Bell className="h-4 w-4 mr-2" />
                        Manage Alerts
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Notes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemove(item.coinId)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function AddAssetForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [trendingCoins, setTrendingCoins] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"search" | "trending">("search")

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trending = await getTrendingCoins()
        setTrendingCoins([...trending.trending, ...trending.topGainers].slice(0, 8))
      } catch (error) {
        console.error("Error fetching trending:", error)
      }
    }
    fetchTrending()
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`/api/crypto/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        if (data.success) {
          setSearchResults(data.data)
        }
      } catch (error) {
        console.error("Error searching:", error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleAdd = async (asset: any) => {
    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "1",
          coinId: asset.id,
          coinName: asset.name,
          coinSymbol: asset.symbol,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `${asset.name} added to watchlist`,
        })
        onSuccess()
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add to watchlist",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "search"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Search
        </button>
        <button
          onClick={() => setActiveTab("trending")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "trending"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Trending
        </button>
      </div>

      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="search-bar">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {loading && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 rounded-lg bg-card/30 hover:bg-card/50 border border-border/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img src={asset.image || "/placeholder.svg"} alt={asset.name} className="h-10 w-10 rounded-full" />
                  <div>
                    <div className="font-semibold">{asset.name}</div>
                    <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                  </div>
                </div>
                <Button onClick={() => handleAdd(asset)} size="sm" className="professional-button">
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "trending" && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {trendingCoins.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center justify-between p-4 rounded-lg bg-card/30 hover:bg-card/50 border border-border/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <img src={asset.image || "/placeholder.svg"} alt={asset.name} className="h-10 w-10 rounded-full" />
                <div>
                  <div className="font-semibold">{asset.name}</div>
                  <div className="text-sm text-emerald-400">+{Math.abs(asset.change).toFixed(2)}% trending</div>
                </div>
              </div>
              <Button onClick={() => handleAdd(asset)} size="sm" className="professional-button">
                Add
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
