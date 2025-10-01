import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const smartRecommendationsSchema = z.object({
  portfolioOptimization: z.object({
    currentScore: z.number().min(0).max(100),
    optimizedScore: z.number().min(0).max(100),
    improvements: z.array(
      z.object({
        action: z.enum(["rebalance", "add", "reduce", "swap", "stake", "yield_farm"]),
        asset: z.string(),
        currentAllocation: z.number(),
        recommendedAllocation: z.number(),
        reasoning: z.string(),
        expectedImpact: z.string(),
        priority: z.enum(["low", "medium", "high", "critical"]),
        timeframe: z.enum(["immediate", "short-term", "medium-term", "long-term"]),
      }),
    ),
  }),
  defiOpportunities: z.array(
    z.object({
      protocol: z.string(),
      opportunity: z.string(),
      apy: z.number(),
      risk: z.enum(["low", "medium", "high"]),
      tvl: z.number(),
      description: z.string(),
      requirements: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  ),
  riskManagement: z.object({
    currentRiskLevel: z.enum(["low", "medium", "high", "extreme"]),
    recommendedActions: z.array(
      z.object({
        type: z.enum(["hedge", "diversify", "reduce_exposure", "add_stablecoin", "set_stop_loss"]),
        description: z.string(),
        urgency: z.enum(["low", "medium", "high", "urgent"]),
        expectedReduction: z.number(),
      }),
    ),
    hedgingStrategies: z.array(z.string()),
  }),
  marketTiming: z.object({
    currentPhase: z.enum(["accumulation", "markup", "distribution", "markdown"]),
    recommendations: z.array(
      z.object({
        action: z.enum(["buy", "sell", "hold", "dca", "take_profit"]),
        asset: z.string(),
        timing: z.string(),
        confidence: z.number().min(0).max(100),
        reasoning: z.string(),
      }),
    ),
  }),
  taxOptimization: z.array(
    z.object({
      strategy: z.string(),
      description: z.string(),
      potentialSavings: z.number(),
      requirements: z.array(z.string()),
      deadline: z.string().optional(),
    }),
  ),
})

export async function POST(req: Request) {
  const { portfolioData, userPreferences, marketConditions } = await req.json()

  const { object } = await generateObject({
    model: openai("gpt-4"),
    schema: smartRecommendationsSchema,
    messages: [
      {
        role: "system",
        content: `You are an expert portfolio manager and DeFi strategist with deep knowledge of:
        - Modern portfolio theory and risk management
        - DeFi protocols, yield farming, and liquidity mining
        - Tax optimization strategies for cryptocurrency
        - Market cycle analysis and timing strategies
        - Cross-chain opportunities and bridge protocols
        
        Generate personalized, actionable recommendations based on the user's portfolio and preferences.`,
      },
      {
        role: "user",
        content: `Analyze this portfolio and generate smart recommendations:

Portfolio Data: ${JSON.stringify(portfolioData, null, 2)}
User Preferences: ${JSON.stringify(userPreferences, null, 2)}
Market Conditions: ${JSON.stringify(marketConditions, null, 2)}

Provide comprehensive recommendations including:
1. Portfolio optimization with specific rebalancing actions
2. DeFi opportunities with risk-adjusted yields
3. Risk management strategies and hedging options
4. Market timing recommendations based on current cycle
5. Tax optimization strategies

Focus on actionable, specific recommendations with clear reasoning and expected outcomes.`,
      },
    ],
  })

  return Response.json({ recommendations: object })
}
