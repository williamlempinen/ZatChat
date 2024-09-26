import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from '../types/types'
import Cookies from 'js-cookie'
import * as React from 'react'
import apiClient from './api/apiClient'
import { redirect } from 'react-router-dom'
import { nodeServerApi } from './api/nodeServerApi'

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
  login: ({ email, password }: LoginParams) => Promise<boolean>
  signup: ({ username, email, password }: SignupParams) => Promise<boolean>
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

  const validateSession = async (): Promise<boolean> => {
    try {
      if (!sessionId) return false

      const res = await apiClient.post('/access/validate-session', { sessionId })

      const data = res.data.data
      console.log('DATA: \n ', res)
      if (!data) return false

      console.log('DATA2: ', data)

      setUser({
        createdAt: data.created_at,
        email: data.email,
        id: data.id,
        isActive: data.is_active,
        profilePictureUrl: data.profile_picture_url,
        role: data.role,
        username: data.username,
      })

      console.log('USER: ', data)

      return res.data.status === 200
    } catch (error: any) {
      console.error('Validating session error')
      return false
    }
  }

  React.useEffect(() => {
    const checkSession = async () => {
      const isValid = await validateSession()

      setIsAuthenticated(isValid)

      if (isValid) {
        apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`
      } else {
        handleLogout()
      }

      console.log(
        'Logging session: \n is auth',
        isAuthenticated,
        '\n session: ',
        sessionId,
        '\n access: ',
        accessToken,
        '\n refresh: ',
        refreshToken,
        '\n ISVALID: ',
        isValid,
        '\n user: ',
        user,
      )
    }

    checkSession()
  }, [])

  const login = async ({ email, password }: LoginParams): Promise<boolean> => {
    const res = await apiClient.post('/access/login', { email, password })

    const data = res.data.data

    if (!data) return false

    console.log('DATA: ', data)

    apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`

    setAccessToken(data.accessToken)
    Cookies.set('accessToken', data.accessToken)

    setRefreshToken(data.refreshToken)
    Cookies.set('refreshToken', data.refreshToken)

    setSessionId(data.sessionId)
    Cookies.set('sessionId', data.sessionId)

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
    return true
  }

  const signup = async ({ username, email, password }: SignupParams): Promise<boolean> => {
    console.log('signup action')
    const res = await apiClient.post('/access/signup', { username, email, password })

    const data = res.data.data
    if (!data) return false

    return true
  }

  const logout = async () => {
    try {
      await apiClient.post('/access/logout', { sessionId })

      console.log('Logout action')
    } catch (error: any) {
      console.error('Logout failed')
    } finally {
      handleLogout()
      redirect('/')
      window.location.reload()
    }
  }

  const handleLogout = () => {
    setAccessToken(undefined)
    setRefreshToken(undefined)
    setSessionId(undefined)
    setUser({} as User)

    queryClient.clear()

    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('sessionId')

    delete apiClient.defaults.headers.Authorization
  }

  return (
    <AuthContext.Provider
      value={{ user, login, accessToken, refreshToken, signup, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return React.useContext(AuthContext)
}
