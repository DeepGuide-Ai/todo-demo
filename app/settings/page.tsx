'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { RoleDefinition, PERMISSIONS_METADATA, getPermissionsByCategory, Permission } from '@/lib/permissions'

type Tab = 'members' | 'roles' | 'invitations'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('members')
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const [roles, setRoles] = useState<RoleDefinition[]>([])
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'roles') {
      fetchRoles()
    }
  }, [activeTab])

  const fetchRoles = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/roles')
      if (response.ok) {
        const data = await response.json()
        setRoles(data.roles)
        if (data.roles.length > 0 && !selectedRole) {
          setSelectedRole(data.roles[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvite = () => {
    const email = emailInput || 'john.doe@example.com'
    setSentEmail(email)
    setShowAddMemberDialog(false)
    setShowSuccessMessage(true)

    setTimeout(() => {
      setShowSuccessMessage(false)
      setEmailInput('')
    }, 3000)
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Organization': '🏢',
      'Members': '👥',
      'Projects': '🚀',
      'Todos': '✓',
      'Settings': '⚙️',
      'Roles': '🔐',
      'Invitations': '✉️',
    }
    return icons[category] || '📋'
  }

  return (
    <div>
      <Navigation />

      <div className="container">
        <h1 className="text-3xl font-bold mb-8">Team Management</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Team Members
          </button>
          <button
            className={`tab ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
          <button
            className={`tab ${activeTab === 'invitations' ? 'active' : ''}`}
            onClick={() => setActiveTab('invitations')}
          >
            Invitations
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'members' && (
            <div>
              <p className="text-gray-600 mb-6">
                Manage your team members and their permissions.
              </p>
              
              <button 
                className="btn btn-success"
                onClick={() => setShowAddMemberDialog(true)}
              >
                Add Member
              </button>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Current Members</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Admin User</div>
                      <div className="text-sm text-gray-500">admin@example.com</div>
                    </div>
                    <div className="text-sm text-gray-500">Owner</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Jane Smith</div>
                      <div className="text-sm text-gray-500">jane@example.com</div>
                    </div>
                    <div className="text-sm text-gray-500">Editor</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div>
              <p className="text-gray-600 mb-6">
                Configure team roles and permissions. Each role defines what actions members can perform within the organization.
              </p>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading roles...</div>
              ) : (
                <div className="grid grid-cols-12 gap-6">
                  {/* Roles List */}
                  <div className="col-span-4">
                    <h3 className="text-lg font-semibold mb-4">Roles</h3>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedRole?.id === role.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedRole(role)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: role.color }}
                              />
                              <span className="font-semibold text-gray-900">{role.name}</span>
                            </div>
                            {role.isSystem && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                System
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{role.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {role.permissions.length} permissions
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Permissions Details */}
                  <div className="col-span-8">
                    {selectedRole ? (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: selectedRole.color }}
                              />
                              <h3 className="text-2xl font-bold text-gray-900">{selectedRole.name}</h3>
                            </div>
                            <p className="text-gray-600">{selectedRole.description}</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => {
                            const rolePermissions = selectedRole.permissions
                            const categoryPermissions = permissions.filter(p => rolePermissions.includes(p as Permission))

                            if (categoryPermissions.length === 0) return null

                            return (
                              <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <span className="text-lg">{getCategoryIcon(category)}</span>
                                  {category}
                                </h4>
                                <div className="space-y-2">
                                  {categoryPermissions.map((permission) => {
                                    const metadata = PERMISSIONS_METADATA[permission as Permission]
                                    const hasPermission = rolePermissions.includes(permission as Permission)

                                    return (
                                      <div
                                        key={permission}
                                        className={`flex items-start gap-3 p-3 rounded ${
                                          hasPermission ? 'bg-green-50' : 'bg-gray-50'
                                        }`}
                                      >
                                        <div className="mt-0.5">
                                          {hasPermission ? (
                                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                          ) : (
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900">{metadata.label}</div>
                                          <div className="text-sm text-gray-600">{metadata.description}</div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex gap-2">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="font-medium text-blue-900">System Role</p>
                              <p className="text-sm text-blue-800">
                                This is a system-defined role managed by Better Auth.
                                Custom roles can be added in future updates.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        Select a role to view its permissions
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'invitations' && (
            <div>
              <p className="text-gray-600">
                View and manage pending invitations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Dialog */}
      {showAddMemberDialog && (
        <div className="dialog-overlay" onClick={() => setShowAddMemberDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="dialog-title">Add Team Member</h2>
            <p className="dialog-description">
              Invite a new member to your team.
            </p>
            <input
              type="email"
              placeholder="Email address"
              className="dialog-input"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              autoFocus
            />
            <div className="dialog-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddMemberDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSendInvite}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h3 className="success-title">Invitation Sent!</h3>
          <p className="success-description">
            An invitation has been sent to {sentEmail}.
          </p>
        </div>
      )}
    </div>
  )
}