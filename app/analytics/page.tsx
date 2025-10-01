import { AIAnalyticsDashboard } from "@/components/analytics/ai-analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AI Analytics</h1>
        <p className="text-muted-foreground">Advanced blockchain analytics powered by artificial intelligence</p>
      </div>

      <AIAnalyticsDashboard />
    </div>
  )
}
