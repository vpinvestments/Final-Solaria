"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  Play,
  FileText,
  Video,
  Headphones,
  TrendingUp,
  Shield,
  Coins,
  BarChart3,
} from "lucide-react"

const categories = [
  { id: "all", name: "All", icon: BookOpen },
  { id: "beginner", name: "Beginner", icon: Star },
  { id: "intermediate", name: "Intermediate", icon: TrendingUp },
  { id: "advanced", name: "Advanced", icon: BarChart3 },
  { id: "trading", name: "Trading", icon: Coins },
  { id: "security", name: "Security", icon: Shield },
]

const courses = [
  {
    id: 1,
    title: "Cryptocurrency Fundamentals",
    description: "Learn the basics of blockchain technology, Bitcoin, and cryptocurrency ecosystems.",
    category: "beginner",
    duration: "2 hours",
    lessons: 12,
    students: 15420,
    rating: 4.8,
    type: "course",
    difficulty: "Beginner",
    image: "/cryptocurrency-basics-blockchain.jpg",
    instructor: "Sarah Chen",
    price: "Free",
  },
  {
    id: 2,
    title: "Technical Analysis Masterclass",
    description: "Master chart patterns, indicators, and trading strategies for crypto markets.",
    category: "trading",
    duration: "4 hours",
    lessons: 24,
    students: 8930,
    rating: 4.9,
    type: "course",
    difficulty: "Intermediate",
    image: "/technical-analysis-charts-trading.jpg",
    instructor: "Mike Rodriguez",
    price: "$49",
  },
  {
    id: 3,
    title: "DeFi Deep Dive",
    description: "Explore decentralized finance protocols, yield farming, and liquidity provision.",
    category: "advanced",
    duration: "3 hours",
    lessons: 18,
    students: 5670,
    rating: 4.7,
    type: "course",
    difficulty: "Advanced",
    image: "/defi-protocols-yield-farming.jpg",
    instructor: "Alex Thompson",
    price: "$79",
  },
  {
    id: 4,
    title: "Crypto Security Best Practices",
    description: "Learn how to secure your crypto assets, use hardware wallets, and avoid scams.",
    category: "security",
    duration: "1.5 hours",
    lessons: 8,
    students: 12340,
    rating: 4.9,
    type: "course",
    difficulty: "Beginner",
    image: "/crypto-security-wallet-protection.jpg",
    instructor: "Emma Davis",
    price: "Free",
  },
  {
    id: 5,
    title: "NFT Creation and Trading",
    description: "Understand NFTs, how to create them, and navigate the NFT marketplace.",
    category: "intermediate",
    duration: "2.5 hours",
    lessons: 15,
    students: 7890,
    rating: 4.6,
    type: "course",
    difficulty: "Intermediate",
    image: "/nft-creation-digital-art-marketplace.jpg",
    instructor: "David Kim",
    price: "$39",
  },
  {
    id: 6,
    title: "Blockchain Development Basics",
    description: "Introduction to smart contract development and blockchain programming.",
    category: "advanced",
    duration: "5 hours",
    lessons: 30,
    students: 4560,
    rating: 4.8,
    type: "course",
    difficulty: "Advanced",
    image: "/blockchain-development-smart-contracts.jpg",
    instructor: "Lisa Wang",
    price: "$99",
  },
]

const articles = [
  {
    id: 1,
    title: "Understanding Market Volatility in Crypto",
    description: "Why cryptocurrency markets are volatile and how to navigate price swings.",
    readTime: "5 min read",
    category: "beginner",
    type: "article",
    author: "John Smith",
    publishedAt: "2024-01-15",
  },
  {
    id: 2,
    title: "The Rise of Layer 2 Solutions",
    description: "Exploring Ethereum scaling solutions and their impact on the ecosystem.",
    readTime: "8 min read",
    category: "intermediate",
    type: "article",
    author: "Maria Garcia",
    publishedAt: "2024-01-12",
  },
  {
    id: 3,
    title: "Regulatory Landscape: What's Coming Next",
    description: "Analysis of upcoming crypto regulations and their potential impact.",
    readTime: "12 min read",
    category: "advanced",
    type: "article",
    author: "Robert Johnson",
    publishedAt: "2024-01-10",
  },
]

const webinars = [
  {
    id: 1,
    title: "Live Trading Session: Market Analysis",
    description: "Join our expert traders for a live market analysis and trading session.",
    date: "2024-01-25",
    time: "2:00 PM EST",
    duration: "1 hour",
    type: "webinar",
    host: "Trading Team",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Q&A: Crypto Tax Strategies",
    description: "Get your crypto tax questions answered by certified professionals.",
    date: "2024-01-30",
    time: "7:00 PM EST",
    duration: "45 minutes",
    type: "webinar",
    host: "Tax Experts",
    status: "upcoming",
  },
]

export default function EducationCenter() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Education Center</h1>
        <p className="text-muted-foreground text-lg">
          Master cryptocurrency trading, blockchain technology, and digital asset management with our comprehensive
          learning resources.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses, articles, and resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="webinars" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            Webinars
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={course.price === "Free" ? "secondary" : "default"}>{course.price}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{course.difficulty}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.lessons} lessons
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {course.students.toLocaleString()} students
                    </div>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Start Course
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">by {course.instructor}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Articles Tab */}
        <TabsContent value="articles" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="capitalize">
                      {article.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      by {article.author} • {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                    <Button variant="outline" size="sm">
                      Read Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Webinars Tab */}
        <TabsContent value="webinars" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {webinars.map((webinar) => (
              <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={webinar.status === "upcoming" ? "default" : "secondary"}>{webinar.status}</Badge>
                    <span className="text-sm text-muted-foreground">{webinar.duration}</span>
                  </div>
                  <CardTitle className="text-lg">{webinar.title}</CardTitle>
                  <CardDescription>{webinar.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {new Date(webinar.date).toLocaleDateString()} at {webinar.time}
                    </div>
                    <div className="text-sm text-muted-foreground">Hosted by {webinar.host}</div>
                  </div>
                  <Button className="w-full">
                    {webinar.status === "upcoming" ? "Register Now" : "Watch Recording"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
