"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  TrendingUp,
  ArrowDownLeft,
  Bell,
  Gift,
  BookOpen,
  Zap,
  Shield,
  Search,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Award,
  Target,
  Coins,
  Download,
} from "lucide-react"

// Mock data for activities
const mockActivities = [
  {
    id: "1",
    type: "trade",
    category: "trading",
    title: "Bought Bitcoin",
    description: "Purchased 0.1234 BTC at $67,000",
    amount: "$8,267.80",
    asset: "BTC",
    timestamp: "2024-01-15T10:30:00Z",
    status: "completed",
    icon: ArrowDownLeft,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    metadata: {
      exchange: "Coinbase",
      fee: "$12.40",
      txHash: "0x1234...5678",
    },
  },
  {
    id: "2",
    type: "alert",
    category: "portfolio",
    title: "Price Alert Triggered",
    description: "Ethereum reached your target price of $3,500",
    amount: "+3.2%",
    asset: "ETH",
    timestamp: "2024-01-15T09:45:00Z",
    status: "active",
    icon: Bell,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    metadata: {
      alertType: "price_target",
      targetPrice: "$3,500",
      currentPrice: "$3,612",
    },
  },
  {
    id: "3",
    type: "staking",
    category: "defi",
    title: "Staking Rewards Received",
    description: "Earned 2.45 SOL from staking rewards",
    amount: "+$441.00",
    asset: "SOL",
    timestamp: "2024-01-15T08:00:00Z",
    status: "completed",
    icon: Coins,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    metadata: {
      validator: "Solana Foundation",
      apr: "6.8%",
      stakingPeriod: "30 days",
    },
  },
  {
    id: "4",
    type: "news",
    category: "market",
    title: "Market Analysis Read",
    description: "Read: 'Bitcoin ETF Approval Impact Analysis'",
    amount: "+5 XP",
    asset: null,
    timestamp: "2024-01-15T07:30:00Z",
    status: "completed",
    icon: BookOpen,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    metadata: {
      article: "Bitcoin ETF Approval Impact Analysis",
      readTime: "8 min",
      category: "Market Analysis",
    },
  },
  {
    id: "5",
    type: "referral",
    category: "social",
    title: "Referral Bonus Earned",
    description: "Friend completed KYC verification",
    amount: "+$25.00",
    asset: "USD",
    timestamp: "2024-01-14T16:20:00Z",
    status: "completed",
    icon: Gift,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    metadata: {
      referredUser: "john.doe@email.com",
      bonusType: "kyc_completion",
      tier: "Bronze",
    },
  },
  {
    id: "6",
    type: "portfolio",
    category: "portfolio",
    title: "Portfolio Milestone",
    description: "Portfolio value exceeded $50,000",
    amount: "$52,341.67",
    asset: null,
    timestamp: "2024-01-14T14:15:00Z",
    status: "achieved",
    icon: Target,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    metadata: {
      milestone: "$50,000",
      growth: "+12.4%",
      timeframe: "3 months",
    },
  },
  {
    id: "7",
    type: "security",
    category: "account",
    title: "Security Alert",
    description: "New device login detected from New York",
    amount: null,
    asset: null,
    timestamp: "2024-01-14T12:30:00Z",
    status: "warning",
    icon: Shield,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    metadata: {
      device: "iPhone 15 Pro",
      location: "New York, NY",
      ipAddress: "192.168.1.1",
    },
  },
  {
    id: "8",
    type: "education",
    category: "learning",
    title: "Course Completed",
    description: "Finished 'DeFi Fundamentals' course",
    amount: "+100 XP",
    asset: null,
    timestamp: "2024-01-14T11:00:00Z",
    status: "completed",
    icon: Award,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    metadata: {
      course: "DeFi Fundamentals",
      duration: "2 hours",
      certificate: "CERT-2024-001",
    },
  },
]

