"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  Wallet,
  BarChart3,
  Newspaper,
  Settings,
  Star,
  Activity,
  PieChart,
  ChevronDown,
  ChevronRight,
  LinkIcon,
  TrendingDown,
  Calendar,
  BookOpen,
  GraduationCap,
  Scale,
  CreditCard,
  Building2,
  Gift,
  HelpCircle,
  Calculator,
  Zap,
} from "lucide-react"

interface SidebarItem {
  title: string
  href?: string
  icon: any
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Markets",
    href: "/",
    icon: TrendingUp,
    children: [
      {
        title: "OnChain Analytics",
        href: "/markets/onchain-analytics",
        icon: LinkIcon,
      },
      {
        title: "Derivatives",
        href: "/markets/derivatives",
        icon: Activity,
      },
      {
        title: "Technical Analysis",
        href: "/markets/technical-analysis",
        icon: TrendingDown,
      },
      {
        title: "Crypto ETFs",
        href: "/markets/crypto-etfs",
        icon: PieChart,
      },
      {
        title: "CryptoCalendar",
        href: "/markets/crypto-calendar",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: Wallet,
  },
  {
    title: "Trading",
    href: "/trading",
    icon: BarChart3,
    children: [
      {
        title: "Trade using API",
        href: "/trading/api",
        icon: Zap,
      },
    ],
  },
  {
    title: "Watchlist",
    href: "/watchlist",
    icon: Star,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: PieChart,
  },
  {
    title: "News",
    href: "/news",
    icon: Newspaper,
  },
  {
    title: "Resources",
    icon: BookOpen,
    children: [
      {
        title: "Education Center",
        href: "/resources/education-center",
        icon: GraduationCap,
      },
      {
        title: "Regulatory Tracker",
        href: "/resources/regulatory-tracker",
        icon: Scale,
      },
      {
        title: "Crypto Cards",
        href: "/resources/crypto-cards",
        icon: CreditCard,
      },
      {
        title: "Exchanges",
        href: "/resources/exchanges",
        icon: Building2,
      },
      {
        title: "Crypto Tax Calculator",
        href: "/resources/crypto-tax-calculator",
        icon: Calculator,
      },
      {
        title: "Referral",
        href: "/resources/referral",
        icon: Gift,
      },
      {
        title: "Technical Support",
        href: "/resources/support",
        icon: HelpCircle,
      },
    ],
  },
  {
    title: "Activity",
    href: "/activity",
    icon: Activity,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

function SidebarItemComponent({ item, level = 0 }: { item: SidebarItem; level?: number }) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(item.children?.some((child) => pathname === child.href) || false)

  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === item.href
  const hasActiveChild = item.children?.some((child) => pathname === child.href)

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div>
      {/* Main item */}
      <div className="flex items-center">
        {item.href ? (
          <Link
            href={item.href}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex-1",
              level > 0 && "ml-6",
              isActive || hasActiveChild
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ) : (
          <button
            onClick={handleToggle}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex-1 text-left",
              level > 0 && "ml-6",
              hasActiveChild
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </button>
        )}

        {hasChildren && (
          <button onClick={handleToggle} className="p-1 rounded hover:bg-sidebar-accent/50 transition-colors">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-sidebar-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
            )}
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarItemComponent key={child.href || child.title} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="hidden xl:flex h-full w-64 flex-col fixed left-0 top-16 border-r border-border bg-sidebar">
      <div className="flex-1 overflow-auto py-6">
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <SidebarItemComponent key={item.href || item.title} item={item} />
          ))}
        </nav>
      </div>
    </div>
  )
}
