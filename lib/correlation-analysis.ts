export interface CorrelationData {
  asset1: string
  asset2: string
  correlation: number
  pValue: number
  significance: "high" | "medium" | "low"
  relationship:
    | "strong_positive"
    | "moderate_positive"
    | "weak_positive"
    | "neutral"
    | "weak_negative"
    | "moderate_negative"
    | "strong_negative"
}

export interface CorrelationMatrix {
  assets: string[]
  matrix: number[][]
  averageCorrelation: number
  maxCorrelation: number
  minCorrelation: number
}

export interface AdvancedMetrics {
  portfolioDiversification: number
  concentrationRisk: number
  correlationRisk: number
  hedgingOpportunities: string[]
  riskFactors: string[]
}

export interface AdvancedRiskMetrics {
  valueAtRisk: {
    var95: number
    var99: number
    expectedShortfall: number
  }
  sharpeRatio: number
  sortinoRatio: number
  calmarRatio: number
  beta: number
  alpha: number
  maxDrawdown: number
  volatility: number
  skewness: number
  kurtosis: number
  informationRatio: number
  treynorRatio: number
  riskAdjustedReturn: number
  downside_deviation: number
}

export interface RiskAssessment {
  overallRiskScore: number
  riskLevel: "Very Low" | "Low" | "Medium" | "High" | "Very High"
  riskFactors: Array<{
    factor: string
    impact: "Low" | "Medium" | "High"
    description: string
    recommendation: string
  }>
  strengths: string[]
  warnings: string[]
  recommendations: string[]
}

// Calculate Pearson correlation coefficient
export function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0

  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0)
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0)
  const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  return denominator === 0 ? 0 : numerator / denominator
}

// Generate mock price history for correlation calculation
export function generatePriceHistory(basePrice: number, volatility: number, days = 30): number[] {
  const prices = [basePrice]

  for (let i = 1; i < days; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility * 0.01
    const newPrice = prices[i - 1] * (1 + change)
    prices.push(Math.max(newPrice, basePrice * 0.1)) // Prevent negative prices
  }

  return prices
}

// Calculate returns from price series
export function calculateReturns(prices: number[]): number[] {
  const returns = []
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
  }
  return returns
}

// Determine correlation relationship strength
export function getCorrelationRelationship(correlation: number): CorrelationData["relationship"] {
  const abs = Math.abs(correlation)

  if (abs >= 0.8) {
    return correlation > 0 ? "strong_positive" : "strong_negative"
  } else if (abs >= 0.5) {
    return correlation > 0 ? "moderate_positive" : "moderate_negative"
  } else if (abs >= 0.3) {
    return correlation > 0 ? "weak_positive" : "weak_negative"
  }
  return "neutral"
}

// Calculate correlation significance
export function getCorrelationSignificance(correlation: number, sampleSize: number): CorrelationData["significance"] {
  const abs = Math.abs(correlation)
  const tStat = abs * Math.sqrt((sampleSize - 2) / (1 - abs * abs))

  if (tStat > 2.576) return "high" // 99% confidence
  if (tStat > 1.96) return "medium" // 95% confidence
  return "low"
}

// Generate correlation matrix for portfolio assets
export function generateCorrelationMatrix(holdings: any[]): CorrelationMatrix {
  const assets = holdings.map((h) => h.symbol)
  const matrix: number[][] = []

  // Generate price histories for each asset
  const priceHistories = holdings.map((holding) => {
    const volatility = holding.riskLevel === "High" ? 8 : holding.riskLevel === "Medium" ? 5 : 3
    return generatePriceHistory(holding.currentPrice, volatility)
  })

  // Calculate correlation matrix
  for (let i = 0; i < assets.length; i++) {
    matrix[i] = []
    const returnsI = calculateReturns(priceHistories[i])

    for (let j = 0; j < assets.length; j++) {
      if (i === j) {
        matrix[i][j] = 1.0 // Perfect correlation with itself
      } else {
        const returnsJ = calculateReturns(priceHistories[j])
        matrix[i][j] = calculateCorrelation(returnsI, returnsJ)
      }
    }
  }

  // Calculate summary statistics
  const correlations = matrix.flat().filter((val, i) => i % (assets.length + 1) !== 0) // Exclude diagonal
  const averageCorrelation = correlations.reduce((a, b) => a + b, 0) / correlations.length
  const maxCorrelation = Math.max(...correlations)
  const minCorrelation = Math.min(...correlations)

  return {
    assets,
    matrix,
    averageCorrelation,
    maxCorrelation,
    minCorrelation,
  }
}

