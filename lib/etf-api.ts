export interface CryptoETF {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  aum: string
  expenseRatio: number
  launchDate: string
  description: string
  topHoldings: string[]
  category: "spot-bitcoin" | "spot-ethereum" | "futures" | "blockchain" | "diversified"
  volume24h: number
  nav: number
  premium: number
}

export interface ETFStats {
  totalAUM: string
  activeETFs: number
  institutionalInvestors: string
  avgExpenseRatio: number
}

export interface InvestmentFund {
  id: string
  name: string
  type: string
  performance: number
  aum: string
  minInvestment: string
  strategy: string
  description: string
}

// Simulated ETF data based on real market data
export async function getCryptoETFs(): Promise<CryptoETF[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      id: "bito",
      name: "ProShares Bitcoin Strategy ETF",
      symbol: "BITO",
      price: 28.45,
      change24h: 2.3,
      aum: "$1.2B",
      expenseRatio: 0.95,
      launchDate: "Oct 2021",
      description: "First Bitcoin-linked ETF in the US, providing exposure to Bitcoin futures contracts.",
      topHoldings: ["Bitcoin Futures", "Cash Equivalents", "T-Bills"],
      category: "futures",
      volume24h: 15420000,
      nav: 28.42,
      premium: 0.11,
    },
    {
      id: "gbtc",
      name: "Grayscale Bitcoin Trust",
      symbol: "GBTC",
      price: 42.18,
      change24h: 1.8,
      aum: "$8.1B",
      expenseRatio: 1.5,
      launchDate: "Sep 2013",
      description: "The world's largest Bitcoin investment vehicle, providing exposure to Bitcoin price movements.",
      topHoldings: ["Bitcoin", "Cash"],
      category: "spot-bitcoin",
      volume24h: 28750000,
      nav: 42.15,
      premium: 0.07,
    },
    {
      id: "fbtc",
      name: "Fidelity Wise Origin Bitcoin Fund",
      symbol: "FBTC",
      price: 52.34,
      change24h: 3.1,
      aum: "$2.8B",
      expenseRatio: 0.25,
      launchDate: "Jan 2024",
      description: "Low-cost Bitcoin ETF providing direct exposure to Bitcoin spot prices.",
      topHoldings: ["Bitcoin", "Cash Equivalents"],
      category: "spot-bitcoin",
      volume24h: 18920000,
      nav: 52.31,
      premium: 0.06,
    },
    {
      id: "ethe",
      name: "Grayscale Ethereum Trust",
      symbol: "ETHE",
      price: 28.92,
      change24h: 4.2,
      aum: "$4.5B",
      expenseRatio: 2.5,
      launchDate: "Dec 2017",
      description: "Provides exposure to Ethereum price movements through a traditional investment vehicle.",
      topHoldings: ["Ethereum", "Cash"],
      category: "spot-ethereum",
      volume24h: 12340000,
      nav: 28.89,
      premium: 0.1,
    },
    {
      id: "dapp",
      name: "VanEck Digital Transformation ETF",
      symbol: "DAPP",
      price: 15.67,
      change24h: 1.2,
      aum: "$45M",
      expenseRatio: 0.65,
      launchDate: "Apr 2021",
      description: "Invests in companies involved in digital transformation and blockchain technology.",
      topHoldings: ["Coinbase", "MicroStrategy", "Block Inc"],
      category: "blockchain",
      volume24h: 2150000,
      nav: 15.65,
      premium: 0.13,
    },
    {
      id: "blok",
      name: "Amplify Transformational Data Sharing ETF",
      symbol: "BLOK",
      price: 22.89,
      change24h: 0.8,
      aum: "$180M",
      expenseRatio: 0.71,
      launchDate: "Jan 2018",
      description: "Actively managed ETF investing in companies developing blockchain technology.",
      topHoldings: ["Marathon Digital", "Riot Platforms", "Coinbase"],
      category: "blockchain",
      volume24h: 3420000,
      nav: 22.87,
      premium: 0.09,
    },
    {
      id: "bkch",
      name: "Global X Blockchain ETF",
      symbol: "BKCH",
      price: 8.45,
      change24h: -0.5,
      aum: "$25M",
      expenseRatio: 0.5,
      launchDate: "Jul 2021",
      description: "Tracks companies positioned to benefit from blockchain technology adoption.",
      topHoldings: ["Canaan Inc", "Hut 8 Mining", "Bitfarms"],
      category: "blockchain",
      volume24h: 890000,
      nav: 8.43,
      premium: 0.24,
    },
    {
      id: "arkb",
      name: "ARK 21Shares Bitcoin ETF",
      symbol: "ARKB",
      price: 68.23,
      change24h: 2.7,
      aum: "$3.1B",
      expenseRatio: 0.21,
      launchDate: "Jan 2024",
      description: "Provides exposure to Bitcoin through a low-cost, transparent structure.",
      topHoldings: ["Bitcoin", "Cash and Cash Equivalents"],
      category: "spot-bitcoin",
      volume24h: 22150000,
      nav: 68.2,
      premium: 0.04,
    },
  ]
}

export async function getETFStats(): Promise<ETFStats> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    totalAUM: "$25.8B",
    activeETFs: 47,
    institutionalInvestors: "2.1M",
    avgExpenseRatio: 0.89,
  }
}

export async function getInvestmentFunds(): Promise<InvestmentFund[]> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      id: "pantera",
      name: "Pantera Capital",
      type: "Hedge Fund",
      performance: 28.5,
      aum: "$3.2B",
      minInvestment: "$1M",
      strategy: "Multi-strategy approach including venture capital, hedge fund, and early-stage token investments.",
      description: "First institutional investment firm focused exclusively on blockchain technology.",
    },
    {
      id: "galaxy",
      name: "Galaxy Digital",
      type: "Investment Management",
      performance: 31.2,
      aum: "$2.1B",
      minInvestment: "$250K",
      strategy: "Trading, asset management, principal investing, and advisory services.",
      description: "Diversified financial services and investment management company in the digital asset space.",
    },
    {
      id: "bitwise",
      name: "Bitwise Asset Management",
      type: "Asset Manager",
      performance: 24.7,
      aum: "$1.8B",
      minInvestment: "$25K",
      strategy: "Index-based and actively managed crypto investment products.",
      description: "Leading crypto asset manager offering index funds and actively managed strategies.",
    },
    {
      id: "coinshares",
      name: "CoinShares",
      type: "Digital Asset Manager",
      performance: 19.8,
      aum: "$4.2B",
      minInvestment: "$50K",
      strategy: "Passive and active investment strategies across digital assets.",
      description: "Europe's largest digital asset investment firm providing institutional-grade products.",
    },
  ]
}

export function getCategoryColor(category: CryptoETF["category"]): string {
  switch (category) {
    case "spot-bitcoin":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20"
    case "spot-ethereum":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "futures":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20"
    case "blockchain":
      return "bg-green-500/10 text-green-600 border-green-500/20"
    case "diversified":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20"
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`
  }
  if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(0)}K`
  }
  return `$${volume.toFixed(0)}`
}
