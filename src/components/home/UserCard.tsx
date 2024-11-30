import * as React from 'react'
import { useAuth } from '../../lib/AuthContext'
import { cn, formatTime } from '../../lib/utils'
import { User } from '../../types/types'
import { GoSmiley } from 'react-icons/go'
import ContactActionsModal from './ContactActionsModal'

type UserCardProps = {
  searchedUser: User
}

const UserCard = ({ searchedUser }: UserCardProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const { user } = useAuth()

  if (searchedUser.id === user.id) return

  const isInContacts = () => {
    const contacts = user.contacts.map((c) => c.id)
    return contacts.includes(searchedUser.id)
  }

  return (
    <div
      className={cn(
        'grid w-full grid-cols-2 grid-rows-1 p-2 sm:grid-cols-4',
        'hover:cursor-pointer hover:shadow hover:shadow-t-sec',
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <ContactActionsModal
        open={isOpen}
        close={() => setIsOpen(!isOpen)}
        modalUser={searchedUser}
      />
      <div className="flex items-center gap-2">
        <div
          className={cn('h-3 w-3 rounded-full', searchedUser.is_active ? 'bg-success' : 'bg-error')}
        ></div>
        <p className="font-bold text-secondary">{searchedUser.username}</p>
      </div>
      <p className="hidden self-center text-xs underline sm:block">
        Joined {formatTime('distance', searchedUser.created_at)}
      </p>
      <span className={cn(isInContacts() ? 'text-success' : 'text-error', 'hidden sm:block')}>
        {isInContacts() ? 'In contacts' : 'No a contact'}
      </span>
      {searchedUser.profile_picture_url ? (
        <span>pic</span>
      ) : (
        <GoSmiley className="self-center justify-self-end text-lg text-shl" />
      )}
    </div>
  )
}

export default UserCard
