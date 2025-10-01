// Crypto Calendar API functions for fetching cryptocurrency events
// Based on CoinMarketCal API structure but using simulated data for demo

export interface CryptoEvent {
  id: string
  title: string
  description: string
  date: string
  time?: string
  category: EventCategory
  coins: {
    id: string
    name: string
    symbol: string
    logo?: string
  }[]
  source: string
  confidence: number
  votes: number
  views: number
  isHot: boolean
  isTrending: boolean
  isSignificant: boolean
  isConfirmed: boolean
  proof?: string
  originalSource?: string
}

export type EventCategory =
  | "mainnet"
  | "partnership"
  | "product"
  | "conference"
  | "airdrop"
  | "burn"
  | "fork"
  | "listing"
  | "update"
  | "announcement"
  | "regulation"
  | "earnings"

export interface EventFilters {
  categories?: EventCategory[]
  coins?: string[]
  dateRange?: {
    start: string
    end: string
  }
  minConfidence?: number
  onlyHot?: boolean
  onlyTrending?: boolean
  onlySignificant?: boolean
}

// Simulated crypto events data based on real market patterns
const generateCryptoEvents = (): CryptoEvent[] => {
  const events: CryptoEvent[] = [
    {
      id: "1",
      title: "Bitcoin Halving Event",
      description: "The next Bitcoin halving is expected to occur, reducing block rewards from 6.25 to 3.125 BTC.",
      date: "2024-04-20",
      time: "12:00",
      category: "mainnet",
      coins: [{ id: "bitcoin", name: "Bitcoin", symbol: "BTC" }],
      source: "CoinMarketCal",
      confidence: 95,
      votes: 1250,
      views: 45000,
      isHot: true,
      isTrending: true,
      isSignificant: true,
      isConfirmed: true,
    },
    {
      id: "2",
      title: "Ethereum Shanghai Upgrade",
      description: "Major network upgrade enabling staking withdrawals and improving network efficiency.",
      date: "2024-03-15",
      time: "14:30",
      category: "update",
      coins: [{ id: "ethereum", name: "Ethereum", symbol: "ETH" }],
      source: "Ethereum Foundation",
      confidence: 90,
      votes: 890,
      views: 32000,
      isHot: true,
      isTrending: false,
      isSignificant: true,
      isConfirmed: true,
    },
    {
      id: "3",
      title: "Solana Breakpoint Conference",
      description: "Annual Solana developer conference featuring major announcements and partnerships.",
      date: "2024-11-15",
      time: "09:00",
      category: "conference",
      coins: [{ id: "solana", name: "Solana", symbol: "SOL" }],
      source: "Solana Labs",
      confidence: 85,
      votes: 567,
      views: 18500,
      isHot: false,
      isTrending: true,
      isSignificant: false,
      isConfirmed: true,
    },
    {
      id: "4",
      title: "Cardano Chang Hard Fork",
      description: "Major upgrade introducing smart contract capabilities and governance features.",
      date: "2024-09-01",
      time: "16:00",
      category: "fork",
      coins: [{ id: "cardano", name: "Cardano", symbol: "ADA" }],
      source: "IOHK",
      confidence: 88,
      votes: 723,
      views: 25000,
      isHot: true,
      isTrending: false,
      isSignificant: true,
      isConfirmed: false,
    },
    {
      id: "5",
      title: "Binance Coin Burn Q4 2024",
      description: "Quarterly BNB token burn event, reducing total supply.",
      date: "2024-10-15",
      time: "12:00",
      category: "burn",
      coins: [{ id: "binancecoin", name: "BNB", symbol: "BNB" }],
      source: "Binance",
      confidence: 92,
      votes: 445,
      views: 15000,
      isHot: false,
      isTrending: false,
      isSignificant: false,
      isConfirmed: true,
    },
    {
      id: "6",
      title: "Polygon zkEVM Mainnet Launch",
      description: "Launch of Polygon zkEVM on mainnet, bringing Ethereum compatibility with zero-knowledge proofs.",
      date: "2024-03-27",
      time: "18:00",
      category: "mainnet",
      coins: [{ id: "polygon", name: "Polygon", symbol: "MATIC" }],
      source: "Polygon Labs",
      confidence: 87,
      votes: 612,
      views: 22000,
      isHot: true,
      isTrending: true,
      isSignificant: true,
      isConfirmed: true,
    },
    {
      id: "7",
      title: "Chainlink CCIP Launch",
      description: "Cross-Chain Interoperability Protocol enabling secure cross-chain communication.",
      date: "2024-07-10",
      time: "15:00",
      category: "product",
      coins: [{ id: "chainlink", name: "Chainlink", symbol: "LINK" }],
      source: "Chainlink Labs",
      confidence: 83,
      votes: 389,
      views: 12500,
      isHot: false,
      isTrending: false,
      isSignificant: false,
      isConfirmed: false,
    },
    {
      id: "8",
      title: "Avalanche Subnet Expansion",
      description: "Major partnership announcement for enterprise subnet deployment.",
      date: "2024-06-20",
      time: "11:30",
      category: "partnership",
      coins: [{ id: "avalanche", name: "Avalanche", symbol: "AVAX" }],
      source: "Ava Labs",
      confidence: 75,
      votes: 234,
      views: 8900,
      isHot: false,
      isTrending: false,
      isSignificant: false,
      isConfirmed: false,
    },
    {
      id: "9",
      title: "Uniswap V4 Release",
      description: "Next generation of the Uniswap protocol with hooks and improved capital efficiency.",
      date: "2024-12-01",
      time: "20:00",
      category: "update",
      coins: [{ id: "uniswap", name: "Uniswap", symbol: "UNI" }],
      source: "Uniswap Labs",
      confidence: 80,
      votes: 756,
      views: 28000,
      isHot: true,
      isTrending: true,
      isSignificant: true,
      isConfirmed: false,
    },
    {
      id: "10",
      title: "Polkadot Parachain Auction",
      description: "Next batch of parachain slot auctions opening for bidding.",
      date: "2024-08-05",
      time: "13:00",
      category: "announcement",
      coins: [{ id: "polkadot", name: "Polkadot", symbol: "DOT" }],
      source: "Web3 Foundation",
      confidence: 91,
      votes: 445,
      views: 16500,
      isHot: false,
      isTrending: false,
      isSignificant: false,
      isConfirmed: true,
    },
  ]

  return events
}

