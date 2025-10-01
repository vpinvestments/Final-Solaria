"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Search, MessageCircle, Phone, Mail, Clock, CheckCircle, FileText, Video, Book } from "lucide-react"

const supportChannels = [
  {
    name: "Live Chat",
    description: "Get instant help from our support team",
    availability: "24/7",
    responseTime: "< 2 minutes",
    icon: MessageCircle,
    color: "bg-green-500",
    status: "online",
  },
  {
    name: "Email Support",
    description: "Send us a detailed message about your issue",
    availability: "24/7",
    responseTime: "< 4 hours",
    icon: Mail,
    color: "bg-blue-500",
    status: "online",
  },
  {
    name: "Phone Support",
    description: "Speak directly with our support specialists",
    availability: "Mon-Fri 9AM-6PM EST",
    responseTime: "< 5 minutes",
    icon: Phone,
    color: "bg-purple-500",
    status: "offline",
  },
]

const faqCategories = [
  { id: "all", name: "All Categories" },
  { id: "account", name: "Account & Security" },
  { id: "trading", name: "Trading" },
  { id: "deposits", name: "Deposits & Withdrawals" },
  { id: "fees", name: "Fees & Limits" },
  { id: "technical", name: "Technical Issues" },
]

const faqs = [
  {
    id: 1,
    question: "How do I secure my account?",
    answer:
      "Enable two-factor authentication (2FA), use a strong unique password, never share your login credentials, and regularly monitor your account activity. We also recommend using our security features like withdrawal whitelist and API restrictions.",
    category: "account",
    helpful: 245,
    views: 1250,
  },
  {
    id: 2,
    question: "What are the trading fees?",
    answer:
      "Our trading fees start at 0.1% for makers and 0.1% for takers. Fees decrease based on your 30-day trading volume and SOL token holdings. VIP users can enjoy fees as low as 0.02%. Check our fee schedule for detailed information.",
    category: "fees",
    helpful: 189,
    views: 980,
  },
  {
    id: 3,
    question: "How long do deposits take?",
    answer:
      "Cryptocurrency deposits are typically confirmed within 10-30 minutes depending on network congestion. Bank transfers can take 1-3 business days. We'll send you email notifications when your deposit is processed.",
    category: "deposits",
    helpful: 156,
    views: 750,
  },
  {
    id: 4,
    question: "Why is my withdrawal pending?",
    answer:
      "Withdrawals may be pending due to security reviews, insufficient balance, or network congestion. Large withdrawals may require additional verification. Check your email for any required actions or contact support if the delay persists.",
    category: "deposits",
    helpful: 134,
    views: 680,
  },
  {
    id: 5,
    question: "How do I place a limit order?",
    answer:
      "Select the trading pair, choose 'Limit' order type, enter your desired price and quantity, then click 'Buy' or 'Sell'. Your order will be placed in the order book and executed when the market price reaches your limit price.",
    category: "trading",
    helpful: 98,
    views: 520,
  },
  {
    id: 6,
    question: "What should I do if I can't log in?",
    answer:
      "First, check your internet connection and try clearing your browser cache. Ensure you're using the correct email and password. If you've enabled 2FA, make sure your authenticator app is synced. Contact support if issues persist.",
    category: "technical",
    helpful: 87,
    views: 450,
  },
]

const supportResources = [
  {
    title: "Getting Started Guide",
    description: "Complete guide for new users to set up their account and start trading",
    type: "guide",
    icon: Book,
    readTime: "10 min read",
  },
  {
    title: "Trading Tutorial Videos",
    description: "Step-by-step video tutorials covering all trading features",
    type: "video",
    icon: Video,
    readTime: "25 min watch",
  },
  {
    title: "API Documentation",
    description: "Comprehensive documentation for developers using our API",
    type: "documentation",
    icon: FileText,
    readTime: "Technical",
  },
  {
    title: "Security Best Practices",
    description: "Learn how to keep your account and funds secure",
    type: "guide",
    icon: Book,
    readTime: "8 min read",
  },
]

const recentTickets = [
  {
    id: "SOL-2024-001",
    subject: "Withdrawal not received",
    status: "resolved",
    priority: "high",
    created: "2024-01-15",
    updated: "2024-01-16",
  },
  {
    id: "SOL-2024-002",
    subject: "2FA setup assistance",
    status: "in-progress",
    priority: "medium",
    created: "2024-01-14",
    updated: "2024-01-15",
  },
  {
    id: "SOL-2024-003",
    subject: "Trading fee inquiry",
    status: "resolved",
    priority: "low",
    created: "2024-01-12",
    updated: "2024-01-13",
  },
]

export default function Support() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
  })

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "in-progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Technical Support Center</h1>
        <p className="text-muted-foreground text-lg">
          Get help with your account, trading, and technical issues. Our support team is here to assist you 24/7.
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {supportChannels.map((channel) => (
          <Card key={channel.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${channel.color} text-white`}>
                    <channel.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                    <Badge variant={channel.status === "online" ? "default" : "secondary"} className="mt-1">
                      {channel.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{channel.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{channel.availability}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Response: {channel.responseTime}</span>
                </div>
              </div>
              <Button className="w-full mt-4" disabled={channel.status === "offline"}>
                {channel.status === "offline" ? "Currently Offline" : `Contact via ${channel.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="ticket" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Submit Ticket
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            My Tickets
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {faqCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id.toString()} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium">{faq.question}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="capitalize">
                        {faq.category}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <p className="text-muted-foreground mb-4">{faq.answer}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{faq.helpful} people found this helpful</span>
                      <span>{faq.views} views</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        👍 Helpful
                      </Button>
                      <Button variant="outline" size="sm">
                        👎 Not helpful
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* Submit Ticket Tab */}
        <TabsContent value="ticket" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Submit a detailed support request and our team will get back to you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select
                      value={ticketForm.category}
                      onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account & Security</SelectItem>
                        <SelectItem value="trading">Trading</SelectItem>
                        <SelectItem value="deposits">Deposits & Withdrawals</SelectItem>
                        <SelectItem value="fees">Fees & Limits</SelectItem>
                        <SelectItem value="technical">Technical Issues</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select
                    value={ticketForm.priority}
                    onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General inquiry</SelectItem>
                      <SelectItem value="medium">Medium - Account issue</SelectItem>
                      <SelectItem value="high">High - Funds at risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Please provide detailed information about your issue, including any error messages, transaction IDs, or steps to reproduce the problem."
                    rows={6}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  />
                </div>
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <resource.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {resource.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{resource.readTime}</span>
                    <Button variant="outline">View Resource</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>Track the status of your support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium">{ticket.subject}</h4>
                        <p className="text-sm text-muted-foreground">Ticket ID: {ticket.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(ticket.created).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Updated: {new Date(ticket.updated).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
