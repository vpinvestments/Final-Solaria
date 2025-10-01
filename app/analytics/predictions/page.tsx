import { PredictiveMarketAnalysis } from "@/components/analytics/predictive-market-analysis"

export default function PredictionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Market Predictions</h1>
        <p className="text-muted-foreground">AI-powered price predictions and market analysis using blockchain data</p>
      </div>

      <PredictiveMarketAnalysis />
    </div>
  )
}
