import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/ui/Layout'
import Access from './pages/Access'
import { PropsWithChildren } from 'react'
import { useAuth } from './lib/AuthContext'
import Home from './pages/Home'
import Conversation from './pages/Conversation'
import { ChatProvider } from './lib/webSocket/ChatContext'

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
          <Route
            path="/conversation/"
            element={
              <PrivateRoute>
                <ChatProvider>
                  <Conversation />
                </ChatProvider>
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