const activityStats = {
  totalActivities: 156,
  todayActivities: 8,
  weeklyGrowth: 12.5,
  totalRewards: 2450.67,
  completedTasks: 23,
  activeAlerts: 5,
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInHours < 48) return "Yesterday"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price)
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-3 w-3 text-green-400" />
    case "pending":
      return <Clock className="h-3 w-3 text-yellow-400" />
    case "failed":
      return <XCircle className="h-3 w-3 text-red-400" />
    case "warning":
      return <AlertTriangle className="h-3 w-3 text-orange-400" />
    case "active":
      return <Zap className="h-3 w-3 text-blue-400" />
    default:
      return <CheckCircle className="h-3 w-3 text-gray-400" />
  }
}

export default function ActivityPage() {
  const [activities, setActivities] = useState(mockActivities)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const filteredActivities = activities
    .filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.asset && activity.asset.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = filterCategory === "all" || activity.category === filterCategory
      const matchesType = filterType === "all" || activity.type === filterType
      const matchesStatus = filterStatus === "all" || activity.status === filterStatus

      return matchesSearch && matchesCategory && matchesType && matchesStatus
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Activity Center
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Track all your trading activities, portfolio changes, and platform interactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold">{activityStats.totalActivities}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{activityStats.todayActivities}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Growth</p>
                <p className="text-2xl font-bold">+{activityStats.weeklyGrowth}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rewards</p>
                <p className="text-2xl font-bold">{formatPrice(activityStats.totalRewards)}</p>
              </div>
              <Gift className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
                <p className="text-2xl font-bold">{activityStats.completedTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">{activityStats.activeAlerts}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="trade">Trades</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                  <SelectItem value="staking">Staking</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="referral">Referrals</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="defi">DeFi</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ActivityList activities={filteredActivities} />
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <ActivityList activities={filteredActivities.filter((a) => a.category === "trading")} />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <ActivityList activities={filteredActivities.filter((a) => a.category === "portfolio")} />
        </TabsContent>

        <TabsContent value="defi" className="space-y-4">
          <ActivityList activities={filteredActivities.filter((a) => a.category === "defi")} />
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <ActivityList activities={filteredActivities.filter((a) => a.category === "market")} />
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <ActivityList activities={filteredActivities.filter((a) => a.category === "social")} />
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <ActivityList activities={filteredActivities.filter((a) => a.category === "account")} />
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <ActivityList activities={filteredActivities.filter((a) => a.category === "learning")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ActivityList({ activities }: { activities: typeof mockActivities }) {
  if (activities.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-12 text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Activities Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  )
}

function ActivityCard({ activity }: { activity: (typeof mockActivities)[0] }) {
  const IconComponent = activity.icon

  return (
    <Card className="glass-card hover:bg-white/10 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-3 rounded-full ${activity.bgColor} flex-shrink-0`}>
            <IconComponent className={`h-5 w-5 ${activity.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm sm:text-base truncate">{activity.title}</h3>
                  {getStatusIcon(activity.status)}
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      activity.status === "completed"
                        ? "border-green-500/50 text-green-400"
                        : activity.status === "pending"
                          ? "border-yellow-500/50 text-yellow-400"
                          : activity.status === "warning"
                            ? "border-orange-500/50 text-orange-400"
                            : activity.status === "failed"
                              ? "border-red-500/50 text-red-400"
                              : "border-blue-500/50 text-blue-400"
                    }`}
                  >
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-2">{activity.description}</p>

                {/* Metadata */}
                {activity.metadata && (
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-1">
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                        <span className="font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Amount and Time */}
              <div className="text-right flex-shrink-0">
                {activity.amount && (
                  <div
                    className={`font-semibold text-sm mb-1 ${
                      activity.amount.startsWith("+") ? "text-green-400" : "text-foreground"
                    }`}
                  >
                    {activity.amount}
                  </div>
                )}
                {activity.asset && <div className="text-xs text-muted-foreground mb-1">{activity.asset}</div>}
                <div className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
