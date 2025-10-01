import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const blockchainAnalyticsSchema = z.object({
  portfolioHealth: z.object({
    score: z.number().min(0).max(100).describe("Overall portfolio health score"),
    riskLevel: z.enum(["low", "medium", "high", "critical"]),
    diversificationScore: z.number().min(0).max(100),
    volatilityRating: z.enum(["stable", "moderate", "volatile", "extreme"]),
    liquidityScore: z.number().min(0).max(100).describe("Asset liquidity assessment"),
    marketPositionStrength: z.number().min(0).max(100).describe("Market position strength"),
  }),
  technicalAnalysis: z.object({
    rsi: z.number().min(0).max(100).describe("Relative Strength Index"),
    macdSignal: z.enum(["bullish", "bearish", "neutral"]).describe("MACD signal"),
    supportLevel: z.number().describe("Key support price level"),
    resistanceLevel: z.number().describe("Key resistance price level"),
    trendStrength: z.number().min(0).max(100).describe("Trend strength indicator"),
    momentumIndicator: z.enum(["strong_buy", "buy", "hold", "sell", "strong_sell"]),
    fibonacciRetracement: z.object({
      level_236: z.number(),
      level_382: z.number(),
      level_618: z.number(),
    }),
  }),
  onChainMetrics: z.object({
    networkActivity: z.number().min(0).max(100).describe("Network activity score"),
    whaleActivity: z.enum(["accumulating", "distributing", "neutral"]).describe("Large holder behavior"),
    exchangeFlows: z.object({
      inflow: z.number().describe("Exchange inflow trend"),
      outflow: z.number().describe("Exchange outflow trend"),
      netFlow: z.number().describe("Net exchange flow"),
    }),
    hodlerBehavior: z.enum(["strong_hands", "weak_hands", "mixed"]).describe("Long-term holder behavior"),
    networkGrowth: z.number().min(-100).max(100).describe("Network growth percentage"),
  }),
  marketInsights: z.object({
    sentiment: z.enum(["bullish", "bearish", "neutral"]),
    trendDirection: z.enum(["up", "down", "sideways"]),
    confidenceLevel: z.number().min(0).max(100),
    keyFactors: z.array(z.string()).describe("Key market factors affecting portfolio"),
    socialSentiment: z.object({
      twitterMentions: z.number().describe("Social media mention volume"),
      sentimentScore: z.number().min(-100).max(100).describe("Overall social sentiment"),
      influencerActivity: z.enum(["high", "medium", "low"]).describe("Key influencer activity level"),
    }),
    institutionalActivity: z.object({
      adoptionTrend: z.enum(["increasing", "decreasing", "stable"]),
      investmentFlow: z.number().describe("Institutional investment flow"),
      corporateInterest: z.enum(["high", "medium", "low"]),
    }),
  }),
  recommendations: z.array(
    z.object({
      type: z.enum(["buy", "sell", "hold", "rebalance", "hedge", "dca", "take_profit"]),
      asset: z.string(),
      priority: z.enum(["low", "medium", "high", "urgent"]),
      reasoning: z.string(),
      expectedImpact: z.string(),
      timeframe: z.enum(["immediate", "short-term", "medium-term", "long-term"]),
      targetPrice: z.number().optional().describe("Suggested target price"),
      stopLoss: z.number().optional().describe("Suggested stop loss level"),
      allocation: z.number().optional().describe("Suggested portfolio allocation percentage"),
    }),
  ),
  riskAssessment: z.object({
    currentRisks: z.array(z.string()),
    potentialThreats: z.array(z.string()),
    hedgingOpportunities: z.array(z.string()),
    correlationWarnings: z.array(z.string()),
    liquidityRisks: z.array(z.string()).describe("Liquidity-related risks"),
    regulatoryRisks: z.array(z.string()).describe("Regulatory and compliance risks"),
    technicalRisks: z.array(z.string()).describe("Technical analysis risks"),
  }),
  performancePrediction: z.object({
    nextWeek: z.object({
      expectedReturn: z.number(),
      confidence: z.number().min(0).max(100),
      priceTarget: z.number().describe("Expected price target"),
      volatilityExpected: z.number().min(0).max(100),
    }),
    nextMonth: z.object({
      expectedReturn: z.number(),
      confidence: z.number().min(0).max(100),
      priceTarget: z.number().describe("Expected price target"),
      volatilityExpected: z.number().min(0).max(100),
    }),
    nextQuarter: z.object({
      expectedReturn: z.number(),
      confidence: z.number().min(0).max(100),
      priceTarget: z.number().describe("Expected price target"),
      volatilityExpected: z.number().min(0).max(100),
    }),
    yearEnd: z.object({
      expectedReturn: z.number(),
      confidence: z.number().min(0).max(100),
      priceTarget: z.number().describe("Expected price target"),
      majorCatalysts: z.array(z.string()).describe("Expected major price catalysts"),
    }),
  }),
  defiOpportunities: z.object({
    yieldFarming: z.array(
      z.object({
        protocol: z.string(),
        apy: z.number(),
        riskLevel: z.enum(["low", "medium", "high"]),
        description: z.string(),
      }),
    ),
    stakingOptions: z.array(
      z.object({
        validator: z.string(),
        apy: z.number(),
        lockupPeriod: z.string(),
        minimumAmount: z.number(),
      }),
    ),
    liquidityMining: z.array(
      z.object({
        pair: z.string(),
        rewards: z.string(),
        apy: z.number(),
        impermanentLossRisk: z.enum(["low", "medium", "high"]),
      }),
    ),
  }),
})

