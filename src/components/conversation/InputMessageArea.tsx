import * as React from 'react'
import { useChat } from '../../lib/webSocket/ChatContext'
import { Message } from '../../types/types'
import Textarea from '../ui/Textarea'
import { useAuth } from '../../lib/AuthContext'
import { GoPaperAirplane } from 'react-icons/go'
import { GoMoveToTop } from 'react-icons/go'
import IconButton from '../ui/IconButton'

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
    <div className="mt-8 flex w-full items-center justify-center gap-2">
      <IconButton
        icon={<GoMoveToTop />}
        className="right-10 text-2xl"
        tooltip="No implementation in here :)"
        onClick={handleSendMessage}
      />
      <Textarea
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        onKeyDown={handleSendMessageByEnter}
        isError={isSendingMessageError}
        errorMessage="Error occurred when trying to send message"
      />
      <IconButton
        icon={<GoPaperAirplane />}
        className="right-10 text-2xl"
        tooltip="Send"
        onClick={handleSendMessage}
      />
    </div>
  )
}

export default InputMessageArea
