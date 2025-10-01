"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface Balance {
  asset: string
  free: number
  locked: number
  total: number
  usdValue?: number
  change24h?: number
}

interface ExchangeBalance {
  exchange: string
  balances: Balance[]
  lastUpdated: string
}

interface BalanceUpdateHook {
  exchangeBalances: ExchangeBalance[]
  isRefreshing: boolean
  lastUpdate: Date
  refreshBalances: () => Promise<void>
  subscribeToUpdates: () => void
  unsubscribeFromUpdates: () => void
}

export function useBalanceUpdates(): BalanceUpdateHook {
  const [exchangeBalances, setExchangeBalances] = useState<ExchangeBalance[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const calculateUSDValue = (asset: string, amount: number): number => {
    const prices: { [key: string]: number } = {
      BTC: 67234.56,
      ETH: 3456.78,
      SOL: 180.45,
      USDT: 1.0,
      USD: 1.0,
    }
    return (prices[asset] || 0) * amount
  }

  const getAssetChange24h = (asset: string): number => {
    const changes: { [key: string]: number } = {
      BTC: 2.34,
      ETH: -1.23,
      SOL: 5.67,
      USDT: 0.01,
      USD: 0.0,
    }
    return changes[asset] || 0
  }

  const fetchBalances = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/trading/balances")
      const data = await response.json()

      if (data.success) {
        const balancesWithValues = data.balances.map((exchangeBalance: any) => ({
          ...exchangeBalance,
          balances: exchangeBalance.balances.map((balance: Balance) => ({
            ...balance,
            usdValue: calculateUSDValue(balance.asset, balance.total),
            change24h: getAssetChange24h(balance.asset),
          })),
          lastUpdated: new Date().toISOString(),
        }))

        setExchangeBalances(balancesWithValues)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch balances:", error)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const subscribeToUpdates = useCallback(() => {
    // Start polling every 15 seconds for more frequent updates
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      fetchBalances()
    }, 15000)

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
      const wsUrl = `${protocol}//${window.location.host}/api/ws/balances`

      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log("[v0] WebSocket connected for balance updates")
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "balance_update") {
            console.log("[v0] Received real-time balance update:", data)
            fetchBalances() // Refresh balances when we get a WebSocket update
          }
        } catch (error) {
          console.error("[v0] Error parsing WebSocket message:", error)
        }
      }

      wsRef.current.onerror = (error) => {
        console.log("[v0] WebSocket error, falling back to Server-Sent Events:", error)
        // Fallback to Server-Sent Events
        setupServerSentEvents()
      }

      wsRef.current.onclose = () => {
        console.log("[v0] WebSocket connection closed, falling back to Server-Sent Events")
        // Fallback to Server-Sent Events
        setupServerSentEvents()
      }
    } catch (error) {
      console.log("[v0] WebSocket not available, using Server-Sent Events:", error)
      setupServerSentEvents()
    }
  }, [fetchBalances])

  const setupServerSentEvents = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    try {
      eventSourceRef.current = new EventSource("/api/ws/balances")

      eventSourceRef.current.onopen = () => {
        console.log("[v0] Server-Sent Events connected for balance updates")
      }

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "balance_update") {
            console.log("[v0] Received SSE balance update:", data)
            fetchBalances()
          }
        } catch (error) {
          console.error("[v0] Error parsing SSE message:", error)
        }
      }

      eventSourceRef.current.onerror = (error) => {
        console.log("[v0] Server-Sent Events error, using polling only:", error)
      }
    } catch (error) {
      console.log("[v0] Server-Sent Events not available, using polling only:", error)
    }
  }, [fetchBalances])

  const unsubscribeFromUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }, [])

  useEffect(() => {
    fetchBalances()
    subscribeToUpdates()

    return () => {
      unsubscribeFromUpdates()
    }
  }, [fetchBalances, subscribeToUpdates, unsubscribeFromUpdates])

  return {
    exchangeBalances,
    isRefreshing,
    lastUpdate,
    refreshBalances: fetchBalances,
    subscribeToUpdates,
    unsubscribeFromUpdates,
  }
}
