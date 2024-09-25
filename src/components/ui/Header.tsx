import { useAuth } from '../../lib/AuthContext'

const Header = () => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="flex w-full justify-center rounded shadow shadow-base-dark">
      <div
        className={`flex w-full max-w-[1600px] ${isAuthenticated ? 'justify-between' : 'justify-start'} p-4`}
      >
        <h1 className="text-4xl text-hl">ZATCHAT</h1>
        {isAuthenticated && <button onClick={logout}>Logout</button>}
      </div>
    </div>
  )
}

export default Header
