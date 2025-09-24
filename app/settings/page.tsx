'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'

type Tab = 'members' | 'roles' | 'invitations'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('members')
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

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
              <p className="text-gray-600">
                Configure team roles and permissions.
              </p>
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