import Header from '../components/ui/Header'
import { useToggle } from '../hooks/useToggle'
import Signup from './access/Signup'
import Login from './access/Login'
import Footer from '../components/ui/Footer'

const Access = () => {
  const { state: isSignup, toggle } = useToggle(false, true)

  return (
    <>
      <div className="my-16 flex h-full w-full flex-col items-center gap-6 border-2 border-error p-2">
        <div className="flex w-full justify-evenly border-2 border-success">
          <button onClick={toggle}>Login</button>
          <button onClick={toggle}>Signup</button>
        </div>
        <div className="flex w-full max-w-lg items-center justify-center">
          {isSignup ? <Signup /> : <Login />}
        </div>
      </div>
    </>
  )
}

export default Access
