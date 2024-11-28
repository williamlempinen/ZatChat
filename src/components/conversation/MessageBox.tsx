import { Message, Participant } from '../../types/types'
import { useAuth } from '../../lib/AuthContext'
import { cn, formatTime } from '../../lib/utils'
import { GoPersonFill } from 'react-icons/go'

type MessageBoxProps = {
  message: Message
  senderUser: Participant
}

const MessageBox = ({ message, senderUser }: MessageBoxProps) => {
  const { user } = useAuth()

  const isOwnMessage = senderUser.id === user.id && senderUser.username === user.username

  const isOnline = senderUser.is_active

  return (
    <div
      key={`${JSON.stringify(message.created_at)}-${message.sender_id}-${message.conversation_id}-${message.content}`}
      className={cn('m-2 flex', isOwnMessage ? 'justify-end' : 'justify-start')}
    >
      <fieldset className='border-red-500" flex max-w-[70%] flex-col gap-1 break-words rounded border-2 bg-base-light p-2 shadow-md shadow-t'>
        <legend
          className={cn(
            'flex px-1 font-bold text-shl',
            isOwnMessage ? 'text-shl' : 'text-secondary',
          )}
        >
          {senderUser.username}
          <GoPersonFill
            title={cn(isOnline ? 'Online' : 'Offline')}
            className={cn('ml-2 self-center text-lg', isOnline ? 'text-success' : 'text-error')}
          />
        </legend>
        <p className="break-words">{message.content}</p>
        <p className="text-sm text-t-sec">Sent: {formatTime('distance', message.created_at)}</p>
        <p>Is this message seen: {message.is_seen ? 'yes' : 'no'}</p>
      </fieldset>
    </div>
  )
}

export default MessageBox
