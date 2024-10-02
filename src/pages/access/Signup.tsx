import * as React from 'react'
import PrimaryButton from '../../components/ui/PrimaryButton'
import AccessSchema from './schema'
import { useAuth } from '../../lib/AuthContext'
import { validator } from '../../lib/utils'
import Input from '../../components/ui/Input'

type UserSignupDetails = {
  email: string
  username: string
  password: string
}

const Signup = () => {
  const [credentials, setCredentials] = React.useState<UserSignupDetails>({
    username: '',
    email: '',
    password: '',
  })
  const [formErrors, setFormErrors] = React.useState<
    Partial<Record<keyof UserSignupDetails, string>>
  >({})

  const { user, signup } = useAuth()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    console.log('Name: ', name, ', value: ', value)

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const { isValid, errors } = validator(AccessSchema.signup, credentials)
    setFormErrors(errors)
    console.log('Errors: ', errors)

    if (!isValid) {
      console.log('Form not valid')
      return
    }

    console.log('Form is valid')

    // signup not yet implemented
    const signupSuccess = await signup(credentials)

    if (!signupSuccess) {
      console.log('Signup failed')
      return
    }

    console.log('SIGNUP SUCCESS')
  }

  const testButton = () => {
    console.log('Button clicked')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full w-full flex-col place-items-center gap-4 rounded-lg bg-base-dark p-2 shadow"
    >
      <p className="mb-6 text-lg font-bold text-secondary">Enter your credentials for signup</p>
      <Input
        type="text"
        name="username"
        value={credentials.username}
        onChange={handleInputChange}
        placeholder="Username"
        isError={!!formErrors.username}
        errorMessage={formErrors.username}
      />
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
      <PrimaryButton type="submit" displayText="Signup" />
    </form>
  )
}

export default Signup
