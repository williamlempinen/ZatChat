import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/ui/PrimaryButton'
import { ChatProvider } from '../lib/webSocket/ChatContext'

const Conversation = () => {
  const navigate = useNavigate()

  return (
    <ChatProvider>
      <div className="flex h-full w-full flex-col gap-1 border-2 border-hl">
        <div className="flex h-8 w-full items-start border-2 border-shl">
          <PrimaryButton displayText="Go Back" onClick={() => navigate('/home')} />
        </div>
      </div>
    </ChatProvider>
  )
}

export default Conversation
