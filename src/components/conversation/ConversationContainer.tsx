import { Message } from 'postcss'
import * as React from 'react'

type MessageInfo = {
  messages: Message[]
  metadata: string
}

const ConversationContainer = (messageInfo: MessageInfo) => {
  return (
    <div className="flex">
      <div className="container-top-info-bar"></div>
      <div className="discussion-are"></div>
    </div>
  )
}

export default ConversationContainer
