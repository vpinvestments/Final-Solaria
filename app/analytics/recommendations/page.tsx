import { SmartRecommendations } from "@/components/analytics/smart-recommendations"

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Smart Recommendations</h1>
        <p className="text-muted-foreground">AI-powered portfolio optimization and investment recommendations</p>
      </div>

      <SmartRecommendations />
    </div>
  )
}
