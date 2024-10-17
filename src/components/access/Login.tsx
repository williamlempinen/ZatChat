import * as React from 'react'
import Input from '../ui/Input'
import { validator } from '../../lib/utils'
import AccessSchema from './schema'
import { useAuth } from '../../lib/AuthContext'
import { nodeServerApi } from '../../lib/api/nodeServerApi'
import PrimaryButton from '../ui/PrimaryButton'
import { useMutation } from '@tanstack/react-query'

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

  const { testGetProtectedData } = nodeServerApi()

  const {
    mutate: postLogin,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ['login'],
    mutationFn: (credentials: UserLoginDetails) => login(credentials),
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
    console.log('Submitting')

    const { isValid, errors } = validator(AccessSchema.login, credentials)
    setFormErrors(errors)
    console.log('Errors: ', errors)

    if (!isValid) {
      console.log('Form not valid')
      return
    }

    console.log('Form is valid')

    postLogin(credentials)

    console.log('LOGIN SUCCESS')
  }

  const test = async () => {
    console.log('testing')
    const res = await testGetProtectedData()
    console.log('res: ', res)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full w-full flex-col place-items-center gap-4 rounded-lg bg-base-dark p-2 shadow"
    >
      <p className="mb-6 text-lg font-bold text-secondary">Enter your credentials</p>
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
      <PrimaryButton
        type="submit"
        displayText="Login"
        disabled={credentials.email === '' || credentials.password === ''}
      />
      {isPending && <span>Loading...</span>}
      {isError && <span>Oops... this is error is from our side</span>}
      <button onClick={test}>Test auth</button>
    </form>
  )
}

export default Login
