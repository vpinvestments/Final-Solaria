"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, Sun, Moon, X } from "lucide-react"
import { searchCryptocurrencies, type CryptoCurrency } from "@/lib/crypto-api"
import { useRouter } from "next/navigation"

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<CryptoCurrency[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleSearchResultClick = (coin: CryptoCurrency) => {
    setSearchQuery("")
    setShowSearchResults(false)
    setIsMobileMenuOpen(false)
    router.push(`/coin/${coin.id}`)
  }

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`
    } else if (price < 1) {
      return `$${price.toFixed(4)}`
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        setShowSearchResults(false)
        return
      }

      setIsSearching(true)
      try {
        const results = await searchCryptocurrencies(searchQuery)
        setSearchResults(results)
        setShowSearchResults(true)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(handleSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg shadow-black/10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - positioned to align with sidebar */}
          <div className="flex items-center">
            <div className="w-64 xl:w-64 flex items-center px-4">
              <Link href="/" className="flex items-center space-x-2 floating-element">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                  <Image
                    src="/images/solaria-icon.png"
                    alt="Solaria World Logo"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                </div>
                <span className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">
                  <span className="hidden sm:inline">Solaria World</span>
                  <span className="sm:hidden">Solaria</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Navigation and Search - centered in remaining space */}
          <div className="flex-1 flex items-center justify-center px-4">
            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-6 mr-8">
              <Link
                href="/"
                className="text-sm font-medium text-white/90 hover:text-white hover:drop-shadow-lg transition-all duration-300"
              >
                Markets
              </Link>
              <Link
                href="/portfolio"
                className="text-sm font-medium text-white/70 hover:text-white hover:drop-shadow-lg transition-all duration-300"
              >
                Portfolio
              </Link>
              <Link
                href="/trading"
                className="text-sm font-medium text-white/70 hover:text-white hover:drop-shadow-lg transition-all duration-300"
              >
                Trading
              </Link>
              <Link
                href="/news"
                className="text-sm font-medium text-white/70 hover:text-white hover:drop-shadow-lg transition-all duration-300"
              >
                News
              </Link>
            </nav>

            {/* Search - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-md">
              <div className="relative w-full" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <Input
                  placeholder="Search cryptocurrencies..."
                  className="glass-input pl-10"
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />

                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
                    {isSearching ? (
                      <div className="p-4 text-center text-white/60">Searching...</div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((coin) => (
                          <button
                            key={coin.id}
                            onClick={() => handleSearchResultClick(coin)}
                            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-white/10 transition-colors"
                          >
                            <img
                              src={coin.image || "/placeholder.svg"}
                              alt={coin.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 text-left">
                              <div className="text-white font-medium">{coin.name}</div>
                              <div className="text-white/60 text-sm">{coin.symbol}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-white">{formatPrice(coin.price)}</div>
                              <div className={`text-sm ${coin.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                                {coin.change24h >= 0 ? "+" : ""}
                                {coin.change24h.toFixed(2)}%
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      searchQuery.trim() && (
                        <div className="p-4 text-center text-white/60">No results found for "{searchQuery}"</div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions - right side */}
          <div className="flex items-center space-x-2 px-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 glass-button">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="icon" className="lg:hidden glass-button" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMobileMenu} />
          <div className="fixed top-16 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/20 shadow-2xl">
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative" ref={mobileSearchRef}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <Input
                  placeholder="Search cryptocurrencies..."
                  className="glass-input pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />

                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl max-h-64 overflow-y-auto z-50">
                    {isSearching ? (
                      <div className="p-4 text-center text-white/60">Searching...</div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((coin) => (
                          <button
                            key={coin.id}
                            onClick={() => handleSearchResultClick(coin)}
                            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-white/10 transition-colors"
                          >
                            <img
                              src={coin.image || "/placeholder.svg"}
                              alt={coin.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <div className="flex-1 text-left">
                              <div className="text-white text-sm font-medium">{coin.name}</div>
                              <div className="text-white/60 text-xs">{coin.symbol}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-white text-sm">{formatPrice(coin.price)}</div>
                              <div className={`text-xs ${coin.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                                {coin.change24h >= 0 ? "+" : ""}
                                {coin.change24h.toFixed(2)}%
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      searchQuery.trim() && (
                        <div className="p-4 text-center text-white/60 text-sm">
                          No results found for "{searchQuery}"
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  onClick={toggleMobileMenu}
                >
                  Markets
                </Link>
                <Link
                  href="/portfolio"
                  className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  onClick={toggleMobileMenu}
                >
                  Portfolio
                </Link>
                <Link
                  href="/trading"
                  className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  onClick={toggleMobileMenu}
                >
                  Trading
                </Link>
                <Link
                  href="/news"
                  className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  onClick={toggleMobileMenu}
                >
                  News
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
