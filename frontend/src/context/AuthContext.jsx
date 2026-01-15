import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Decode token to get user info (simplified)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ username: payload.sub, roles: payload.roles || [] })
      } catch (e) {
        console.error('Error decoding token', e)
      }
    }
    setLoading(false)
  }, [token])

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      })
      const { token, roles, id, email } = response.data
      setToken(token)
      setUser({ username, roles, id, email })
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Login failed'
      }
    }
  }

  const register = async (userData) => {
    try {
      await axios.post('http://localhost:8080/api/auth/register', userData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Registration failed'
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
