"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Users, DollarSign, Copy, Share2, Trophy, TrendingUp, Calendar, Check, ExternalLink } from "lucide-react"

const referralStats = {
  totalReferrals: 47,
  activeReferrals: 32,
  totalEarnings: 2847.5,
  thisMonthEarnings: 485.2,
  conversionRate: 68,
  tier: "Gold",
}

const recentReferrals = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.j***@gmail.com",
    joinDate: "2024-01-15",
    status: "active",
    earnings: 125.0,
    tier: "Premium",
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah.c***@outlook.com",
    joinDate: "2024-01-12",
    status: "active",
    earnings: 89.5,
    tier: "Basic",
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    email: "mike.r***@yahoo.com",
    joinDate: "2024-01-10",
    status: "pending",
    earnings: 0,
    tier: "Basic",
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma.d***@gmail.com",
    joinDate: "2024-01-08",
    status: "active",
    earnings: 156.75,
    tier: "Premium",
  },
]

const referralTiers = [
  {
    name: "Bronze",
    minReferrals: 0,
    commission: "10%",
    bonuses: ["Welcome bonus", "Basic support"],
    color: "from-orange-400 to-orange-600",
    current: false,
  },
  {
    name: "Silver",
    minReferrals: 10,
    commission: "15%",
    bonuses: ["Welcome bonus", "Priority support", "Monthly bonus"],
    color: "from-gray-400 to-gray-600",
    current: false,
  },
  {
    name: "Gold",
    minReferrals: 25,
    commission: "20%",
    bonuses: ["Welcome bonus", "Priority support", "Monthly bonus", "Exclusive events"],
    color: "from-yellow-400 to-yellow-600",
    current: true,
  },
  {
    name: "Platinum",
    minReferrals: 50,
    commission: "25%",
    bonuses: ["Welcome bonus", "VIP support", "Monthly bonus", "Exclusive events", "Personal manager"],
    color: "from-purple-400 to-purple-600",
    current: false,
  },
]

const socialPlatforms = [
  { name: "Twitter", icon: "🐦", color: "bg-blue-500" },
  { name: "Facebook", icon: "📘", color: "bg-blue-600" },
  { name: "LinkedIn", icon: "💼", color: "bg-blue-700" },
  { name: "Telegram", icon: "✈️", color: "bg-blue-400" },
  { name: "WhatsApp", icon: "💬", color: "bg-green-500" },
  { name: "Email", icon: "📧", color: "bg-gray-600" },
]

export default function Referral() {
  const [referralCode] = useState("SOLARIA-REF-2024")
  const [referralLink] = useState("https://solaria.world/ref/SOLARIA-REF-2024")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const shareToSocial = (platform: string) => {
    const message = `Join me on Solaria World - the ultimate crypto trading platform! Use my referral link to get started: ${referralLink}`

    const urls = {
      Twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      Telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`,
      WhatsApp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      Email: `mailto:?subject=Join Solaria World&body=${encodeURIComponent(message)}`,
    }

    window.open(urls[platform as keyof typeof urls], "_blank")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Referral Program</h1>
        <p className="text-muted-foreground text-lg">
          Earn rewards by inviting friends to join Solaria World. The more you refer, the more you earn!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">{referralStats.activeReferrals} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${referralStats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+${referralStats.thisMonthEarnings.toFixed(2)} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Above average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.tier}</div>
            <p className="text-xs text-muted-foreground">20% commission rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="share" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share & Earn
          </TabsTrigger>
          <TabsTrigger value="tiers" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Tiers & Rewards
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Referral History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Start earning with our simple 3-step referral process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Share Your Link</h4>
                    <p className="text-sm text-muted-foreground">
                      Share your unique referral link with friends and family
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">They Sign Up</h4>
                    <p className="text-sm text-muted-foreground">Your friends create an account and start trading</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">You Earn Rewards</h4>
                    <p className="text-sm text-muted-foreground">Earn commission on their trading fees and bonuses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Referral Details</CardTitle>
                <CardDescription>Your unique referral code and link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Referral Code</label>
                  <div className="flex gap-2">
                    <Input value={referralCode} readOnly className="font-mono" />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(referralCode, "code")}>
                      {copied === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Referral Link</label>
                  <div className="flex gap-2">
                    <Input value={referralLink} readOnly className="font-mono text-xs" />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(referralLink, "link")}>
                      {copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Share & Earn Tab */}
        <TabsContent value="share" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Share on Social Media</CardTitle>
                <CardDescription>Share your referral link across different platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {socialPlatforms.map((platform) => (
                    <Button
                      key={platform.name}
                      variant="outline"
                      className="flex items-center gap-2 h-12 bg-transparent"
                      onClick={() => shareToSocial(platform.name)}
                    >
                      <span className="text-lg">{platform.icon}</span>
                      {platform.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral Tools</CardTitle>
                <CardDescription>Additional resources to help you succeed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download Marketing Materials
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Referral Guidelines
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Access Training Resources
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Referral Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tiers & Rewards Tab */}
        <TabsContent value="tiers" className="mt-6">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Referral Tiers</h3>
              <p className="text-muted-foreground">
                Unlock higher commission rates and exclusive benefits as you refer more users
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {referralTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative overflow-hidden ${tier.current ? "ring-2 ring-yellow-500" : ""}`}
                >
                  <div className={`h-32 bg-gradient-to-r ${tier.color} relative`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                      <p className="text-white/80">{tier.commission} commission</p>
                    </div>
                    {tier.current && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-yellow-900">Current</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{tier.minReferrals}+ Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tier.bonuses.map((bonus, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-green-500" />
                          {bonus}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Referral History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>Track your recent referrals and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReferrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {referral.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h4 className="font-medium">{referral.name}</h4>
                        <p className="text-sm text-muted-foreground">{referral.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={referral.status === "active" ? "default" : "secondary"}>
                          {referral.status}
                        </Badge>
                        <Badge variant="outline">{referral.tier}</Badge>
                      </div>
                      <p className="text-sm font-medium">${referral.earnings.toFixed(2)} earned</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(referral.joinDate).toLocaleDateString()}
                      </p>
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
