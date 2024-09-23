import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Layout from './components/ui/Layout'
import Access from './pages/Access'
import { PropsWithChildren } from 'react'

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()

  // TEMP
  const isAuthenticated = true

  if (isAuthenticated) return children
  return navigate('/access')
}

const App = () => {
  return (
    <Layout>
      <Router>
        <Routes>
          <Route path="/" element={<Access />} />
        </Routes>
      </Router>
    </Layout>
  )
}

export default App
