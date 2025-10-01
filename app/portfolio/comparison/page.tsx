import { PortfolioComparison } from "@/components/portfolio/portfolio-comparison"

export default function PortfolioComparisonPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Portfolio Comparison</h1>
          <p className="text-muted-foreground mt-2">Compare your portfolio performance against benchmarks and peers</p>
        </div>
      </div>

      <PortfolioComparison />
    </div>
  )
}
