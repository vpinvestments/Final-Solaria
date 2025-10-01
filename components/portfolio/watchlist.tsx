"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Eye,
  Plus,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  Star,
  MoreHorizontal,
  Trash2,
  Edit,
  AlertTriangle,
  Loader2,
  Heart,
  BellRing,
  Settings,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { getTrendingCoins } from "@/lib/crypto-api"

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

interface SearchResult {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  image: string
  marketCap: number
}

export function Watchlist() {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAlertsDialog, setShowAlertsDialog] = useState(false)
  const [selectedItemForAlerts, setSelectedItemForAlerts] = useState<WatchlistItem | null>(null)

  const fetchWatchlist = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/watchlist?userId=1")
      const data = await response.json()

      if (data.success) {
        setWatchlistItems(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load watchlist",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching watchlist:", error)
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
  }, [fetchWatchlist])

  const handleRemoveFromWatchlist = async (coinId: string, name: string) => {
    try {
      const response = await fetch(`/api/watchlist?userId=1&coinId=${coinId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setWatchlistItems((prev) => prev.filter((item) => item.coinId !== coinId))
        toast({
          title: "Success",
          description: `${name} removed from watchlist`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to remove from watchlist",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error removing from watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      })
    }
  }

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

      const data = await response.json()

      if (data.success) {
        setWatchlistItems((prev) =>
          prev.map((watchItem) =>
            watchItem.coinId === item.coinId ? { ...watchItem, isFavorite: !watchItem.isFavorite } : watchItem,
          ),
        )
        toast({
          title: "Success",
          description: `${item.name} ${!item.isFavorite ? "added to" : "removed from"} favorites`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update favorite",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite",
        variant: "destructive",
      })
    }
  }

  const handleEditNotes = (item: WatchlistItem) => {
    setEditingItem(item)
    setShowEditDialog(true)
  }

  const handleSaveNotes = async (notes: string) => {
    if (!editingItem) return

    try {
      const response = await fetch(`/api/watchlist/${editingItem.coinId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "1",
          notes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setWatchlistItems((prev) =>
          prev.map((item) => (item.coinId === editingItem.coinId ? { ...item, notes } : item)),
        )
        setShowEditDialog(false)
        setEditingItem(null)
        toast({
          title: "Success",
          description: "Notes updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update notes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error updating notes:", error)
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive",
      })
    }
  }

  const handleManageAlerts = (item: WatchlistItem) => {
    setSelectedItemForAlerts(item)
    setShowAlertsDialog(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(1)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(1)}M`
    }
    return `$${marketCap.toLocaleString()}`
  }

  const filteredItems = watchlistItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((item) => {
      if (filterBy === "all") return true
      if (filterBy === "gainers") return item.change24h > 0
      if (filterBy === "losers") return item.change24h < 0
      if (filterBy === "alerts") return item.alerts.some((alert) => alert.active)
      if (filterBy === "favorites") return item.isFavorite
      return true
    })
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1

      switch (sortBy) {
        case "price":
          return b.price - a.price
        case "change24h":
          return b.change24h - a.change24h
        case "marketcap":
          return b.marketCap - a.marketCap
        case "volume":
          return b.volume24h - a.volume24h
        default:
          return a.name.localeCompare(b.name)
      }
    })

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading watchlist...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Eye className="h-6 w-6 text-primary" />
              <span className="text-balance">Your Watchlist</span>
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1">
                {watchlistItems.length} assets
              </Badge>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="professional-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Add to Watchlist</DialogTitle>
                  </DialogHeader>
                  <AddToWatchlistForm onClose={() => setShowAddDialog(false)} onSuccess={fetchWatchlist} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search watchlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 modern-input"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="change24h">24h Change</SelectItem>
                <SelectItem value="marketcap">Market Cap</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
                <SelectItem value="gainers">Gainers</SelectItem>
                <SelectItem value="losers">Losers</SelectItem>
                <SelectItem value="alerts">With Alerts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="watchlist-item">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-12 w-12 rounded-full border border-border/50"
                    />
                    {item.isFavorite && (
                      <Heart className="absolute -top-1 -right-1 h-4 w-4 text-primary fill-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <Badge variant="outline" className="text-xs font-mono">
                        {item.symbol}
                      </Badge>
                      {item.alerts.some((alert) => alert.active) && (
                        <div className="alert-badge">
                          <BellRing className="h-3 w-3" />
                          <span>{item.alerts.filter((a) => a.active).length}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatMarketCap(item.marketCap)} • Vol: {formatMarketCap(item.volume24h)}
                    </div>
                    {item.notes && <div className="text-xs text-muted-foreground mt-1 italic">"{item.notes}"</div>}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-mono font-bold text-xl">{formatPrice(item.price)}</div>
                    <div className="flex items-center gap-4 mt-1">
                      <div
                        className={`flex items-center text-sm font-medium ${
                          item.change24h >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {item.change24h >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(item.change24h).toFixed(2)}%
                      </div>
                      <div className={`text-sm ${item.change7d >= 0 ? "text-green-400" : "text-red-400"}`}>
                        7d: {item.change7d >= 0 ? "+" : ""}
                        {item.change7d.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-transparent">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card">
                      <DropdownMenuItem onClick={() => handleManageAlerts(item)}>
                        <Bell className="h-4 w-4 mr-2" />
                        Manage Alerts
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleFavorite(item)}>
                        <Star className={`h-4 w-4 mr-2 ${item.isFavorite ? "text-primary fill-primary" : ""}`} />
                        {item.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditNotes(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Notes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleRemoveFromWatchlist(item.coinId, item.name)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove from Watchlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchTerm || filterBy !== "all"
                  ? "No assets found matching your criteria"
                  : "Your watchlist is empty. Add some cryptocurrencies to get started!"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Notes Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Edit Notes - {editingItem?.name}</DialogTitle>
          </DialogHeader>
          <EditNotesForm item={editingItem} onSave={handleSaveNotes} onClose={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Manage Alerts Dialog */}
      <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
        <DialogContent className="glass-card max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Alerts - {selectedItemForAlerts?.name}</DialogTitle>
          </DialogHeader>
          <ManageAlertsForm
            item={selectedItemForAlerts}
            onClose={() => setShowAlertsDialog(false)}
            onSuccess={fetchWatchlist}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

function AddToWatchlistForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [trendingCoins, setTrendingCoins] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<SearchResult | null>(null)
  const [priceAlerts, setPriceAlerts] = useState({ above: "", below: "" })
  const [volumeAlert, setVolumeAlert] = useState("")
  const [notes, setNotes] = useState("")

  // Fetch trending coins on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trending = await getTrendingCoins()
        setTrendingCoins([...trending.trending, ...trending.topGainers].slice(0, 6))
      } catch (error) {
        console.error("[v0] Error fetching trending coins:", error)
      }
    }
    fetchTrending()
  }, [])

  // Search cryptocurrencies
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/crypto/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.data)
      }
    } catch (error) {
      console.error("[v0] Error searching cryptocurrencies:", error)
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleAddToWatchlist = async (asset: SearchResult | any) => {
    try {
      const alerts = []

      if (priceAlerts.above) {
        alerts.push({ type: "price_above", value: Number.parseFloat(priceAlerts.above) })
      }
      if (priceAlerts.below) {
        alerts.push({ type: "price_below", value: Number.parseFloat(priceAlerts.below) })
      }
      if (volumeAlert) {
        alerts.push({ type: "volume_above", value: Number.parseFloat(volumeAlert) })
      }

      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "1",
          coinId: asset.id,
          coinName: asset.name,
          coinSymbol: asset.symbol,
          notes,
          alerts,
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
      console.error("[v0] Error adding to watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Assets</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset-search">Search for an asset</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="asset-search"
                placeholder="Search by name or symbol..."
                className="pl-10 modern-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-3 rounded-lg bg-card/30 hover:bg-card/50 cursor-pointer border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <img src={asset.image || "/placeholder.svg"} alt={asset.name} className="h-8 w-8 rounded-full" />
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-mono text-sm">{formatPrice(asset.price)}</div>
                    <div className={`text-xs ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {asset.change24h >= 0 ? "+" : ""}
                      {asset.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleAddToWatchlist(asset)}>
                  Add
                </Button>
              </div>
            ))}
            {searchQuery && !loading && searchResults.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">No results found for "{searchQuery}"</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="space-y-2">
            {trendingCoins.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-3 rounded-lg bg-card/30 hover:bg-card/50 cursor-pointer border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <img src={asset.image || "/placeholder.svg"} alt={asset.name} className="h-8 w-8 rounded-full" />
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-sm text-green-400">+{Math.abs(asset.change).toFixed(2)}% trending</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleAddToWatchlist(asset)}>
                  Add
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 border-t border-border pt-4">
        <h3 className="font-medium flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Set up alerts (optional)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price-above">Price above</Label>
            <Input
              id="price-above"
              placeholder="$0.00"
              value={priceAlerts.above}
              onChange={(e) => setPriceAlerts({ ...priceAlerts, above: e.target.value })}
              className="modern-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price-below">Price below</Label>
            <Input
              id="price-below"
              placeholder="$0.00"
              value={priceAlerts.below}
              onChange={(e) => setPriceAlerts({ ...priceAlerts, below: e.target.value })}
              className="modern-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume-alert">Volume above</Label>
          <Input
            id="volume-alert"
            placeholder="$0"
            value={volumeAlert}
            onChange={(e) => setVolumeAlert(e.target.value)}
            className="modern-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add your notes about this asset..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="modern-input min-h-[80px]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function EditNotesForm({
  item,
  onSave,
  onClose,
}: {
  item: WatchlistItem | null
  onSave: (notes: string) => void
  onClose: () => void
}) {
  const [notes, setNotes] = useState(item?.notes || "")

  const handleSave = () => {
    onSave(notes)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-notes">Notes</Label>
        <Textarea
          id="edit-notes"
          placeholder="Add your notes about this asset..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="modern-input min-h-[120px]"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="professional-button">
          Save Notes
        </Button>
      </div>
    </div>
  )
}

function ManageAlertsForm({
  item,
  onClose,
  onSuccess,
}: {
  item: WatchlistItem | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newAlert, setNewAlert] = useState({ type: "price_above", value: "" })

  useEffect(() => {
    if (item) {
      fetchAlerts()
    }
  }, [item])

  const fetchAlerts = async () => {
    if (!item) return

    try {
      const response = await fetch(`/api/watchlist/alerts?userId=1&coinId=${item.coinId}`)
      const data = await response.json()

      if (data.success) {
        setAlerts(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlert = async () => {
    if (!item || !newAlert.value) return

    try {
      const response = await fetch("/api/watchlist/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "1",
          coinId: item.coinId,
          coinName: item.name,
          coinSymbol: item.symbol,
          alertType: newAlert.type,
          targetValue: Number.parseFloat(newAlert.value),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Alert created successfully",
        })
        setNewAlert({ type: "price_above", value: "" })
        fetchAlerts()
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create alert",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error creating alert:", error)
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAlert = async (alertId: number) => {
    try {
      const response = await fetch(`/api/watchlist/alerts?alertId=${alertId}&userId=1`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Alert deleted successfully",
        })
        fetchAlerts()
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete alert",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error deleting alert:", error)
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Existing Alerts */}
      <div className="space-y-3">
        <h3 className="font-medium">Current Alerts</h3>
        {alerts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No alerts set for this asset</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-border/50"
            >
              <div>
                <div className="font-medium">
                  {alert.type.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </div>
                <div className="text-sm text-muted-foreground">Target: ${alert.targetValue.toLocaleString()}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteAlert(alert.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Create New Alert */}
      <div className="space-y-4 border-t border-border pt-4">
        <h3 className="font-medium">Create New Alert</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Alert Type</Label>
            <Select value={newAlert.type} onValueChange={(value) => setNewAlert({ ...newAlert, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_above">Price Above</SelectItem>
                <SelectItem value="price_below">Price Below</SelectItem>
                <SelectItem value="volume_above">Volume Above</SelectItem>
                <SelectItem value="market_cap_above">Market Cap Above</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Target Value</Label>
            <Input
              placeholder="Enter value..."
              value={newAlert.value}
              onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
              className="modern-input"
            />
          </div>
        </div>
        <Button onClick={handleCreateAlert} className="professional-button w-full">
          Create Alert
        </Button>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

// Helper function for formatting price
function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: price < 1 ? 4 : 2,
    maximumFractionDigits: price < 1 ? 4 : 2,
  }).format(price)
}
