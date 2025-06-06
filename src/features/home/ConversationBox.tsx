import * as React from 'react'
import { Conversation } from '../../types/types'
import { useAuth } from '../../lib/AuthContext'
import Cookies from 'js-cookie'
import { cn, formatTime } from '../../lib/utils'
import { useNavigate } from 'react-router-dom'

type ConversationBoxProps = {
  conversation: Conversation
}

const ConversationBox = ({ conversation }: ConversationBoxProps) => {
  const { logout, user } = useAuth()

  const navigate = useNavigate()

  const extractConversationName = (): string => {
    if (!conversation.group_name.includes('<>')) return conversation.group_name

    const participants = conversation.group_name.split('<>').map((name) => name.trim())
    return participants.find((name) => name !== user.username) || 'Unknown'
  }

  const openConversation = () => {
    const token = Cookies.get('accessToken')

    if (!token) {
      logout()
      return
    }

    navigate(`/conversation/?conversation-id=${conversation.id}`, { state: { conversation } })
  }

  const filteredParticipants = conversation.participants.filter(
    (participant) => participant.username !== user.username,
  )

  // create css transformation
  return (
    <div
      onClick={openConversation}
      className={cn(
        'grib-cols-2 my-1 grid rounded bg-base-dark p-2 sm:grid-cols-3',
        'hover:cursor-pointer hover:shadow hover:shadow-t-sec',
      )}
    >
      <p className="text-3xl font-bold">{extractConversationName()}</p>
      <p className="hidden font-bold underline sm:block">
        {' '}
        {formatTime('distance', conversation.updated_at)}
      </p>
      <p className="mr-8 self-center justify-self-end text-2xl text-secondary underline">
        {conversation.unread_count}
      </p>
      {conversation.is_group && (
        <div className="flex gap-1">
          {filteredParticipants.slice(0, 2).map((participant, index) => (
            <p key={participant.id} className="text-t-sec">
              {index > 0 ? `, ${participant.username}` : participant.username}
            </p>
          ))}
          {filteredParticipants.length > 2 && <span className="text-t-sec">...</span>}
        </div>
      )}
    </div>
  )
}

export default ConversationBox
