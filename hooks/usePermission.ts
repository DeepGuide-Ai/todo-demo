'use client'

import { useState, useEffect, useCallback } from 'react'
import { Permission, hasPermission as checkPermission } from '@/lib/permissions'

type UserMembership = {
  role: string
  organization: {
    name: string
    slug: string
  }
}

type PermissionState = {
  membership: UserMembership | null
  loading: boolean
  error: string | null
}

export function usePermission() {
  const [state, setState] = useState<PermissionState>({
    membership: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await fetch('/api/user/membership')
        if (response.ok) {
          const data = await response.json()
          setState({
            membership: data,
            loading: false,
            error: null,
          })
        } else if (response.status === 401) {
          setState({
            membership: null,
            loading: false,
            error: 'Unauthorized',
          })
        } else {
          setState({
            membership: null,
            loading: false,
            error: 'Failed to fetch membership',
          })
        }
      } catch {
        setState({
          membership: null,
          loading: false,
          error: 'Network error',
        })
      }
    }

    fetchMembership()
  }, [])

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!state.membership?.role) return false
      return checkPermission(state.membership.role, permission)
    },
    [state.membership]
  )

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.some((permission) => hasPermission(permission))
    },
    [hasPermission]
  )

  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.every((permission) => hasPermission(permission))
    },
    [hasPermission]
  )

  return {
    ...state,
    role: state.membership?.role ?? null,
    organization: state.membership?.organization ?? null,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isOwner: state.membership?.role === 'owner',
    isAdmin: state.membership?.role === 'admin',
    isMember: state.membership?.role === 'member',
  }
}
