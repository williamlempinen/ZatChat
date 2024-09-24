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
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Access />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
