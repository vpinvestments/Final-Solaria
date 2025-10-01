import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const marketPredictionSchema = z.object({
  overallMarketForecast: z.object({
    direction: z.enum(["bullish", "bearish", "neutral", "volatile"]),
    confidence: z.number().min(0).max(100),
    timeframe: z.enum(["short-term", "medium-term", "long-term"]),
    keyDrivers: z.array(z.string()),
    riskFactors: z.array(z.string()),
  }),
  assetPredictions: z.array(
    z.object({
      symbol: z.string(),
      currentPrice: z.number(),
      predictions: z.object({
        oneDay: z.object({
          price: z.number(),
          change: z.number(),
          confidence: z.number().min(0).max(100),
        }),
        oneWeek: z.object({
          price: z.number(),
          change: z.number(),
          confidence: z.number().min(0).max(100),
        }),
        oneMonth: z.object({
          price: z.number(),
          change: z.number(),
          confidence: z.number().min(0).max(100),
        }),
        threeMonths: z.object({
          price: z.number(),
          change: z.number(),
          confidence: z.number().min(0).max(100),
        }),
      }),
      technicalIndicators: z.object({
        rsi: z.number(),
        macd: z.enum(["bullish", "bearish", "neutral"]),
        movingAverages: z.enum(["above", "below", "crossing"]),
        support: z.number(),
        resistance: z.number(),
      }),
      onChainMetrics: z.object({
        networkActivity: z.number().min(0).max(100),
        whaleActivity: z.enum(["accumulating", "distributing", "neutral"]),
        developerActivity: z.number().min(0).max(100),
        socialSentiment: z.number().min(0).max(100),
      }),
      catalysts: z.array(z.string()),
      risks: z.array(z.string()),
    }),
  ),
  marketScenarios: z.array(
    z.object({
      name: z.string(),
      probability: z.number().min(0).max(100),
      description: z.string(),
      impact: z.enum(["positive", "negative", "neutral"]),
      affectedAssets: z.array(z.string()),
      timeframe: z.string(),
    }),
  ),
  tradingSignals: z.array(
    z.object({
      asset: z.string(),
      signal: z.enum(["strong_buy", "buy", "hold", "sell", "strong_sell"]),
      strength: z.number().min(0).max(100),
      entry: z.number().optional(),
      target: z.number().optional(),
      stopLoss: z.number().optional(),
      reasoning: z.string(),
      timeframe: z.enum(["scalp", "day", "swing", "position"]),
    }),
  ),
})

export async function POST(req: Request) {
  const { assets, marketData, timeframe } = await req.json()

  const { object } = await generateObject({
    model: openai("gpt-4"),
    schema: marketPredictionSchema,
    messages: [
      {
        role: "system",
        content: `You are an expert quantitative analyst and blockchain researcher with deep expertise in:
        - Technical analysis and chart patterns
        - On-chain analytics and whale behavior
        - DeFi protocol analysis and yield farming
        - Macroeconomic factors affecting crypto markets
        - Machine learning models for price prediction
        - Risk management and portfolio optimization
        
        Generate comprehensive market predictions based on multiple data sources including technical indicators, on-chain metrics, social sentiment, and macroeconomic factors.`,
      },
      {
        role: "user",
        content: `Analyze and predict market movements for the following assets: ${assets.join(", ")}

Market Data: ${JSON.stringify(marketData, null, 2)}
Analysis Timeframe: ${timeframe}

Provide detailed predictions including:
1. Overall market forecast with confidence levels
2. Individual asset price predictions for multiple timeframes
3. Technical and on-chain analysis for each asset
4. Potential market scenarios and their probabilities
5. Actionable trading signals with entry/exit points

Consider current market conditions, regulatory environment, institutional adoption, and emerging trends in DeFi, NFTs, and Web3.`,
      },
    ],
  })

  return Response.json({ predictions: object })
}
