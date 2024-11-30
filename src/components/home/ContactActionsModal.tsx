import * as React from 'react'
import { User } from '../../types/types'
import { cn } from '../../lib/utils'
import { GoPersonAdd } from 'react-icons/go'
import { GoCrossReference } from 'react-icons/go'
import { GoCommentDiscussion } from 'react-icons/go'
import { useAuth } from '../../lib/AuthContext'
import PrimaryButton from '../ui/PrimaryButton'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import { useNavigate } from 'react-router-dom'

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
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { user } = useAuth()

  const navigate = useNavigate()

  const modalRef = React.useRef<HTMLDialogElement>(null)

  const { getPrivateConversationId, createConversation, getConversation } = nodeServerApi()

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      close()
    }
  }

  const isAlreadyContact = () => {
    const ids = user?.contacts.map((c) => c.id)
    return ids.includes(modalUser.id)
  }

  const handleAddUserToContacts = () => {
    console.log('ADD USER')
    console.log(user)
    close()
  }

  const handleRemoveUserFromContacts = () => {
    console.log('REMOVE USER')
    close()
  }

  // server could handle, this
  // i.e. make only one request
  // enables nice use of useQuery
  const handleStartConversation = async () => {
    setIsLoading(true)

    const response = await getPrivateConversationId(user.id, modalUser.id)

    if (!response.data) {
      const createConversationResponse = await createConversation(
        false,
        [JSON.stringify(user.id), JSON.stringify(modalUser.id)],
        '',
      )
      const data = createConversationResponse.data

      setIsLoading(false)

      navigate(`/conversation/?conversation-id=${data.id}`, {
        state: { conversation: data },
      })
      return
    }

    const conversationData = await getConversation(response.data)

    setIsLoading(false)
    navigate(`/conversation/?conversation-id=${conversationData.data.id}`, {
      state: { conversation: conversationData.data },
    })
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
          <div className="flex flex-col p-2 sm:p-1">
            {actionView === ActionType.CONTACTS ? (
              <>
                {isAlreadyContact() ? (
                  <div>
                    <p>User is in your contacts</p>
                    <p>Want to remove them?</p>
                    <PrimaryButton
                      variant="error"
                      displayText="Remove"
                      onClick={handleRemoveUserFromContacts}
                    />
                  </div>
                ) : (
                  <>
                    <p>Add user to your contacts</p>
                    <PrimaryButton
                      variant="yellow"
                      displayText="Add"
                      onClick={handleAddUserToContacts}
                    />
                  </>
                )}
              </>
            ) : actionView === ActionType.CONVERSATION ? (
              <div>
                <p>Start conversation with {modalUser.username}</p>

                <PrimaryButton
                  variant="yellow"
                  displayText="Zat"
                  isLoading={isLoading}
                  onClick={handleStartConversation}
                />
              </div>
            ) : (
              <p>add to {modalUser.username} to a group</p>
            )}
          </div>
        </dialog>
      </div>
    )
  )
}

export default ContactActionsModal
