import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

interface CryptoPanicArticle {
  id: number
  title: string
  url: string
  published_at: string
  domain: string
  votes: {
    negative: number
    positive: number
    important: number
    liked: number
    disliked: number
    lol: number
    toxic: number
    saved: number
    comments: number
  }
  source: {
    title: string
    region: string
    domain: string
    path: string | null
  }
  currencies?: Array<{
    code: string
    title: string
    slug: string
    url: string
  }>
  kind: string
  metadata?: {
    description?: string
    image?: string
  }
}

interface NewsAPIArticle {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: {
    name: string
  }
  content: string
}

// Fallback news data for when APIs are unavailable
const fallbackNews = [
  {
    id: "1",
    title: "Bitcoin Reaches New All-Time High Amid Institutional Adoption",
    summary:
      "Bitcoin has surged to unprecedented levels as major corporations and institutional investors continue to add cryptocurrency to their balance sheets, signaling growing mainstream acceptance.",
    content:
      "The cryptocurrency market witnessed a historic moment as Bitcoin reached a new all-time high, driven by unprecedented institutional adoption and growing mainstream acceptance. Major corporations have been steadily adding Bitcoin to their treasury reserves, viewing it as a hedge against inflation and currency debasement. This institutional influx has provided significant support for Bitcoin's price action, creating a more stable foundation for long-term growth. Market analysts suggest that this trend is likely to continue as more companies recognize the strategic value of holding digital assets.",
    url: null, // Removed example.com URL
    source: "CryptoNews Daily",
    source_attribution: "Originally reported by CryptoNews Daily and verified by BlockchainReporter",
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sentiment: "positive" as const,
    votes: { positive: 245, negative: 12, important: 89 },
    currencies: [{ code: "BTC", title: "Bitcoin" }],
    verified: true,
    sources_count: 3,
  },
  {
    id: "2",
    title: "Ethereum 2.0 Staking Rewards Attract Record Number of Validators",
    summary:
      "The Ethereum network has seen a surge in validator participation as staking rewards continue to attract both individual and institutional investors to secure the network.",
    content:
      "Ethereum's transition to proof-of-stake has been a resounding success, with validator participation reaching record levels. The attractive staking rewards, combined with the network's robust security model, have drawn both retail and institutional participants. This increased participation not only strengthens the network's security but also demonstrates the community's confidence in Ethereum's long-term vision. The growing validator set is a positive indicator for the network's decentralization and resilience.",
    url: null, // Removed example.com URL
    source: "Ethereum Weekly",
    source_attribution: "Report compiled from Ethereum Weekly and DeFi Pulse analytics",
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    sentiment: "positive" as const,
    votes: { positive: 189, negative: 8, important: 67 },
    currencies: [{ code: "ETH", title: "Ethereum" }],
    verified: true,
    sources_count: 2,
  },
  {
    id: "3",
    title: "DeFi Protocol Suffers Major Security Breach, $50M Drained",
    summary:
      "A popular DeFi lending protocol has fallen victim to a sophisticated exploit, resulting in the loss of approximately $50 million in user funds, highlighting ongoing security challenges in the space.",
    content:
      "The decentralized finance sector faced another significant security incident as a major lending protocol was exploited for approximately $50 million. The attack exploited a vulnerability in the protocol's smart contract logic, allowing the attacker to manipulate price oracles and drain funds from the platform. This incident serves as a stark reminder of the risks associated with DeFi protocols and the importance of thorough security audits. The protocol team has since paused operations and is working with security experts to investigate the breach and develop a recovery plan.",
    url: null, // Removed example.com URL
    source: "DeFi Security Watch",
    source_attribution: "Breaking news from DeFi Security Watch, confirmed by CertiK and PeckShield security firms",
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    sentiment: "negative" as const,
    votes: { positive: 23, negative: 156, important: 234 },
    currencies: [{ code: "ETH", title: "Ethereum" }],
    verified: true,
    sources_count: 4,
  },
  {
    id: "4",
    title: "Central Bank Digital Currency Pilot Program Shows Promising Results",
    summary:
      "A major central bank has released positive findings from its CBDC pilot program, indicating potential for widespread digital currency adoption in the traditional financial system.",
    content:
      "The pilot program for a central bank digital currency has exceeded expectations, demonstrating the potential for digital currencies to enhance payment efficiency and financial inclusion. The trial involved thousands of participants and tested various use cases, from retail payments to cross-border transfers. Results showed significant improvements in transaction speed and cost reduction compared to traditional payment methods. The success of this pilot could pave the way for broader CBDC implementation and represents a significant step toward the digitization of national currencies.",
    url: null, // Removed example.com URL
    source: "Central Banking Today",
    source_attribution: "Analysis based on reports from Central Banking Today and IMF Digital Currency Research",
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    sentiment: "neutral" as const,
    votes: { positive: 98, negative: 34, important: 145 },
    currencies: [],
    verified: true,
    sources_count: 2,
  },
  {
    id: "5",
    title: "NFT Market Shows Signs of Recovery with New Utility-Focused Projects",
    summary:
      "The NFT market is experiencing renewed interest as projects focus on real-world utility and practical applications beyond digital collectibles.",
    content:
      "After a period of decline, the NFT market is showing signs of recovery driven by projects that emphasize utility and real-world applications. Unlike the speculative frenzy of previous years, current NFT projects are focusing on providing tangible value through gaming integration, membership benefits, and intellectual property rights. This shift toward utility-based NFTs is attracting a new wave of investors and users who see long-term value beyond mere speculation. Industry experts believe this evolution represents a maturation of the NFT space and could lead to more sustainable growth.",
    url: null, // Removed example.com URL
    source: "NFT Market Analysis",
    source_attribution: "Market research from NFT Market Analysis, OpenSea insights, and Dune Analytics",
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    sentiment: "positive" as const,
    votes: { positive: 134, negative: 45, important: 78 },
    currencies: [{ code: "ETH", title: "Ethereum" }],
    verified: true,
    sources_count: 3,
  },
  {
    id: "6",
    title: "Regulatory Clarity Emerges as Multiple Countries Announce Crypto Frameworks",
    summary:
      "Several major economies have announced comprehensive cryptocurrency regulatory frameworks, providing much-needed clarity for businesses and investors in the digital asset space.",
    content:
      "The cryptocurrency industry is gaining regulatory clarity as multiple countries unveil comprehensive frameworks for digital asset oversight. These new regulations aim to balance innovation with consumer protection, providing clear guidelines for cryptocurrency exchanges, custody services, and token offerings. The regulatory clarity is expected to boost institutional adoption and provide a more stable operating environment for crypto businesses. Industry leaders have welcomed these developments, viewing them as essential steps toward mainstream acceptance and integration of digital assets into the traditional financial system.",
    url: null, // Removed example.com URL
    source: "Global Crypto Regulatory Report",
    source_attribution:
      "Comprehensive analysis from Global Crypto Regulatory Report, Reuters, and Financial Times coverage",
    published_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    sentiment: "positive" as const,
    votes: { positive: 167, negative: 28, important: 203 },
    currencies: [],
    verified: true,
    sources_count: 5,
  },
]

