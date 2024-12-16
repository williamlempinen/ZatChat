import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/ui/PrimaryButton'
import { useChat } from '../lib/webSocket/ChatContext'
import ConversationContainer from '../features/conversation/ConversationContainer'

const Conversation = () => {
  const navigate = useNavigate()

  const { closeConversation } = useChat()

  const handleLeavingConversation = () => {
    closeConversation()
    navigate('/home')
  }

  return (
    <div className="flex h-full w-full flex-col gap-1">
      <div className="flex h-8 w-full items-start">
        <PrimaryButton displayText="Go Back" onClick={handleLeavingConversation} />
      </div>
      <ConversationContainer />
    </div>
  )
}

export default Conversation
