import * as React from 'react'
import { Conversation } from '../../types/types'
import { useLocation } from 'react-router-dom'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import PrimaryButton from '../ui/PrimaryButton'

const ConversationContainer = () => {
  const [messagesPageNumber, setMessagesPageNumber] = React.useState<number>(2)
  const [hasNextPage, setHasNextPage] = React.useState<boolean>(true)
  const [totalPages, setTotalPages] = React.useState<number>(1)

  const location = useLocation()
  const conversation = location.state?.conversation as Conversation

  const { getMessages } = nodeServerApi()

  const getOlderMessages = async () => {
    const response = await getMessages(conversation.id, messagesPageNumber)
    const res = response.data

    if (res.data.length === 0) {
      setHasNextPage(false)
      console.log('WAS LAST PAGE')
    }

    setMessagesPageNumber((prev) => prev + 1)
    setTotalPages(res.data.totalPages)
    console.log('RESPONSE DATA: ', res)
    return []
  }

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const conversationId = searchParams.get('conversation-id')

    if (!conversation) {
      console.log('NO CONVERSATION')
    } else {
      console.log('CONVERSATION IN HERE: ', conversation)
    }

    console.log('SEARCH PARAMS: ', searchParams, ' CONVO ID: ', conversationId)
  }, [])

  return (
    <div className="flex">
      <div className="container-top-info-bar"></div>
      <div className="flex flex-col">
        {conversation.messages.map((m) => (
          /*<MessageBox />*/
          <div className="m-2 border-2 border-shl">
            <p key={m.id}>{JSON.stringify(m)}</p>
          </div>
        ))}
        {conversation.messages.length === 30 && hasNextPage && (
          <PrimaryButton displayText="Get older messages" onClick={getOlderMessages} />
        )}
      </div>
    </div>
  )
}

export default ConversationContainer
