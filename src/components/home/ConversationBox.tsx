import * as React from 'react'
import { Conversation } from '../../types/types'
import { useAuth } from '../../lib/AuthContext'
import connectWebSocket from '../../lib/webSocket/webSocketClient'
import Cookies from 'js-cookie'
import { format } from 'date-fns'
import { cn } from '../../lib/utils'
import { useNavigate } from 'react-router-dom'

type ConversationBoxProps = {
  conversation: Conversation
}

const ConversationBox = ({ conversation }: ConversationBoxProps) => {
  const [isErrorOpeningConnection, setIsErrorOpeningConnection] = React.useState<boolean>(false)

  const { logout } = useAuth()

  const navigate = useNavigate()

  const extractConversationName = (): string => {
    if (!conversation.group_name.includes('<>')) return conversation.group_name
    return conversation.group_name.split('<>')[1].trim()
  }

  const openConversation = () => {
    const token = Cookies.get('accessToken')

    if (!token) {
      logout()
      return
    }

    const ws = connectWebSocket(token)
    if (!ws) {
      setIsErrorOpeningConnection(true)
      return
    }

    console.log('WS: ', ws)
    navigate(`/conversation/?conversation-id=${conversation.id}`, { state: { conversation } })
  }

  return (
    <div
      onClick={() => openConversation()}
      className={cn('my-1 grid grid-cols-2 rounded bg-base-dark p-2 shadow-md shadow-base-light')}
    >
      <p className="text-3xl font-bold">{extractConversationName()}</p>
      <p className="font-bold underline">{`Last message: ${format(new Date(conversation.updated_at), 'kk:mm | dd-MM')}`}</p>
      {conversation.is_group && (
        <div className="flex gap-1">
          {conversation.participants.slice(0, 3).map((p, index) => (
            <p key={p.id}>
              {p.username}
              {index < 2 ? ',' : ''}
            </p>
          ))}
          {conversation.participants.length > 3 && <span>...</span>}
        </div>
      )}
      {isErrorOpeningConnection && (
        <p>Oops... error occured when trying to establish connection to conversation</p>
      )}
    </div>
  )
}

export default ConversationBox
