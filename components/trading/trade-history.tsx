"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tradeHistory = [
  {
    id: "1",
    type: "buy",
    pair: "BTC/USD",
    amount: 0.1234,
    price: 66500,
    total: 8206.1,
    fee: 8.21,
    date: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    type: "sell",
    pair: "ETH/USD",
    amount: 1.5,
    price: 3450,
    total: 5175,
    fee: 5.18,
    date: "2024-01-15T12:15:00Z",
  },
  {
    id: "3",
    type: "buy",
    pair: "SOL/USD",
    amount: 25,
    price: 175,
    total: 4375,
    fee: 4.38,
    date: "2024-01-14T16:45:00Z",
  },
  {
    id: "4",
    type: "sell",
    pair: "BTC/USD",
    amount: 0.05,
    price: 67000,
    total: 3350,
    fee: 3.35,
    date: "2024-01-14T10:20:00Z",
  },
]

export function TradeHistory() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatAmount = (amount: number) => {
    return amount.toFixed(8)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pair</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Price</th>
                <th className="text-right">Total</th>
                <th className="text-right">Fee</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.map((trade) => (
                <tr key={trade.id} className="hover:bg-muted/50">
                  <td className="font-medium">{trade.pair}</td>
                  <td>
                    <Badge variant={trade.type === "buy" ? "default" : "destructive"} className="text-xs">
                      {trade.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="text-right font-mono">{formatAmount(trade.amount)}</td>
                  <td className="text-right font-mono">{formatPrice(trade.price)}</td>
                  <td className="text-right font-mono">{formatPrice(trade.total)}</td>
                  <td className="text-right font-mono">{formatPrice(trade.fee)}</td>
                  <td className="text-sm text-muted-foreground">{formatDate(trade.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
