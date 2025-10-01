import { PriceChart } from "@/components/coin/price-chart"
import { OrderBook } from "@/components/trading/order-book"
import { TradeForm } from "@/components/trading/trade-form"
import { OpenOrders } from "@/components/trading/open-orders"
import { TradeHistory } from "@/components/trading/trade-history"
import { ExchangeConnection } from "@/components/trading/exchange-connection"
import { BalanceDisplay } from "@/components/trading/balance-display"

export default function TradingPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">Trading</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Advanced cryptocurrency trading interface</p>
        </div>
      </div>

      <ExchangeConnection />

      <BalanceDisplay />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Chart - Takes up 2 columns on desktop, full width on mobile */}
        <div className="lg:col-span-2 order-1">
          <PriceChart />
        </div>

        {/* Trade Form - Priority on mobile, appears second */}
        <div className="order-2 lg:order-4">
          <TradeForm />
        </div>

        {/* Order Book - Appears third on mobile */}
        <div className="order-3 lg:order-3">
          <OrderBook />
        </div>
      </div>

      {/* Orders and History */}
      <div className="space-y-4 lg:space-y-6">
        <OpenOrders />
        <TradeHistory />
      </div>
    </div>
  )
}
