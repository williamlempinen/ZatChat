import * as React from 'react'
import Input from '../components/ui/Input'
import { nodeServerApi } from '../lib/api/nodeServerApi'
import { useAuth } from '../lib/AuthContext'
import SearchUsers from '../components/home/SearchUsers'
import PreviousConversations from '../components/home/PreviousConversations'

const Home = () => {
  const [query, setQuery] = React.useState<string>('')

  const { testGetProtectedData, postRefreshToken: reFunc } = nodeServerApi()

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

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setQuery(value)
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-bold text-2xl text-shl">Welcome {user.username}</p>
      <p>Your previous conversations</p>
      <PreviousConversations />
      <div>
        <p>Search for new users to chat with</p>
        <Input type="text" value={query} onChange={handleQueryChange} />
        <SearchUsers query={query} />
      </div>

      <button className="bg-base" onClick={test}>
        Test auth
      </button>
      <button className="bg-base" onClick={testRefresh}>
        REFRESH
      </button>
    </div>
  )
}

export default Home
