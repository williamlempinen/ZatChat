import * as React from 'react'
import Input from '../ui/Input'
import IconButton from '../ui/IconButton'
import { GoPersonAdd } from 'react-icons/go'
import { useMutation } from '@tanstack/react-query'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import { cn } from '../../lib/utils'
import { useAuth } from '../../lib/AuthContext'
import PrimaryButton from '../ui/PrimaryButton'

type NewGroup = {
  name: string
  participants: string[]
}

const CreateGroup = () => {
  const [newGroupState, setNewGroupState] = React.useState<NewGroup>({
    name: '',
    participants: [],
  })
  const [nameError, setNameError] = React.useState<string>('')
  const [isValidToContinue, setIsValidToContinue] = React.useState<boolean>(false)

  const { user } = useAuth()

  const { createConversation } = nodeServerApi()

  const {
    mutate: createNewGroup,
    isPending,
    isError,
  } = useMutation({
    mutationKey: [`create-new-group-${newGroupState.name}`],
    mutationFn: () =>
      createConversation(
        true,
        [...newGroupState.participants, user.id.toString()], // include current user to the newly created group
        newGroupState.name,
      ),
  })

  const handleStartAddingContacts = () => {
    // could use validator here
    if (newGroupState.name.length < 3) {
      setNameError('Group name is too short')
      setIsValidToContinue(false)
      return
    }

    setNameError('')
    setIsValidToContinue(true)
  }

  const addUser = (id: number) => {
    if (newGroupState.participants.includes(id.toString())) return

    setNewGroupState((prev) => ({ ...prev, participants: [...prev.participants, id.toString()] }))
  }

  // successful group creations shoudl appear immediately in previous conversations
  return (
    <div className="h-auto w-full rounded bg-base-dark p-2 shadow">
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-4',
          'sm:flex-row sm:items-baseline sm:justify-evenly',
        )}
      >
        <Input
          type="text"
          name="email"
          placeholder="Group name"
          value={newGroupState.name}
          onChange={(event) =>
            setNewGroupState((prev) => ({ ...prev, name: event.target.value.trim() }))
          }
          isError={!!nameError}
          errorMessage={nameError}
        />
        <IconButton icon={<GoPersonAdd />} onClick={handleStartAddingContacts} />
      </div>
      <div className="mt-4 flex flex-col">
        {isValidToContinue && (user?.contacts?.length === 0 || user?.contacts === undefined) ? (
          <p className="self-center text-xs text-t-sec">Could not find any contacts</p>
        ) : (
          isValidToContinue &&
          user?.contacts?.map((p) => (
            <div
              className="flex p-2 hover:shadow hover:shadow-t"
              onClick={() => addUser(p.contact_id)}
            >
              <p key={p.id}>{p.username}</p>)
            </div>
          ))
        )}
        {newGroupState.participants.length > 0 && (
          <PrimaryButton
            displayText="Create group"
            isError={isError}
            isLoading={isPending}
            onClick={() => createNewGroup()}
          />
        )}
      </div>
    </div>
  )
}

export default CreateGroup
