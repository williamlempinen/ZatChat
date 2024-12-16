import * as React from 'react'
import PrimaryButton from '../../components/ui/PrimaryButton'
import AccessSchema from './schema'
import { useAuth } from '../../lib/AuthContext'
import { validator } from '../../lib/utils'
import Input from '../../components/ui/Input'
import { useMutation } from '@tanstack/react-query'

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

  const { signup } = useAuth()

  const {
    mutate: postSignup,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationKey: ['signup'],
    mutationFn: (credentials: UserSignupDetails) => signup(credentials),
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const { isValid, errors } = validator(AccessSchema.signup, credentials)
    setFormErrors(errors)

    if (!isValid) return

    postSignup(credentials)
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
      {isPending && <span>Loading...</span>}
      {isError && <span>Oops... this error is from our side</span>}
      {isSuccess && <span>Singup succeed, now use your credentials to login</span>}
    </form>
  )
}

export default Signup
