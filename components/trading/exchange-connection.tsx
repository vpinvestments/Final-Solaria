"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Wifi, WifiOff, Key, Shield, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BinanceOAuthConnection } from "./binance-oauth-connection"
import { ApiKeyManagement } from "./api-key-management"

interface ExchangeConnection {
  id: string
  name: string
  logo: string
  connected: boolean
  balance: { [key: string]: number }
  tradingEnabled: boolean
  lastSync: string
}

const exchangeConfigs = [
  {
    id: "binance",
    name: "Binance",
    logo: "🟨",
    description: "World's largest crypto exchange",
    features: ["Spot Trading", "Futures", "Options"],
    fees: "0.1%",
  },
  {
    id: "coinbase",
    name: "Coinbase Pro",
    logo: "🟦",
    description: "Professional trading platform",
    features: ["Spot Trading", "Advanced Orders"],
    fees: "0.5%",
  },
  {
    id: "kraken",
    name: "Kraken",
    logo: "🟪",
    description: "Secure and reliable exchange",
    features: ["Spot Trading", "Margin Trading", "Futures"],
    fees: "0.26%",
  },
  {
    id: "okx",
    name: "OKX",
    logo: "⚫",
    description: "Global crypto exchange",
    features: ["Spot Trading", "Derivatives", "DeFi"],
    fees: "0.1%",
  },
]

