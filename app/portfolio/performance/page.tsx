import { PortfolioPerformance } from "@/components/portfolio/portfolio-performance"

export default function PortfolioPerformancePage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Performance Analysis</h1>
          <p className="text-muted-foreground mt-2">Detailed portfolio performance metrics and analytics</p>
        </div>
      </div>

      <PortfolioPerformance />
    </div>
  )
}
