import * as React from 'react'
import { Conversation } from '../../types/types'
import { useAuth } from '../../lib/AuthContext'

type ConversationBoxProps = {
  conversation: Conversation
}

const ConversationBox = ({ conversation }: ConversationBoxProps) => {
  const { user } = useAuth()

  return (
    <div className="my-1 grid grid-cols-2 rounded bg-base-dark p-2 shadow-md shadow-base-light">
      <p>{conversation.group_name}</p>
      <p>{conversation.created_at}</p>
      <p>my id: {user.id}</p>
    </div>
  )
}

export default ConversationBox
