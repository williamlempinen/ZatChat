import * as React from 'react'
import { useToggle } from '../hooks/useToggle'
import Signup from '../features/access/Signup'
import Login from '../features/access/Login'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { cn } from '../lib/utils'

const Access = () => {
  const { state: isSignup, toggle } = useToggle(false, true)

  const navigate = useNavigate()

  const location = useLocation()

  const { isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true })
    }
  }, [isAuthenticated, navigate])

  React.useEffect(() => {
    if (isSignup && location.pathname !== '/signup') {
      navigate('/signup', { replace: true })
    } else if (!isSignup && location.pathname !== '/login') {
      navigate('/login', { replace: true })
    }
  }, [isSignup, location.pathname, navigate])

  const handleToggle = () => {
    toggle()

    if (isSignup) {
      navigate('/login', { replace: true })
      return
    }

    navigate('/signup', { replace: true })
  }

  return (
    <div className="flex w-full flex-col items-center gap-6 rounded bg-base-light p-4 pb-16 shadow">
      <div className="flex h-8 w-full justify-evenly rounded-md">
        <button
          className={cn(
            'w-full shadow transition-colors duration-300',
            location.pathname === '/login' ? 'bg-base-dark text-secondary' : 'bg-base-light text-t',
          )}
          onClick={handleToggle}
        >
          Login
        </button>
        <button
          className={cn(
            'w-full shadow transition-colors duration-300',
            location.pathname === '/signup'
              ? 'bg-base-dark text-secondary'
              : 'bg-base-light text-t',
          )}
          onClick={handleToggle}
        >
          Signup
        </button>
      </div>
      <div className="flex w-full max-w-lg items-center justify-center">
        {isSignup ? <Signup /> : <Login />}
      </div>
    </div>
  )
}

export default Access
