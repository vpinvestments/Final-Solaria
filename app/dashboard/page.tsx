"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Wallet, Activity, DollarSign, Users } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const stats = [
    {
      title: "Portfolio Value",
      value: "$45,234.56",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Wallet,
    },
    {
      title: "24h Change",
      value: "+$2,847.32",
      change: "+6.7%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Active Positions",
      value: "12",
      change: "+2",
      changeType: "positive" as const,
      icon: Activity,
    },
    {
      title: "Total Profit/Loss",
      value: "+$8,456.78",
      change: "+18.9%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
  ]

  const quickActions = [
    {
      title: "View Portfolio",
      description: "Check your holdings and performance",
      href: "/portfolio",
      icon: Wallet,
    },
    {
      title: "Start Trading",
      description: "Buy and sell cryptocurrencies",
      href: "/trading",
      icon: BarChart3,
    },
    {
      title: "Market Analysis",
      description: "View market trends and insights",
      href: "/analytics",
      icon: TrendingUp,
    },
    {
      title: "Account Settings",
      description: "Manage your account preferences",
      href: "/settings",
      icon: Users,
    },
  ]

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-balance">Welcome to your Dashboard!</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Here's what's happening with your investments today
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/70">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className={`text-xs ${stat.changeType === "positive" ? "text-green-400" : "text-red-400"}`}>
                  {stat.change} from yesterday
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="glass-card hover:bg-white/10 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <action.icon className="h-5 w-5 text-white/70" />
                    <CardTitle className="text-base text-white">{action.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/60">{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={action.href}>Go to {action.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-white/60">Your latest transactions and portfolio changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Bought Bitcoin",
                  amount: "0.025 BTC",
                  value: "$1,234.56",
                  time: "2 hours ago",
                },
                {
                  action: "Sold Ethereum",
                  amount: "0.5 ETH",
                  value: "$1,567.89",
                  time: "1 day ago",
                },
                {
                  action: "Added to Watchlist",
                  amount: "Solana (SOL)",
                  value: "",
                  time: "2 days ago",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-white/60 text-sm">{activity.amount}</p>
                  </div>
                  <div className="text-right">
                    {activity.value && <p className="text-white font-medium">{activity.value}</p>}
                    <p className="text-white/60 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/activity">View All Activity</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
