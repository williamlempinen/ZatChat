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
  accessToken: string | undefined
  refreshToken: string | undefined
  login: ({ email, password }: { email: string; password: string }) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = React.createContext<AuthContextProps>({} as AuthContextProps)

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = React.useState<User>({} as User)
  const [accessToken, setAccessToken] = React.useState<string | undefined>(
    Cookies.get('accessToken'),
  )
  const [refreshToken, setRefreshToken] = React.useState<string | undefined>(
    Cookies.get('refreshToken'),
  )

  const queryClient = useQueryClient()

  React.useEffect(() => {
    if (accessToken) {
      console.log('setting in useeffect')
      apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`
      Cookies.set('accessToken', accessToken, { expires: 1 })
    } else {
      delete apiClient.defaults.headers.Authorization
      Cookies.remove('accessToken')
    }
  }, [accessToken])

  const login = async ({ email, password }: { email: string; password: string }) => {
    console.log('Login action')
    const res = await apiClient.post('/access/login', { email, password })
    console.log('Response: ', res.data)
    setAccessToken(res.data.data.accessToken)
    console.log('TOKEN: ', accessToken)
    if (accessToken) Cookies.set('token', accessToken)
    setUser({
      id: res.data.data.id,
      username: res.data.data.username,
      email: res.data.data.email,
      profilePicture: res.data.data.profile_picture_url,
    })
    console.log('USER: ', user)
  }

  const signup = async (username: string, email: string, password: string) => {
    console.log('signup action')
  }

  const logout = async () => {
    console.log('Logout action')
    setAccessToken(undefined)
    setUser({} as User)
    queryClient.clear()
  }

  const isAuthenticated = false

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, login, signup, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return React.useContext(AuthContext)
}
