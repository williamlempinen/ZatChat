import * as React from 'react'
import { Conversation, Message } from '../../types/types'
import { useLocation, useNavigate } from 'react-router-dom'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import MessageBox from './MessageBox'
import InputMessageArea from './InputMessageArea'
import { format } from 'date-fns'
import { useChat } from '../../lib/webSocket/ChatContext'

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

  const { isConnectionError, isSendingMessageError, isConnected } = useChat()

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

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const conversationId = searchParams.get('conversation-id')

    const container = messageContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }

    console.log('INITIAL MESSAGES: ', conversationData.messages)

    console.log('SEARCH PARAMS: ', searchParams, ' CONVO ID: ', conversationId)

    navigate(`/conversation/?conversation-id=${conversationId}`)
  }, [])

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

  const updateConversationOptimistically = (newMessage: Message) => {
    setConversationData((prev) => ({
      ...prev,
      messages: [newMessage, ...prev.messages],
    }))
  }

  // TODO: ERROR HANDLING
  return (
    <div className="flex h-[60rem] w-full flex-grow flex-col border-2 border-white p-4">
      <div className="h-12 border-b border-gray-300">
        <p className="text-xl font-bold">{conversationData.group_name}</p>
      </div>
      <div
        className="no-scrollbar flex h-full flex-col overflow-y-auto"
        ref={messageContainerRef}
        onScroll={handleScroll}
      >
        {!hasNextPage && !conversationData.is_group && (
          <p className="self-center text-t-sec">
            Conversation created at: {format(conversationData.created_at, 'dd-MM-yyyy')}
          </p>
        )}
        {!hasNextPage && conversationData.is_group && (
          <p className="self-center text-t-sec">
            Group created at: {format(conversationData.created_at, 'dd-MM-yyyy')}
          </p>
        )}
        <div className="flex w-full flex-col-reverse">
          {conversationData.messages.map((m) => (
            <MessageBox message={m} senderUser={passUser(m.sender_id)} />
          ))}
        </div>
        {isConnectionError && <p>ERROR IN WEBSOCKET CONNECTION</p>}
        <p>{isConnected}</p>
        <p>{isConnectionError}</p>
        <p>{isSendingMessageError}</p>
      </div>
      <InputMessageArea updateConversation={updateConversationOptimistically} />
    </div>
  )
}

export default ConversationContainer
