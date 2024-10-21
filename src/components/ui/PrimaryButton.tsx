import * as React from 'react'
import { cn } from '../../lib/utils'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  displayText: string
  isError?: boolean
  isLoading?: boolean
  loadingIcon?: React.ReactNode
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, disabled, isError, isLoading, loadingIcon, displayText, ...props }, ref) => {
    return (
      <div className="relative">
        <button
          className={cn(
            'gap 2 flex h-full w-full items-center justify-center whitespace-nowrap rounded px-3 py-1 text-lg text-t',
            'transition duration-100 ease-in-out',
            !disabled && 'hover:scale-101 hover:bg-hl',
            `${isError && !disabled ? 'bg-error' : 'bg-hl-dark'}`,
            `${disabled && 'bg-gray opacity-disabled transition-none'}`,
            className,
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        >
          {isError && !isLoading ? (
            'Error'
          ) : (
            <>
              {isLoading && (
                <AiOutlineLoading3Quarters className="absolute top-[10px] size-[17px] animate-spin text-t" />
              )}
              <span className={cn(`text-t ${isLoading ? 'invisible' : ''}`, className)}>
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
