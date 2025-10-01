import { MarketStats } from "@/components/market/market-stats"
import { CryptoTable } from "@/components/market/crypto-table"
import { TrendingCoins } from "@/components/market/trending-coins"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">Cryptocurrency Market Overview</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Track the latest prices, market caps, and trends in the crypto market
          </p>
        </div>
      </div>

      <MarketStats />

      <div className="space-y-6">
        <TrendingCoins />
        <CryptoTable />
      </div>
    </div>
  )
}
