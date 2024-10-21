import * as React from 'react'
import { Conversation } from '../../types/types'
import { useAuth } from '../../lib/AuthContext'
import connectWebSocket from '../../lib/webSocket/webSocketClient'
import Cookies from 'js-cookie'
import { format } from 'date-fns'

type ConversationBoxProps = {
  conversation: Conversation
}

const ConversationBox = ({ conversation }: ConversationBoxProps) => {
  const { user } = useAuth()

  const checkConversationName = (): string => {
    if (!conversation.group_name.includes('<>')) return conversation.group_name
    return conversation.group_name.split('<>')[1].trim()
  }

  const connect = () => {
    const token = Cookies.get('accessToken')
    if (!token) {
      console.log('NO TOKEN FOUND')
      return
    }

    connectWebSocket(token)
  }

  return (
    <div
      onClick={() => connect()}
      className="my-1 grid grid-cols-2 rounded bg-base-dark p-2 shadow-md shadow-base-light"
    >
      <p>{checkConversationName()}</p>
      <p>{format(new Date(conversation.updated_at), 'kk:mm | dd-MM')}</p>
      <p>my id: {user.id}</p>
    </div>
  )
}

export default ConversationBox
