import * as React from 'react'
import { cn } from '../../lib/utils'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  displayText: string
  isError?: boolean
  isLoading?: boolean
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, isError, isLoading, displayText, ...props }, ref) => {
    return (
      <div>
        <button
          className={cn(
            `rounded px-3 py-1 text-lg text-t ${isError ? 'bg-error' : 'bg-hl'}`,
            className,
          )}
          ref={ref}
          {...props}
        >
          {displayText}
          {isLoading && <span>Spinner</span>}
        </button>
      </div>
    )
  },
)

PrimaryButton.displayName = 'PrimaryButton'

export default PrimaryButton
