"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpRight, ArrowDownLeft, Search, Download, Plus, Activity } from "lucide-react"

const transactions = [
  {
    id: "1",
    type: "buy",
    asset: "Bitcoin",
    symbol: "BTC",
    amount: 0.1234,
    price: 67000,
    value: 8267.8,
    fee: 12.4,
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    exchange: "Coinbase",
    txHash: "0x1234...5678",
    notes: "DCA purchase",
  },
  {
    id: "2",
    type: "sell",
    asset: "Ethereum",
    symbol: "ETH",
    amount: 1.5,
    price: 3400,
    value: 5100,
    fee: 7.65,
    date: "2024-01-14T15:45:00Z",
    status: "completed",
    exchange: "Binance",
    txHash: "0xabcd...efgh",
    notes: "Profit taking",
  },
  {
    id: "3",
    type: "buy",
    asset: "Solana",
    symbol: "SOL",
    amount: 25,
    price: 180,
    value: 4500,
    fee: 6.75,
    date: "2024-01-13T09:15:00Z",
    status: "completed",
    exchange: "Kraken",
    txHash: "0x9876...5432",
    notes: "Growth investment",
  },
  {
    id: "4",
    type: "buy",
    asset: "Bitcoin",
    symbol: "BTC",
    amount: 0.05,
    price: 65000,
    value: 3250,
    fee: 4.88,
    date: "2024-01-12T14:20:00Z",
    status: "pending",
    exchange: "Coinbase",
    txHash: null,
    notes: "",
  },
  {
    id: "5",
    type: "transfer",
    asset: "Ethereum",
    symbol: "ETH",
    amount: 2.0,
    price: 3456,
    value: 6912,
    fee: 15.2,
    date: "2024-01-11T11:30:00Z",
    status: "completed",
    exchange: "Wallet Transfer",
    txHash: "0xdef0...1234",
    notes: "Move to cold storage",
  },
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [showAddTransaction, setShowAddTransaction] = useState(false)

  const filteredTransactions = transactions
    .filter(
      (tx) =>
        tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.exchange.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((tx) => filterType === "all" || tx.type === filterType)
    .filter((tx) => filterStatus === "all" || tx.status === filterStatus)

  const totalVolume = filteredTransactions.reduce((sum, tx) => sum + tx.value, 0)
  const totalFees = filteredTransactions.reduce((sum, tx) => sum + tx.fee, 0)
  const buyTransactions = filteredTransactions.filter((tx) => tx.type === "buy").length
  const sellTransactions = filteredTransactions.filter((tx) => tx.type === "sell").length

  const handleExportTransactions = () => {
    const csvContent = [
      ["Date", "Type", "Asset", "Amount", "Price", "Value", "Fee", "Exchange"].join(","),
      ...filteredTransactions.map((tx) =>
        [formatDate(tx.date), tx.type, tx.asset, tx.amount, tx.price, tx.value, tx.fee, tx.exchange].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
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
            <Activity className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportTransactions}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <AddTransactionForm onClose={() => setShowAddTransaction(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl md:text-2xl font-bold text-blue-400">{formatPrice(totalVolume)}</div>
            <div className="text-sm text-muted-foreground">Total Volume</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl md:text-2xl font-bold text-red-400">{formatPrice(totalFees)}</div>
            <div className="text-sm text-muted-foreground">Total Fees</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl md:text-2xl font-bold text-green-400">{buyTransactions}</div>
            <div className="text-sm text-muted-foreground">Buy Orders</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl md:text-2xl font-bold text-purple-400">{sellTransactions}</div>
            <div className="text-sm text-muted-foreground">Sell Orders</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mt-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="w-full p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "buy"
                        ? "bg-green-500/20 text-green-400"
                        : transaction.type === "sell"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {transaction.type === "buy" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : transaction.type === "sell" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <Activity className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {transaction.type === "buy" ? "Bought" : transaction.type === "sell" ? "Sold" : "Transferred"}{" "}
                      {transaction.asset}
                    </div>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-mono text-sm">
                      {transaction.amount} {transaction.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-mono text-sm">{formatPrice(transaction.price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Value</span>
                    <span className="font-mono font-medium">{formatPrice(transaction.value)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Fee</span>
                    <span className="font-mono text-sm text-red-400">{formatPrice(transaction.fee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Exchange</span>
                    <span className="text-sm">{transaction.exchange}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm">{formatDate(transaction.date)}</span>
                  </div>
                  {transaction.txHash && (
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-xs text-muted-foreground break-all">{transaction.txHash}</div>
                    </div>
                  )}
                  {transaction.notes && (
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-xs text-muted-foreground italic">{transaction.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No transactions found matching your filters</div>
        )}
      </CardContent>
    </Card>
  )
}

function AddTransactionForm({ onClose }: { onClose: () => void }) {
  const [apiConnections, setApiConnections] = useState<Record<string, boolean>>({
    coinbase: false,
    binance: false,
    kraken: false,
    okx: false,
  })
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState<string | null>(null)

  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "preview" | "success" | "error">("idle")
  const [importError, setImportError] = useState<string>("")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setCsvFile(file)
      processCSVFile(file)
    } else {
      setImportError("Please select a valid CSV file")
      setImportStatus("error")
    }
  }

  const processCSVFile = async (file: File) => {
    setIsProcessing(true)
    setImportStatus("processing")
    setImportError("")

    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length < 2) {
        throw new Error("CSV file must contain at least a header row and one data row")
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
      const requiredHeaders = ["date", "type", "asset", "amount", "price"]
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
      }

      const parsedData = lines.slice(1).map((line, index) => {
        const values = line.split(",").map((v) => v.trim())
        const row: any = {}

        headers.forEach((header, i) => {
          row[header] = values[i] || ""
        })

        // Validate and transform data
        const transaction = {
          id: `import-${Date.now()}-${index}`,
          date: row.date,
          type: row.type.toLowerCase(),
          asset: row.asset,
          symbol: row.symbol || row.asset,
          amount: Number.parseFloat(row.amount) || 0,
          price: Number.parseFloat(row.price) || 0,
          value: (Number.parseFloat(row.amount) || 0) * (Number.parseFloat(row.price) || 0),
          fee: Number.parseFloat(row.fee) || 0,
          exchange: row.exchange || "Imported",
          txHash: row.txhash || row.hash || null,
          notes: row.notes || `Imported from ${file.name}`,
          status: "completed",
        }

        // Validate transaction data
        if (!transaction.date || !transaction.type || !transaction.asset || transaction.amount <= 0) {
          throw new Error(`Invalid data in row ${index + 2}: missing required fields or invalid amount`)
        }

        if (!["buy", "sell", "transfer"].includes(transaction.type)) {
          throw new Error(
            `Invalid transaction type "${transaction.type}" in row ${index + 2}. Must be: buy, sell, or transfer`,
          )
        }

        return transaction
      })

      setCsvData(parsedData)
      setImportStatus("preview")
    } catch (error) {
      console.error("[v0] CSV processing error:", error)
      setImportError(error instanceof Error ? error.message : "Failed to process CSV file")
      setImportStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImportTransactions = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call to save transactions
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[v0] Imported transactions:", csvData)
      setImportStatus("success")

      // Reset form after successful import
      setTimeout(() => {
        setCsvFile(null)
        setCsvData([])
        setImportStatus("idle")
        onClose()
      }, 2000)
    } catch (error) {
      console.error("[v0] Import error:", error)
      setImportError("Failed to import transactions")
      setImportStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResetImport = () => {
    setCsvFile(null)
    setCsvData([])
    setImportStatus("idle")
    setImportError("")
  }

  const handleConnectExchange = async (exchange: string) => {
    setIsConnecting(exchange)
    try {
      // Simulate API connection process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setApiConnections((prev) => ({ ...prev, [exchange]: true }))
      console.log(`[v0] Connected to ${exchange}`)
    } catch (error) {
      console.error(`[v0] Failed to connect to ${exchange}:`, error)
    } finally {
      setIsConnecting(null)
    }
  }

  const handleDisconnectExchange = async (exchange: string) => {
    setApiConnections((prev) => ({ ...prev, [exchange]: false }))
    console.log(`[v0] Disconnected from ${exchange}`)
  }

  const handleSyncTransactions = async (exchange: string) => {
    setIsSyncing(exchange)
    try {
      // Simulate transaction sync process
      await new Promise((resolve) => setTimeout(resolve, 3000))
      console.log(`[v0] Synced transactions from ${exchange}`)
      // Here you would typically update the transactions state
    } catch (error) {
      console.error(`[v0] Failed to sync transactions from ${exchange}:`, error)
    } finally {
      setIsSyncing(null)
    }
  }

  const exchangeConfigs = [
    {
      id: "coinbase",
      name: "Coinbase",
      logo: "🟦",
      description: "Connect your Coinbase Pro account",
      authUrl: "https://api.coinbase.com/oauth/authorize",
    },
    {
      id: "binance",
      name: "Binance",
      logo: "🟨",
      description: "Connect your Binance account",
      authUrl: "https://api.binance.com/oauth/authorize",
    },
    {
      id: "kraken",
      name: "Kraken",
      logo: "🟪",
      description: "Connect your Kraken account",
      authUrl: "https://api.kraken.com/oauth/authorize",
    },
    {
      id: "okx",
      name: "OKX",
      logo: "⚫",
      description: "Connect your OKX account",
      authUrl: "https://api.okx.com/oauth/authorize",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="import">Import CSV</TabsTrigger>
          <TabsTrigger value="api">API Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="0.00" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" placeholder="$0.00" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee">Fee</Label>
              <Input id="fee" placeholder="$0.00" type="number" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exchange">Exchange</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coinbase">Coinbase</SelectItem>
                  <SelectItem value="binance">Binance</SelectItem>
                  <SelectItem value="kraken">Kraken</SelectItem>
                  <SelectItem value="okx">OKX</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time</Label>
              <Input id="date" type="datetime-local" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="txhash">Transaction Hash (Optional)</Label>
            <Input id="txhash" placeholder="0x..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" placeholder="Add notes about this transaction..." />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>Add Transaction</Button>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          {importStatus === "idle" && (
            <div className="space-y-4">
              <div className="text-center py-8 border-2 border-dashed border-white/20 rounded-lg">
                <div className="text-muted-foreground mb-4">Import transactions from CSV files</div>
                <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="csv-upload" />
                <label htmlFor="csv-upload">
                  <Button variant="outline" asChild>
                    <span className="cursor-pointer">Choose CSV File</span>
                  </Button>
                </label>
                <div className="text-xs text-muted-foreground mt-2">Supports formats from major exchanges</div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="text-sm">
                  <div className="font-medium text-blue-400 mb-2">Required CSV Format:</div>
                  <div className="text-muted-foreground space-y-1">
                    <div>
                      • <strong>date</strong>: Transaction date (YYYY-MM-DD or MM/DD/YYYY)
                    </div>
                    <div>
                      • <strong>type</strong>: buy, sell, or transfer
                    </div>
                    <div>
                      • <strong>asset</strong>: Asset name (Bitcoin, Ethereum, etc.)
                    </div>
                    <div>
                      • <strong>amount</strong>: Quantity of asset
                    </div>
                    <div>
                      • <strong>price</strong>: Price per unit in USD
                    </div>
                    <div>
                      • <strong>fee</strong>: Transaction fee (optional)
                    </div>
                    <div>
                      • <strong>exchange</strong>: Exchange name (optional)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {importStatus === "processing" && (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
              <div className="text-lg font-medium mb-2">Processing CSV File</div>
              <div className="text-muted-foreground">Parsing and validating transaction data...</div>
            </div>
          )}

          {importStatus === "error" && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="text-red-400 text-lg font-medium mb-2">Import Error</div>
                <div className="text-muted-foreground mb-4">{importError}</div>
                <Button variant="outline" onClick={handleResetImport}>
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {importStatus === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Preview Import</div>
                  <div className="text-sm text-muted-foreground">
                    Found {csvData.length} transactions in {csvFile?.name}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleResetImport}>
                    Cancel
                  </Button>
                  <Button onClick={handleImportTransactions} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      `Import ${csvData.length} Transactions`
                    )}
                  </Button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border border-white/10 rounded-lg">
                <div className="grid grid-cols-1 gap-2 p-4">
                  {csvData.slice(0, 5).map((transaction, index) => (
                    <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              transaction.type === "buy"
                                ? "default"
                                : transaction.type === "sell"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {transaction.type}
                          </Badge>
                          <span className="font-medium">{transaction.asset}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm">
                            {transaction.amount} {transaction.symbol}
                          </div>
                          <div className="text-xs text-muted-foreground">{formatPrice(transaction.value)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {csvData.length > 5 && (
                    <div className="text-center text-muted-foreground text-sm py-2">
                      ... and {csvData.length - 5} more transactions
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {importStatus === "success" && (
            <div className="text-center py-8">
              <div className="text-green-400 text-lg font-medium mb-2">Import Successful!</div>
              <div className="text-muted-foreground">Successfully imported {csvData.length} transactions</div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Exchange API Connections</h3>
              <p className="text-muted-foreground text-sm">
                Connect your exchange accounts to automatically sync transactions
              </p>
            </div>

            <div className="grid gap-4">
              {exchangeConfigs.map((exchange) => (
                <div
                  key={exchange.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{exchange.logo}</div>
                    <div>
                      <div className="font-medium">{exchange.name}</div>
                      <div className="text-sm text-muted-foreground">{exchange.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {apiConnections[exchange.id] ? (
                      <>
                        <Badge variant="default" className="bg-green-500/20 text-green-400">
                          Connected
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSyncTransactions(exchange.id)}
                          disabled={isSyncing === exchange.id}
                        >
                          {isSyncing === exchange.id ? (
                            <>
                              <Activity className="h-4 w-4 mr-2 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <Activity className="h-4 w-4 mr-2" />
                              Sync
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDisconnectExchange(exchange.id)}>
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConnectExchange(exchange.id)}
                        disabled={isConnecting === exchange.id}
                      >
                        {isConnecting === exchange.id ? (
                          <>
                            <Activity className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <div className="text-blue-400 mt-0.5">ℹ️</div>
                <div className="text-sm">
                  <div className="font-medium text-blue-400 mb-1">API Connection Requirements</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• API keys must have read-only permissions</li>
                    <li>• Enable "View" permissions for account and trading data</li>
                    <li>• Whitelist your IP address if required by the exchange</li>
                    <li>• Transactions are synced automatically every 15 minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
