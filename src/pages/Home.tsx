import * as React from 'react'
import Input from '../components/ui/Input'
import { nodeServerApi } from '../lib/api/nodeServerApi'
import { useAuth } from '../lib/AuthContext'
import SearchUsers from '../components/home/SearchUsers'
import { FilteredUser } from '../types/types'

type Conversation = {
  id: number
  created_at: string
  is_group: boolean
  updated_at: string
  group_name: string
  messages: any[]
  participants: FilteredUser[]
}

const OldConversations = ({
  conversations,
  userId,
}: {
  conversations: Conversation[]
  userId: number
}) => {
  return (
    <div className="flex flex-col rounded border-2 border-hl">
      {conversations.length > 0 ? (
        conversations.map((conversation) => {
          if (conversation.is_group || conversation.participants.length > 2) {
            return <p>{conversation.group_name}</p>
          }

          const friendUser = conversation.participants.filter((p) => p.id !== userId)

          console.log('FRIEND USER: ', friendUser)

          return <p>{friendUser[0].username}</p>
        })
      ) : (
        <p>No conversations yet</p>
      )}
    </div>
  )
}

const Home = () => {
  const [query, setQuery] = React.useState<string>('')
  const [conversations, setConversations] = React.useState<any[]>([])
  const [conversationPageNumber, setConversationPageNumber] = React.useState<number>(1)
  const [hasNextPage, setHasNextPage] = React.useState<boolean>(false)

  const { testGetProtectedData, postRefreshToken: reFunc, getConversations } = nodeServerApi()

  const { user, refreshToken } = useAuth()

  React.useEffect(() => {
    const getConvo = async () => {
      const response = await getConversations(user.id, conversationPageNumber)
      console.log('CONVO DATA: ', response)

      setHasNextPage(response.data.hasNextPage)

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

  const getMore = async () => {
    console.log('GET MORE BUTTOM')
    const response = await getConversations(user.id, conversationPageNumber + 1)
    setHasNextPage(response.data.hasNextPage)
    setConversationPageNumber((prev) => prev + 1)
    setConversations((prev) => [...prev, ...response.data.data])
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-bold text-2xl text-shl">Welcome {user.username}</p>
      <p>Your previous conversations</p>
      <OldConversations conversations={conversations} userId={user.id} />
      {hasNextPage && <button onClick={() => getMore()}>Get more conversations</button>}
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
