import { nodeServerApi } from '../lib/api/nodeServerApi'
import { useAuth } from '../lib/AuthContext'

type Conversation = {
  when: string
}

const OldConversations = ({ conversations }: { conversations: Conversation[] }) => {
  return (
    <div className="flex flex-col rounded border-2 border-hl">
      {conversations.length > 0 ? (
        conversations.map((conversation) => <p>{conversation.when}</p>)
      ) : (
        <p>You no coversations yet</p>
      )}
    </div>
  )
}

const Home = () => {
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

  return (
    <div className="flex flex-col gap-1">
      <p className="text-bold text-2xl text-shl">Welcome {user.username}</p>
      <p>Your previous conversations</p>
      <OldConversations conversations={[]} />
      <div>
        <p>Search for new users to chat with</p>
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
