"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

const timeframes = [
  { label: "1D", value: "1D" },
  { label: "7D", value: "7D" },
  { label: "1M", value: "1M" },
  { label: "1Y", value: "1Y" },
] as const

interface PriceChartProps {
  coinId?: string
}

const getCoinSymbol = (coinId = "bitcoin") => {
  const symbolMap: Record<string, string> = {
    bitcoin: "BINANCE:BTCUSDT",
    ethereum: "BINANCE:ETHUSDT",
    tether: "BINANCE:USDCUSDT",
    bnb: "BINANCE:BNBUSDT",
    solana: "BINANCE:SOLUSDT",
    cardano: "BINANCE:ADAUSDT",
    dogecoin: "BINANCE:DOGEUSDT",
    polygon: "BINANCE:MATICUSDT",
    chainlink: "BINANCE:LINKUSDT",
    "shiba-inu": "BINANCE:SHIBUSDT",
    avalanche: "BINANCE:AVAXUSDT",
    polkadot: "BINANCE:DOTUSDT",
    uniswap: "BINANCE:UNIUSDT",
    litecoin: "BINANCE:LTCUSDT",
    "terra-luna": "BINANCE:LUNAUSDT",
    apecoin: "BINANCE:APEUSDT",
    sandbox: "BINANCE:SANDUSDT",
    arbitrum: "BINANCE:ARBUSDT",
    pepe: "BINANCE:PEPEUSDT",
  }

  return symbolMap[coinId] || "BINANCE:BTCUSDT"
}

export function PriceChart({ coinId = "bitcoin" }: PriceChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7D")
  const containerRef = useRef<HTMLDivElement>(null)

  const symbol = getCoinSymbol(coinId)
  const coinName = coinId.charAt(0).toUpperCase() + coinId.slice(1).replace(/-/g, " ")

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol, // Use dynamic symbol
      interval:
        selectedTimeframe === "1D"
          ? "15"
          : selectedTimeframe === "7D"
            ? "1H"
            : selectedTimeframe === "1M"
              ? "4H"
              : "1D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      backgroundColor: "rgba(0, 0, 0, 0)",
      gridColor: "rgba(255, 255, 255, 0.1)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: "tradingview_chart",
      studies: ["Volume@tv-basicstudies"],
      show_popup_button: false,
      popup_width: "1000",
      popup_height: "650",
      no_referral_id: true,
    })

    if (containerRef.current) {
      // Clear previous widget
      containerRef.current.innerHTML = ""
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [selectedTimeframe, symbol]) // Add symbol to dependencies

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{coinName} Price Chart</CardTitle> {/* Dynamic title */}
          <div className="flex space-x-1">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.value}
                variant={selectedTimeframe === timeframe.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe.value)}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          id="tradingview_chart"
          className="w-full h-[600px] min-h-[600px]"
          style={{ height: "600px" }}
        />
      </CardContent>
    </Card>
  )
}