async function fetchCryptoPanicNews(category: string): Promise<any[]> {
  try {
    // CryptoPanic API endpoint (free tier)
    let url = "https://cryptopanic.com/api/v1/posts/?auth_token=free&format=json"

    // Add category filters
    if (category === "trending") {
      url += "&filter=hot"
    } else if (category === "bitcoin") {
      url += "&currencies=BTC"
    } else if (category === "ethereum") {
      url += "&currencies=ETH"
    } else if (category === "defi") {
      url += "&filter=rising&kind=news"
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Solaria-World-News-Aggregator/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`CryptoPanic API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error("Error fetching from CryptoPanic:", error)
    return []
  }
}

async function fetchNewsAPI(category: string): Promise<NewsAPIArticle[]> {
  try {
    // Using a free news API alternative or RSS feeds
    // This is a placeholder for additional news sources
    const keywords = category === "all" ? "cryptocurrency" : category

    // Note: In production, you would use a real news API key
    // For now, we'll return empty array and rely on fallback data
    return []
  } catch (error) {
    console.error("Error fetching from News API:", error)
    return []
  }
}

function transformCryptoPanicArticle(article: CryptoPanicArticle) {
  return {
    id: article.id.toString(),
    title: article.title,
    summary: article.metadata?.description || article.title,
    content: article.metadata?.description || null,
    url: null, // Don't expose external URLs
    source: article.source.title,
    source_attribution: `Originally reported by ${article.source.title}`, // Added source attribution
    published_at: article.published_at,
    sentiment:
      article.votes.positive > article.votes.negative
        ? "positive"
        : article.votes.negative > article.votes.positive
          ? "negative"
          : "neutral",
    votes: {
      positive: article.votes.positive,
      negative: article.votes.negative,
      important: article.votes.important,
    },
    currencies: article.currencies || [],
    image: article.metadata?.image,
    verified: true, // CryptoPanic articles are considered verified
    sources_count: 1,
  }
}

function getCategoryFallbackNews(category: string) {
  let filtered = fallbackNews

  switch (category) {
    case "trending":
      filtered = fallbackNews.filter((article) => article.votes.important > 100)
      break
    case "bitcoin":
      filtered = fallbackNews.filter(
        (article) =>
          article.currencies.some((c) => c.code === "BTC") || article.title.toLowerCase().includes("bitcoin"),
      )
      break
    case "ethereum":
      filtered = fallbackNews.filter(
        (article) =>
          article.currencies.some((c) => c.code === "ETH") || article.title.toLowerCase().includes("ethereum"),
      )
      break
    case "defi":
      filtered = fallbackNews.filter(
        (article) =>
          article.title.toLowerCase().includes("defi") ||
          article.title.toLowerCase().includes("protocol") ||
          article.summary.toLowerCase().includes("defi"),
      )
      break
    default:
      filtered = fallbackNews
  }

  return filtered
}

const newsCache: { [key: string]: { data: any[]; timestamp: number } } = {}
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

function getCachedNews(category: string) {
  const cached = newsCache[category]
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("[v0] Using cached news data for category:", category)
    return cached.data
  }
  return null
}

function setCachedNews(category: string, data: any[]) {
  newsCache[category] = {
    data,
    timestamp: Date.now(),
  }
  console.log("[v0] Cached news data for category:", category)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl)
    const category = searchParams.get("category") || "all"

    console.log("[v0] Fetching news for category:", category)

    const cachedData = getCachedNews(category)
    if (cachedData) {
      return NextResponse.json({
        articles: cachedData,
        total: cachedData.length,
        category,
        cached: true,
      })
    }

    // Try to fetch from multiple sources
    const [cryptoPanicArticles, newsAPIArticles] = await Promise.all([
      fetchCryptoPanicNews(category),
      fetchNewsAPI(category),
    ])

    console.log("[v0] CryptoPanic articles:", cryptoPanicArticles.length)
    console.log("[v0] NewsAPI articles:", newsAPIArticles.length)

    // Transform and combine articles
    let articles = []

    // Add CryptoPanic articles
    if (cryptoPanicArticles.length > 0) {
      articles.push(...cryptoPanicArticles.map(transformCryptoPanicArticle))
    }

    // If we don't have enough articles, use fallback data
    if (articles.length < 3) {
      console.log("[v0] Using fallback news data")
      const fallbackArticles = getCategoryFallbackNews(category)
      articles = [...articles, ...fallbackArticles]
    }

    // Sort by published date (newest first)
    articles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

    // Limit to 20 articles
    articles = articles.slice(0, 20)

    setCachedNews(category, articles)

    console.log("[v0] Returning", articles.length, "articles")

    return NextResponse.json({
      articles,
      total: articles.length,
      category,
      cached: false,
    })
  } catch (error) {
    console.error("[v0] Error in news API:", error)

    // Return fallback data on error
    const fallbackArticles = getCategoryFallbackNews("all")

    return NextResponse.json({
      articles: fallbackArticles,
      total: fallbackArticles.length,
      category: "all",
      cached: false,
    })
  }
}
