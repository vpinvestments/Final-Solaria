"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, TrendingDown, Clock, Eye, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewsArticle {
  id: string
  title: string
  summary: string
  content?: string
  url?: string | null
  source: string
  source_attribution?: string
  published_at: string
  sentiment: "positive" | "negative" | "neutral"
  votes: {
    positive: number
    negative: number
    important: number
  }
  currencies?: Array<{
    code: string
    title: string
  }>
  image?: string
  verified: boolean
  sources_count: number
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()

    const interval = setInterval(
      () => {
        console.log("[v0] Auto-refreshing news data")
        fetchNews()
      },
      15 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [selectedCategory])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/news?category=${selectedCategory}`)
      const data = await response.json()
      setArticles(data.articles || [])

      if (data.cached) {
        console.log("[v0] Loaded cached news data")
      } else {
        console.log("[v0] Loaded fresh news data")
      }
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "negative":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const toggleExpanded = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId)
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Cryptocurrency News</h1>
          <p className="text-muted-foreground mt-2">
            Latest news and updates from verified crypto sources • Updates every 15 minutes
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All News</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
          <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
          <TabsTrigger value="defi">DeFi</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {loading ? (
            <div className="grid gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="crypto-card animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="crypto-card group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2 text-sm">
                          <span className="font-medium">{article.source}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(article.published_at)}</span>
                          {article.verified && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                Verified from {article.sources_count} sources
                              </Badge>
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", getSentimentColor(article.sentiment))}>
                          <div className="flex items-center gap-1">
                            {getSentimentIcon(article.sentiment)}
                            {article.sentiment}
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{article.summary}</p>

                    {article.currencies && article.currencies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.currencies.slice(0, 5).map((currency) => (
                          <Badge key={currency.code} variant="outline" className="text-xs">
                            {currency.code}
                          </Badge>
                        ))}
                        {article.currencies.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.currencies.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {article.source_attribution && (
                      <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg border-l-2 border-primary/30">
                        <Quote className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground italic">{article.source_attribution}</p>
                      </div>
                    )}

                    {expandedArticle === article.id && article.content && (
                      <div className="border-t border-border pt-4">
                        <div className="prose prose-sm max-w-none text-foreground">
                          <p className="leading-relaxed">{article.content}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {article.votes && (
                          <>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-green-400" />
                              <span>{article.votes.positive}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingDown className="h-3 w-3 text-red-400" />
                              <span>{article.votes.negative}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{article.votes.important}</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {article.content && (
                          <Button variant="ghost" size="sm" onClick={() => toggleExpanded(article.id)}>
                            {expandedArticle === article.id ? "Show Less" : "Read More"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredArticles.length === 0 && (
            <Card className="crypto-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-muted-foreground text-center">
                  <h3 className="text-lg font-medium mb-2">No articles found</h3>
                  <p>Try adjusting your search terms or category selection.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
