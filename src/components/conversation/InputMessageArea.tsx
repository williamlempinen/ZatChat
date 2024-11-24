import * as React from 'react'
import { useChat } from '../../lib/webSocket/ChatContext'
import { Message } from '../../types/types'
import PrimaryButton from '../ui/PrimaryButton'
import Textarea from '../ui/Textarea'

const InputMessageArea = () => {
  const [textValue, setTextValue] = React.useState<string>('')

  const { sendMessage } = useChat()

  const to = '14'
  const message: Message = {
    content: 'Sika nauta vieti, sika nauta vieti aj jauheliha kastiketta perunoiden kanssa',
    conversation_id: 14,
    created_at: Date.prototype,
    id: 99,
    is_seen: false,
    sender_id: 6,
  }

  const handleSendMessage = () => {
    if (textValue.trim() === '') return

    sendMessage(to, message)
  }

  const handleSendMessageByEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('ENTER PRESSED, SENDING MESSAGE')
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex w-full justify-center gap-1">
      <p>Icon</p>
      <Textarea
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        onKeyDown={handleSendMessageByEnter}
      />
      <PrimaryButton displayText="Send" onClick={sendMessage(to, message)} />
      <p>Icon</p>
    </div>
  )
}

export default InputMessageArea
