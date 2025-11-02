'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type FormSubmission = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  companyName: string
  companySize: string
  industry: string | null
  website: string | null
  projectType: string
  budget: string
  timeline: string | null
  description: string
  howHeard: string | null
  newsletter: boolean
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/form-submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
      } else {
        console.error('Failed to fetch submissions')
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredSubmissions = filterStatus === 'all'
    ? submissions
    : submissions.filter(s => s.status === filterStatus)

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading submissions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navigation />

      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Form Submissions</h1>
            <p className="text-muted-foreground mt-1">
              View and manage project inquiry submissions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Submissions</CardDescription>
              <CardTitle className="text-3xl">{submissions.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>New</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {submissions.filter(s => s.status === 'new').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl text-purple-600">
                {submissions.filter(s => s.status === 'in-progress').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {submissions.filter(s => s.status === 'completed').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No submissions found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredSubmissions.map((submission) => (
              <Card
                key={submission.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedSubmission(submission)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {submission.firstName} {submission.lastName}
                        </h3>
                        <Badge className={`text-xs px-2 py-1 border ${getStatusColor(submission.status)}`}>
                          {submission.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Company</p>
                          <p className="font-medium">{submission.companyName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Project Type</p>
                          <p className="font-medium">{submission.projectType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Budget</p>
                          <p className="font-medium">{submission.budget}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Submitted</p>
                          <p className="font-medium">
                            {new Date(submission.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Submission Details Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Submission from {selectedSubmission.firstName} {selectedSubmission.lastName}
                </DialogTitle>
                <DialogDescription>
                  Submitted on {new Date(selectedSubmission.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedSubmission.firstName} {selectedSubmission.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedSubmission.email}</p>
                    </div>
                    {selectedSubmission.phone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedSubmission.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Company Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="font-medium">{selectedSubmission.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Company Size</p>
                      <p className="font-medium">{selectedSubmission.companySize}</p>
                    </div>
                    {selectedSubmission.industry && (
                      <div>
                        <p className="text-sm text-muted-foreground">Industry</p>
                        <p className="font-medium">{selectedSubmission.industry}</p>
                      </div>
                    )}
                    {selectedSubmission.website && (
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a href={selectedSubmission.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                          {selectedSubmission.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Project Details</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Project Type</p>
                      <p className="font-medium">{selectedSubmission.projectType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium">{selectedSubmission.budget}</p>
                    </div>
                    {selectedSubmission.timeline && (
                      <div>
                        <p className="text-sm text-muted-foreground">Timeline</p>
                        <p className="font-medium">{selectedSubmission.timeline}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedSubmission.description}</p>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Additional Information</h3>
                  <div className="space-y-2">
                    {selectedSubmission.howHeard && (
                      <div>
                        <p className="text-sm text-muted-foreground">How they heard about us</p>
                        <p className="font-medium">{selectedSubmission.howHeard}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Newsletter subscription</p>
                      <p className="font-medium">{selectedSubmission.newsletter ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={`text-xs px-2 py-1 border ${getStatusColor(selectedSubmission.status)}`}>
                        {selectedSubmission.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
