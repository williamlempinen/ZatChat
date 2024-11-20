import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import PrimaryButton from './PrimaryButton'

const Header = () => {
  const { isAuthenticated, logout } = useAuth()

  const navigate = useNavigate()

  return (
    <div className="flex w-full justify-center rounded-bl rounded-br bg-base shadow shadow-base-dark">
      <div
        className={`flex w-full max-w-[1600px] ${isAuthenticated ? 'justify-between' : 'justify-start'} p-4`}
      >
        <h1 onClick={() => navigate('/home')} className="text-4xl text-hl hover:cursor-pointer">
          ZATCHAT
        </h1>
        {isAuthenticated && (
          <PrimaryButton
            className="bg-secondary text-gray-dark hover:bg-secondary-dark"
            displayText="Logout"
            onClick={logout}
          />
        )}
      </div>
    </div>
  )
}

export default Header
