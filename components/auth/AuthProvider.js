
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Create context
export const AuthContext = createContext()

// Provider component
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    
    if (token) {
      fetchUserProfile(token)
    } else {
      setLoading(false)
    }
  }, [])
  
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        { headers: { Authorization: `Bearer ${token}` }}
      )
      
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }
  
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        email,
        password
      })
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please check your credentials.'
      }
    }
  }
  
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }
  
  const register = async (userData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, userData)
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.'
      }
    }
  }
  
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
