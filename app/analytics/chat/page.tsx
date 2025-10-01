import { AIChatInterface } from "@/components/analytics/ai-chat-interface"

export default function ChatPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AI Analytics Chat</h1>
        <p className="text-muted-foreground">
          Chat with our AI assistant for real-time portfolio analysis and market insights
        </p>
      </div>

      <AIChatInterface />
    </div>
  )
}
