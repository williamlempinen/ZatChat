import { z } from 'zod'

const AccessSchema = {
  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password incorrect'),
  }),
  signup: z.object({
    username: z.string().min(3, 'Username is too short'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password has to be min 8 characters'),
  }),
}

export default AccessSchema
