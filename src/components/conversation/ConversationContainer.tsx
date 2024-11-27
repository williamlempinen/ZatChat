import * as React from 'react'
import { Conversation, Message } from '../../types/types'
import { useLocation, useNavigate } from 'react-router-dom'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import MessageBox from './MessageBox'
import InputMessageArea from './InputMessageArea'
import { useChat } from '../../lib/webSocket/ChatContext'
import ErrorTypography from '../ui/ErrorTypography'
import { useAuth } from '../../lib/AuthContext'
import { formatTime } from '../../lib/utils'

const ConversationContainer = () => {
  const [messagesPageNumber, setMessagesPageNumber] = React.useState<number>(2)
  const [hasNextPage, setHasNextPage] = React.useState<boolean>(true)
  const [totalPages, setTotalPages] = React.useState<number>(1)

  const navigate = useNavigate()
  const location = useLocation()

  const [conversationData, setConversationData] = React.useState<Conversation>(
    location.state?.conversation as Conversation,
  )

  const messageContainerRef = React.useRef<HTMLDivElement | null>(null)

  const { getMessages } = nodeServerApi()

  const { isConnectionError, isSendingMessageError, isConnected, messages } = useChat()

  const { user } = useAuth()

  const extractConversationName = (): string => {
    if (!conversationData.group_name.includes('<>')) return conversationData.group_name
    return conversationData.group_name.split('<>')[1].trim()
  }

  const getOlderMessages = async () => {
    if (!hasNextPage) return

    const container = messageContainerRef.current
    const prevScrollHeight = container?.scrollHeight || 0

    const response = await getMessages(conversationData.id, messagesPageNumber)
    const res = response.data

    if (res.data.length === 0) {
      setHasNextPage(false)
      console.log('WAS LAST PAGE')
      return
    }

    setMessagesPageNumber((prev) => prev + 1)
    setTotalPages(res.data.totalPages)

    setConversationData((prev) => ({
      ...prev,
      messages: [...prev.messages, ...res.data],
    }))

    setTimeout(() => {
      if (container) {
        container.scrollTop = container.scrollHeight - prevScrollHeight
      }
    }, 0)
  }

  const updateConversationOptimistically = (newMessage: Message) => {
    setConversationData((prev) => ({
      ...prev,
      messages: [newMessage, ...prev.messages],
    }))

    setTimeout(() => {
      const container = messageContainerRef.current
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }, 0)
  }

  React.useEffect(() => {
    const lastlyAdded = messages.pop()
    if (!messages || !lastlyAdded) return

    updateConversationOptimistically(lastlyAdded)
  }, [messages])

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const conversationId = searchParams.get('conversation-id')

    const container = messageContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }

    navigate(`/conversation/?conversation-id=${conversationId}`)
  }, [location.search])

  const handleScroll = () => {
    const container = messageContainerRef.current
    if (container && container.scrollTop < 100 && hasNextPage) {
      getOlderMessages()
    }
  }

  const passUser = (id: number) => {
    const [user] = conversationData.participants.filter((p) => p.id === id)
    return user
  }

  const isUserActive = (id: number): boolean => {
    return user.id === id && user.isActive
  }

  // TODO: ERROR HANDLING
  return (
    <div className="flex h-[60rem] w-full flex-grow flex-col p-4">
      <div className="h-12 border-b-4 border-white">
        <p className="text-xl font-bold text-secondary">{extractConversationName()}</p>
        <div className="flex">
          {conversationData.participants.map((p) => (
            <p className="font-bold text-shl">
              | {p.username} - Is active:{' '}
              {isUserActive(p.id) ? (
                <span className="text-green-500">yes</span>
              ) : (
                <span className="text-error">no</span>
              )}{' '}
              |
            </p>
          ))}
        </div>
      </div>
      <div
        className="no-scrollbar flex h-full flex-col overflow-y-auto scroll-smooth"
        ref={messageContainerRef}
        onScroll={handleScroll}
      >
        {!hasNextPage && !conversationData.is_group && (
          <p className="self-center text-t-sec">
            Conversation created at: {formatTime('full', conversationData.created_at)}
          </p>
        )}
        {!hasNextPage && conversationData.is_group && (
          <p className="self-center text-t-sec">
            Group created at: {formatTime('full', conversationData.created_at)}
          </p>
        )}
        <div className="flex w-full flex-col-reverse">
          {isConnectionError && <ErrorTypography errorMessage="Error connecting WebSocket" />}
          {conversationData.messages.map((m) => (
            <MessageBox message={m} senderUser={passUser(m.sender_id)} />
          ))}
        </div>
        <p>{isConnected}</p>
        <p>{isConnectionError}</p>
        <p>{isSendingMessageError}</p>
      </div>
      <InputMessageArea updateConversation={updateConversationOptimistically} />
    </div>
  )
}

export default ConversationContainer
