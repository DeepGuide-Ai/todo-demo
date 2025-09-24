'use client'

import { useState, useRef } from 'react'
import Navigation from '@/components/Navigation'

type FileItem = {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
  status: 'uploading' | 'success' | 'error'
  progress: number
}

export default function Upload() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('video/')) return '🎥'
    if (type.startsWith('audio/')) return '🎵'
    if (type.includes('pdf')) return '📄'
    if (type.includes('zip') || type.includes('rar')) return '📦'
    if (type.includes('sheet') || type.includes('excel')) return '📊'
    if (type.includes('document') || type.includes('word')) return '📝'
    if (type.includes('presentation') || type.includes('powerpoint')) return '📽️'
    return '📎'
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const simulateUpload = (file: FileItem) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, progress: 100, status: 'success' }
            : f
        ))
      } else {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, progress: Math.min(progress, 99) }
            : f
        ))
      }
    }, 500)
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles: FileItem[] = Array.from(fileList).map(file => ({
      id: Date.now().toString() + Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      uploadDate: new Date().toISOString(),
      status: 'uploading' as const,
      progress: 0
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    newFiles.forEach(file => simulateUpload(file))
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== id))
    }
  }

  const handleRetry = (file: FileItem) => {
    setFiles(prev => prev.map(f => 
      f.id === file.id 
        ? { ...f, status: 'uploading', progress: 0 }
        : f
    ))
    simulateUpload(file)
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <Navigation />
      
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">File Upload</h1>
        
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleChange}
            className="hidden"
          />
          
          <div className="text-6xl mb-4">📁</div>
          
          <p className="text-xl font-medium mb-2">
            {dragActive ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          
          <p className="text-gray-500 mb-6">
            or
          </p>
          
          <button
            id="browse-files-button"
            onClick={onButtonClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Files
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Supported formats: Images, Videos, Documents, PDFs, Archives
          </p>
        </div>

        {/* File Statistics */}
        {files.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mt-8 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">{files.length}</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">
                {files.filter(f => f.status === 'success').length}
              </div>
              <div className="text-sm text-gray-600">Uploaded</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {files.filter(f => f.status === 'uploading').length}
              </div>
              <div className="text-sm text-gray-600">Uploading</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-600">
                {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Size</div>
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(file => (
                    <tr key={file.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getFileIcon(file.type)}</span>
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(file.uploadDate).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        {file.status === 'uploading' && (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{Math.round(file.progress)}%</span>
                            </div>
                            <span className="text-xs text-blue-600">Uploading...</span>
                          </div>
                        )}
                        {file.status === 'success' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Uploaded
                          </span>
                        )}
                        {file.status === 'error' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {file.status === 'success' && (
                            <>
                              <button
                                onClick={() => setSelectedFile(file)}
                                className="text-blue-600 hover:underline text-sm view-file-button"
                                data-file-id={file.id}
                              >
                                View
                              </button>
                              <button 
                                className="text-green-600 hover:underline text-sm download-file-button"
                                data-file-id={file.id}
                              >
                                Download
                              </button>
                            </>
                          )}
                          {file.status === 'error' && (
                            <button
                              onClick={() => handleRetry(file)}
                              className="text-yellow-600 hover:underline text-sm"
                            >
                              Retry
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="text-red-600 hover:underline text-sm delete-file-button"
                            data-file-id={file.id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        {selectedFile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">File Details</h2>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-5xl">{getFileIcon(selectedFile.type)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedFile.name}</h3>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Upload Date</label>
                    <p>{new Date(selectedFile.uploadDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Uploaded Successfully
                    </span>
                  </div>
                </div>
                
                {selectedFile.type.startsWith('image/') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Preview</label>
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <p className="text-gray-500">Image preview would appear here</p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    id="close-file-modal"
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button 
                    id="modal-download-button"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Download
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}