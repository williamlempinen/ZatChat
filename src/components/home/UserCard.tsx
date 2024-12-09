import * as React from 'react'
import { useAuth } from '../../lib/AuthContext'
import { cn, formatTime } from '../../lib/utils'
import { Contact, User } from '../../types/types'
import { GoSmiley } from 'react-icons/go'
import ContactActionsModal from './ContactActionsModal'

type UserCardProps = {
  searchedUser: User
}

const UserCard = ({ searchedUser }: UserCardProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const { user } = useAuth()

  const [contactIds, setContactIds] = React.useState<number[]>(
    user.contacts.map((c) => c.contact_id),
  )

  if (searchedUser.id === user.id) return

  const isInContacts = () => {
    return contactIds.includes(searchedUser.id)
  }

  const handleChangeInContacts = (contactId: number, isAdd: boolean) => {
    if (isAdd) {
      setContactIds((prev) => [...prev, contactId])
      return
    }

    setContactIds((prev) => prev.filter((id) => id !== contactId))
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
        closeModal={() => setIsOpen(!isOpen)}
        modalUser={searchedUser}
        onUpdateContacts={handleChangeInContacts}
        contactIds={contactIds}
      />
      <div className="flex items-center gap-2">
        <div
          title={searchedUser.is_active ? 'Online' : 'Offline'}
          className={cn('h-3 w-3 rounded-full', searchedUser.is_active ? 'bg-success' : 'bg-error')}
        ></div>
        <p className="font-bold text-secondary">{searchedUser.username}</p>
      </div>
      <p className="hidden self-center text-xs underline sm:block">
        Joined {formatTime('distance', searchedUser.created_at)}
      </p>
      <span className={cn(isInContacts() ? 'text-success' : 'text-error', 'hidden sm:block')}>
        {isInContacts() ? 'In contacts' : 'Not a contact'}
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
