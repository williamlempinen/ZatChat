import { z } from 'zod'

const AccessSchema = {
  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password incorrect'),
  }),
  signup: z.object({
    username: z.string().min(1),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be atleast 8 characters long'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((val, ctx) => val === ctx.parent.password, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      }),
  }),
}

export default AccessSchema
