import { formatDate } from 'date-fns'
import { useAuth } from '../../lib/AuthContext'
import { formatTime } from '../../lib/utils'
import { AiFillGithub } from 'react-icons/ai'

const Footer = () => {
  const { user } = useAuth()

  const now = new Date()

  const handleSourceClick = () => {
    window.open('https://github.com/williamlempinen', '_blank')
  }

  return (
    <div className="flex w-full justify-center bg-base-light">
      <div className="grid h-32 w-full max-w-[1600px] grid-cols-3 place-items-center bg-base-light">
        <p className="text-sm text-t-sec">
          Logged in as <span className="text-shl">{user.username}</span>
        </p>
        <p className="text-sm text-t-sec">
          <span className="text-shl">{formatTime('full', now)}</span>
        </p>
        <AiFillGithub
          className="text-lg text-shl hover:cursor-pointer"
          onClick={handleSourceClick}
        />
      </div>
    </div>
  )
}

export default Footer
