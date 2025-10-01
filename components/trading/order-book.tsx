"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const orderBookData = {
  bids: [
    { price: 67230.45, amount: 0.1234, total: 8.2945 },
    { price: 67229.12, amount: 0.2567, total: 17.2567 },
    { price: 67228.78, amount: 0.0987, total: 6.6345 },
    { price: 67227.34, amount: 0.3456, total: 23.2234 },
    { price: 67226.89, amount: 0.1876, total: 12.6078 },
    { price: 67225.45, amount: 0.2134, total: 14.3456 },
  ],
  asks: [
    { price: 67235.67, amount: 0.0987, total: 6.6345 },
    { price: 67236.12, amount: 0.1234, total: 8.2945 },
    { price: 67237.45, amount: 0.2567, total: 17.2567 },
    { price: 67238.78, amount: 0.3456, total: 23.2234 },
    { price: 67239.34, amount: 0.1876, total: 12.6078 },
    { price: 67240.89, amount: 0.2134, total: 14.3456 },
  ],
}

export function OrderBook() {
  const formatPrice = (price: number) => {
    return price.toFixed(2)
  }

  const formatAmount = (amount: number) => {
    return amount.toFixed(4)
  }

  return (
    <Card className="h-auto lg:h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3 lg:pb-4">
        <CardTitle className="text-lg lg:text-xl">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col h-full">
          {/* Asks (Sell Orders) */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-1 lg:gap-2 text-xs text-muted-foreground mb-2">
              <span className="text-xs lg:text-sm">Price</span>
              <span className="text-right text-xs lg:text-sm">Amount</span>
              <span className="text-right text-xs lg:text-sm">Total</span>
            </div>
            <div className="space-y-0.5 lg:space-y-1">
              {orderBookData.asks.reverse().map((ask, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-1 lg:gap-2 text-xs lg:text-sm hover:bg-red-50 dark:hover:bg-red-950/20 p-0.5 lg:p-1 rounded"
                >
                  <span className="font-mono text-red-500 text-xs lg:text-sm">{formatPrice(ask.price)}</span>
                  <span className="font-mono text-right text-xs lg:text-sm">{formatAmount(ask.amount)}</span>
                  <span className="font-mono text-right text-muted-foreground text-xs lg:text-sm">
                    {formatAmount(ask.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-b py-2 lg:py-3 my-1 lg:my-2 flex-shrink-0">
            <div className="text-center">
              <div className="text-base lg:text-lg font-mono font-bold">67,234.56</div>
              <div className="text-xs text-muted-foreground">Spread: $5.22</div>
            </div>
          </div>

          {/* Bids (Buy Orders) */}
          <div className="flex-1">
            <div className="space-y-0.5 lg:space-y-1">
              {orderBookData.bids.map((bid, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-1 lg:gap-2 text-xs lg:text-sm hover:bg-green-50 dark:hover:bg-green-950/20 p-0.5 lg:p-1 rounded"
                >
                  <span className="font-mono text-green-500 text-xs lg:text-sm">{formatPrice(bid.price)}</span>
                  <span className="font-mono text-right text-xs lg:text-sm">{formatAmount(bid.amount)}</span>
                  <span className="font-mono text-right text-muted-foreground text-xs lg:text-sm">
                    {formatAmount(bid.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
