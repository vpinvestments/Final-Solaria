"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Key, Shield, CheckCircle, AlertTriangle, Activity, Eye, EyeOff, ExternalLink, Trash2 } from "lucide-react"
import { type BinanceCredentials, CredentialManager, APIValidator, ConnectionManager } from "@/lib/binance-api"

interface ApiKeyManagementProps {
  onConnectionChange?: (connected: boolean) => void
}

export function ApiKeyManagement({ onConnectionChange }: ApiKeyManagementProps) {
  const { toast } = useToast()
  const [credentials, setCredentials] = useState<BinanceCredentials>({
    apiKey: "",
    secretKey: "",
    testMode: true,
  })
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">(
    "disconnected",
  )
  const [validationErrors, setValidationErrors] = useState<{ apiKey?: string; secretKey?: string }>({})
  const [accountInfo, setAccountInfo] = useState<any>(null)

  const connectionManager = ConnectionManager.getInstance()

  useEffect(() => {
    // Load saved credentials on mount
    const savedCredentials = CredentialManager.loadCredentials()
    if (savedCredentials) {
      setCredentials(savedCredentials)
      // Auto-connect if credentials exist
      handleAutoConnect()
    }

    // Listen for connection status changes
    const statusListener = (status: string) => {
      setConnectionStatus(status as any)
      onConnectionChange?.(status === "connected")
    }

    connectionManager.addStatusListener(statusListener)
    setConnectionStatus(connectionManager.getStatus() as any)

    return () => {
      connectionManager.removeStatusListener(statusListener)
    }
  }, [onConnectionChange])

  const handleAutoConnect = async () => {
    try {
      setIsConnecting(true)
      const success = await connectionManager.autoConnect()
      if (success) {
        const client = connectionManager.getClient()
        if (client) {
          const info = await client.getAccountInfo()
          setAccountInfo(info)
        }
      }
    } catch (error) {
      console.error("Auto-connect failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const validateCredentials = (): boolean => {
    const errors: { apiKey?: string; secretKey?: string } = {}

    const apiKeyValidation = APIValidator.validateApiKey(credentials.apiKey)
    if (!apiKeyValidation.valid) {
      errors.apiKey = apiKeyValidation.message
    }

    const secretKeyValidation = APIValidator.validateSecretKey(credentials.secretKey)
    if (!secretKeyValidation.valid) {
      errors.secretKey = secretKeyValidation.message
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleConnect = async () => {
    if (!validateCredentials()) {
      return
    }

    setIsConnecting(true)

    try {
      const success = await connectionManager.connect(credentials)

      if (success) {
        const client = connectionManager.getClient()
        if (client) {
          const info = await client.getAccountInfo()
          setAccountInfo(info)
        }

        toast({
          title: "Connected Successfully",
          description: `Connected to Binance ${credentials.testMode ? "Testnet" : "Mainnet"}`,
        })
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Binance API",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    connectionManager.disconnect()
    setAccountInfo(null)
    setCredentials({ apiKey: "", secretKey: "", testMode: true })

    toast({
      title: "Disconnected",
      description: "Successfully disconnected from Binance API",
    })
  }

  const handleClearCredentials = () => {
    CredentialManager.clearCredentials()
    setCredentials({ apiKey: "", secretKey: "", testMode: true })
    setValidationErrors({})

    toast({
      title: "Credentials Cleared",
      description: "All saved API credentials have been removed",
    })
  }

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-500/20 text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case "connecting":
        return (
          <Badge variant="secondary">
            <Activity className="h-3 w-3 mr-1 animate-spin" />
            Connecting...
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return <Badge variant="outline">Disconnected</Badge>
    }
  }

  if (connectionStatus === "connected" && accountInfo) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Connection
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully connected to Binance {credentials.testMode ? "Testnet" : "Mainnet"}. Trading permissions:{" "}
              {accountInfo.canTrade ? "Enabled" : "Disabled"}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">Account Type</div>
              <div className="font-medium">{accountInfo.accountType}</div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">Trading</div>
              <div className={`font-medium ${accountInfo.canTrade ? "text-green-500" : "text-red-500"}`}>
                {accountInfo.canTrade ? "Enabled" : "Disabled"}
              </div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">Assets</div>
              <div className="font-medium">{accountInfo.balances?.length || 0} balances</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearCredentials}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Saved Credentials
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your API credentials are encrypted and stored locally. We recommend using testnet for initial testing.
            <a
              href="https://www.binance.com/en/my/settings/api-management"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 ml-2 text-primary hover:underline"
            >
              Create API Keys <ExternalLink className="h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="text"
              placeholder="Enter your Binance API key"
              value={credentials.apiKey}
              onChange={(e) => {
                setCredentials((prev) => ({ ...prev, apiKey: e.target.value }))
                setValidationErrors((prev) => ({ ...prev, apiKey: undefined }))
              }}
              className={validationErrors.apiKey ? "border-red-500" : ""}
            />
            {validationErrors.apiKey && <p className="text-sm text-red-500">{validationErrors.apiKey}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret-key">Secret Key</Label>
            <div className="relative">
              <Input
                id="secret-key"
                type={showSecretKey ? "text" : "password"}
                placeholder="Enter your Binance secret key"
                value={credentials.secretKey}
                onChange={(e) => {
                  setCredentials((prev) => ({ ...prev, secretKey: e.target.value }))
                  setValidationErrors((prev) => ({ ...prev, secretKey: undefined }))
                }}
                className={`pr-10 ${validationErrors.secretKey ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowSecretKey(!showSecretKey)}
              >
                {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {validationErrors.secretKey && <p className="text-sm text-red-500">{validationErrors.secretKey}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="testmode"
            checked={credentials.testMode}
            onChange={(e) => setCredentials((prev) => ({ ...prev, testMode: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <Label htmlFor="testmode" className="text-sm">
            Use Testnet (Recommended for testing)
          </Label>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleConnect}
            disabled={isConnecting || !credentials.apiKey || !credentials.secretKey}
            className="flex-1"
          >
            {isConnecting ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect to Binance API"
            )}
          </Button>

          {CredentialManager.hasCredentials() && (
            <Button variant="outline" onClick={handleClearCredentials}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Create API keys at Binance API Management</p>
          <p>
            • For testnet, use{" "}
            <a
              href="https://testnet.binance.vision/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Binance Testnet
            </a>
          </p>
          <p>• Enable "Spot & Margin Trading" permissions for your API key</p>
          <p>• Restrict API access to your IP address for security</p>
        </div>
      </CardContent>
    </Card>
  )
}
