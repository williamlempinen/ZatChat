import * as React from 'react'
import { Conversation } from '../../types/types'
import ConversationBox from './ConversationBox'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../lib/AuthContext'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import PrimaryButton from '../ui/PrimaryButton'
import Loading from '../ui/Loading'

const Root = ({ children }: React.PropsWithChildren) => (
  <div className="flex flex-col rounded bg-base-light p-2">{children}</div>
)

const PreviousConversations = () => {
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  const [conversationsPageNumber, setConversationsPageNumber] = React.useState<number>(1)
  const [hasNextPage, setHasNextPage] = React.useState<boolean>(false)
  const [totalPages, setTotalPages] = React.useState<number>(1)

  const { user } = useAuth()

  const { getConversations } = nodeServerApi()

  const handlePreviousConversations = async () => {
    if (conversationsPageNumber > totalPages) return []

    const response = await getConversations(user.id, conversationsPageNumber)

    if (response.data.hasNextPage) {
      setHasNextPage(true)
    } else {
      setHasNextPage(false)
    }
    setTotalPages(response.data.totalPages)
    setConversationsPageNumber((prev) => prev + 1)
    setConversations((prev) => [...prev, ...response.data.data])
    // part of the comment below
    return []
  }

  const {
    // workaround because Tanstack v5 sucks
    data: emptyArray,
    isLoading,
    isError,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ['get-previous-conversations', `user id ${user.id}`],
    queryFn: () => handlePreviousConversations(),
  })

  // there is issues in loading
  // same loading is used with root and when fetching
  // more conversation

  if (isLoading) {
    return (
      <Root>
        <Loading />
      </Root>
    )
  }

  if (isError) {
    return (
      <Root>
        <span>Oops... this is error is from our side</span>
      </Root>
    )
  }

  return (
    <Root>
      {conversations.length > 0 ? (
        conversations.map((conversation: Conversation) => (
          <ConversationBox key={conversation.id} conversation={conversation} />
        ))
      ) : (
        <div>{!isLoading && <p>You don't yet have any ongoing conversations</p>}</div>
      )}
      {hasNextPage && (
        <PrimaryButton
          displayText="Show older conversations"
          onClick={() => handlePreviousConversations()}
        />
      )}
      {isLoading && <Loading />}
    </Root>
  )
}

export default PreviousConversations
