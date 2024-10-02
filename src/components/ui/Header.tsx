import { useAuth } from '../../lib/AuthContext'
import PrimaryButton from './PrimaryButton'

const Header = () => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="flex w-full justify-center rounded shadow shadow-base-dark">
      <div
        className={`flex w-full max-w-[1600px] ${isAuthenticated ? 'justify-between' : 'justify-start'} p-4`}
      >
        <h1 className="text-4xl text-hl">ZATCHAT</h1>
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
