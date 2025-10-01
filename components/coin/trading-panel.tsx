"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TradingPanelProps {
  coinSymbol: string
  currentPrice: number
}

export function TradingPanel({ coinSymbol, currentPrice }: TradingPanelProps) {
  const [buyAmount, setBuyAmount] = useState("")
  const [sellAmount, setSellAmount] = useState("")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Trade {coinSymbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="text-sm">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="text-sm">
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-amount" className="text-sm">
                Amount (USD)
              </Label>
              <Input
                id="buy-amount"
                type="number"
                placeholder="0.00"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">You'll receive</Label>
              <div className="p-3 bg-muted rounded-md">
                <span className="font-mono text-sm">
                  {buyAmount ? (Number.parseFloat(buyAmount) / currentPrice).toFixed(6) : "0.000000"} {coinSymbol}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-muted-foreground">Price per {coinSymbol}</span>
                <span className="font-mono">{formatPrice(currentPrice)}</span>
              </div>
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-muted-foreground">Fee (0.1%)</span>
                <span className="font-mono">
                  {buyAmount ? formatPrice(Number.parseFloat(buyAmount) * 0.001) : "$0.00"}
                </span>
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-sm py-2">Buy {coinSymbol}</Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-amount" className="text-sm">
                Amount ({coinSymbol})
              </Label>
              <Input
                id="sell-amount"
                type="number"
                placeholder="0.000000"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">You'll receive</Label>
              <div className="p-3 bg-muted rounded-md">
                <span className="font-mono text-sm">
                  {sellAmount ? formatPrice(Number.parseFloat(sellAmount) * currentPrice) : "$0.00"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-muted-foreground">Price per {coinSymbol}</span>
                <span className="font-mono">{formatPrice(currentPrice)}</span>
              </div>
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-muted-foreground">Fee (0.1%)</span>
                <span className="font-mono">
                  {sellAmount ? formatPrice(Number.parseFloat(sellAmount) * currentPrice * 0.001) : "$0.00"}
                </span>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-sm py-2">Sell {coinSymbol}</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
