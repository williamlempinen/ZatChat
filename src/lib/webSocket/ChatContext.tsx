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
  messages: Message[]
}

const ChatContext = React.createContext<ChatContextProps>({} as ChatContextProps)

export const ChatProvider = ({ children }: React.PropsWithChildren) => {
  const [isConnected, setIsConnected] = React.useState<boolean>(false)
  const [isConnectionError, setIsConnectionError] = React.useState<boolean>(false)
  const [isSendingMessageError, setIsSendingMessageError] = React.useState<boolean>(false)
  const [conversationId, setConversationId] = React.useState<string>('')
  const [messages, setMessages] = React.useState<Message[]>([])

  const token = Cookies.get('accessToken')

  const [searchParams] = useSearchParams()

  const wsRef = React.useRef<WebSocket | null>(null)

  React.useEffect(() => {
    const toId = searchParams.get('conversation-id') || ''

    if (!token || toId === '' || toId === undefined) return
    if (wsRef.current) {
      console.log('Connection already exists')
      return
    }

    setConversationId(toId)

    const wsConnection = connectWebSocket(token, toId)

    if (!wsConnection) {
      setIsConnectionError(true)
      return
    }

    wsRef.current = wsConnection

    wsConnection.onopen = () => {
      console.log('WS CONNECTED (via ChatContext)')
      setIsConnected(true)
      setIsConnectionError(false)
      setIsSendingMessageError(false)
    }

    wsConnection.onclose = (event) => {
      console.log('WS CLOSED (via ChatContext)', event || 'No reason provided')
      setIsConnected(false)
    }

    wsConnection.onmessage = (event) => {
      try {
        const received = JSON.parse(event.data)

        console.log('RECEIVED DATA: ', JSON.parse(event.data))

        if (received.type === 'success' && received.data) {
          setMessages((prev) => [...prev, received.data])
        }
      } catch (error: any) {
        console.error('ERROR ON MESSAGE RECEIVING: ', error)
      }
    }

    wsConnection.onerror = (error) => {
      console.error('WebSocket error (via ChatContext):', error)
      setIsConnected(false)
      setIsConnectionError(true)
    }
  }, [token, searchParams])

  const closeConversation = () => {
    console.log('WEBSOCKET CLOSING')
    if (!wsRef.current) return
    wsRef.current.close()
    wsRef.current = null
    console.log('WEBSOCKET CLOSED')
  }

  const sendMessage = (newMessage: Message) => {
    if (!wsRef.current) {
      setIsSendingMessageError(true)
      console.error('Cannot send message: WebSocket is not initialized')
      return
    }

    if (wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message: WebSocket is not open')
      return
    }
    console.log('WS SENT MESSAGE')

    wsRef.current.send(JSON.stringify(newMessage))
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
        messages,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  return React.useContext(ChatContext)
}
