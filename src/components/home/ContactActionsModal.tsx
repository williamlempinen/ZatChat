import * as React from 'react'
import { User } from '../../types/types'
import { cn } from '../../lib/utils'
import { GoPersonAdd } from 'react-icons/go'
import { GoCrossReference } from 'react-icons/go'
import { GoCommentDiscussion } from 'react-icons/go'
import { useAuth } from '../../lib/AuthContext'
import PrimaryButton from '../ui/PrimaryButton'

type ContactActionsModalProps = {
  modalUser: User
  open: boolean
  close: () => void
}

enum ActionType {
  CONTACTS,
  CONVERSATION,
  ADD_TO_CONVERSATION,
}

const ContactActionsModal = ({ modalUser, open, close }: ContactActionsModalProps) => {
  const [actionView, setActionView] = React.useState<ActionType>(ActionType.CONTACTS)

  const { user } = useAuth()

  const modalRef = React.useRef<HTMLDialogElement>(null)

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      close()
    }
  }

  const isAlreadyContact = () => {
    const ids = user.contacts.map((c) => c.id)
    return ids.includes(modalUser.id)
  }

  const handleAddUserToContacts = () => {
    console.log('ADD USER')
  }

  const handleRemoveUserFromContacts = () => {
    console.log('REMOVE USER')
  }

  return (
    open && (
      <div
        onClick={handleClickOutside}
        className="fixed inset-0 z-50 flex justify-center bg-gray bg-opacity-15 pt-[12rem]"
      >
        <dialog
          ref={modalRef}
          open={open}
          className="flex h-[30%] max-h-[20rem] w-[40%] max-w-[50rem] flex-col rounded bg-base-dark p-2"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex h-auto w-full justify-evenly rounded-md">
            <button
              onClick={() => setActionView(ActionType.CONTACTS)}
              className={cn(
                'w-full rounded-bl rounded-tl p-1 shadow transition-colors duration-300',
                actionView === ActionType.CONTACTS ? 'bg-base-dark' : 'bg-base-light',
              )}
            >
              <span
                className={cn(
                  actionView === ActionType.CONTACTS ? 'text-secondary' : 'text-t',
                  'flex items-center justify-center',
                )}
              >
                {window.innerWidth >= 600 ? <>Add to contacts</> : <GoPersonAdd />}
              </span>
            </button>
            <button
              onClick={() => setActionView(ActionType.CONVERSATION)}
              className={cn(
                'w-full p-1 shadow transition-colors duration-300',
                actionView === ActionType.CONVERSATION ? 'bg-base-dark' : 'bg-base-light',
              )}
            >
              <span
                className={cn(
                  actionView === ActionType.CONVERSATION ? 'text-secondary' : 'text-t',
                  'flex items-center justify-center',
                )}
              >
                {window.innerWidth >= 600 ? <>Start a conversation</> : <GoCrossReference />}
              </span>
            </button>
            <button
              onClick={() => setActionView(ActionType.ADD_TO_CONVERSATION)}
              className={cn(
                'w-full rounded-br rounded-tr p-1 shadow transition-colors duration-300',
                actionView === ActionType.ADD_TO_CONVERSATION ? 'bg-base-dark' : 'bg-base-light',
              )}
            >
              <span
                className={cn(
                  actionView === ActionType.ADD_TO_CONVERSATION ? 'text-secondary' : 'text-t',
                  'flex items-center justify-center',
                )}
              >
                {window.innerWidth >= 600 ? (
                  <>Add to conversation</>
                ) : (
                  <GoCommentDiscussion className="text-lg" />
                )}
              </span>
            </button>
          </div>
          <div className="flex flex-col">
            {actionView === ActionType.CONTACTS ? (
              <>
                {isAlreadyContact() ? (
                  <div>
                    <p>User {modalUser.username} is in your contacts</p>
                    <p>Do you want to remove them from your contacts?</p>
                    <PrimaryButton
                      variant="error"
                      displayText="Remove from contacts"
                      onClick={handleRemoveUserFromContacts}
                    />
                  </div>
                ) : (
                  <>
                    <p>Add user {modalUser.username} to your contacts</p>
                    <PrimaryButton
                      variant="yellow"
                      displayText="Add"
                      onClick={handleAddUserToContacts}
                    />
                  </>
                )}
              </>
            ) : actionView === ActionType.CONVERSATION ? (
              <p>Conversation</p>
            ) : (
              <p>add to conversation</p>
            )}
          </div>
        </dialog>
      </div>
    )
  )
}

export default ContactActionsModal
