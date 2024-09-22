import * as React from 'react'
import Input from '../../components/ui/Input'

type UserLoginDetails = {
  email: string
  password: string
}

const Login = () => {
  const [credentials, setCredentials] = React.useState<UserLoginDetails>({
    email: '',
    password: '',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="flex flex-col place-items-center border-4 border-shl bg-base-dark">
      <p>Login</p>
      <div>
        <p>Email</p>
        <Input
          type="text"
          name="email"
          value={credentials.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
      </div>
      <div>
        <p>Password</p>
        <Input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
      </div>
    </div>
  )
}

export default Login
