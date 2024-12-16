import * as React from 'react'
import { Conversation, Participant, User } from '../../types/types'
import { cn } from '../../lib/utils'
import { GoPersonAdd } from 'react-icons/go'
import { GoCrossReference } from 'react-icons/go'
import { GoCommentDiscussion } from 'react-icons/go'
import { useAuth } from '../../lib/AuthContext'
import PrimaryButton from '../../components/ui/PrimaryButton'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import Loading from '../../components/ui/Loading'
import ErrorTypography from '../../components/ui/ErrorTypography'

type ContactActionsModalProps = {
  modalUser: User
  open: boolean
  closeModal: () => void
  onUpdateContacts: (contactId: number, isAdd: boolean) => void
  contactIds: number[]
}

enum ActionType {
  CONTACTS,
  CONVERSATION,
  ADD_TO_CONVERSATION,
}

// this file should be heavily refactored

const ContactActionsModal = ({
  modalUser,
  open,
  closeModal,
  onUpdateContacts,
  contactIds,
}: ContactActionsModalProps) => {
  const [actionView, setActionView] = React.useState<ActionType>(ActionType.CONTACTS)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { user } = useAuth()

  const navigate = useNavigate()

  const modalRef = React.useRef<HTMLDialogElement>(null)

  const {
    getPrivateConversationId,
    createConversation,
    getConversation,
    getGroupConversations,
    postAddUserToContacts,
    postDeleteUserFromContacts,
    postAddUserToGroup,
  } = nodeServerApi()

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal()
    }
  }

  const {
    mutate: addUserContactResponse,
    isPending: isLoadingAddContact,
    isError: isErrorAddingContact,
  } = useMutation({
    mutationKey: [`add-user-to-contacts-${user.username}-${modalUser.username}`],
    mutationFn: () => postAddUserToContacts(JSON.stringify(user.id), JSON.stringify(modalUser.id)),
    onSuccess: () => {
      onUpdateContacts(modalUser.id, true)
      closeModal()
    },
  })

  const {
    mutate: deleteUserFromContacts,
    isPending: isLoadingDeleteContact,
    isError: isErrorDeleteContact,
  } = useMutation({
    mutationKey: [`delete-user-from-contacts-${user.username}-${modalUser.username}`],
    mutationFn: () =>
      postDeleteUserFromContacts(JSON.stringify(user.id), JSON.stringify(modalUser.id)),
    onSuccess: () => {
      onUpdateContacts(modalUser.id, false)
      closeModal()
    },
  })

  const {
    mutate: addToGroup,
    isPending: isLoadingAddingToGroup,
    isError: isErrorAddingToGroup,
  } = useMutation({
    mutationKey: [`add-to-group-${modalUser.username}`],
    mutationFn: (conversationId: string) =>
      postAddUserToGroup(JSON.stringify(modalUser.id), conversationId),
    onSuccess: () => {
      closeModal()
    },
  })

  const {
    data: groupConversations,
    isLoading: isLoadingGroupConversations,
    isError: isErrorGroupConversations,
    refetch,
  } = useQuery({
    queryKey: [`get-group-conversations-user-${user.id}-${user.username}`],
    queryFn: () => getGroupConversations(JSON.stringify(user.id)),
  })

  const isAlreadyContact = () => {
    return contactIds.includes(modalUser.id)
  }

  const handleContactActions = async () => {
    if (isAlreadyContact()) {
      deleteUserFromContacts()
      return
    }

    addUserContactResponse()
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

  const handleAddUserToGroup = async (conversationId: number) => {
    addToGroup(JSON.stringify(conversationId))
  }

  const addableGroups = () => {
    return groupConversations?.data.filter(
      (g: Conversation) =>
        !g.participants.some((p: Participant) => p.username === modalUser.username),
    )
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
                {window.innerWidth >= 750 ? <>Add to contacts</> : <GoPersonAdd />}
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
                {window.innerWidth >= 750 ? <>Start a conversation</> : <GoCrossReference />}
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
                {window.innerWidth >= 750 ? (
                  <>Add to group</>
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
                      isLoading={isLoadingDeleteContact}
                      isError={isErrorDeleteContact}
                      onClick={handleContactActions}
                    />
                  </div>
                ) : (
                  <>
                    <p>Add user to your contacts</p>
                    <PrimaryButton
                      variant="yellow"
                      displayText="Add"
                      isLoading={isLoadingAddContact}
                      isError={isErrorAddingContact}
                      onClick={handleContactActions}
                    />
                  </>
                )}
              </>
            ) : actionView === ActionType.CONVERSATION ? (
              <>
                <p>Start Zat with {modalUser.username}</p>
                <PrimaryButton
                  variant="yellow"
                  displayText="Zat"
                  isLoading={isLoading}
                  onClick={handleStartConversation}
                />
              </>
            ) : (
              <>
                <p>Add to {modalUser.username} to a group</p>
                <div className="no-scrollbar flex h-full max-h-[12rem] w-full flex-col self-center overflow-y-auto">
                  {isLoadingGroupConversations && <Loading />}
                  {isErrorGroupConversations && !isLoadingGroupConversations && (
                    <PrimaryButton variant="error" displayText="Error" onClick={() => refetch()} />
                  )}
                  {!isErrorGroupConversations &&
                  !isLoadingGroupConversations &&
                  addableGroups()?.length === 0 ? (
                    <p className="my-2 self-center text-xs text-t-sec">
                      You don't have any created groups
                    </p>
                  ) : (
                    addableGroups()?.map((g: Conversation) => (
                      <div
                        key={`${g.id}-${g.group_name}`}
                        className="m-1 flex flex-col rounded bg-base-light p-1 hover:shadow hover:shadow-t"
                        onClick={() => handleAddUserToGroup(g.id)}
                      >
                        <p key={`${g.id}-${g.group_name}`}>{g.group_name}</p>
                        <p className="text-xs text-t-sec" key={`${g.id}-${g.group_name}`}>
                          {g.participants.length} members
                        </p>
                      </div>
                    ))
                  )}
                  {isErrorAddingToGroup && !isLoadingAddingToGroup && <ErrorTypography />}
                  {isLoadingAddingToGroup && <Loading />}
                </div>
              </>
            )}
          </div>
        </dialog>
      </div>
    )
  )
}

export default ContactActionsModal
