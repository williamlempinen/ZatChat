import * as React from 'react'
import { Conversation } from '../../types/types'
import { useAuth } from '../../lib/AuthContext'
import connectWebSocket from '../../lib/webSocket/webSocketClient'
import Cookies from 'js-cookie'

type ConversationBoxProps = {
  conversation: Conversation
}

const ConversationBox = ({ conversation }: ConversationBoxProps) => {
  const { user } = useAuth()

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
      <p>{conversation.group_name}</p>
      <p>{JSON.stringify(conversation.created_at)}</p>
      <p>my id: {user.id}</p>
    </div>
  )
}

export default ConversationBox
