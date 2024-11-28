import * as React from 'react'
import { nodeServerApi } from '../lib/api/nodeServerApi'
import { useAuth } from '../lib/AuthContext'
import SearchUsers from '../components/home/SearchUsers'
import PreviousConversations from '../components/home/PreviousConversations'

const Home = () => {
  const { testGetProtectedData } = nodeServerApi()

  const { user, refreshToken, refreshTokens } = useAuth()

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

    const _res = await refreshTokens()
  }

  return (
    <div className="flex flex-col">
      <p className="text-bold text-2xl text-shl">Welcome {user.username}</p>
      <p>Your previous conversations</p>
      <hr className="text-shl" />
      <PreviousConversations />
      <p className="text-bold mt-8 text-2xl text-shl">Search for new users to chat with</p>
      <SearchUsers />

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
