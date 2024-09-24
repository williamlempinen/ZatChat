import * as React from 'react'
import Input from '../../components/ui/Input'
import { validator } from '../../lib/utils'
import AccessSchema from './schema'
import { useAuth } from '../../lib/AuthContext'

type UserLoginDetails = {
  email: string
  password: string
}

const Login = () => {
  const [credentials, setCredentials] = React.useState<UserLoginDetails>({
    email: '',
    password: '',
  })
  const [formErrors, setFormErrors] = React.useState<
    Partial<Record<keyof UserLoginDetails, string>>
  >({})

  const { login } = useAuth()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log('Submitting')

    const { isValid, errors } = validator(AccessSchema.login, credentials)
    setFormErrors(errors)
    console.log('Errors: ', errors)

    if (!isValid) {
      console.log('Form not valid')
      return
    }

    console.log('Form is valid')

    await login(credentials.email, credentials.password)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full w-full flex-col place-items-center gap-2 rounded-lg bg-base-dark p-2 shadow shadow-shl"
    >
      <p className="mb-6 text-lg font-bold text-hl">Enter your credentials</p>
      <Input
        type="text"
        name="email"
        value={credentials.email}
        onChange={handleInputChange}
        placeholder="Email"
        isError={!!formErrors.email}
        errorMessage={formErrors.email}
      />
      <Input
        type="text" /*dev*/
        name="password"
        value={credentials.password}
        onChange={handleInputChange}
        placeholder="Password"
        isError={!!formErrors.password}
        errorMessage={formErrors.password}
      />
      <button type="submit">Login</button>
    </form>
  )
}

export default Login
