import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/ui/PrimaryButton'
import { ChatProvider } from '../lib/webSocket/ChatContext'
import ConversationContainer from '../components/conversation/ConversationContainer'

const Conversation = () => {
  const navigate = useNavigate()

  return (
    <ChatProvider>
      <div className="flex h-full max-h-screen w-full flex-col gap-1">
        <div className="flex h-8 w-full items-start">
          <PrimaryButton displayText="Go Back" onClick={() => navigate('/home')} />
        </div>
        <ConversationContainer />
      </div>
    </ChatProvider>
  )
}

export default Conversation
