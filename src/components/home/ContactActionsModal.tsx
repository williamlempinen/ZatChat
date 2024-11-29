import * as React from 'react'
import { User } from '../../types/types'
import { cn } from '../../lib/utils'

type ContactActionsModalProps = {
  user: User
  open: boolean
  close: () => void
}

enum ActionType {
  CONTACTS = 1,
  CONVERSATION = 2,
  ADD_TO_CONVERSATION = 3,
}

const ContactActionsModal = ({ user, open, close }: ContactActionsModalProps) => {
  const [actionView, setActionView] = React.useState<ActionType>(ActionType.CONTACTS)

  const modalRef = React.useRef<HTMLDialogElement>(null)

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      close()
    }
  }

  return (
    open && (
      <div
        onClick={handleClickOutside}
        className="fixed inset-0 z-50 flex justify-center bg-gray bg-opacity-5 pt-[12rem]"
      >
        <dialog
          ref={modalRef}
          open={open}
          className="flex h-[30%] max-h-[20rem] w-[40%] max-w-[50rem] flex-col rounded bg-base-dark p-2"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex h-8 w-full justify-evenly rounded-md">
            <button
              onClick={() => setActionView(ActionType.CONTACTS)}
              className={cn(
                'w-full rounded-bl rounded-tl shadow transition-colors duration-300',
                actionView === ActionType.CONTACTS
                  ? 'bg-base-dark text-secondary'
                  : 'bg-base-light text-t',
              )}
            >
              Add to contacts
            </button>
            <button
              onClick={() => setActionView(ActionType.CONVERSATION)}
              className={cn(
                'w-full rounded-bl rounded-tl shadow transition-colors duration-300',
                actionView === ActionType.CONVERSATION
                  ? 'bg-base-dark text-secondary'
                  : 'bg-base-light text-t',
              )}
            >
              Start conversation
            </button>
            <button
              onClick={() => setActionView(ActionType.ADD_TO_CONVERSATION)}
              className={cn(
                'w-full rounded-br rounded-tr shadow transition-colors duration-300',
                actionView === ActionType.ADD_TO_CONVERSATION
                  ? 'bg-base-dark text-secondary'
                  : 'bg-base-light text-t',
              )}
            >
              Add to a conversation
            </button>
          </div>
        </dialog>
      </div>
    )
  )
}

export default ContactActionsModal