// Calculate advanced portfolio metrics
export function calculateAdvancedMetrics(holdings: any[], correlationMatrix: CorrelationMatrix): AdvancedMetrics {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)

  // Portfolio diversification score (lower correlation = better diversification)
  const avgCorrelation = Math.abs(correlationMatrix.averageCorrelation)
  const portfolioDiversification = Math.max(0, (1 - avgCorrelation) * 100)

  // Concentration risk (based on allocation distribution)
  const allocations = holdings.map((h) => h.value / totalValue)
  const herfindahlIndex = allocations.reduce((sum, alloc) => sum + alloc * alloc, 0)
  const concentrationRisk = herfindahlIndex * 100

  // Correlation risk (high correlations increase portfolio risk)
  const highCorrelations = correlationMatrix.matrix.flat().filter((corr) => Math.abs(corr) > 0.7 && corr !== 1.0)
  const correlationRisk = (highCorrelations.length / (holdings.length * (holdings.length - 1))) * 100

  // Generate hedging opportunities
  const hedgingOpportunities = []
  if (avgCorrelation > 0.6) {
    hedgingOpportunities.push("Consider adding uncorrelated assets like stablecoins or commodities")
  }
  if (concentrationRisk > 50) {
    hedgingOpportunities.push("Reduce position sizes in largest holdings")
  }
  if (correlationRisk > 30) {
    hedgingOpportunities.push("Add inverse correlation assets or derivatives for hedging")
  }

  // Generate risk factors
  const riskFactors = []
  if (avgCorrelation > 0.7) {
    riskFactors.push("High correlation between assets increases portfolio volatility")
  }
  if (concentrationRisk > 60) {
    riskFactors.push("Portfolio concentration risk is elevated")
  }
  if (correlationRisk > 40) {
    riskFactors.push("Multiple high-correlation pairs detected")
  }

  return {
    portfolioDiversification,
    concentrationRisk,
    correlationRisk,
    hedgingOpportunities,
    riskFactors,
  }
}

// Get correlation color for heat map visualization
export function getCorrelationColor(correlation: number): string {
  const abs = Math.abs(correlation)

  if (correlation > 0.7) return "#ef4444" // Strong positive - red
  if (correlation > 0.3) return "#f97316" // Moderate positive - orange
  if (correlation > 0.1) return "#eab308" // Weak positive - yellow
  if (correlation > -0.1) return "#6b7280" // Neutral - gray
  if (correlation > -0.3) return "#3b82f6" // Weak negative - blue
  if (correlation > -0.7) return "#1d4ed8" // Moderate negative - darker blue
  return "#1e40af" // Strong negative - darkest blue
}

// Calculate Value at Risk (VaR) using historical simulation
export function calculateVaR(returns: number[], confidence = 0.95): number {
  const sortedReturns = [...returns].sort((a, b) => a - b)
  const index = Math.floor((1 - confidence) * sortedReturns.length)
  return Math.abs(sortedReturns[index] || 0) * 100
}

// Calculate Expected Shortfall (Conditional VaR)
export function calculateExpectedShortfall(returns: number[], confidence = 0.95): number {
  const sortedReturns = [...returns].sort((a, b) => a - b)
  const cutoffIndex = Math.floor((1 - confidence) * sortedReturns.length)
  const tailReturns = sortedReturns.slice(0, cutoffIndex)
  const avgTailReturn = tailReturns.reduce((sum, ret) => sum + ret, 0) / tailReturns.length
  return Math.abs(avgTailReturn || 0) * 100
}

// Calculate Sharpe Ratio
export function calculateSharpeRatio(returns: number[], riskFreeRate = 0.02): number {
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length
  const volatility = calculateVolatility(returns)
  return volatility === 0 ? 0 : (avgReturn * 252 - riskFreeRate) / (volatility * Math.sqrt(252))
}

// Calculate Sortino Ratio (downside deviation)
export function calculateSortinoRatio(returns: number[], riskFreeRate = 0.02): number {
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length
  const downsideReturns = returns.filter((ret) => ret < 0)
  const downsideDeviation = Math.sqrt(downsideReturns.reduce((sum, ret) => sum + ret * ret, 0) / downsideReturns.length)
  return downsideDeviation === 0 ? 0 : (avgReturn * 252 - riskFreeRate) / (downsideDeviation * Math.sqrt(252))
}

// Calculate Maximum Drawdown
export function calculateMaxDrawdown(prices: number[]): number {
  let maxDrawdown = 0
  let peak = prices[0]

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > peak) {
      peak = prices[i]
    }
    const drawdown = (peak - prices[i]) / peak
    maxDrawdown = Math.max(maxDrawdown, drawdown)
  }

  return maxDrawdown * 100
}

// Calculate volatility (standard deviation of returns)
export function calculateVolatility(returns: number[]): number {
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
  return Math.sqrt(variance)
}

