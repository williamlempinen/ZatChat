import * as React from 'react'
import { Conversation } from '../../types/types'
import { useAuth } from '../../lib/AuthContext'

type ConversationBoxProps = {
  conversation: Conversation
}

const ConversationBox = ({ conversation }: ConversationBoxProps) => {
  const { user } = useAuth()

  return (
    <div>
      <p>Hello world</p>
      <p>my id: {user.id}</p>
      <p>{conversation.group_name}</p>
      <p>#####</p>
    </div>
  )
}

export default ConversationBox
