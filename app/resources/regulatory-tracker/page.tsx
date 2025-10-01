"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Scale, CheckCircle, Clock, Search, Filter, ExternalLink, Calendar, Building } from "lucide-react"

const regions = [
  { id: "all", name: "All Regions", flag: "🌍" },
  { id: "us", name: "United States", flag: "🇺🇸" },
  { id: "eu", name: "European Union", flag: "🇪🇺" },
  { id: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { id: "asia", name: "Asia Pacific", flag: "🌏" },
  { id: "canada", name: "Canada", flag: "🇨🇦" },
  { id: "australia", name: "Australia", flag: "🇦🇺" },
]

const regulatoryUpdates = [
  {
    id: 1,
    title: "SEC Approves Bitcoin ETF Applications",
    description:
      "The Securities and Exchange Commission has approved multiple Bitcoin ETF applications, marking a significant milestone for institutional crypto adoption.",
    region: "us",
    status: "approved",
    impact: "high",
    date: "2024-01-15",
    agency: "SEC",
    category: "ETF",
    source: "Official SEC Release",
    tags: ["Bitcoin", "ETF", "Institutional"],
  },
  {
    id: 2,
    title: "MiCA Regulation Implementation Timeline",
    description:
      "The European Union's Markets in Crypto-Assets regulation implementation phases and compliance requirements for crypto service providers.",
    region: "eu",
    status: "pending",
    impact: "high",
    date: "2024-01-12",
    agency: "European Commission",
    category: "Licensing",
    source: "EU Official Journal",
    tags: ["MiCA", "Compliance", "Licensing"],
  },
  {
    id: 3,
    title: "UK Stablecoin Regulation Framework",
    description: "HM Treasury publishes comprehensive framework for stablecoin regulation and oversight requirements.",
    region: "uk",
    status: "proposed",
    impact: "medium",
    date: "2024-01-10",
    agency: "HM Treasury",
    category: "Stablecoins",
    source: "HM Treasury Consultation",
    tags: ["Stablecoins", "Framework", "Oversight"],
  },
  {
    id: 4,
    title: "Japan Crypto Tax Reform Proposal",
    description:
      "Japanese government proposes significant changes to cryptocurrency taxation for individual and corporate investors.",
    region: "asia",
    status: "proposed",
    impact: "medium",
    date: "2024-01-08",
    agency: "FSA Japan",
    category: "Taxation",
    source: "FSA Press Release",
    tags: ["Taxation", "Reform", "Japan"],
  },
  {
    id: 5,
    title: "Canada CBDC Research Update",
    description:
      "Bank of Canada releases latest research findings on Central Bank Digital Currency development and implementation considerations.",
    region: "canada",
    status: "research",
    impact: "low",
    date: "2024-01-05",
    agency: "Bank of Canada",
    category: "CBDC",
    source: "BoC Research Paper",
    tags: ["CBDC", "Research", "Digital Currency"],
  },
  {
    id: 6,
    title: "Australia Crypto Custody Standards",
    description:
      "AUSTRAC introduces new standards for cryptocurrency custody services and digital asset storage requirements.",
    region: "australia",
    status: "approved",
    impact: "medium",
    date: "2024-01-03",
    agency: "AUSTRAC",
    category: "Custody",
    source: "AUSTRAC Guidelines",
    tags: ["Custody", "Standards", "Storage"],
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "SEC Bitcoin ETF Decision Deadline",
    description: "Final decision expected on remaining Bitcoin ETF applications",
    date: "2024-02-15",
    region: "us",
    importance: "high",
  },
  {
    id: 2,
    title: "MiCA Compliance Deadline - Phase 1",
    description: "First phase of MiCA regulation compliance requirements take effect",
    date: "2024-03-01",
    region: "eu",
    importance: "high",
  },
  {
    id: 3,
    title: "UK Stablecoin Consultation Closes",
    description: "Public consultation period ends for UK stablecoin regulation framework",
    date: "2024-02-28",
    region: "uk",
    importance: "medium",
  },
]

const complianceChecklist = [
  {
    id: 1,
    title: "KYC/AML Procedures",
    description: "Implement comprehensive Know Your Customer and Anti-Money Laundering procedures",
    status: "required",
    regions: ["us", "eu", "uk", "canada", "australia"],
    priority: "high",
  },
  {
    id: 2,
    title: "Licensing Requirements",
    description: "Obtain necessary licenses for cryptocurrency operations in your jurisdiction",
    status: "required",
    regions: ["us", "eu", "uk", "asia"],
    priority: "high",
  },
  {
    id: 3,
    title: "Tax Reporting",
    description: "Establish proper tax reporting procedures for cryptocurrency transactions",
    status: "required",
    regions: ["us", "eu", "uk", "canada", "australia", "asia"],
    priority: "medium",
  },
  {
    id: 4,
    title: "Data Protection Compliance",
    description: "Ensure compliance with data protection regulations (GDPR, CCPA, etc.)",
    status: "required",
    regions: ["eu", "us", "uk"],
    priority: "medium",
  },
]

export default function RegulatoryTracker() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUpdates = regulatoryUpdates.filter((update) => {
    const matchesRegion = selectedRegion === "all" || update.region === selectedRegion
    const matchesSearch =
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || update.status === statusFilter
    return matchesRegion && matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "proposed":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "research":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "medium":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      case "low":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Regulatory Tracker</h1>
        <p className="text-muted-foreground text-lg">
          Stay updated with the latest cryptocurrency regulations, compliance requirements, and policy changes
          worldwide.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search regulations, agencies, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  <span className="flex items-center gap-2">
                    <span>{region.flag}</span>
                    {region.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="proposed">Proposed</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="updates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="updates" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Regulatory Updates
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Compliance Guide
          </TabsTrigger>
        </TabsList>

        {/* Regulatory Updates Tab */}
        <TabsContent value="updates" className="mt-6">
          <div className="space-y-6">
            {filteredUpdates.map((update) => (
              <Card key={update.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(update.status)}>{update.status}</Badge>
                        <Badge className={getImpactColor(update.impact)}>{update.impact} impact</Badge>
                        <Badge variant="outline">
                          {regions.find((r) => r.id === update.region)?.flag}{" "}
                          {regions.find((r) => r.id === update.region)?.name}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{update.title}</CardTitle>
                      <CardDescription className="mt-2">{update.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{update.agency}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(update.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span>{update.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {update.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Source: {update.source}</span>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Upcoming Events Tab */}
        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={event.importance === "high" ? "destructive" : "secondary"}>
                      {event.importance} priority
                    </Badge>
                    <Badge variant="outline">
                      {regions.find((r) => r.id === event.region)?.flag}{" "}
                      {regions.find((r) => r.id === event.region)?.name}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Clock className="h-4 w-4 mr-2" />
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Guide Tab */}
        <TabsContent value="compliance" className="mt-6">
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Compliance Checklist</h3>
              <p className="text-muted-foreground">
                Essential compliance requirements for cryptocurrency businesses and service providers.
              </p>
            </div>
            {complianceChecklist.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={item.priority === "high" ? "destructive" : "secondary"}>
                          {item.priority} priority
                        </Badge>
                        <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">{item.status}</Badge>
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="mt-2">{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Applicable Regions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.regions.map((regionId) => {
                        const region = regions.find((r) => r.id === regionId)
                        return region ? (
                          <Badge key={regionId} variant="outline">
                            {region.flag} {region.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Guidelines
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
