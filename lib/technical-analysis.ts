export interface TechnicalIndicator {
  name: string
  value: number
  signal: "BUY" | "SELL" | "NEUTRAL"
  description: string
}

export interface TechnicalAnalysis {
  coinId: string
  coinName: string
  symbol: string
  price: number
  change24h: number
  image: string
  overallSignal: "STRONG_BUY" | "BUY" | "NEUTRAL" | "SELL" | "STRONG_SELL"
  confidence: number
  indicators: TechnicalIndicator[]
  aiInsight: string
  supportLevels: number[]
  resistanceLevels: number[]
  priceTarget: {
    short: number
    medium: number
    long: number
  }
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
}

// Simulate technical analysis data with realistic indicators
export async function getTechnicalAnalysis(
  coinId: string,
  price: number,
  change24h: number,
): Promise<TechnicalAnalysis> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const indicators: TechnicalIndicator[] = [
    {
      name: "RSI (14)",
      value: Math.random() * 100,
      signal: Math.random() > 0.5 ? "BUY" : Math.random() > 0.3 ? "SELL" : "NEUTRAL",
      description: "Relative Strength Index indicates momentum",
    },
    {
      name: "MACD",
      value: (Math.random() - 0.5) * 2,
      signal: change24h > 0 ? "BUY" : change24h < -2 ? "SELL" : "NEUTRAL",
      description: "Moving Average Convergence Divergence shows trend changes",
    },
    {
      name: "Bollinger Bands",
      value: Math.random(),
      signal: price > 50000 ? "SELL" : price < 30000 ? "BUY" : "NEUTRAL",
      description: "Price volatility and potential reversal points",
    },
    {
      name: "Volume Profile",
      value: Math.random() * 1000000,
      signal: Math.random() > 0.6 ? "BUY" : "NEUTRAL",
      description: "Trading volume analysis for price confirmation",
    },
    {
      name: "Fibonacci Retracement",
      value: 0.618,
      signal: Math.random() > 0.4 ? "BUY" : "SELL",
      description: "Key support and resistance levels",
    },
  ]

  const buySignals = indicators.filter((i) => i.signal === "BUY").length
  const sellSignals = indicators.filter((i) => i.signal === "SELL").length

  let overallSignal: TechnicalAnalysis["overallSignal"]
  if (buySignals >= 4) overallSignal = "STRONG_BUY"
  else if (buySignals >= 3) overallSignal = "BUY"
  else if (sellSignals >= 4) overallSignal = "STRONG_SELL"
  else if (sellSignals >= 3) overallSignal = "SELL"
  else overallSignal = "NEUTRAL"

  const confidence = Math.max(buySignals, sellSignals) * 20

  const aiInsights = [
    `${coinId.toUpperCase()} is showing ${overallSignal.toLowerCase().replace("_", " ")} signals with ${confidence}% confidence. The current price action suggests ${change24h > 0 ? "bullish" : "bearish"} momentum.`,
    `Technical indicators are ${buySignals > sellSignals ? "favoring upward movement" : "suggesting caution"}. Key levels to watch are support at $${(price * 0.95).toFixed(2)} and resistance at $${(price * 1.05).toFixed(2)}.`,
    `Volume analysis indicates ${Math.random() > 0.5 ? "strong institutional interest" : "retail-driven movement"}. Risk management is crucial at current levels.`,
    `The AI model suggests ${overallSignal === "STRONG_BUY" || overallSignal === "BUY" ? "accumulation opportunities" : "profit-taking zones"} based on historical patterns and market structure.`,
  ]

  return {
    coinId,
    coinName: coinId.charAt(0).toUpperCase() + coinId.slice(1),
    symbol: coinId.toUpperCase().slice(0, 3),
    price,
    change24h,
    image: `/placeholder.svg?height=32&width=32&query=${coinId}+cryptocurrency+logo`,
    overallSignal,
    confidence,
    indicators,
    aiInsight: aiInsights[Math.floor(Math.random() * aiInsights.length)],
    supportLevels: [price * 0.95, price * 0.9, price * 0.85],
    resistanceLevels: [price * 1.05, price * 1.1, price * 1.15],
    priceTarget: {
      short: price * (1 + (Math.random() - 0.5) * 0.2),
      medium: price * (1 + (Math.random() - 0.5) * 0.4),
      long: price * (1 + (Math.random() - 0.5) * 0.6),
    },
    riskLevel: confidence > 70 ? "LOW" : confidence > 40 ? "MEDIUM" : "HIGH",
  }
}

export function getSignalColor(signal: string): string {
  switch (signal) {
    case "STRONG_BUY":
      return "text-green-600 bg-green-50"
    case "BUY":
      return "text-green-500 bg-green-50"
    case "NEUTRAL":
      return "text-yellow-600 bg-yellow-50"
    case "SELL":
      return "text-red-500 bg-red-50"
    case "STRONG_SELL":
      return "text-red-600 bg-red-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case "LOW":
      return "text-green-600 bg-green-50"
    case "MEDIUM":
      return "text-yellow-600 bg-yellow-50"
    case "HIGH":
      return "text-red-600 bg-red-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}