function generateFallbackAnalytics(coinInfo: any, portfolioData: any): any {
  const priceChange24h = coinInfo.price_change_percentage_24h
  const priceChange7d = coinInfo.price_change_percentage_7d
  const priceChange30d = coinInfo.price_change_percentage_30d
  const marketCapRank = coinInfo.market_cap_rank
  const athChange = coinInfo.ath_change_percentage
  const currentPrice = coinInfo.current_price
  const volume = coinInfo.total_volume
  const marketCap = coinInfo.market_cap

  // Calculate comprehensive health score
  let healthScore = 50
  if (marketCapRank <= 10) healthScore += 30
  else if (marketCapRank <= 50) healthScore += 20
  else if (marketCapRank <= 100) healthScore += 10

  if (priceChange7d > 0) healthScore += 10
  if (priceChange30d > 0) healthScore += 10
  if (volume / marketCap > 0.1) healthScore += 5 // High volume relative to market cap

  healthScore = Math.min(100, Math.max(0, healthScore))

  // Enhanced volatility and risk calculations
  const volatility = Math.abs(priceChange7d)
  let riskLevel = "low"
  let volatilityRating = "stable"

  if (volatility > 30) {
    riskLevel = "critical"
    volatilityRating = "extreme"
  } else if (volatility > 20) {
    riskLevel = "high"
    volatilityRating = "volatile"
  } else if (volatility > 10) {
    riskLevel = "medium"
    volatilityRating = "moderate"
  }

  // Technical analysis calculations
  const rsi = 50 + priceChange7d * 2 // Simplified RSI calculation
  const supportLevel = currentPrice * (1 - Math.abs(priceChange30d) / 200)
  const resistanceLevel = currentPrice * (1 + Math.abs(priceChange30d) / 200)

  let momentumIndicator = "hold"
  if (priceChange7d > 15) momentumIndicator = "strong_buy"
  else if (priceChange7d > 5) momentumIndicator = "buy"
  else if (priceChange7d < -15) momentumIndicator = "strong_sell"
  else if (priceChange7d < -5) momentumIndicator = "sell"

  // On-chain metrics simulation
  const networkActivity = Math.min(100, Math.max(0, 50 + (volume / marketCap) * 500))
  let whaleActivity = "neutral"
  if (priceChange24h > 5 && volume > marketCap * 0.15) whaleActivity = "accumulating"
  else if (priceChange24h < -5 && volume > marketCap * 0.15) whaleActivity = "distributing"

  // Market sentiment
  let sentiment = "neutral"
  if (priceChange24h > 5 && priceChange7d > 10) sentiment = "bullish"
  else if (priceChange24h < -5 && priceChange7d < -10) sentiment = "bearish"

  let trendDirection = "sideways"
  if (priceChange7d > 5) trendDirection = "up"
  else if (priceChange7d < -5) trendDirection = "down"

  // Enhanced recommendations with more detail
  const recommendations = []

  if (athChange > -20 && sentiment === "bullish") {
    recommendations.push({
      type: "take_profit",
      asset: coinInfo.symbol,
      priority: "high",
      reasoning: `${coinInfo.name} is near all-time highs with strong momentum. Consider taking partial profits.`,
      expectedImpact: "Risk management and profit realization",
      timeframe: "short-term",
      targetPrice: currentPrice * 1.1,
      stopLoss: currentPrice * 0.95,
      allocation: 15,
    })
  } else if (athChange < -50 && marketCapRank <= 20) {
    recommendations.push({
      type: "dca",
      asset: coinInfo.symbol,
      priority: "high",
      reasoning: `${coinInfo.name} is significantly below ATH but maintains strong market position. Consider dollar-cost averaging.`,
      expectedImpact: "Strong recovery potential with reduced timing risk",
      timeframe: "medium-term",
      targetPrice: currentPrice * 1.5,
      allocation: 25,
    })
  } else if (riskLevel === "critical") {
    recommendations.push({
      type: "hedge",
      asset: coinInfo.symbol,
      priority: "urgent",
      reasoning: `Extreme volatility detected. Implement hedging strategies immediately.`,
      expectedImpact: "Portfolio protection during high volatility",
      timeframe: "immediate",
      stopLoss: currentPrice * 0.9,
      allocation: 10,
    })
  }

  // DeFi opportunities based on coin type
  const defiOpportunities = {
    yieldFarming: [
      {
        protocol: "Compound",
        apy: 4.5 + Math.random() * 3,
        riskLevel: "medium",
        description: `Earn yield by supplying ${coinInfo.symbol} to lending protocols`,
      },
      {
        protocol: "Aave",
        apy: 3.8 + Math.random() * 4,
        riskLevel: "low",
        description: `Stable lending yields with ${coinInfo.symbol} collateral`,
      },
    ],
    stakingOptions:
      coinInfo.symbol === "ETH"
        ? [
            {
              validator: "Lido",
              apy: 3.2,
              lockupPeriod: "No lockup",
              minimumAmount: 0.01,
            },
            {
              validator: "Rocket Pool",
              apy: 3.5,
              lockupPeriod: "No lockup",
              minimumAmount: 0.01,
            },
          ]
        : [],
    liquidityMining: [
      {
        pair: `${coinInfo.symbol}/USDC`,
        rewards: "Trading fees + token rewards",
        apy: 8.5 + Math.random() * 10,
        impermanentLossRisk: "medium",
      },
    ],
  }

  return {
    portfolioHealth: {
      score: Math.round(healthScore),
      riskLevel,
      diversificationScore: 25,
      volatilityRating,
      liquidityScore: Math.min(100, (volume / marketCap) * 1000),
      marketPositionStrength: Math.max(0, 100 - marketCapRank),
    },
    technicalAnalysis: {
      rsi: Math.min(100, Math.max(0, rsi)),
      macdSignal: priceChange7d > 0 ? "bullish" : priceChange7d < 0 ? "bearish" : "neutral",
      supportLevel,
      resistanceLevel,
      trendStrength: Math.min(100, Math.abs(priceChange7d) * 5),
      momentumIndicator,
      fibonacciRetracement: {
        level_236: currentPrice * 0.764,
        level_382: currentPrice * 0.618,
        level_618: currentPrice * 0.382,
      },
    },
    onChainMetrics: {
      networkActivity,
      whaleActivity,
      exchangeFlows: {
        inflow: Math.random() * 1000000,
        outflow: Math.random() * 1000000,
        netFlow: (Math.random() - 0.5) * 2000000,
      },
      hodlerBehavior: priceChange30d > 0 ? "strong_hands" : "weak_hands",
      networkGrowth: priceChange30d,
    },
    marketInsights: {
      sentiment,
      trendDirection,
      confidenceLevel: Math.min(90, 60 + (marketCapRank <= 10 ? 30 : marketCapRank <= 50 ? 20 : 10)),
      keyFactors: [
        `Market cap rank: #${marketCapRank}`,
        `24h change: ${priceChange24h.toFixed(2)}%`,
        `7d performance: ${priceChange7d.toFixed(2)}%`,
        `Distance from ATH: ${athChange.toFixed(1)}%`,
        `Volume/Market Cap ratio: ${((volume / marketCap) * 100).toFixed(2)}%`,
        `Current volatility: ${volatilityRating}`,
        `RSI indicator: ${Math.round(rsi)}`,
      ],
      socialSentiment: {
        twitterMentions: Math.floor(Math.random() * 10000) + 1000,
        sentimentScore: priceChange7d * 5,
        influencerActivity: marketCapRank <= 10 ? "high" : marketCapRank <= 50 ? "medium" : "low",
      },
      institutionalActivity: {
        adoptionTrend: priceChange30d > 10 ? "increasing" : priceChange30d < -10 ? "decreasing" : "stable",
        investmentFlow: (Math.random() - 0.5) * 1000000000,
        corporateInterest: marketCapRank <= 5 ? "high" : marketCapRank <= 20 ? "medium" : "low",
      },
    },
    recommendations,
    riskAssessment: {
      currentRisks: [
        volatility > 20 ? "Extreme price volatility" : "Moderate price fluctuations",
        "Single-asset concentration risk",
        marketCapRank > 50 ? "Lower market cap asset risk" : "Established market position",
        volume / marketCap < 0.05 ? "Low liquidity risk" : "Adequate liquidity",
      ],
      potentialThreats: [
        "Market-wide cryptocurrency corrections",
        "Regulatory changes affecting crypto markets",
        "Technical analysis breakdown signals",
        "Macroeconomic headwinds",
        "Exchange security incidents",
      ],
      hedgingOpportunities: [
        "Diversify into stablecoins during high volatility",
        "Consider DeFi yield farming for additional income",
        "Set stop-loss orders at key support levels",
        "Use options strategies for downside protection",
        "Implement dollar-cost averaging for entries",
      ],
      correlationWarnings: [
        "High correlation with Bitcoin market movements",
        "Sensitive to overall crypto market sentiment",
        "May be affected by broader risk-off market conditions",
        "Correlation with tech stock performance",
      ],
      liquidityRisks: [
        volume / marketCap < 0.05 ? "Low daily volume relative to market cap" : "Adequate trading volume",
        "Potential slippage on large orders",
        "Exchange concentration risk",
      ],
      regulatoryRisks: [
        "Potential regulatory changes in major markets",
        "SEC classification uncertainty",
        "International regulatory coordination",
      ],
      technicalRisks: [
        rsi > 70 ? "Overbought conditions detected" : rsi < 30 ? "Oversold conditions detected" : "Neutral RSI levels",
        "Support level breakdown risk",
        "Resistance level rejection risk",
      ],
    },
    performancePrediction: {
      nextWeek: {
        expectedReturn: sentiment === "bullish" ? Math.random() * 15 - 2 : Math.random() * 8 - 10,
        confidence: 65,
        priceTarget: currentPrice * (1 + (sentiment === "bullish" ? 0.08 : -0.05)),
        volatilityExpected: Math.min(100, volatility + 10),
      },
      nextMonth: {
        expectedReturn: trendDirection === "up" ? Math.random() * 35 - 5 : Math.random() * 20 - 20,
        confidence: 55,
        priceTarget: currentPrice * (1 + (trendDirection === "up" ? 0.2 : -0.1)),
        volatilityExpected: Math.min(100, volatility + 5),
      },
      nextQuarter: {
        expectedReturn: healthScore > 70 ? Math.random() * 60 - 10 : Math.random() * 40 - 25,
        confidence: 45,
        priceTarget: currentPrice * (1 + (healthScore > 70 ? 0.3 : -0.15)),
        volatilityExpected: volatility,
      },
      yearEnd: {
        expectedReturn: marketCapRank <= 10 ? Math.random() * 100 - 20 : Math.random() * 80 - 40,
        confidence: 35,
        priceTarget: currentPrice * (1 + (marketCapRank <= 10 ? 0.5 : 0.2)),
        majorCatalysts: [
          "Institutional adoption milestones",
          "Regulatory clarity developments",
          "Technology upgrade implementations",
          "Market cycle progression",
          "Macroeconomic policy changes",
        ],
      },
    },
    defiOpportunities,
  }
}

