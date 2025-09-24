'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
      const email = localStorage.getItem('userEmail') || ''
      setIsLoggedIn(loggedIn)
      setUserEmail(email)
    }
    
    checkAuth()
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    setIsLoggedIn(false)
    setUserEmail('')
    router.push('/login')
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="nav">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <Link href="/" className={`nav-item ${isActive('/') || isActive('/projects') ? 'active' : ''}`}>
            Projects
          </Link>
          <Link href="/todos" className={`nav-item ${isActive('/todos') ? 'active' : ''}`}>
            Todos
          </Link>
          <Link href="/data-table" className={`nav-item ${isActive('/data-table') ? 'active' : ''}`}>
            Data
          </Link>
          <Link href="/forms" className={`nav-item ${isActive('/forms') ? 'active' : ''}`}>
            Forms
          </Link>
          <Link href="/upload" className={`nav-item ${isActive('/upload') ? 'active' : ''}`}>
            Upload
          </Link>
          <Link href="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
            Settings
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <span className="text-sm">{userEmail}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Settings
                  </Link>
                  <hr className="border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm text-white hover:text-gray-100">
                Login
              </Link>
              <Link href="/signup" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}