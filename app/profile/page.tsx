"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { User, Mail, Calendar, Shield, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const mockUser = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    avatarUrl: null,
    createdAt: "2024-01-01T00:00:00Z",
    emailVerified: true,
  }

  const [formData, setFormData] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
  })

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getDisplayName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`
  }

  const handleSave = async () => {
    try {
      // In a real app, this would make an API call to update the user profile
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-balance">Profile</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage your account information and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="glass-card lg:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage
                    src={mockUser.avatarUrl || undefined}
                    alt={getDisplayName(mockUser.firstName, mockUser.lastName)}
                  />
                  <AvatarFallback className="bg-white/20 text-white text-xl font-medium">
                    {getInitials(mockUser.firstName, mockUser.lastName)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full bg-white/10 border-white/20"
                >
                  <Camera className="h-3 w-3 mr-1" />
                  Change
                </Button>
              </div>
              <div className="space-y-2 mt-6">
                <CardTitle className="text-white">{getDisplayName(mockUser.firstName, mockUser.lastName)}</CardTitle>
                <CardDescription className="text-white/70">{mockUser.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Calendar className="h-4 w-4" />
                Member since {new Date(mockUser.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Shield className="h-4 w-4" />
                {mockUser.emailVerified ? (
                  <span className="text-green-400">Email verified</span>
                ) : (
                  <span className="text-yellow-400">Email not verified</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                  <CardDescription className="text-white/60">
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="bg-transparent">
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleCancel} variant="outline" size="sm" className="bg-transparent">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} size="sm">
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white/80">
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-white/5 border border-white/10">
                      <User className="h-4 w-4 text-white/60" />
                      <span className="text-white">{mockUser.firstName}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white/80">
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-white/5 border border-white/10">
                      <User className="h-4 w-4 text-white/60" />
                      <span className="text-white">{mockUser.lastName}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">
                  Email Address
                </Label>
                <div className="flex items-center gap-2 p-2 rounded-md bg-white/5 border border-white/10">
                  <Mail className="h-4 w-4 text-white/60" />
                  <span className="text-white">{mockUser.email}</span>
                  {mockUser.emailVerified && (
                    <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-400">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-white/60">
                  Email address cannot be changed. Contact support if you need to update it.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Security */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Account Security</CardTitle>
            <CardDescription className="text-white/60">
              Manage your account security settings and authentication methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                Enable 2FA
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">Password</p>
                  <p className="text-white/60 text-sm">Change your account password</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