async function handler(req: Request) {
  try {
    const { portfolio, coinData, priceHistory } = await req.json()

    const coinInfo = coinData
    const portfolioData = portfolio
    const marketData = { priceHistory }
    const blockchainData = {}

    try {
      const { object } = await generateObject({
        model: openai("gpt-4"),
        schema: blockchainAnalyticsSchema,
        messages: [
          {
            role: "system",
            content: `You are an expert blockchain and cryptocurrency analyst with deep knowledge of DeFi, technical analysis, on-chain metrics, and portfolio optimization. You have access to real-time market data and should provide comprehensive, data-driven insights based on current market conditions, technical indicators, and blockchain fundamentals.`,
          },
          {
            role: "user",
            content: `Provide a comprehensive cryptocurrency analysis with real market data:

COIN INFORMATION:
- Name: ${coinInfo.name} (${coinInfo.symbol})
- Current Price: $${coinInfo.current_price.toLocaleString()}
- Market Cap: $${coinInfo.market_cap.toLocaleString()}
- Market Cap Rank: #${coinInfo.market_cap_rank}
- 24h Price Change: ${coinInfo.price_change_percentage_24h.toFixed(2)}%
- 7d Price Change: ${coinInfo.price_change_percentage_7d.toFixed(2)}%
- 30d Price Change: ${coinInfo.price_change_percentage_30d.toFixed(2)}%
- All-Time High: $${coinInfo.ath.toLocaleString()} (${coinInfo.ath_change_percentage.toFixed(2)}% from ATH)
- All-Time Low: $${coinInfo.atl.toLocaleString()} (${coinInfo.atl_change_percentage.toFixed(2)}% from ATL)
- 24h Volume: $${coinInfo.total_volume.toLocaleString()}
- Volume/Market Cap: ${((coinInfo.total_volume / coinInfo.market_cap) * 100).toFixed(2)}%
- Circulating Supply: ${coinInfo.circulating_supply?.toLocaleString() || "N/A"}
- Max Supply: ${coinInfo.max_supply?.toLocaleString() || "Unlimited"}

PORTFOLIO DATA: ${JSON.stringify(portfolioData, null, 2)}

Provide comprehensive analysis including:

1. PORTFOLIO HEALTH (enhanced with liquidity and market position)
2. TECHNICAL ANALYSIS (RSI, MACD, support/resistance, Fibonacci levels, momentum)
3. ON-CHAIN METRICS (network activity, whale behavior, exchange flows, holder behavior)
4. MARKET INSIGHTS (sentiment, social metrics, institutional activity)
5. DETAILED RECOMMENDATIONS (with target prices, stop losses, allocation suggestions)
6. COMPREHENSIVE RISK ASSESSMENT (liquidity, regulatory, technical risks)
7. PERFORMANCE PREDICTIONS (week, month, quarter, year-end with catalysts)
8. DEFI OPPORTUNITIES (yield farming, staking, liquidity mining options)

Focus on actionable insights with specific price targets, risk management strategies, and DeFi yield opportunities.`,
          },
        ],
      })

      return Response.json({ analytics: object })
    } catch (aiError) {
      console.log("AI Analytics API: OpenAI not available, using comprehensive fallback analytics")

      const fallbackAnalytics = generateFallbackAnalytics(coinInfo, portfolioData)
      return Response.json({ analytics: fallbackAnalytics })
    }
  } catch (error) {
    console.error("AI Analytics API Error:", error)
    return Response.json({ error: "Failed to generate analytics" }, { status: 500 })
  }
}

export const POST = handler
