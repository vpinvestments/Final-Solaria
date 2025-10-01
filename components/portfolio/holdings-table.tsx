"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  MoreHorizontal,
  Edit,
  Trash2,
  Target,
  AlertTriangle,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Wallet,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
    image: "/bitcoin-concept.png",
    allocation: 52.3,
    riskLevel: "Medium",
    lastTransaction: "2024-01-15",
    notes: "Long-term hold",
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
    image: "/ethereum-abstract.png",
    allocation: 13.0,
    riskLevel: "Medium",
    lastTransaction: "2024-01-12",
    notes: "DeFi exposure",
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
    image: "/solana-blockchain.png",
    allocation: 8.8,
    riskLevel: "High",
    lastTransaction: "2024-01-10",
    notes: "Growth play",
  },
]

export function HoldingsTable() {
  const [selectedHoldings, setSelectedHoldings] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("value")
  const [filterBy, setFilterBy] = useState("all")
  const [editingPosition, setEditingPosition] = useState<string | null>(null)
  const [showAddPosition, setShowAddPosition] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
  }

  const formatAmount = (amount: number) => {
    return amount.toFixed(6)
  }

  const filteredHoldings = holdings
    .filter(
      (holding) =>
        holding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((holding) => {
      if (filterBy === "all") return true
      if (filterBy === "profitable") return holding.pnl > 0
      if (filterBy === "losing") return holding.pnl < 0
      if (filterBy === "high-risk") return holding.riskLevel === "High"
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "value":
          return b.value - a.value
        case "pnl":
          return b.pnl - a.pnl
        case "allocation":
          return b.allocation - a.allocation
        default:
          return 0
      }
    })

  const totalValue = filteredHoldings.reduce((sum, h) => sum + h.value, 0)
  const totalPnL = filteredHoldings.reduce((sum, h) => sum + h.pnl, 0)
  const profitablePositions = filteredHoldings.filter((h) => h.pnl > 0).length
  const totalPositions = filteredHoldings.length

  const handleExportHoldings = () => {
    const csvContent = [
      ["Asset", "Symbol", "Amount", "Avg Price", "Current Price", "Value", "P&L", "Allocation", "Risk Level"].join(","),
      ...filteredHoldings.map((h) =>
        [h.name, h.symbol, h.amount, h.avgPrice, h.currentPrice, h.value, h.pnl, h.allocation, h.riskLevel].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `holdings-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedHoldings(filteredHoldings.map((h) => h.id))
    } else {
      setSelectedHoldings([])
    }
  }

  const handleSelectHolding = (holdingId: string, checked: boolean) => {
    if (checked) {
      setSelectedHoldings([...selectedHoldings, holdingId])
    } else {
      setSelectedHoldings(selectedHoldings.filter((id) => id !== holdingId))
    }
  }

  const handleBulkActions = () => {
    console.log("[v0] Bulk actions for:", selectedHoldings)
    // Here you would implement bulk operations like sell, transfer, etc.
  }

  const handleBuyMore = (holdingId: string) => {
    console.log("[v0] Buy more of:", holdingId)
    // Here you would open a buy dialog or redirect to trading
  }

  const handleSellPosition = (holdingId: string) => {
    console.log("[v0] Sell position:", holdingId)
    // Here you would open a sell dialog or redirect to trading
  }

  return (
    <Card className="glass-card w-full overflow-x-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Holdings Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportHoldings}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={showAddPosition} onOpenChange={setShowAddPosition}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Position
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Position</DialogTitle>
                </DialogHeader>
                <AddPositionForm onClose={() => setShowAddPosition(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl md:text-2xl font-bold text-blue-400">{formatPrice(totalValue)}</div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className={`text-xl md:text-2xl font-bold ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
              {formatPrice(totalPnL)}
            </div>
            <div className="text-sm text-muted-foreground">Total P&L</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl md:text-2xl font-bold text-green-400">{profitablePositions}</div>
            <div className="text-sm text-muted-foreground">Profitable</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl md:text-2xl font-bold text-purple-400">{totalPositions}</div>
            <div className="text-sm text-muted-foreground">Total Positions</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mt-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search holdings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value">Value</SelectItem>
                <SelectItem value="pnl">P&L</SelectItem>
                <SelectItem value="allocation">Allocation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Holdings</SelectItem>
                <SelectItem value="profitable">Profitable</SelectItem>
                <SelectItem value="losing">Losing</SelectItem>
                <SelectItem value="high-risk">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Individual Holdings Cards */}
          {filteredHoldings.map((holding) => (
            <div
              key={holding.id}
              className="w-full p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img src={holding.image || "/placeholder.svg"} alt={holding.name} className="h-8 w-8 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{holding.name}</div>
                    <Badge
                      variant={
                        holding.riskLevel === "High"
                          ? "destructive"
                          : holding.riskLevel === "Medium"
                            ? "secondary"
                            : "default"
                      }
                      className="text-xs"
                    >
                      {holding.riskLevel}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Holdings</span>
                    <span className="font-mono text-sm">
                      {formatAmount(holding.amount)} {holding.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Value</span>
                    <span className="font-mono font-medium">{formatPrice(holding.value)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Price</span>
                    <span className="font-mono text-sm">{formatPrice(holding.avgPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current</span>
                    <span className="font-mono text-sm">{formatPrice(holding.currentPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h Change</span>
                    <div
                      className={`flex items-center text-sm ${holding.change24h >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {holding.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(holding.change24h).toFixed(2)}%
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">P&L</span>
                    <span className={`font-mono text-sm ${holding.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {formatPrice(holding.pnl)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Allocation</span>
                    <span className="text-sm">{holding.allocation}%</span>
                  </div>
                  {holding.notes && (
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-xs text-muted-foreground italic">{holding.notes}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBuyMore(holding.id)}
                  className="flex-1 min-w-[60px]"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Buy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSellPosition(holding.id)}
                  className="flex-1 min-w-[60px]"
                >
                  <Minus className="h-3 w-3 mr-1" />
                  Sell
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card">
                    <DropdownMenuItem onClick={() => setEditingPosition(holding.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Position
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Target className="h-4 w-4 mr-2" />
                      Set Target
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Set Alert
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Position
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
        {filteredHoldings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No holdings found matching your filters</div>
        )}
      </CardContent>
    </Card>
  )
}

function AddPositionForm({ onClose }: { onClose?: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [uploadMessage, setUploadMessage] = useState("")
  const [parsedTrades, setParsedTrades] = useState<any[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus("idle")
      setUploadMessage("")
      setParsedTrades([])
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return

    setUploadStatus("processing")
    setUploadMessage("Processing file...")

    try {
      const text = await selectedFile.text()
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length < 2) {
        throw new Error("File must contain at least a header row and one data row")
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
      const trades = []

      const requiredHeaders = ["date", "asset", "type", "amount", "price"]
      const missingHeaders = requiredHeaders.filter((h) => !headers.some((header) => header.includes(h)))

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
      }

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())
        if (values.length < headers.length) continue

        const trade: any = {}
        headers.forEach((header, index) => {
          if (header.includes("date")) trade.date = values[index]
          else if (header.includes("asset") || header.includes("symbol")) trade.asset = values[index]
          else if (header.includes("type") || header.includes("side")) trade.type = values[index]
          else if (header.includes("amount") || header.includes("quantity"))
            trade.amount = Number.parseFloat(values[index]) || 0
          else if (header.includes("price")) trade.price = Number.parseFloat(values[index]) || 0
          else if (header.includes("total") || header.includes("value"))
            trade.total = Number.parseFloat(values[index]) || 0
          else if (header.includes("notes") || header.includes("description")) trade.notes = values[index]
        })

        if (trade.asset && trade.amount > 0 && trade.price > 0) {
          trades.push(trade)
        }
      }

      if (trades.length === 0) {
        throw new Error("No valid trades found in file")
      }

      setParsedTrades(trades)
      setUploadStatus("success")
      setUploadMessage(`Successfully parsed ${trades.length} trades`)
    } catch (error) {
      console.error("[v0] File upload error:", error)
      setUploadStatus("error")
      setUploadMessage(error instanceof Error ? error.message : "Failed to process file")
    }
  }

  const handleImportTrades = () => {
    console.log("[v0] Importing trades:", parsedTrades)
    setUploadMessage(`Imported ${parsedTrades.length} trades successfully`)
    setTimeout(() => {
      onClose?.()
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="import">Import Trades</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                  <SelectItem value="sol">Solana (SOL)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="0.00" type="number" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Purchase Price</Label>
              <Input id="price" placeholder="$0.00" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input id="notes" placeholder="Add notes about this position..." />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>Add Position</Button>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-sm text-muted-foreground mb-4">
                Import trades from CSV files. Expected format: Date, Asset, Type, Amount, Price, Total, Notes
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </span>
                    </Button>
                  </label>

                  {selectedFile && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                      <span className="text-muted-foreground">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>

                {selectedFile && uploadStatus === "idle" && (
                  <Button onClick={handleFileUpload} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Process File
                  </Button>
                )}

                {uploadStatus === "processing" && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Processing file...
                  </div>
                )}

                {uploadStatus === "success" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      {uploadMessage}
                    </div>

                    {parsedTrades.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-sm font-medium">Preview of trades to import:</div>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {parsedTrades.slice(0, 5).map((trade, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-xs bg-white/5 p-2 rounded"
                            >
                              <span>{trade.asset}</span>
                              <span>{trade.type}</span>
                              <span>{trade.amount}</span>
                              <span>${trade.price}</span>
                              <span>{trade.date}</span>
                            </div>
                          ))}
                          {parsedTrades.length > 5 && (
                            <div className="text-xs text-muted-foreground text-center">
                              ... and {parsedTrades.length - 5} more trades
                            </div>
                          )}
                        </div>

                        <Button onClick={handleImportTrades} className="w-full">
                          Import {parsedTrades.length} Trades
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {uploadStatus === "error" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-red-400">
                      <XCircle className="h-4 w-4" />
                      {uploadMessage}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null)
                        setUploadStatus("idle")
                        setUploadMessage("")
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="font-medium">CSV Format Requirements:</div>
                <div>• Headers: Date, Asset, Type, Amount, Price (required)</div>
                <div>• Date format: YYYY-MM-DD or MM/DD/YYYY</div>
                <div>• Type: buy, sell, transfer, etc.</div>
                <div>• Amount and Price: numeric values</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
