import * as React from 'react'

interface AuthContextProps {
  user: any // temp
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: React.PropsWithChildren) => {}
