"use client"

import type React from "react"

import { useState } from "react"
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview"
import { PortfolioChart } from "@/components/portfolio/portfolio-chart"
import { HoldingsTable } from "@/components/portfolio/holdings-table"
import { TransactionHistory } from "@/components/portfolio/transaction-history"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Download, Plus } from "lucide-react"
import { PortfolioAnalytics } from "@/components/portfolio/portfolio-analytics"
import { PortfolioAlerts } from "@/components/portfolio/portfolio-alerts"
import { PortfolioInsights } from "@/components/portfolio/portfolio-insights"

export default function PortfolioPage() {
  const [showAddPosition, setShowAddPosition] = useState(false)

  const handleExportPortfolio = () => {
    const portfolioData = {
      exportDate: new Date().toISOString(),
      totalValue: "$45,234.56",
      holdings: [
        { name: "Bitcoin", symbol: "BTC", amount: 0.67234, value: 45234.56 },
        { name: "Ethereum", symbol: "ETH", amount: 3.2456, value: 11234.56 },
        { name: "Solana", symbol: "SOL", amount: 42.567, value: 7618.92 },
      ],
    }

    // Create CSV content with portfolio summary and holdings
    const csvContent = [
      // Portfolio summary header
      ["Portfolio Export", new Date().toLocaleDateString()].join(","),
      ["Total Portfolio Value", portfolioData.totalValue].join(","),
      [""], // Empty row for separation
      // Holdings header
      ["Asset Name", "Symbol", "Amount", "Current Value (USD)", "Percentage"].join(","),
      // Holdings data
      ...portfolioData.holdings.map((holding) => {
        const percentage = ((holding.value / 64088.04) * 100).toFixed(2) + "%"
        return [
          holding.name,
          holding.symbol,
          holding.amount.toString(),
          `$${holding.value.toFixed(2)}`,
          percentage,
        ].join(",")
      }),
      [""], // Empty row for separation
      // Summary totals
      ["Total Holdings", portfolioData.holdings.length.toString()].join(","),
      ["Export Date", new Date().toISOString()].join(","),
    ].join("\n")

    const dataBlob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `portfolio-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-balance">Portfolio</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Track your cryptocurrency investments and performance
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPortfolio}
              className="text-xs sm:text-sm bg-transparent flex-1 sm:flex-none"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Export</span>
            </Button>
            <Dialog open={showAddPosition} onOpenChange={setShowAddPosition}>
              <DialogTrigger asChild>
                <Button size="sm" className="text-xs sm:text-sm flex-1 sm:flex-none">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Add Position</span>
                  <span className="xs:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card max-w-2xl mx-4">
                <DialogHeader>
                  <DialogTitle>Add New Position</DialogTitle>
                </DialogHeader>
                <AddPositionForm onClose={() => setShowAddPosition(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="w-full">
          <PortfolioOverview />
        </div>

        <div className="space-y-4 lg:space-y-6 w-full overflow-x-hidden">
          <PortfolioChart />
          <HoldingsTable />
          <TransactionHistory />
          <PortfolioAlerts />
          <PortfolioInsights />
          <PortfolioAnalytics />
        </div>
      </div>
    </div>
  )
}

function AddPositionForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    asset: "",
    amount: "",
    price: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Adding position:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="asset" className="text-sm font-medium">
            Asset
          </label>
          <select
            id="asset"
            value={formData.asset}
            onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
            className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
            required
          >
            <option value="">Select asset</option>
            <option value="btc">Bitcoin (BTC)</option>
            <option value="eth">Ethereum (ETH)</option>
            <option value="sol">Solana (SOL)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="any"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Purchase Price
          </label>
          <input
            id="price"
            type="number"
            step="any"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
            placeholder="$0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes (Optional)
        </label>
        <input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
          placeholder="Add notes about this position..."
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          Add Position
        </Button>
      </div>
    </form>
  )
}
