'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

type UserMembership = {
  role: string
  organization: {
    name: string
  }
}

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const [membership, setMembership] = useState<UserMembership | null>(null)

  useEffect(() => {
    if (session?.user) {
      // Fetch user's organization membership
      fetch('/api/user/membership')
        .then(res => res.ok ? res.json() : null)
        .then(data => setMembership(data))
        .catch(() => setMembership(null))
    }
  }, [session])

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  const isActive = (path: string) => pathname === path

  const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'destructive' => {
    switch (role) {
      case 'owner': return 'destructive'
      case 'admin': return 'default'
      default: return 'secondary'
    }
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex flex-1">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Todo App</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive('/') || isActive('/projects') ? "text-foreground" : "text-foreground/60"
              )}
            >
              Projects
            </Link>
            <Link
              href="/todos"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive('/todos') ? "text-foreground" : "text-foreground/60"
              )}
            >
              Todos
            </Link>
            <Link
              href="/data-table"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive('/data-table') ? "text-foreground" : "text-foreground/60"
              )}
            >
              Data
            </Link>
            <Link
              href="/forms"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive('/forms') ? "text-foreground" : "text-foreground/60"
              )}
            >
              Forms
            </Link>
            <Link
              href="/upload"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive('/upload') ? "text-foreground" : "text-foreground/60"
              )}
            >
              Upload
            </Link>
            <Link
              href="/settings"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive('/settings') ? "text-foreground" : "text-foreground/60"
              )}
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span className="text-sm">{session.user.email}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium leading-none">{session.user.name || 'User'}</p>
                      {membership?.role && (
                        <Badge variant={getRoleBadgeVariant(membership.role)} className="text-[10px] px-1.5 py-0">
                          {membership.role.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                    {membership?.organization && (
                      <p className="text-xs leading-none text-muted-foreground pt-1">
                        🏢 {membership.organization.name}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
