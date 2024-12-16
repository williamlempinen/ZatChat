import * as React from 'react'
import { Conversation } from '../../types/types'
import ConversationBox from './ConversationBox'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../lib/AuthContext'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import PrimaryButton from '../../components/ui/PrimaryButton'
import Loading from '../../components/ui/Loading'
import ErrorTypography from '../../components/ui/ErrorTypography'

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

  const updateUnreadCounts = (conversations: Conversation[], userId: number) => {
    return conversations.map((conversation) => {
      const unreadCount = conversation.messages.filter(
        (message) => !message.is_seen_by.includes(userId),
      ).length

      return {
        ...conversation,
        unread_count: unreadCount,
      }
    })
  }

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

    const updatedConversations = updateUnreadCounts(response.data.data, user.id)

    setConversations((prev) => [...prev, ...updatedConversations])
    // part of the comment below
    return []
  }

  const {
    // workaround because Tanstack v5 sucks
    data: emptyArray,
    isLoading,
    isError,
    isFetching,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ['get-previous-conversations', `user id ${user.id}`],
    queryFn: () => handlePreviousConversations(),
    refetchOnWindowFocus: false,
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
        <ErrorTypography />
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
        <div>
          {!isLoading && conversations.length === 0 && !isFetching && (
            <p>You don't yet have any ongoing conversations</p>
          )}
        </div>
      )}
      {hasNextPage && (
        <PrimaryButton
          displayText="Show older conversations"
          onClick={() => handlePreviousConversations()}
        />
      )}
      {(isLoading || isFetching) && <Loading />}
    </Root>
  )
}

export default PreviousConversations
