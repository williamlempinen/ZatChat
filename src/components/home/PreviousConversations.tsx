import * as React from 'react'
import { Conversation } from '../../types/types'
import ConversationBox from './ConversationBox'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../lib/AuthContext'
import { nodeServerApi } from '../../lib/api/nodeServerApi'

const Root = ({ children }: React.PropsWithChildren) => (
  <div className="flex flex-col rounded border-2 border-hl p-2 shadow shadow-shl">{children}</div>
)

const PreviousConversations = () => {
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  const [conversationsPageNumber, setConversationsPageNumber] = React.useState<number>(1)
  const [hasNextPage, setHasNextPage] = React.useState<boolean>(false)

  const { user } = useAuth()

  const { getConversations } = nodeServerApi()

  const handlePreviousConversations = async () => {
    const response = await getConversations(user.id, conversationsPageNumber)

    if (response.data.hasNextPage) {
      setHasNextPage(true)
    } else {
      setHasNextPage(false)
    }

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
    queryKey: ['get-previous-conversations', user.id],
    queryFn: () => handlePreviousConversations(),
  })

  if (isLoading) {
    return (
      <Root>
        <span>Loading...</span>
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
          <ConversationBox conversation={conversation} />
        ))
      ) : (
        <div>
          <p>You don't yet have any ongoing conversations</p>
        </div>
      )}
      {hasNextPage && <button onClick={() => handlePreviousConversations()}>Get more</button>}
    </Root>
  )
}

export default PreviousConversations
