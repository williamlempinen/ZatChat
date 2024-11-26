import * as React from 'react'
import { useChat } from '../../lib/webSocket/ChatContext'
import { Message } from '../../types/types'
import Textarea from '../ui/Textarea'
import { useAuth } from '../../lib/AuthContext'

type InputMessageAreaProps = {
  updateConversation: (message: Message) => void
}

const InputMessageArea = ({ updateConversation }: InputMessageAreaProps) => {
  const [textValue, setTextValue] = React.useState<string>('')

  const { sendMessage, conversationId, isSendingMessageError, isConnectionError } = useChat()

  const { user } = useAuth()

  const handleSendMessage = () => {
    if (textValue.trim() === '') return

    // send complete Message type to support optimistic updates
    const message = {
      content: textValue.trim(),
      conversation_id: parseInt(conversationId),
      created_at: new Date(),
      id: Date.now(),
      is_seen: false,
      sender_id: user.id,
    }

    sendMessage(message)
    setTextValue('')

    if (!isSendingMessageError) {
      updateConversation(message)
    }
  }

  const handleSendMessageByEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSendingMessageError && !isConnectionError) {
      console.log('ENTER PRESSED, SENDING MESSAGE')
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="mt-8 flex w-full justify-center gap-1">
      <p>Icon</p>
      <Textarea
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        onKeyDown={handleSendMessageByEnter}
        isError={isSendingMessageError}
        errorMessage="Error occurred when trying to send message"
      />
      <p>Icon</p>
    </div>
  )
}

export default InputMessageArea
