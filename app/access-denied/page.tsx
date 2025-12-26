'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { usePermission } from '@/hooks/usePermission'
import { PERMISSIONS_METADATA, Permission } from '@/lib/permissions'
import { Suspense } from 'react'

function AccessDeniedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { role, loading } = usePermission()

  const requiredPermission = searchParams.get('permission') as Permission | null
  const permissionMeta = requiredPermission ? PERMISSIONS_METADATA[requiredPermission] : null

  return (
    <div>
      <Navigation />

      <div className="container py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Access Denied Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Access Denied Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>

          {/* Error Message */}
          <p className="text-lg text-gray-600 mb-6">
            You don&apos;t have permission to access this page.
          </p>

          {/* Permission Details Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Access Details
            </h3>

            <div className="space-y-3">
              {/* Current Role */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Your Current Role:</span>
                {loading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      role === 'owner'
                        ? 'bg-red-100 text-red-800'
                        : role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {role?.toUpperCase() || 'None'}
                  </span>
                )}
              </div>

              {/* Required Permission */}
              {permissionMeta && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Required Permission:</span>
                  <span className="text-sm font-medium text-red-600">
                    {permissionMeta.label}
                  </span>
                </div>
              )}

              {/* Permission Description */}
              {permissionMeta && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    <strong>What this permission allows:</strong>{' '}
                    {permissionMeta.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Insufficient Permissions Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-left">
                <p className="font-medium text-amber-800">Insufficient Permissions</p>
                <p className="text-sm text-amber-700 mt-1">
                  Contact your organization administrator to request access to this feature.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccessDenied() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccessDeniedContent />
    </Suspense>
  )
}
