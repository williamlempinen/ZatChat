import * as React from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean
  errorMessage?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isError, errorMessage, ...props }, ref) => {
    return (
      <div>
        <textarea className={cn('text-t', className)} ref={ref} {...props}></textarea>
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

export default Textarea
