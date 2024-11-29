import * as React from 'react'
import { nodeServerApi } from '../lib/api/nodeServerApi'
import { useAuth } from '../lib/AuthContext'
import SearchUsers from '../components/home/SearchUsers'
import PreviousConversations from '../components/home/PreviousConversations'
import { useToggle } from '../hooks/useToggle'
import { cn } from '../lib/utils'

const Home = () => {
  const { state: isConversations, toggle } = useToggle(true, false)

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
      <div className="flex h-8 w-full justify-evenly rounded-md">
        <button
          className={cn(
            'w-full rounded-bl rounded-tl shadow transition-colors duration-300',
            isConversations ? 'bg-base-dark text-secondary' : 'bg-base-light text-t',
          )}
          onClick={toggle}
        >
          Conversations
        </button>
        <button
          className={cn(
            'w-full rounded-br rounded-tr shadow transition-colors duration-300',
            !isConversations ? 'bg-base-dark text-secondary' : 'bg-base-light text-t',
          )}
          onClick={toggle}
        >
          Search Users
        </button>
      </div>
      {isConversations ? (
        <>
          <p>Your previous conversations</p>
          <hr />
          <PreviousConversations />
        </>
      ) : (
        <>
          <p>Search for new users to chat with</p>
          <hr />
          <SearchUsers />
        </>
      )}

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
