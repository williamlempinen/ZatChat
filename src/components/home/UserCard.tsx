import { cn } from '../../lib/utils'
import { User } from '../../types/types'

type UserCardProps = {
  user: User
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className={cn('flex w-full p-2', 'hover:cursor-pointer hover:shadow hover:shadow-t-sec')}>
      <p>{user.username}</p>
    </div>
  )
}

export default UserCard
