import { nodeServerApi } from '../lib/api/nodeServerApi'
import { useAuth } from '../lib/AuthContext'

const Home = () => {
  const { testGetProtectedData, refreshToken: reFunc } = nodeServerApi()

  const { user, refreshToken } = useAuth()

  const test = async () => {
    console.log('testing')
    const res = await testGetProtectedData()
    console.log('res: ', res)
  }

  const testRefresh = async () => {
    console.log('test refreshing')
    if (!refreshToken) {
      console.log('NO VALID REFRESHTOKEN. CAN NOT REFRESHTOKENS')
      return
    }

    const res = await reFunc(user.email, user.id, refreshToken)
    console.log('RES FROM REFRESHTOKEN: ', res)
  }

  return (
    <div className="bg-shl">
      <p>Hello world</p>Hello World
      <button className="bg-base" onClick={test}>
        Test auth
      </button>
      <button className="bg-base" onClick={testRefresh}>
        REFRESH
      </button>
      <h1>{user.username}</h1>
      <h1>{user.email}</h1>
    </div>
  )
}

export default Home
