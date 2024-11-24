import * as React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean
  errorMessage?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isError, errorMessage, value, ...props }, ref) => {
    return (
      <div className="relative mt-4">
        {isError && errorMessage && (
          <span className="absolute left-2 top-[-18px] text-[12px] text-error">{errorMessage}</span>
        )}
        <input
          type={type}
          className={cn(
            'flex w-full rounded border-2 border-hl',
            'p-1 shadow focus:border-shl focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            value === '' ? 'bg-base' : 'bg-t-sec',
            isError ? 'border-error' : '',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
