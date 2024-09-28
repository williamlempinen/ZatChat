import PrimaryButton from '../../components/ui/PrimaryButton'
import Textarea from '../../components/ui/Textarea'

type UserSignupDetails = {
  email: string
  username: string
  password: string
}

const Signup = () => {
  const testButton = () => {
    console.log('Button clicked')
  }

  return (
    <div>
      <p>Signup, hello</p>
      <Textarea />
      <PrimaryButton onClick={testButton} displayText="Button" />
    </div>
  )
}

export default Signup
