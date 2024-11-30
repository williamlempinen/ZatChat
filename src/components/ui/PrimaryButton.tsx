import * as React from 'react'
import { cn } from '../../lib/utils'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'light-blue' | 'yellow' | 'error'
  displayText: string
  isError?: boolean
  isLoading?: boolean
  loadingIcon?: React.ReactNode
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      className,
      disabled,
      isError,
      isLoading,
      loadingIcon,
      displayText,
      variant,
      onClick,
      ...props
    },
    ref,
  ) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'error':
          return 'bg-error hover:bg-error-dark'
        case 'light-blue':
          return 'bg-shl hover:bg-shl-light'
        case 'yellow':
          return 'bg-secondary hover:bg-secondary-dark'
        default:
          return 'bg-hl hover:bg-hl-dark'
      }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (isLoading) {
        event.preventDefault()
        return
      }
      if (onClick) onClick(event)
    }

    return (
      <div className="relative">
        <button
          className={cn(
            'gap 2 flex h-full w-full items-center justify-center whitespace-nowrap rounded px-3 py-1 text-lg text-t',
            'transition duration-100 ease-in-out',
            !disabled && 'hover:scale-101 hover:bg-hl',
            `${isError && !disabled ? 'bg-error' : getVariantClasses()}`,
            `${disabled && 'bg-gray opacity-disabled transition-none'}`,
            className,
          )}
          disabled={disabled}
          ref={ref}
          onClick={handleClick}
          {...props}
        >
          {isError && !isLoading ? (
            'Error'
          ) : (
            <>
              {isLoading && (
                <AiOutlineLoading3Quarters className="absolute top-[10px] size-[17px] animate-spin text-t" />
              )}
              <span className={cn(`text-white ${isLoading ? 'invisible' : ''}`, className)}>
                {displayText}
              </span>
            </>
          )}
        </button>
      </div>
    )
  },
)

PrimaryButton.displayName = 'PrimaryButton'

export default PrimaryButton