// Calculate skewness
export function calculateSkewness(returns: number[]): number {
  const n = returns.length
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / n
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / n
  const stdDev = Math.sqrt(variance)

  const skewness = returns.reduce((sum, ret) => sum + Math.pow((ret - mean) / stdDev, 3), 0) / n
  return skewness
}

// Calculate kurtosis
export function calculateKurtosis(returns: number[]): number {
  const n = returns.length
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / n
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / n
  const stdDev = Math.sqrt(variance)

  const kurtosis = returns.reduce((sum, ret) => sum + Math.pow((ret - mean) / stdDev, 4), 0) / n
  return kurtosis - 3 // Excess kurtosis
}

// Calculate Beta (relative to market)
export function calculateBeta(portfolioReturns: number[], marketReturns: number[]): number {
  const covariance = calculateCovariance(portfolioReturns, marketReturns)
  const marketVariance = calculateVariance(marketReturns)
  return marketVariance === 0 ? 1 : covariance / marketVariance
}

// Calculate Alpha
export function calculateAlpha(
  portfolioReturns: number[],
  marketReturns: number[],
  beta: number,
  riskFreeRate = 0.02,
): number {
  const portfolioReturn = (portfolioReturns.reduce((sum, ret) => sum + ret, 0) / portfolioReturns.length) * 252
  const marketReturn = (marketReturns.reduce((sum, ret) => sum + ret, 0) / marketReturns.length) * 252
  return portfolioReturn - (riskFreeRate + beta * (marketReturn - riskFreeRate))
}

// Helper function to calculate covariance
function calculateCovariance(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length)
  const meanX = x.slice(0, n).reduce((sum, val) => sum + val, 0) / n
  const meanY = y.slice(0, n).reduce((sum, val) => sum + val, 0) / n

  return x.slice(0, n).reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0) / n
}

// Helper function to calculate variance
function calculateVariance(values: number[]): number {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
}

// Calculate comprehensive risk metrics
export function calculateAdvancedRiskMetrics(holdings: any[]): AdvancedRiskMetrics {
  // Generate portfolio returns based on holdings
  const portfolioReturns = generatePortfolioReturns(holdings)
  const marketReturns = generateMarketReturns() // Benchmark returns

  const beta = calculateBeta(portfolioReturns, marketReturns)
  const alpha = calculateAlpha(portfolioReturns, marketReturns, beta)
  const sharpeRatio = calculateSharpeRatio(portfolioReturns)
  const sortinoRatio = calculateSortinoRatio(portfolioReturns)
  const volatility = calculateVolatility(portfolioReturns)
  const maxDrawdown = calculateMaxDrawdown(generatePortfolioPrices(holdings))

  return {
    valueAtRisk: {
      var95: calculateVaR(portfolioReturns, 0.95),
      var99: calculateVaR(portfolioReturns, 0.99),
      expectedShortfall: calculateExpectedShortfall(portfolioReturns, 0.95),
    },
    sharpeRatio,
    sortinoRatio: sortinoRatio,
    calmarRatio: sharpeRatio / (maxDrawdown / 100),
    beta,
    alpha: alpha * 100,
    maxDrawdown,
    volatility: volatility * Math.sqrt(252) * 100,
    skewness: calculateSkewness(portfolioReturns),
    kurtosis: calculateKurtosis(portfolioReturns),
    informationRatio: alpha / (volatility * Math.sqrt(252)),
    treynorRatio: ((portfolioReturns.reduce((sum, ret) => sum + ret, 0) / portfolioReturns.length) * 252 - 0.02) / beta,
    riskAdjustedReturn: sharpeRatio * volatility * Math.sqrt(252) * 100,
    downside_deviation: calculateVolatility(portfolioReturns.filter((ret) => ret < 0)) * Math.sqrt(252) * 100,
  }
}

// Generate portfolio returns based on holdings
function generatePortfolioReturns(holdings: any[], days = 252): number[] {
  const returns = []
  const weights = holdings.map((h) => h.allocation / 100)

  for (let i = 0; i < days; i++) {
    let portfolioReturn = 0
    holdings.forEach((holding, index) => {
      const volatility = holding.riskLevel === "High" ? 0.08 : holding.riskLevel === "Medium" ? 0.05 : 0.03
      const dailyReturn = ((Math.random() - 0.5) * 2 * volatility) / Math.sqrt(252)
      portfolioReturn += weights[index] * dailyReturn
    })
    returns.push(portfolioReturn)
  }

  return returns
}

// Generate market benchmark returns
function generateMarketReturns(days = 252): number[] {
  const returns = []
  for (let i = 0; i < days; i++) {
    const dailyReturn = ((Math.random() - 0.5) * 2 * 0.04) / Math.sqrt(252) // 4% annual volatility
    returns.push(dailyReturn)
  }
  return returns
}

