import { openai } from "@ai-sdk/openai"
import {
  convertToModelMessages,
  type InferUITools,
  stepCountIs,
  streamText,
  tool,
  type UIDataTypes,
  type UIMessage,
  validateUIMessages,
} from "ai"
import { z } from "zod"

export const maxDuration = 30

const analyzePortfolioTool = tool({
  description: "Analyze portfolio performance and provide detailed insights",
  inputSchema: z.object({
    portfolioId: z.string(),
    timeframe: z.enum(["1d", "7d", "30d", "90d", "1y"]),
  }),
  async *execute({ portfolioId, timeframe }) {
    yield { state: "analyzing" as const }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate blockchain data analysis
    const analysis = {
      performance: Math.random() * 20 - 10, // -10% to +10%
      riskScore: Math.floor(Math.random() * 100),
      recommendations: [
        "Consider rebalancing BTC allocation",
        "DeFi yields are attractive in current market",
        "Monitor correlation with traditional markets",
      ],
      onChainMetrics: {
        transactionVolume: Math.floor(Math.random() * 1000000),
        activeAddresses: Math.floor(Math.random() * 50000),
        networkGrowth: Math.random() * 10,
      },
    }

    yield {
      state: "complete" as const,
      ...analysis,
    }
  },
})

const getMarketSentimentTool = tool({
  description: "Analyze current market sentiment using blockchain data and social metrics",
  inputSchema: z.object({
    assets: z.array(z.string()),
  }),
  async *execute({ assets }) {
    yield { state: "fetching" as const }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const sentiments = ["bullish", "bearish", "neutral"]
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)]

    yield {
      state: "ready" as const,
      overallSentiment: sentiment,
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
      socialScore: Math.floor(Math.random() * 100),
      fearGreedIndex: Math.floor(Math.random() * 100),
      assetSentiments: assets.map((asset) => ({
        asset,
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        score: Math.floor(Math.random() * 100),
      })),
    }
  },
})

const predictPriceTool = tool({
  description: "Generate AI-powered price predictions based on blockchain analytics",
  inputSchema: z.object({
    asset: z.string(),
    timeframe: z.enum(["1h", "24h", "7d", "30d"]),
  }),
  async *execute({ asset, timeframe }) {
    yield { state: "calculating" as const }

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const currentPrice = Math.random() * 50000 + 1000 // $1000-$51000
    const prediction = currentPrice * (1 + (Math.random() * 0.4 - 0.2)) // ±20%

    yield {
      state: "predicted" as const,
      asset,
      currentPrice,
      predictedPrice: prediction,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      factors: [
        "On-chain transaction volume",
        "Network hash rate trends",
        "DeFi protocol adoption",
        "Institutional flow patterns",
      ],
      timeframe,
    }
  },
})

const optimizePortfolioTool = tool({
  description: "Provide AI-powered portfolio optimization recommendations",
  inputSchema: z.object({
    riskTolerance: z.enum(["conservative", "moderate", "aggressive"]),
    investmentGoal: z.enum(["growth", "income", "balanced"]),
  }),
  outputSchema: z.string(),
})

const tools = {
  analyzePortfolio: analyzePortfolioTool,
  getMarketSentiment: getMarketSentimentTool,
  predictPrice: predictPriceTool,
  optimizePortfolio: optimizePortfolioTool,
} as const

export type AIInsightsMessage = UIMessage<never, UIDataTypes, InferUITools<typeof tools>>

export async function POST(req: Request) {
  const body = await req.json()

  const messages = await validateUIMessages<AIInsightsMessage>({
    messages: body.messages,
    tools,
  })

  const result = streamText({
    model: openai("gpt-4"),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
    system: `You are an expert AI analyst specializing in cryptocurrency and blockchain technology. You have access to real-time blockchain data, market sentiment analysis, and advanced predictive models. 

Your expertise includes:
- DeFi protocol analysis and yield optimization
- On-chain metrics interpretation
- Cross-chain bridge analysis
- NFT market dynamics
- Governance token evaluation
- Risk assessment and portfolio optimization

Always provide data-driven insights with confidence levels and explain your reasoning based on blockchain fundamentals.`,
  })

  return result.toUIMessageStreamResponse({
    onFinish: (options) => {
      console.log("AI Insights analysis completed", options)
    },
  })
}
