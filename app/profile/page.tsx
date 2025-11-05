'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type UserMembership = {
  role: string
  organization: {
    name: string
    slug: string
  }
}

export default function Profile() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [membership, setMembership] = useState<UserMembership | null>(null)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (session?.user) {
      // Fetch user's organization membership
      fetch('/api/user/membership')
        .then(res => res.ok ? res.json() : null)
        .then(data => setMembership(data))
        .catch(() => setMembership(null))
    }
  }, [session])

  // Prevent hydration mismatch by only rendering on client
  if (!isMounted) {
    return null
  }

  if (!session) {
    router.push('/login')
    return null
  }

  const handleSave = async () => {
    // TODO: Implement profile update API
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  return (
    <div>
      <Navigation />

      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View and manage your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{session.user.name || 'User'}</h2>
                  <p className="text-muted-foreground">{session.user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-sm py-2">{session.user.name || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <p className="text-sm py-2 text-muted-foreground">{session.user.email}</p>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label>Account Created</Label>
                  <p className="text-sm py-2">
                    {session.user.createdAt
                      ? new Date(session.user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        name: session.user.name || '',
                        email: session.user.email || '',
                      })
                    }}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {membership && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Organization Membership</CardTitle>
                <CardDescription>
                  Your organization and role information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <p className="text-sm">{membership.organization.name}</p>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div>
                    <Badge variant={
                      membership.role === 'owner' ? 'destructive' :
                      membership.role === 'admin' ? 'default' : 'secondary'
                    }>
                      {membership.role.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {membership.role === 'owner' && 'Full control over the organization'}
                    {membership.role === 'admin' && 'Comprehensive access except organization deletion'}
                    {membership.role === 'member' && 'Limited permissions for organization operations'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