export async function getCryptoEvents(filters?: EventFilters): Promise<CryptoEvent[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let events = generateCryptoEvents()

  if (filters) {
    if (filters.categories && filters.categories.length > 0) {
      events = events.filter((event) => filters.categories!.includes(event.category))
    }

    if (filters.coins && filters.coins.length > 0) {
      events = events.filter((event) => event.coins.some((coin) => filters.coins!.includes(coin.symbol.toLowerCase())))
    }

    if (filters.dateRange) {
      events = events.filter((event) => event.date >= filters.dateRange!.start && event.date <= filters.dateRange!.end)
    }

    if (filters.minConfidence) {
      events = events.filter((event) => event.confidence >= filters.minConfidence!)
    }

    if (filters.onlyHot) {
      events = events.filter((event) => event.isHot)
    }

    if (filters.onlyTrending) {
      events = events.filter((event) => event.isTrending)
    }

    if (filters.onlySignificant) {
      events = events.filter((event) => event.isSignificant)
    }
  }

  // Sort by date (upcoming first)
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export async function getEventCategories(): Promise<{ category: EventCategory; count: number; color: string }[]> {
  const events = await getCryptoEvents()
  const categoryMap = new Map<EventCategory, number>()

  events.forEach((event) => {
    categoryMap.set(event.category, (categoryMap.get(event.category) || 0) + 1)
  })

  const categoryColors: Record<EventCategory, string> = {
    mainnet: "#10b981",
    partnership: "#3b82f6",
    product: "#8b5cf6",
    conference: "#f59e0b",
    airdrop: "#06b6d4",
    burn: "#ef4444",
    fork: "#84cc16",
    listing: "#ec4899",
    update: "#6366f1",
    announcement: "#64748b",
    regulation: "#dc2626",
    earnings: "#059669",
  }

  return Array.from(categoryMap.entries()).map(([category, count]) => ({
    category,
    count,
    color: categoryColors[category],
  }))
}

export async function getUpcomingEventsCount(): Promise<number> {
  const events = await getCryptoEvents()
  const today = new Date().toISOString().split("T")[0]
  return events.filter((event) => event.date >= today).length
}

export async function getTrendingEvents(): Promise<CryptoEvent[]> {
  const events = await getCryptoEvents({ onlyTrending: true })
  return events.slice(0, 5)
}
