import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodSchema } from 'zod'
import { TimeVariantType } from '../types/types'
import { format, formatDistanceToNow } from 'date-fns'

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

export const formatTime = (variant: TimeVariantType = 'full', timeStamp: Date | string) => {
  const date = typeof timeStamp === 'string' ? new Date(timeStamp) : timeStamp

  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  if (variant === 'distance') {
    return `${formatDistanceToNow(timeStamp)} ago`
  }

  if (variant === 'dates') {
    return format(timeStamp, 'EEE / MMM')
  }

  if (variant === 'times') {
    return format(timeStamp, 'kk:mm')
  }

  return format(timeStamp, 'do MMM yyyy')
}
