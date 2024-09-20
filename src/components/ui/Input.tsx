import * as React from 'react'
import { cn } from 'lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean
  errorMessage?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isError, errorMessage, ...props }, ref) => {
    return (
      <div>
        {isError && errorMessage && <p>{errorMessage}</p>}
        <input type={type} className={cn(className)} ref={ref} {...props} />
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
