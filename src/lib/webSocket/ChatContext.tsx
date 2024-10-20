import { Message } from 'postcss'
import * as React from 'react'

type ChatContextProps = {
  sendMessage: (to: string, content: Message) => void
  // todo
}

const ChatContext = React.createContext<ChatContextProps>({} as ChatContextProps)

export const ChatProvider = ({ children }: React.PropsWithChildren) => {
  const [ws, setWs] = React.useState<WebSocket | null>(null)

  React.useEffect(() => {
    console.log('CHATPROVIDER EFFECT')
  }, [])

  const sendMessage = (to: string, content: Message) => {
    if (!ws) return

    const message = JSON.stringify(content)
    ws.send(message)
  }

  return <ChatContext.Provider value={{ sendMessage }}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  return React.useContext(ChatContext)
}
