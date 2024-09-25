import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Layout from './components/ui/Layout'
import Access from './pages/Access'
import { PropsWithChildren } from 'react'
import { useAuth } from './lib/AuthContext'
import Home from './pages/Home'

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return children

  return <Navigate to="/login" replace />
}

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Access />} />
          <Route path="/signup" element={<Access />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
