'use client'

import { useState, useMemo } from 'react'
import Navigation from '@/components/Navigation'

type User = {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
  lastActive: string
  projects: number
}

const generateMockData = (): User[] => {
  const roles = ['Admin', 'Developer', 'Designer', 'Manager', 'Analyst']
  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR']
  const statuses: User['status'][] = ['active', 'inactive', 'pending']
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projects: Math.floor(Math.random() * 20) + 1
  }))
}

export default function DataTable() {
  const [data] = useState<User[]>(generateMockData())
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof User>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    status: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = !filters.role || user.role === filters.role
      const matchesDepartment = !filters.department || user.department === filters.department
      const matchesStatus = !filters.status || user.status === filters.status
      
      return matchesSearch && matchesRole && matchesDepartment && matchesStatus
    })

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    return filtered
  }, [data, searchTerm, filters, sortField, sortDirection])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredAndSortedData.slice(start, start + itemsPerPage)
  }, [filteredAndSortedData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData.map(user => user.id))
    }
  }

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }

  const handleBulkAction = (action: string) => {
    alert(`Performing ${action} on ${selectedRows.length} selected items`)
    setSelectedRows([])
  }

  const handleExport = (format: string) => {
    alert(`Exporting data as ${format}`)
    setShowExportModal(false)
  }

  const getStatusBadge = (status: User['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status]
  }

  const uniqueRoles = [...new Set(data.map(u => u.role))]
  const uniqueDepartments = [...new Set(data.map(u => u.department))]

  return (
    <div>
      <Navigation />
      
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex gap-2">
            <button
              id="export-data-button"
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              + Add User
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[300px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              id="toggle-filters-button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Filters {showFilters ? '▼' : '▶'}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div className="col-span-3 flex justify-end">
                <button
                  onClick={() => setFilters({ role: '', department: '', status: '' })}
                  className="text-blue-600 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-blue-800">
              {selectedRows.length} item{selectedRows.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                id="bulk-activate-button"
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('id')}
                  >
                    ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('role')}
                  >
                    Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('department')}
                  >
                    Department {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('projects')}
                  >
                    Projects {sortField === 'projects' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={() => handleSelectRow(user.id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">{user.department}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{user.projects}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:underline">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{' '}
                {filteredAndSortedData.length} results
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-3 py-1 border rounded"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 
                    ? i + 1 
                    : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i
                  
                  if (pageNum < 1 || pageNum > totalPages) return null
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Export Data</h2>
            <p className="text-gray-600 mb-4">Choose the format for your export:</p>
            <div className="space-y-2">
              <button
                onClick={() => handleExport('CSV')}
                className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 text-left"
              >
                📄 Export as CSV
              </button>
              <button
                onClick={() => handleExport('Excel')}
                className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 text-left"
              >
                📊 Export as Excel
              </button>
              <button
                onClick={() => handleExport('PDF')}
                className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 text-left"
              >
                📑 Export as PDF
              </button>
              <button
                onClick={() => handleExport('JSON')}
                className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 text-left"
              >
                🔧 Export as JSON
              </button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}