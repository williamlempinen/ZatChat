import { nodeServerApi } from '../lib/api/nodeServerApi'
import { useAuth } from '../lib/AuthContext'

const Home = () => {
  const { testGetProtectedData } = nodeServerApi()

  const { user } = useAuth()

  const test = async () => {
    console.log('testing')
    const res = await testGetProtectedData()
    console.log('res: ', res)
  }

  return (
    <div className="bg-shl">
      <p>Hello world</p>Hello World
      <button className="bg-base" onClick={test}>
        Test auth
      </button>
      <h1>{user.username}</h1>
      <h1>{user.email}</h1>
    </div>
  )
}

export default Home
