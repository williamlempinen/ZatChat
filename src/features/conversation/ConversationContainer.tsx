import * as React from 'react'
import { Conversation, Message, Participant } from '../../types/types'
import { useLocation, useNavigate } from 'react-router-dom'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import MessageBox from './MessageBox'
import InputMessageArea from './InputMessageArea'
import { useChat } from '../../lib/webSocket/ChatContext'
import ErrorTypography from '../../components/ui/ErrorTypography'
import { formatTime } from '../../lib/utils'
import Loading from '../../components/ui/Loading'
import { useAuth } from '../../lib/AuthContext'
import { GoPeople } from 'react-icons/go'

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

  const { getMessages, updateMessagesAsSeen } = nodeServerApi()

  const { isConnectionError, isSendingMessageError, isConnected, messages } = useChat()

  const { user } = useAuth()

  const extractConversationName = (): string => {
    if (!conversationData.group_name.includes('<>')) return conversationData.group_name

    const participants = conversationData.group_name.split('<>').map((name) => name.trim())
    return participants.find((name) => name !== user.username) || 'Unknown'
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

  const activeParticipants = React.useMemo(() => {
    return conversationData.participants.filter((p) => p.is_active).map((p) => p.id)
  }, [conversationData.messages])

  const updateConversationOptimistically = (newMessage: Message) => {
    const updatedMessages = [newMessage, ...conversationData.messages].map((message) => {
      const updatedSeenBy = [...new Set([...message.is_seen_by, ...activeParticipants])]

      return {
        ...message,
        is_seen_by: updatedSeenBy,
        is_seen: updatedSeenBy.length > 0,
      }
    })

    setConversationData((prev) => ({
      ...prev,
      messages: updatedMessages,
    }))

    setTimeout(() => {
      const container = messageContainerRef.current
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }, 0)

    if (conversationData.id) {
      updateMessagesAsSeen(JSON.stringify(conversationData.id), JSON.stringify(user.id))
    }
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

    if (conversationData.id) {
      updateMessagesAsSeen(JSON.stringify(conversationData.id), JSON.stringify(user.id))
    }

    navigate(`/conversation/?conversation-id=${conversationId}`)
  }, [location.search])

  const handleScroll = () => {
    const container = messageContainerRef.current
    if (container && container.scrollTop < 100 && hasNextPage) {
      getOlderMessages()
    }
  }

  const passUser = (id: number): { user: Participant; isActive: boolean } => {
    const [user] = conversationData.participants.filter((p) => p.id === id)
    const isActive = activeParticipants.includes(user.id)
    return { user, isActive }
  }

  const participantsAsString = (): string => {
    return conversationData.participants
      .filter((p) => p.username !== user.username)
      .map((p) => p.username)
      .toString()
  }

  // TODO: ERROR HANDLING
  // no error handling if error occurs on sending message
  // conversation is still updated optimistically
  return (
    <div className="flex h-[20rem] w-full flex-grow flex-col p-4">
      <div className="flex h-12 justify-between border-b-4">
        <p className="text-xl font-bold text-shl">{extractConversationName()}</p>
        <GoPeople className="mr-4 text-4xl text-secondary" title={participantsAsString()} />
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
        {conversationData?.messages?.length === 0 && (
          <p className="mt-12 self-center text-t-sec">Be the first to send a message :)</p>
        )}
        <div className="flex w-full flex-col-reverse">
          {isConnectionError && <ErrorTypography errorMessage="Error connecting WebSocket" />}
          {conversationData.messages.length > 0 &&
            conversationData.messages.map((m) => (
              <MessageBox message={m} senderUser={passUser(m.sender_id)} />
            ))}
        </div>
        <p>{isConnectionError}</p>
        <p>{isSendingMessageError}</p>
      </div>
      <InputMessageArea updateConversation={updateConversationOptimistically} />
    </div>
  )
}

export default ConversationContainer
