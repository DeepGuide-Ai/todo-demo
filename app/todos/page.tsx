'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'

type Todo = {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Todo['priority'],
    dueDate: ''
  })

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    }
  }

  const handleAddTodo = async () => {
    if (!formData.title.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
        }),
      })

      if (response.ok) {
        await fetchTodos()
        setShowAddModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  const handleUpdateTodo = async () => {
    if (!editingTodo || !formData.title.trim()) return

    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
        }),
      })

      if (response.ok) {
        await fetchTodos()
        setEditingTodo(null)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  const handleToggleComplete = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      })

      if (response.ok) {
        await fetchTodos()
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchTodos()
      }
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    })
  }

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })
    .filter(todo =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
    }
  }

  return (
    <div>
      <Navigation />
      
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Todo List</h1>
          <button
            id="add-toto-button"
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Todo
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex gap-2">
              <button
                id="filter-all"
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                All ({todos.length})
              </button>
              <button
                id="filter-active"
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                Active ({todos.filter(t => !t.completed).length})
              </button>
              <button
                id="filter-completed"
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                Completed ({todos.filter(t => t.completed).length})
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No todos found</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`bg-white rounded-lg shadow p-4 ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                    className="mt-1 w-5 h-5 cursor-pointer"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          todo.completed ? 'line-through text-gray-500' : ''
                        }`}>
                          {todo.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{todo.description}</p>
                        
                        <div className="flex gap-4 mt-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                            {todo.priority.toUpperCase()}
                          </span>
                          {todo.dueDate && (
                            <span className="text-sm text-gray-500">
                              Due: {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(todo)}
                          className="text-blue-600 hover:text-blue-800 edit-todo-button"
                          data-todo-id={todo.id}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingTodo) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingTodo ? 'Edit Todo' : 'Add New Todo'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter todo title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Todo['priority'] })}
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
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingTodo(null)
                  resetForm()
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                id={editingTodo ? 'update-todo-submit' : 'add-todo-submit'}
                onClick={editingTodo ? handleUpdateTodo : handleAddTodo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingTodo ? 'Update' : 'Add'} Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}