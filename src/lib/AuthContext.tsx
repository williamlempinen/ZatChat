import { useQueryClient } from '@tanstack/react-query'
import { User } from '../types/types'
import Cookies from 'js-cookie'
import * as React from 'react'
import apiClient from './api/apiClient'
import axios from 'axios'
import { redirect } from 'react-router-dom'

type SignupParams = {
  username: string
  email: string
  password: string
}

type LoginParams = Omit<SignupParams, 'username'>

interface AuthContextProps {
  user: User
  accessToken: string | undefined
  refreshToken: string | undefined
  login: ({ email, password }: LoginParams) => Promise<void>
  signup: ({ username, email, password }: SignupParams) => Promise<void>
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
  const [sessionId, setSessionId] = React.useState<string | undefined>(Cookies.get('sessionId'))
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false)

  const queryClient = useQueryClient()

  //
  //React.useEffect(() => {
  //  if (!accessToken) {
  //    setAccessToken(undefined)
  //    setUser({} as User)
  //    setIsAuthenticated(false)
  //    Cookies.remove('accessToken')
  //    Cookies.remove('refreshToken')
  //  return
  //  }
  //
  //  const validateRes = await apiClient.
  //
  //})

  React.useEffect(() => {
    if (accessToken) {
      console.log('setting in useeffect')
      apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`
      Cookies.set('accessToken', accessToken, { expires: 1 })
      setIsAuthenticated(true)
    } else {
      delete apiClient.defaults.headers.Authorization
      Cookies.remove('accessToken')
      setIsAuthenticated(false)
    }

    console.log('IS AUTHENTICATED: ', isAuthenticated)
  }, [accessToken])

  const login = async ({ email, password }: LoginParams) => {
    const res = await apiClient.post('/access/login', { email, password })

    const data = res.data.data
    if (!data) {
      console.log('No data returned, login failed')
      return
    }

    console.log('DATA: ', data)

    setAccessToken(data.accessToken)
    if (accessToken) Cookies.set('accessToken', accessToken)

    setRefreshToken(data.refreshToken)
    if (refreshToken) Cookies.set('refreshToken', refreshToken)

    setSessionId(data.sessionId)
    if (sessionId) Cookies.set('sessionId', sessionId)

    setUser({
      createdAt: data.user.created_at,
      email: data.user.email,
      id: data.user.id,
      isActive: data.user.is_active,
      profilePictureUrl: data.user.profile_picture_url,
      role: data.user.role,
      username: data.user.username,
    })

    setIsAuthenticated(true)
  }

  const signup = async ({ username, email, password }: SignupParams) => {
    console.log('signup action')
  }

  const logout = async () => {
    if (!isAuthenticated) return
    console.log('USER: ', user)
    if (!user || !user.id) return

    const res = await apiClient.post('/access/logout', { id: user.id, sessionId })

    console.log('RES: ', res)
    console.log('Logout action')

    setAccessToken(undefined)
    setRefreshToken(undefined)
    setUser({} as User)
    setIsAuthenticated(false)

    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')

    queryClient.clear()

    redirect('/')
    window.location.reload()
  }

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
