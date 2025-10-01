"use client"

import type React from "react"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Brain, TrendingUp, BarChart3 } from "lucide-react"

export function AIChatInterface() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai-insights" }),
  })

  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({ text: input })
      setInput("")
    }
  }

  const quickQuestions = [
    "Analyze my portfolio performance",
    "What are the current market trends?",
    "Predict BTC price for next week",
    "Suggest portfolio rebalancing",
    "What are the best DeFi opportunities?",
    "Assess my portfolio risk level",
  ]

  return (
    <Card className="glass-card h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-400" />
          AI Analytics Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Ask the AI Assistant</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get instant insights about your portfolio, market analysis, and trading recommendations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                    onClick={() => sendMessage({ text: question })}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={message.role === "user" ? "default" : "secondary"}>
                    {message.role === "user" ? "You" : "AI Assistant"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${
                              message.role === "user"
                                ? "bg-blue-500/20 border border-blue-500/30"
                                : "bg-white/5 border border-white/10"
                            }`}
                          >
                            <div className="text-sm whitespace-pre-wrap">{part.text}</div>
                          </div>
                        )

                      case "tool-analyzePortfolio":
                        switch (part.state) {
                          case "input-available":
                            return (
                              <div key={index} className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <BarChart3 className="h-4 w-4 text-purple-400" />
                                  <span className="text-sm font-semibold">Analyzing Portfolio...</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Portfolio ID: {part.input.portfolioId} | Timeframe: {part.input.timeframe}
                                </div>
                              </div>
                            )
                          case "output-available":
                            return (
                              <div key={index} className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="h-4 w-4 text-green-400" />
                                  <span className="text-sm font-semibold">Portfolio Analysis Complete</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>Performance: {part.output.performance.toFixed(2)}%</div>
                                  <div>Risk Score: {part.output.riskScore}/100</div>
                                </div>
                                <div className="mt-2">
                                  <div className="text-xs font-semibold mb-1">Recommendations:</div>
                                  <ul className="text-xs space-y-1">
                                    {part.output.recommendations.map((rec: string, i: number) => (
                                      <li key={i} className="flex items-start gap-1">
                                        <span>•</span>
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )
                        }
                        break

                      case "tool-getMarketSentiment":
                        switch (part.state) {
                          case "input-available":
                            return (
                              <div key={index} className="p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <Brain className="h-4 w-4 text-yellow-400" />
                                  <span className="text-sm font-semibold">Analyzing Market Sentiment...</span>
                                </div>
                              </div>
                            )
                          case "output-available":
                            return (
                              <div key={index} className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm font-semibold">Market Sentiment Analysis</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                  <div>Overall: {part.output.overallSentiment}</div>
                                  <div>Confidence: {part.output.confidence}%</div>
                                  <div>Social Score: {part.output.socialScore}/100</div>
                                  <div>Fear & Greed: {part.output.fearGreedIndex}/100</div>
                                </div>
                                <div className="space-y-1">
                                  {part.output.assetSentiments.map((asset: any, i: number) => (
                                    <div key={i} className="flex justify-between text-xs">
                                      <span>{asset.asset}:</span>
                                      <span
                                        className={
                                          asset.sentiment === "bullish"
                                            ? "text-green-400"
                                            : asset.sentiment === "bearish"
                                              ? "text-red-400"
                                              : "text-yellow-400"
                                        }
                                      >
                                        {asset.sentiment} ({asset.score}%)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                        }
                        break

                      case "tool-predictPrice":
                        switch (part.state) {
                          case "input-available":
                            return (
                              <div key={index} className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <Brain className="h-4 w-4 text-purple-400 animate-pulse" />
                                  <span className="text-sm font-semibold">Predicting {part.input.asset} Price...</span>
                                </div>
                                <div className="text-xs text-muted-foreground">Timeframe: {part.input.timeframe}</div>
                              </div>
                            )
                          case "output-available":
                            return (
                              <div key={index} className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="h-4 w-4 text-green-400" />
                                  <span className="text-sm font-semibold">{part.output.asset} Price Prediction</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                  <div>Current: ${part.output.currentPrice.toLocaleString()}</div>
                                  <div>Predicted: ${part.output.predictedPrice.toLocaleString()}</div>
                                  <div>Confidence: {part.output.confidence}%</div>
                                  <div>Timeframe: {part.output.timeframe}</div>
                                </div>
                                <div>
                                  <div className="text-xs font-semibold mb-1">Key Factors:</div>
                                  <ul className="text-xs space-y-1">
                                    {part.output.factors.map((factor: string, i: number) => (
                                      <li key={i} className="flex items-start gap-1">
                                        <span>•</span>
                                        <span>{factor}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )
                        }
                        break

                      default:
                        return null
                    }
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your portfolio, market trends, or get trading advice..."
            disabled={status === "in_progress"}
            className="flex-1"
          />
          <Button type="submit" disabled={status === "in_progress" || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
