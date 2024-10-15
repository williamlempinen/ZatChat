import * as React from 'react'
import Input from '../components/ui/Input'
import { nodeServerApi } from '../lib/api/nodeServerApi'
import { useAuth } from '../lib/AuthContext'
import SearchUsers from '../components/home/SearchUsers'

type Conversation = {
  id: number
  created_at: string
  is_group: boolean
  updated_at: string
}

const OldConversations = ({ conversations }: { conversations: Conversation[] }) => {
  return (
    <div className="flex flex-col rounded border-2 border-hl">
      {conversations.length > 0 ? (
        conversations.map((conversation) => <p key={conversation.id}>{conversation.created_at}</p>)
      ) : (
        <p>You no coversations yet</p>
      )}
    </div>
  )
}

const Home = () => {
  const [query, setQuery] = React.useState<string>('')
  const [conversations, setConversations] = React.useState<any[]>([])

  const { testGetProtectedData, postRefreshToken: reFunc, getConversations } = nodeServerApi()

  const { user, refreshToken } = useAuth()

  React.useEffect(() => {
    const getConvo = async () => {
      const response = await getConversations(user.id)
      setConversations(response.data.data)
    }

    console.log('USER: ', user)

    getConvo()
  }, [])

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

  const logger = () => {
    console.log(conversations)
    console.log('USER: ', user)
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-bold text-2xl text-shl">Welcome {user.username}</p>
      <p>Your previous conversations</p>
      {conversations && logger()}
      <OldConversations conversations={conversations} />
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
      <h1>{user.username}</h1>
      <h1>{user.email}</h1>
    </div>
  )
}

export default Home
