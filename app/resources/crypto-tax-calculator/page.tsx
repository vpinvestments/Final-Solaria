"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calculator,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Upload,
  Download,
  Plus,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle,
  PieChart,
} from "lucide-react"

const taxYears = [
  { id: "2024", name: "2024" },
  { id: "2023", name: "2023" },
  { id: "2022", name: "2022" },
  { id: "2021", name: "2021" },
]

const countries = [
  { id: "us", name: "United States", rate: "0-37%" },
  { id: "uk", name: "United Kingdom", rate: "10-20%" },
  { id: "ca", name: "Canada", rate: "0-33%" },
  { id: "au", name: "Australia", rate: "0-45%" },
  { id: "de", name: "Germany", rate: "0-42%" },
]

const transactionTypes = [
  { id: "buy", name: "Buy", icon: TrendingUp },
  { id: "sell", name: "Sell", icon: TrendingDown },
  { id: "trade", name: "Trade", icon: Calculator },
  { id: "mining", name: "Mining", icon: PieChart },
  { id: "staking", name: "Staking", icon: DollarSign },
]

interface Transaction {
  id: string
  type: string
  crypto: string
  amount: number
  price: number
  date: string
  fees: number
}

export default function CryptoTaxCalculator() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedCountry, setSelectedCountry] = useState("us")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: "buy",
    crypto: "",
    amount: 0,
    price: 0,
    date: "",
    fees: 0,
  })

  const addTransaction = () => {
    if (newTransaction.crypto && newTransaction.amount && newTransaction.price && newTransaction.date) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: newTransaction.type || "buy",
        crypto: newTransaction.crypto,
        amount: newTransaction.amount,
        price: newTransaction.price,
        date: newTransaction.date,
        fees: newTransaction.fees || 0,
      }
      setTransactions([...transactions, transaction])
      setNewTransaction({
        type: "buy",
        crypto: "",
        amount: 0,
        price: 0,
        date: "",
        fees: 0,
      })
    }
  }

  const removeTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const calculateTaxes = () => {
    let totalGains = 0
    let totalLosses = 0
    let totalFees = 0

    transactions.forEach((transaction) => {
      const value = transaction.amount * transaction.price
      totalFees += transaction.fees

      if (transaction.type === "sell") {
        // Simplified calculation - in reality, this would need cost basis tracking
        const gain = value * 0.1 // Placeholder calculation
        if (gain > 0) {
          totalGains += gain
        } else {
          totalLosses += Math.abs(gain)
        }
      }
    })

    return {
      totalGains,
      totalLosses,
      totalFees,
      netGains: totalGains - totalLosses,
      estimatedTax: (totalGains - totalLosses) * 0.2, // Simplified 20% rate
    }
  }

  const taxResults = calculateTaxes()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Crypto Tax Calculator</h1>
        <p className="text-muted-foreground text-lg">
          Calculate your cryptocurrency capital gains, losses, and tax obligations with our comprehensive tax
          calculator.
        </p>
      </div>

      {/* Tax Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tax Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select tax year" />
              </SelectTrigger>
              <SelectContent>
                {taxYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tax Jurisdiction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{country.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {country.rate}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tax Reports
          </TabsTrigger>
          <TabsTrigger value="guidance" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Tax Guidance
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Input */}
            <Card>
              <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
                <CardDescription>Enter your cryptocurrency transactions to calculate taxes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Transaction Type</Label>
                    <Select
                      value={newTransaction.type}
                      onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {transactionTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="crypto">Cryptocurrency</Label>
                    <Input
                      id="crypto"
                      placeholder="BTC, ETH, etc."
                      value={newTransaction.crypto}
                      onChange={(e) => setNewTransaction({ ...newTransaction, crypto: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.00000001"
                      placeholder="0.00"
                      value={newTransaction.amount || ""}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, amount: Number.parseFloat(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price per Unit ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newTransaction.price || ""}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, price: Number.parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fees">Fees ($)</Label>
                    <Input
                      id="fees"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newTransaction.fees || ""}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, fees: Number.parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <Button onClick={addTransaction} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Summary</CardTitle>
                <CardDescription>Your calculated tax obligations for {selectedYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Total Gains</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700">${taxResults.totalGains.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">Total Losses</span>
                      </div>
                      <p className="text-2xl font-bold text-red-700">${taxResults.totalLosses.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Net Capital Gains</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">${taxResults.netGains.toFixed(2)}</p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-600">Estimated Tax Owed</span>
                    </div>
                    <p className="text-3xl font-bold text-orange-700">${taxResults.estimatedTax.toFixed(2)}</p>
                    <p className="text-xs text-orange-600 mt-1">
                      Based on {countries.find((c) => c.id === selectedCountry)?.rate} tax rate
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Info className="h-4 w-4" />
                      Additional Details
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Transactions:</span>
                        <span>{transactions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Fees:</span>
                        <span>${taxResults.totalFees.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Review and manage your cryptocurrency transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Transactions Added</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your cryptocurrency transactions to calculate your tax obligations.
                  </p>
                  <Button onClick={() => document.querySelector('[value="calculator"]')?.click()}>
                    Add First Transaction
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => {
                    const transactionType = transactionTypes.find((t) => t.id === transaction.type)
                    const IconComponent = transactionType?.icon || Calculator

                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{transaction.crypto}</span>
                              <Badge variant="outline" className="capitalize">
                                {transaction.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {transaction.amount} × ${transaction.price} = $
                              {(transaction.amount * transaction.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          <Button variant="ghost" size="sm" onClick={() => removeTransaction(transaction.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Forms</CardTitle>
                <CardDescription>Generate tax forms and reports for filing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Form 8949 (US) - Capital Gains and Losses
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Schedule D (US) - Capital Gains Summary
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Tax Summary Report
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Transaction History Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Export your data in various formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export to PDF
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export to TurboTax
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export to TaxAct
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guidance Tab */}
        <TabsContent value="guidance" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Important Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This calculator provides estimates only and should not be considered as professional tax advice.
                  Cryptocurrency tax laws are complex and vary by jurisdiction. Always consult with a qualified tax
                  professional for your specific situation.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Guidelines by Country</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {countries.map((country) => (
                    <div key={country.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{country.name}</h4>
                        <Badge variant="outline">{country.rate}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Capital gains tax rate varies based on income level and holding period.
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Tax Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Selling Crypto</h4>
                        <p className="text-sm text-muted-foreground">Triggers capital gains/losses</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Trading Crypto</h4>
                        <p className="text-sm text-muted-foreground">Each trade is a taxable event</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Mining & Staking</h4>
                        <p className="text-sm text-muted-foreground">Treated as ordinary income</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">DeFi Activities</h4>
                        <p className="text-sm text-muted-foreground">Complex tax implications</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
