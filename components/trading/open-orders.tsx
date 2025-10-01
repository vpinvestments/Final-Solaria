"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const openOrders = [
  {
    id: "1",
    type: "buy",
    orderType: "limit",
    pair: "BTC/USD",
    amount: 0.1234,
    price: 65000,
    filled: 0.0567,
    remaining: 0.0667,
    total: 8021,
    status: "partial",
    date: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    type: "sell",
    orderType: "limit",
    pair: "BTC/USD",
    amount: 0.05,
    price: 70000,
    filled: 0,
    remaining: 0.05,
    total: 3500,
    status: "open",
    date: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    type: "buy",
    orderType: "stop",
    pair: "ETH/USD",
    amount: 2.5,
    price: 3200,
    filled: 0,
    remaining: 2.5,
    total: 8000,
    status: "open",
    date: "2024-01-14T16:45:00Z",
  },
]

export function OpenOrders() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "default"
      case "partial":
        return "secondary"
      case "filled":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {openOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No open orders</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Type</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Filled</th>
                  <th className="text-right">Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {openOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="font-medium">{order.pair}</td>
                    <td>
                      <div className="flex items-center space-x-1">
                        <Badge variant={order.type === "buy" ? "default" : "destructive"} className="text-xs">
                          {order.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{order.orderType}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono">{formatAmount(order.amount)}</td>
                    <td className="text-right font-mono">{formatPrice(order.price)}</td>
                    <td className="text-right">
                      <div className="text-sm">
                        <div className="font-mono">{formatAmount(order.filled)}</div>
                        <div className="text-xs text-muted-foreground">
                          {((order.filled / order.amount) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </td>
                    <td className="text-right font-mono">{formatPrice(order.total)}</td>
                    <td>
                      <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="text-sm text-muted-foreground">{formatDate(order.date)}</td>
                    <td>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
