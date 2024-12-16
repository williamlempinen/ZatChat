import { useAuth } from '../lib/AuthContext'
import SearchUsers from '../features/home/SearchUsers'
import PreviousConversations from '../features/home/PreviousConversations'
import { useToggle } from '../hooks/useToggle'
import { cn } from '../lib/utils'
import CreateGroup from '../features/home/CreateGroup'

const Home = () => {
  const { state: isConversations, toggle } = useToggle(true, false)

  const { user } = useAuth()

  return (
    <div className="flex flex-col">
      <p className="text-bold text-2xl text-shl">Welcome {user.username}</p>
      <div className="flex h-8 w-full justify-evenly rounded-md">
        <button
          className={cn(
            'w-full rounded-bl rounded-tl shadow transition-colors duration-300',
            isConversations ? 'bg-base-dark text-secondary' : 'bg-base-light text-t',
          )}
          onClick={toggle}
        >
          Conversations
        </button>
        <button
          className={cn(
            'w-full rounded-br rounded-tr shadow transition-colors duration-300',
            !isConversations ? 'bg-base-dark text-secondary' : 'bg-base-light text-t',
          )}
          onClick={toggle}
        >
          Search Users
        </button>
      </div>
      {isConversations ? (
        <>
          <p className="mt-4">Your previous conversations</p>
          <hr />
          <PreviousConversations />
          <p className="mt-4">Create a group</p>
          <hr />
          <CreateGroup />
        </>
      ) : (
        <>
          <p className="mt-4">Search for new users to chat with</p>
          <hr />
          <SearchUsers />
        </>
      )}
    </div>
  )
}

export default Home