// Generate portfolio price series
function generatePortfolioPrices(holdings: any[], days = 252): number[] {
  const returns = generatePortfolioReturns(holdings, days)
  const prices = [100] // Start at 100

  for (let i = 0; i < returns.length; i++) {
    prices.push(prices[prices.length - 1] * (1 + returns[i]))
  }

  return prices
}

// Assess overall portfolio risk
export function assessPortfolioRisk(metrics: AdvancedRiskMetrics, holdings: any[]): RiskAssessment {
  let riskScore = 0
  const riskFactors = []
  const strengths = []
  const warnings = []
  const recommendations = []

  // Volatility assessment
  if (metrics.volatility > 40) {
    riskScore += 25
    riskFactors.push({
      factor: "High Volatility",
      impact: "High" as const,
      description: `Portfolio volatility of ${metrics.volatility.toFixed(1)}% is significantly above market average`,
      recommendation: "Consider adding stable assets or reducing position sizes in volatile holdings",
    })
    warnings.push("Portfolio exhibits high volatility - expect significant price swings")
  } else if (metrics.volatility > 25) {
    riskScore += 15
    riskFactors.push({
      factor: "Moderate Volatility",
      impact: "Medium" as const,
      description: `Portfolio volatility of ${metrics.volatility.toFixed(1)}% is above average`,
      recommendation: "Monitor position sizes and consider diversification",
    })
  } else {
    strengths.push("Portfolio maintains reasonable volatility levels")
  }

  // VaR assessment
  if (metrics.valueAtRisk.var95 > 15) {
    riskScore += 20
    riskFactors.push({
      factor: "High Value at Risk",
      impact: "High" as const,
      description: `95% VaR of ${metrics.valueAtRisk.var95.toFixed(1)}% indicates potential for large losses`,
      recommendation: "Implement stop-loss strategies and reduce leverage",
    })
    warnings.push("High probability of significant daily losses")
  } else if (metrics.valueAtRisk.var95 > 8) {
    riskScore += 10
    riskFactors.push({
      factor: "Moderate Value at Risk",
      impact: "Medium" as const,
      description: `95% VaR of ${metrics.valueAtRisk.var95.toFixed(1)}% suggests moderate downside risk`,
      recommendation: "Consider hedging strategies for downside protection",
    })
  } else {
    strengths.push("Value at Risk is within acceptable limits")
  }

  // Sharpe Ratio assessment
  if (metrics.sharpeRatio > 1.5) {
    strengths.push("Excellent risk-adjusted returns (Sharpe ratio > 1.5)")
  } else if (metrics.sharpeRatio > 1.0) {
    strengths.push("Good risk-adjusted returns")
  } else if (metrics.sharpeRatio < 0.5) {
    riskScore += 15
    riskFactors.push({
      factor: "Poor Risk-Adjusted Returns",
      impact: "Medium" as const,
      description: `Sharpe ratio of ${metrics.sharpeRatio.toFixed(2)} indicates poor risk-adjusted performance`,
      recommendation: "Review asset selection and consider rebalancing",
    })
  }

  // Max Drawdown assessment
  if (metrics.maxDrawdown > 30) {
    riskScore += 20
    warnings.push("Portfolio has experienced severe drawdowns")
    recommendations.push("Implement strict risk management and position sizing rules")
  } else if (metrics.maxDrawdown > 20) {
    riskScore += 10
    recommendations.push("Monitor drawdowns and consider protective strategies")
  } else {
    strengths.push("Portfolio maintains reasonable drawdown levels")
  }

  // Beta assessment
  if (metrics.beta > 1.5) {
    riskScore += 10
    riskFactors.push({
      factor: "High Market Sensitivity",
      impact: "Medium" as const,
      description: `Beta of ${metrics.beta.toFixed(2)} indicates high sensitivity to market movements`,
      recommendation: "Consider adding market-neutral or low-beta assets",
    })
  } else if (metrics.beta < 0.5) {
    strengths.push("Low correlation with market provides diversification benefits")
  }

  // Determine overall risk level
  let riskLevel: RiskAssessment["riskLevel"]
  if (riskScore >= 60) riskLevel = "Very High"
  else if (riskScore >= 45) riskLevel = "High"
  else if (riskScore >= 30) riskLevel = "Medium"
  else if (riskScore >= 15) riskLevel = "Low"
  else riskLevel = "Very Low"

  // Add general recommendations
  if (riskLevel === "High" || riskLevel === "Very High") {
    recommendations.push("Consider reducing overall portfolio risk through diversification")
    recommendations.push("Implement systematic rebalancing strategy")
  }

  if (strengths.length === 0) {
    strengths.push("Portfolio analysis complete - review recommendations for improvements")
  }

  return {
    overallRiskScore: riskScore,
    riskLevel,
    riskFactors,
    strengths,
    warnings,
    recommendations,
  }
}