export function ExchangeConnection() {
  const { toast } = useToast()
  const [connections, setConnections] = useState<ExchangeConnection[]>([
    {
      id: "binance",
      name: "Binance",
      logo: "🟨",
      connected: true,
      balance: { BTC: 0.5, ETH: 2.3, USDT: 10000 },
      tradingEnabled: true,
      lastSync: "2024-01-15T10:30:00Z",
    },
    {
      id: "coinbase",
      name: "Coinbase Pro",
      logo: "🟦",
      connected: false,
      balance: {},
      tradingEnabled: false,
      lastSync: "",
    },
  ])

  const [selectedExchange, setSelectedExchange] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [showApiDialog, setShowApiDialog] = useState(false)
  const [apiCredentials, setApiCredentials] = useState({
    apiKey: "",
    secretKey: "",
    passphrase: "",
    testMode: true,
  })

  const handleConnect = async (exchangeId: string) => {
    setIsConnecting(true)
    try {
      // Simulate API connection
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === exchangeId
            ? { ...conn, connected: true, tradingEnabled: true, lastSync: new Date().toISOString() }
            : conn,
        ),
      )

      toast({
        title: "Exchange Connected",
        description: `Successfully connected to ${exchangeConfigs.find((e) => e.id === exchangeId)?.name}`,
      })

      setShowApiDialog(false)
      setApiCredentials({ apiKey: "", secretKey: "", passphrase: "", testMode: true })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to exchange. Please check your API credentials.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = (exchangeId: string) => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === exchangeId ? { ...conn, connected: false, tradingEnabled: false, balance: {} } : conn,
      ),
    )

    toast({
      title: "Exchange Disconnected",
      description: `Disconnected from ${exchangeConfigs.find((e) => e.id === exchangeId)?.name}`,
    })
  }

  const handleToggleTrading = (exchangeId: string, enabled: boolean) => {
    setConnections((prev) => prev.map((conn) => (conn.id === exchangeId ? { ...conn, tradingEnabled: enabled } : conn)))

    toast({
      title: enabled ? "Trading Enabled" : "Trading Disabled",
      description: `Trading ${enabled ? "enabled" : "disabled"} for ${exchangeConfigs.find((e) => e.id === exchangeId)?.name}`,
    })
  }

  const connectedExchanges = connections.filter((conn) => conn.connected)
  const totalBalance = connectedExchanges.reduce((total, conn) => {
    return total + (conn.balance.USDT || 0) + (conn.balance.BTC || 0) * 67000 + (conn.balance.ETH || 0) * 3400
  }, 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Exchange Connections
          </CardTitle>
          <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Key className="h-4 w-4 mr-2" />
                Connect Exchange
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Connect Exchange</DialogTitle>
              </DialogHeader>
              <ConnectExchangeForm
                onConnect={handleConnect}
                isConnecting={isConnecting}
                selectedExchange={selectedExchange}
                setSelectedExchange={setSelectedExchange}
                apiCredentials={apiCredentials}
                setApiCredentials={setApiCredentials}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl font-bold text-green-400">{connectedExchanges.length}</div>
            <div className="text-sm text-muted-foreground">Connected</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl font-bold text-blue-400">
              ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">Total Balance</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xl font-bold text-purple-400">
              {connections.filter((c) => c.tradingEnabled).length}
            </div>
            <div className="text-sm text-muted-foreground">Trading Active</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {connections.map((connection) => {
            const config = exchangeConfigs.find((e) => e.id === connection.id)
            if (!config) return null

            return (
              <div
                key={connection.id}
                className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{connection.logo}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{connection.name}</span>
                      {connection.connected ? (
                        <Badge variant="default" className="bg-green-500/20 text-green-400">
                          <Wifi className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
                          <WifiOff className="h-3 w-3 mr-1" />
                          Disconnected
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{config.description}</div>
                    {connection.connected && Object.keys(connection.balance).length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Balance:{" "}
                        {Object.entries(connection.balance)
                          .map(([asset, amount]) => `${amount} ${asset}`)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {connection.connected && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`trading-${connection.id}`} className="text-sm">
                        Trading
                      </Label>
                      <Switch
                        id={`trading-${connection.id}`}
                        checked={connection.tradingEnabled}
                        onCheckedChange={(checked) => handleToggleTrading(connection.id, checked)}
                      />
                    </div>
                  )}

                  {connection.connected ? (
                    <Button variant="outline" size="sm" onClick={() => handleDisconnect(connection.id)}>
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedExchange(connection.id)
                        setShowApiDialog(true)
                      }}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function ConnectExchangeForm({
  onConnect,
  isConnecting,
  selectedExchange,
  setSelectedExchange,
  apiCredentials,
  setApiCredentials,
}: {
  onConnect: (exchangeId: string) => void
  isConnecting: boolean
  selectedExchange: string
  setSelectedExchange: (id: string) => void
  apiCredentials: any
  setApiCredentials: (creds: any) => void
}) {
  const selectedConfig = exchangeConfigs.find((e) => e.id === selectedExchange)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="exchange">Select Exchange</Label>
          <Select value={selectedExchange} onValueChange={setSelectedExchange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Choose an exchange" />
            </SelectTrigger>
            <SelectContent>
              {exchangeConfigs.map((exchange) => (
                <SelectItem key={exchange.id} value={exchange.id}>
                  <div className="flex items-center gap-2">
                    <span>{exchange.logo}</span>
                    <span>{exchange.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedConfig && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{selectedConfig.logo}</span>
              <div>
                <div className="font-medium">{selectedConfig.name}</div>
                <div className="text-sm text-muted-foreground">{selectedConfig.description}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Features:</div>
                <div>{selectedConfig.features.join(", ")}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Trading Fee:</div>
                <div>{selectedConfig.fees}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedExchange && (
        <Tabs defaultValue="oauth" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oauth">OAuth (Recommended)</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="oauth" className="space-y-4">
            {selectedExchange === "binance" ? (
              <BinanceOAuthConnection />
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  OAuth connection for {selectedConfig?.name} is coming soon
                </div>
                <Button size="lg" disabled>
                  <Shield className="h-4 w-4 mr-2" />
                  Connect with OAuth
                </Button>
                <div className="text-xs text-muted-foreground mt-2">Use API Keys tab for now</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            {selectedExchange === "binance" ? (
              <ApiKeyManagement />
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-yellow-400 mb-1">Security Requirements</div>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Create API keys with read and trade permissions only</li>
                        <li>• Enable IP whitelist restrictions if available</li>
                        <li>• Never share your API keys with anyone</li>
                        <li>• Use test mode first to verify connection</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your API key"
                      value={apiCredentials.apiKey}
                      onChange={(e) => setApiCredentials((prev) => ({ ...prev, apiKey: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="secretKey">Secret Key</Label>
                    <Textarea
                      id="secretKey"
                      placeholder="Enter your secret key"
                      value={apiCredentials.secretKey}
                      onChange={(e) => setApiCredentials((prev) => ({ ...prev, secretKey: e.target.value }))}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  {(selectedExchange === "okx" || selectedExchange === "coinbase") && (
                    <div>
                      <Label htmlFor="passphrase">Passphrase</Label>
                      <Input
                        id="passphrase"
                        type="password"
                        placeholder="Enter your passphrase"
                        value={apiCredentials.passphrase}
                        onChange={(e) => setApiCredentials((prev) => ({ ...prev, passphrase: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="testMode"
                      checked={apiCredentials.testMode}
                      onCheckedChange={(checked) => setApiCredentials((prev) => ({ ...prev, testMode: checked }))}
                    />
                    <Label htmlFor="testMode" className="text-sm">
                      Test Mode (Sandbox Environment)
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => onConnect(selectedExchange)}
                    disabled={!apiCredentials.apiKey || !apiCredentials.secretKey || isConnecting}
                    className="min-w-[120px]"
                  >
                    {isConnecting ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
