import * as React from 'react'
import { useToggle } from '../hooks/useToggle'
import Signup from './access/Signup'
import Login from './access/Login'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

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
    <div className="flex w-full flex-col items-center gap-6 rounded bg-base-light p-4 pb-16 shadow shadow-t">
      <div className="flex w-full justify-evenly border-2 border-success">
        <button onClick={handleToggle}>Login</button>
        <button onClick={handleToggle}>Signup</button>
      </div>
      <div className="flex w-full max-w-lg items-center justify-center">
        {isSignup ? <Signup /> : <Login />}
      </div>
    </div>
  )
}

export default Access
