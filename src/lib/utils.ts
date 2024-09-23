import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodSchema } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validator = <T>(schema: ZodSchema<T>, data: T) => {
  const result = schema.safeParse(data)

  const errors: Partial<Record<keyof T, string>> = {}

  if (!result.success) {
    result.error.errors.forEach((err) => {
      const fieldName = err.path[0] as keyof T
      errors[fieldName] = err.message
    })
    return { isValid: false, errors }
  }

  return { isValid: true, errors }
}
