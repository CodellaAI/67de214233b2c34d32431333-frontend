
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, X, User, Package, MessageSquare, 
  LogIn, LogOut, ChevronDown, Search, Plus 
} from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [pathname])
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])
  
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/plugins?search=${encodeURIComponent(searchQuery)}`
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUserMenuOpen(false)
    
    if (pathname.startsWith('/profile') || pathname === '/plugins/create') {
      window.location.href = '/'
    }
  }
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/plugins', label: 'Plugins' },
    { href: '/forums', label: 'Forums' },
  ]

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">MinecraftPluginBazaar</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${
                  pathname === link.href
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="relative">
              <button
                className="text-gray-700 hover:text-primary-600 flex items-center text-sm font-medium"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={18} />
              </button>
              
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg p-2 z-10">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search plugins..."
                        className="input pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <button 
                        type="submit" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <Search size={18} />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </nav>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/plugins/create"
                  className="btn btn-outline flex items-center text-sm"
                >
                  <Plus size={16} className="mr-1" />
                  Create Plugin
                </Link>
                
                <div className="relative">
                  <button
                    className="flex items-center text-gray-700 hover:text-primary-600"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/profile/me"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        My Profile
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package size={16} className="mr-2" />
                        My Plugins
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Messages
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="mr-2" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline flex items-center">
                  <LogIn size={16} className="mr-1" />
                  Log In
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <form onSubmit={handleSearchSubmit} className="pt-2 pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search plugins..."
                  className="input pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={20} className="text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">Account</div>
                      <div className="text-sm font-medium text-gray-500">Logged In</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      href="/profile/me"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/profile/settings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    >
                      Settings
                    </Link>
                    <Link
                      href="/plugins/create"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    >
                      Create Plugin
                    </Link>
                    <button
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 px-3">
                  <Link
                    href="/login"
                    className="block w-full px-4 py-2 text-center font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full px-4 py-2 text-center font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
