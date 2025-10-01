import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Solaria World - Cryptocurrency Trading Platform",
  description:
    "Professional cryptocurrency trading platform with market data, portfolio tracking, and advanced trading features.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 xl:ml-64">{children}</main>
          </div>
          <Analytics />
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}
