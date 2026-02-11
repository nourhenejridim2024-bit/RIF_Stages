'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, UserRole } from './types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; userId?: string }>
}

interface RegisterData {
  email: string
  password: string
  nom: string
  prenom: string
  ecole?: string
  specialite?: string
  telephone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      const stored = localStorage.getItem('rif-stages-user')
      if (stored) {
        try {
          const userData = JSON.parse(stored)
          setUser(userData)
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          localStorage.removeItem('rif-stages-user')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setIsLoading(false)
        return { success: false, error: data.error || 'Erreur de connexion' }
      }

      // Store user data
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role as UserRole,
        nom: data.user.name || '',
        prenom: '',
        createdAt: new Date().toISOString().split('T')[0],
      }

      setUser(userData)
      localStorage.setItem('rif-stages-user', JSON.stringify(userData))
      setIsLoading(false)

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
  }, [])

  const logout = useCallback(async () => {
    setUser(null)
    localStorage.removeItem('rif-stages-user')

    // Optional: Call logout API endpoint if you have one
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setIsLoading(false)
        return { success: false, error: result.error || 'Erreur lors de l\'inscription' }
      }

      setIsLoading(false)
      return { success: true, userId: result.userId }
    } catch (error) {
      console.error('Registration error:', error)
      setIsLoading(false)
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
