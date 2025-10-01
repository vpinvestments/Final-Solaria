"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, TrendingUp, Search, Star, Eye, ThumbsUp, ExternalLink, Flame, Zap } from "lucide-react"
import {
  getCryptoEvents,
  getEventCategories,
  getTrendingEvents,
  type CryptoEvent,
  type EventCategory,
  type EventFilters,
} from "@/lib/crypto-calendar-api"

export default function CryptoCalendarPage() {
  const [events, setEvents] = useState<CryptoEvent[]>([])
  const [trendingEvents, setTrendingEvents] = useState<CryptoEvent[]>([])
  const [categories, setCategories] = useState<{ category: EventCategory; count: number; color: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all")
  const [selectedTab, setSelectedTab] = useState("upcoming")
  const [filters, setFilters] = useState<EventFilters>({})

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [eventsData, categoriesData, trendingData] = await Promise.all([
        getCryptoEvents(filters),
        getEventCategories(),
        getTrendingEvents(),
      ])
      setEvents(eventsData)
      setCategories(categoriesData)
      setTrendingEvents(trendingData)
    } catch (error) {
      console.error("Failed to load crypto calendar data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.coins.some((coin) => coin.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory

    const today = new Date().toISOString().split("T")[0]
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "upcoming" && event.date >= today) ||
      (selectedTab === "past" && event.date < today) ||
      (selectedTab === "hot" && event.isHot) ||
      (selectedTab === "trending" && event.isTrending)

    return matchesSearch && matchesCategory && matchesTab
  })

  const getCategoryBadgeColor = (category: EventCategory) => {
    const categoryColors: Record<EventCategory, string> = {
      mainnet: "bg-green-500/20 text-green-700 dark:text-green-300",
      partnership: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      product: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
      conference: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
      airdrop: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
      burn: "bg-red-500/20 text-red-700 dark:text-red-300",
      fork: "bg-lime-500/20 text-lime-700 dark:text-lime-300",
      listing: "bg-pink-500/20 text-pink-700 dark:text-pink-300",
      update: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300",
      announcement: "bg-slate-500/20 text-slate-700 dark:text-slate-300",
      regulation: "bg-red-600/20 text-red-800 dark:text-red-300",
      earnings: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    }
    return categoryColors[category] || "bg-gray-500/20 text-gray-700 dark:text-gray-300"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isUpcoming = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0]
    return dateString >= today
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-balance">CryptoCalendar</h1>
        <p className="text-muted-foreground text-pretty">
          Stay ahead of the market with comprehensive cryptocurrency events and announcements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{events.filter((e) => isUpcoming(e.date)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Hot Events</p>
                <p className="text-2xl font-bold">{events.filter((e) => e.isHot).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Trending</p>
                <p className="text-2xl font-bold">{events.filter((e) => e.isTrending).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-purple-500" />
            <span>Trending Events</span>
          </CardTitle>
          <CardDescription>Most popular events in the crypto community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingEvents.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryBadgeColor(event.category)}>{event.category}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        <span>{event.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2">{event.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(event.date)}</span>
                      {event.time && (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.coins.map((coin) => (
                        <Badge key={coin.id} variant="outline" className="text-xs">
                          {coin.symbol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, coins, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as EventCategory | "all")}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.category} value={cat.category}>
                    {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="hot">Hot</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className={`transition-all hover:shadow-md ${isUpcoming(event.date) ? "border-l-4 border-l-blue-500" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-balance">{event.title}</h3>
                            {event.isHot && <Flame className="h-4 w-4 text-orange-500" />}
                            {event.isTrending && <TrendingUp className="h-4 w-4 text-purple-500" />}
                            {event.isSignificant && <Star className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <p className="text-muted-foreground text-pretty">{event.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getCategoryBadgeColor(event.category)}>{event.category}</Badge>
                        {event.coins.map((coin) => (
                          <Badge key={coin.id} variant="outline">
                            {coin.symbol}
                          </Badge>
                        ))}
                        {event.isConfirmed && (
                          <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">Confirmed</Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.date)}</span>
                          {event.time && (
                            <>
                              <Clock className="h-4 w-4 ml-2" />
                              <span>{event.time}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{event.votes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{event.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{event.confidence}%</span>
                          <span>confidence</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Source</p>
                        <p className="font-medium">{event.source}</p>
                      </div>
                      {event.originalSource && (
                        <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                          <ExternalLink className="h-3 w-3" />
                          <span>View Source</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or filters to find more events.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
