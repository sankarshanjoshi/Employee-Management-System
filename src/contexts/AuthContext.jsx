import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '@/lib/mockApi'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user')
    const storedEmployee = localStorage.getItem('employee')
    const token = localStorage.getItem('token')

    if (storedUser && storedEmployee && token) {
      setUser(JSON.parse(storedUser))
      setEmployee(JSON.parse(storedEmployee))
      setIsAuthenticated(true)
    }
    
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      const { user, employee, token } = response

      setUser(user)
      setEmployee(employee)
      setIsAuthenticated(true)

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('employee', JSON.stringify(employee))
      localStorage.setItem('token', token)

      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData)
      const { user, employee, token } = response

      setUser(user)
      setEmployee(employee)
      setIsAuthenticated(true)

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('employee', JSON.stringify(employee))
      localStorage.setItem('token', token)

      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setEmployee(null)
    setIsAuthenticated(false)
    
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('employee')
    localStorage.removeItem('token')
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isEmployee = () => {
    return user?.role === 'employee'
  }

  const value = {
    user,
    employee,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    isAdmin,
    isEmployee
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}