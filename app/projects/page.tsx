'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'

type Project = {
  id: string
  name: string
  description: string
  status: 'planning' | 'in-progress' | 'review' | 'completed'
  progress: number
  team: string[]
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  tags: string[]
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Build a modern e-commerce platform with AI-powered recommendations',
    status: 'in-progress',
    progress: 65,
    team: ['Alice', 'Bob', 'Charlie'],
    dueDate: '2024-02-15',
    priority: 'high',
    tags: ['React', 'Node.js', 'AI']
  },
  {
    id: '2',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of our mobile application with new UI/UX',
    status: 'planning',
    progress: 20,
    team: ['Diana', 'Eve'],
    dueDate: '2024-03-01',
    priority: 'medium',
    tags: ['React Native', 'Design']
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    description: 'Create comprehensive analytics dashboard for business intelligence',
    status: 'review',
    progress: 85,
    team: ['Frank', 'Grace'],
    dueDate: '2024-01-30',
    priority: 'high',
    tags: ['Data', 'Visualization', 'Python']
  },
  {
    id: '4',
    name: 'API Documentation',
    description: 'Document all public APIs with interactive examples',
    status: 'completed',
    progress: 100,
    team: ['Henry'],
    dueDate: '2024-01-15',
    priority: 'low',
    tags: ['Documentation', 'API']
  }
]

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'medium' as Project['priority'],
    dueDate: ''
  })

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'text-gray-500'
      case 'medium': return 'text-yellow-500'
      case 'high': return 'text-red-500'
    }
  }

  const handleCreateProject = () => {
    if (!newProject.name) return
    
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: 'planning',
      progress: 0,
      team: [],
      dueDate: newProject.dueDate,
      priority: newProject.priority,
      tags: []
    }
    
    setProjects([...projects, project])
    setShowNewProjectModal(false)
    setNewProject({ name: '', description: '', priority: 'medium', dueDate: '' })
  }

  const handleUpdateProgress = (projectId: string, newProgress: number) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, progress: newProgress, status: newProgress === 100 ? 'completed' : p.status }
        : p
    ))
  }

  return (
    <div>
      <Navigation />
      
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>
          <button
            id="new-project-button"
            onClick={() => setShowNewProjectModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + New Project
          </button>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                id="view-mode-grid"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                id="view-mode-list"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <span className={`text-2xl ${getPriorityColor(project.priority)}`}>
                      {project.priority === 'high' ? '⚡' : project.priority === 'medium' ? '🔔' : '📌'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs"
                        >
                          {member[0]}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-1">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(project => (
                  <tr key={project.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.description.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 bg-gray-300 rounded-full border border-white flex items-center justify-center text-xs"
                          >
                            {member[0]}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(project.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-blue-600 hover:underline view-project-button"
                        data-project-id={project.id}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe the project"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as Project['priority'] })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                id="create-project-submit"
                onClick={handleCreateProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
              <button
                id="close-project-modal"
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">{selectedProject.description}</p>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                  {selectedProject.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Priority</label>
                <span className={`text-lg ${getPriorityColor(selectedProject.priority)}`}>
                  {selectedProject.priority.toUpperCase()}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Due Date</label>
                <p>{new Date(selectedProject.dueDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Team Members</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.team.map(member => (
                    <span key={member} className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-500 mb-2">Progress</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedProject.progress}
                  onChange={(e) => handleUpdateProgress(selectedProject.id, Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-medium">{selectedProject.progress}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${selectedProject.progress}%` }}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-500 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}