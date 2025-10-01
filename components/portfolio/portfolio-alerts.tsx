"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, TrendingUp, AlertTriangle, Target, X } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "price",
    title: "Bitcoin Price Alert",
    message: "BTC reached your target price of $45,000",
    severity: "success",
    time: "2 minutes ago",
    icon: TrendingUp,
  },
  {
    id: 2,
    type: "portfolio",
    title: "Portfolio Rebalancing",
    message: "Your allocation is 5% off target",
    severity: "warning",
    time: "1 hour ago",
    icon: Target,
  },
  {
    id: 3,
    type: "risk",
    title: "High Volatility Warning",
    message: "Portfolio volatility increased by 15%",
    severity: "error",
    time: "3 hours ago",
    icon: AlertTriangle,
  },
  {
    id: 4,
    type: "performance",
    title: "Weekly Performance",
    message: "Portfolio outperformed benchmark by 2.3%",
    severity: "success",
    time: "1 day ago",
    icon: TrendingUp,
  },
]

export function PortfolioAlerts() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {alerts.map((alert) => {
            const Icon = alert.icon
            return (
              <div
                key={alert.id}
                className="w-full min-w-0 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-1.5 rounded-full flex-shrink-0 ${
                      alert.severity === "success"
                        ? "bg-green-500/20 text-green-400"
                        : alert.severity === "warning"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{alert.title}</h4>
                      <Badge
                        variant={
                          alert.severity === "success"
                            ? "default"
                            : alert.severity === "warning"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs flex-shrink-0"
                      >
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="bg-transparent">
            View All Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
