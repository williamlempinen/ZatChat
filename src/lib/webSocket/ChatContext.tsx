import Cookies from 'js-cookie'
import { Message } from '../../types/types'
import * as React from 'react'
import connectWebSocket from './webSocketClient'
import { useSearchParams } from 'react-router-dom'

type ChatContextProps = {
  sendMessage: (content: Message) => void
  closeConversation: () => void
  isConnected: boolean
  isConnectionError: boolean
  isSendingMessageError: boolean
  conversationId: string
}

const ChatContext = React.createContext<ChatContextProps>({} as ChatContextProps)

export const ChatProvider = ({ children }: React.PropsWithChildren) => {
  const [ws, setWs] = React.useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = React.useState<boolean>(false)
  const [isConnectionError, setIsConnectionError] = React.useState<boolean>(false)
  const [isSendingMessageError, setIsSendingMessageError] = React.useState<boolean>(false)
  const [conversationId, setConversationId] = React.useState<string>('')

  const token = Cookies.get('accessToken')

  const [searchParams] = useSearchParams()

  React.useEffect(() => {
    const toId = searchParams.get('conversation-id')
    setConversationId(toId || '')

    if (!token) return

    const ws = connectWebSocket(token)

    if (!ws) {
      setIsConnectionError(true)
      return
    }
    setWs(ws)

    ws.onopen = () => {
      console.log('WebSocket connection established (via ChatContext)')
      setIsConnected(true)
      setIsConnectionError(false)
      setIsSendingMessageError(false)
    }

    ws.onclose = (event) => {
      console.log(
        'WebSocket connection closed (via ChatContext)',
        event.reason || 'No reason provided',
      )
      setIsConnected(false)
      setWs(null)
    }

    ws.onmessage = (event) => {
      console.log('Message received (via ChatContext):', event.data)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error (via ChatContext):', error)
      setIsConnected(false)
      setIsConnectionError(true)
    }

    return () => {
      closeConversation()
    }
  }, [isConnected])

  const closeConversation = () => {
    console.log('WEBSOCKET CLOSING')
    if (!ws) return
    ws.close()
    setWs(null)
    console.log('WEBSOCKET CLOSED')
  }

  const sendMessage = (newMessage: Message) => {
    if (!ws) {
      setIsSendingMessageError(true)
      console.error('Cannot send message: WebSocket is not initialized')
      return
    }

    if (ws.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message: WebSocket is not open')
      return
    }

    ws.send(JSON.stringify(newMessage))
  }

  return (
    <ChatContext.Provider
      value={{
        sendMessage,
        closeConversation,
        isConnected,
        isConnectionError,
        isSendingMessageError,
        conversationId,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  return React.useContext(ChatContext)
}
