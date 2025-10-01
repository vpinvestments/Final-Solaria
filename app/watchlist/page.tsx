import { Watchlist } from "@/components/portfolio/watchlist"

export default function WatchlistPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Watchlist</h1>
          <p className="text-muted-foreground mt-2">Track cryptocurrencies and set up price alerts</p>
        </div>
      </div>

      <Watchlist />
    </div>
  )
}
