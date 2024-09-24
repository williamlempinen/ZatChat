import { useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import * as React from 'react'
import apiClient from './api/apiClient'
import axios from 'axios'

export interface User {
  id: number
  username: string
  email: string
  profilePicture: string
}

interface AuthContextProps {
  user: User
  token: string | undefined
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = React.createContext<AuthContextProps>({} as AuthContextProps)

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = React.useState<User>({} as User)
  const [token, setToken] = React.useState<string | undefined>(Cookies.get('token'))
  const queryClient = useQueryClient()

  const BASE = import.meta.env.VITE_BASEURL

  React.useEffect(() => {
    if (token) {
      apiClient.defaults.headers.Authorization = `Bearer ${token}`
    } else {
      delete apiClient.defaults.headers.Authorization
    }
  }, [token])

  const login = async (email: string, password: string) => {
    console.log('Login action')
    const response = await axios.post(`${BASE}/access/login`, { email, password })
    console.log('Response: ', response.data)
    setToken((prev) => response.data.data.accessToken)
    console.log('TOKEN: ', token)
    if (token) Cookies.set('token', token)
  }

  const signup = async (username: string, email: string, password: string) => {
    console.log('signup action')
  }

  const logout = async () => {
    console.log('Logout action')
    setToken(undefined)
    setUser({} as User)
  }

  const isAuthenticated = false

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return React.useContext(AuthContext)
}
