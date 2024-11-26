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
  onMessageReceived: (callback: (message: Message) => void) => void
}

const ChatContext = React.createContext<ChatContextProps>({} as ChatContextProps)

export const ChatProvider = ({ children }: React.PropsWithChildren) => {
  const [ws, setWs] = React.useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = React.useState<boolean>(false)
  const [isConnectionError, setIsConnectionError] = React.useState<boolean>(false)
  const [isSendingMessageError, setIsSendingMessageError] = React.useState<boolean>(false)
  const [conversationId, setConversationId] = React.useState<string>('')
  const [messageListener, setMessageListener] = React.useState<(message: Message) => void | null>()

  const token = Cookies.get('accessToken')

  const [searchParams] = useSearchParams()

  React.useEffect(() => {
    const toId = searchParams.get('conversation-id') || ''
    if (!token || toId === '') return

    setConversationId(toId)

    const wsConnection = connectWebSocket(token, toId)

    if (!wsConnection) {
      setIsConnectionError(true)
      return
    }

    setWs(wsConnection)

    wsConnection.onopen = () => {
      console.log('WS CONNECTED (via ChatContext)')
      setIsConnected(true)
      setIsConnectionError(false)
      setIsSendingMessageError(false)
    }

    wsConnection.onclose = (event) => {
      console.log('WS CLOSED (via ChatContext)', event.reason || 'No reason provided')
      setIsConnected(false)
      setWs(null)
    }

    wsConnection.onmessage = (event) => {
      try {
        const received = JSON.parse(event.data)

        console.log('RECEIVED DATA: ', JSON.parse(event.data))

        if (received.type === 'success' && received.data) {
          messageListener?.(received.data)
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

    return () => {
      closeConversation()
    }
  }, [token, searchParams, messageListener])

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

  const onMessageReceived = React.useCallback((callback: (message: Message) => void) => {
    setMessageListener(() => callback)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        sendMessage,
        closeConversation,
        isConnected,
        isConnectionError,
        isSendingMessageError,
        conversationId,
        onMessageReceived,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  return React.useContext(ChatContext)
}
