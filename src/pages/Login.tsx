import Input from '../components/ui/Input'

const Login = () => {
  return (
    <div className="border-1 flex flex-col place-items-center border-shl bg-base-dark">
      <p>Login</p>
      <div>
        <p>Email</p>
        <Input />
      </div>
      <div>
        <p>Password</p>
        <Input />
      </div>
    </div>
  )
}

export default Login
