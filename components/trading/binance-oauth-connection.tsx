"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Shield, ExternalLink, CheckCircle, AlertTriangle, Info, Activity, LogOut, RefreshCw } from "lucide-react"

interface BinanceOAuthStatus {
  available: boolean
  hasTokens: boolean
  userInfo?: {
    id: string
    nickname: string
    email: string
    kycLevel: number
    accountType: string
  }
  message: string
  requestAccess?: string
}

export function BinanceOAuthConnection() {
  const { toast } = useToast()
  const [oauthStatus, setOauthStatus] = useState<BinanceOAuthStatus>({
    available: false,
    hasTokens: false,
    message: "Loading...",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(false)

  useEffect(() => {
    checkOAuthStatus()

    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search)
    const oauthSuccess = urlParams.get("oauth_success")
    const oauthError = urlParams.get("oauth_error")
    const errorDescription = urlParams.get("error_description")

    if (oauthSuccess === "true") {
      const userId = urlParams.get("user_id")
      const nickname = urlParams.get("nickname")

      toast({
        title: "OAuth Connection Successful",
        description: `Successfully connected to Binance as ${nickname || userId}`,
      })

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)

      // Refresh status
      setTimeout(checkOAuthStatus, 1000)
    }

    if (oauthError) {
      toast({
        title: "OAuth Connection Failed",
        description: errorDescription || `OAuth error: ${oauthError}`,
        variant: "destructive",
      })

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [toast])

  const checkOAuthStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/binance/oauth?action=status")
      const status = await response.json()
      setOauthStatus(status)
    } catch (error) {
      console.error("Failed to check OAuth status:", error)
      setOauthStatus({
        available: false,
        hasTokens: false,
        message: "Failed to check OAuth status",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthConnect = async () => {
    try {
      setIsConnecting(true)

      const response = await fetch("/api/auth/binance/oauth?action=authorize")
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          // OAuth not available - show info dialog
          setShowInfoDialog(true)
          return
        }
        throw new Error(data.message || "Failed to initiate OAuth")
      }

      // Redirect to Binance OAuth
      window.location.href = data.authUrl
    } catch (error) {
      toast({
        title: "OAuth Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect with OAuth",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      const response = await fetch("/api/auth/binance/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke" }),
      })

      if (response.ok) {
        toast({
          title: "Disconnected",
          description: "Successfully disconnected from Binance OAuth",
        })
        checkOAuthStatus()
      }
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect OAuth connection",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = () => {
    if (isLoading) {
      return (
        <Badge variant="secondary">
          <Activity className="h-3 w-3 mr-1 animate-spin" />
          Loading...
        </Badge>
      )
    }

    if (oauthStatus.hasTokens) {
      return (
        <Badge variant="default" className="bg-green-500/20 text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      )
    }

    if (!oauthStatus.available) {
      return (
        <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Partner Access Required
        </Badge>
      )
    }

    return (
      <Badge variant="outline">
        <Shield className="h-3 w-3 mr-1" />
        Available
      </Badge>
    )
  }

  if (oauthStatus.hasTokens && oauthStatus.userInfo) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Binance OAuth Connection
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully connected to Binance via OAuth. Enhanced security with automatic token management.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">User ID</div>
              <div className="font-medium">{oauthStatus.userInfo.id}</div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">Nickname</div>
              <div className="font-medium">{oauthStatus.userInfo.nickname}</div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">Account Type</div>
              <div className="font-medium">{oauthStatus.userInfo.accountType}</div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">KYC Level</div>
              <div className="font-medium">Level {oauthStatus.userInfo.kycLevel}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDisconnect}>
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
            <Button variant="outline" onClick={checkOAuthStatus}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
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
            <Shield className="h-5 w-5" />
            Binance OAuth Connection
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            OAuth provides enhanced security by eliminating the need to share API keys. Your credentials are managed
            securely by Binance.
          </AlertDescription>
        </Alert>

        {!oauthStatus.available && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div>
                  Binance OAuth is currently available only to close ecosystem partners. Contact Binance business team
                  for access.
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowInfoDialog(true)}>
                    <Info className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                  {oauthStatus.requestAccess && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(oauthStatus.requestAccess, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Request Access
                    </Button>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="text-sm font-medium">OAuth Benefits:</div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• No need to share API keys</li>
            <li>• Automatic token refresh</li>
            <li>• Granular permission control</li>
            <li>• Enhanced security with OAuth 2.0</li>
            <li>• Easy revocation of access</li>
          </ul>
        </div>

        <Button onClick={handleOAuthConnect} disabled={!oauthStatus.available || isConnecting} className="w-full">
          {isConnecting ? (
            <>
              <Activity className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Connect with Binance OAuth
            </>
          )}
        </Button>

        <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Binance OAuth Information
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What is Binance OAuth?</h4>
                <p className="text-sm text-muted-foreground">
                  Binance OAuth is a secure authentication method that allows applications to access your Binance
                  account without requiring you to share your API keys. It uses the industry-standard OAuth 2.0
                  protocol.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Current Availability</h4>
                <p className="text-sm text-muted-foreground">
                  Binance OAuth is currently offered exclusively to close ecosystem partners. This means only approved
                  business partners have access to this feature.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">How to Get Access</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>To request OAuth access for your application:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Visit the Binance Developer Center</li>
                    <li>Contact the Binance business team</li>
                    <li>Provide details about your application and use case</li>
                    <li>Wait for approval from Binance</li>
                  </ol>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Alternative: API Keys</h4>
                <p className="text-sm text-muted-foreground">
                  While waiting for OAuth access, you can use traditional API keys for trading. This method is still
                  secure when properly implemented with encryption and proper permissions.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open("https://developers.binance.com/en/landingpage/oauth", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Binance OAuth Documentation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("https://developers.binance.com/docs/login/web-integration", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Integration Guide
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
