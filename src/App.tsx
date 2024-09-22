import Input from './components/ui/Input'
import { useState } from 'react'
import Layout from './components/ui/Layout'
import Header from './components/ui/Header'
import Login from './pages/access/Login'

const App = () => {
  const [count, setCount] = useState(0)

  const toggleLight = () => {
    console.log('Toggle light pressed')
  }

  return (
    <Layout>
      <Header />
      <div className="m-4 flex flex-col gap-2 rounded border-2 border-blue-500 p-4">
        <button className="text-t" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <Input />
      </div>
      <Login />
    </Layout>
  )
}

export default App
