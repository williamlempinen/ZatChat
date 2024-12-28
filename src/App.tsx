import * as React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/ui/Layout'
import Access from './pages/Access'
import { PropsWithChildren } from 'react'
import { useAuth } from './lib/AuthContext'
import Home from './pages/Home'
import Conversation from './pages/Conversation'
import { ChatProvider } from './lib/webSocket/ChatContext'
import { setupApiClient } from './lib/api/apiClient'
import { ErrorBoundary } from 'react-error-boundary'
import { Spinner } from './components/ui/Spinner'

const ErrorFallback = () => {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-error"
      role="alert"
    >
      <h2 className="text-lg font-bold">Ooops, something went wrong :( </h2>
      <button className="mt-4" onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </button>
    </div>
  )
}

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
    </React.Suspense>
  )
}

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return children

  return <Navigate to="/login" replace />
}

const App = () => {
  const { logout } = useAuth()

  React.useEffect(() => {
    setupApiClient(logout)
  }, [logout])

  return (
    <Wrapper>
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
    </Wrapper>
  )
}

export default App
