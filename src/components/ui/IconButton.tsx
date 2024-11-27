import * as React from 'react'
import { cn } from '../../lib/utils'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  tooltip?: string
  isLoading?: boolean
  disabled?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, tooltip, isLoading, disabled, className, ...rest }, ref) => {
    return (
      <button
        className={cn(
          'flex h-9 w-10 items-center justify-center rounded-lg',
          'transition duration-100 ease-in-out',
          !disabled && 'hover:scale-105 hover:bg-hl',
          `${disabled && 'cursor-not-allowed bg-gray opacity-50'}`,
          `${!disabled && !isLoading && 'bg-hl-dark'}`,
          className,
        )}
        title={tooltip}
        ref={ref}
        disabled={disabled}
        {...rest}
      >
        {icon}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'

export default IconButton
