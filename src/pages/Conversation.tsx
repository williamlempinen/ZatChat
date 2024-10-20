import { ChatProvider } from '../lib/webSocket/ChatContext'

const Conversation = () => {
  return (
    <ChatProvider>
      <div>Hello world</div>
    </ChatProvider>
  )
}

export default Conversation
