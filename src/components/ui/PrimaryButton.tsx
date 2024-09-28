import * as React from 'react'
import { cn } from '../../lib/utils'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  displayText: string
  isError?: boolean
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, isError, displayText, ...props }, ref) => {
    return (
      <div>
        <button className={cn('text-t', className)} ref={ref} {...props}>
          {displayText}
        </button>
      </div>
    )
  },
)

PrimaryButton.displayName = 'PrimaryButton'

export default PrimaryButton
