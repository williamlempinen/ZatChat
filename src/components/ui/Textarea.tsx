import * as React from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean
  errorMessage?: string
}

// create variant prop

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isError, errorMessage, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    // copy-paste GPT
    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement)

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = textareaRef.current
      if (!textarea) return

      textarea.style.height = 'auto'

      const minHeight = 2 * parseFloat(getComputedStyle(textarea).lineHeight || '20px')
      const maxHeight = 10 * parseFloat(getComputedStyle(textarea).lineHeight || '20px')
      const newHeight = Math.min(textarea.scrollHeight, maxHeight)

      textarea.style.height = `${Math.max(newHeight, minHeight)}px`
      textarea.style.overflowY = newHeight === maxHeight ? 'auto' : 'hidden'
    }

    return (
      <div className={cn('flex w-full flex-col', isError && 'rounded border-b-2 border-error')}>
        <textarea
          ref={textareaRef}
          className={cn(
            'no-scrollbar resize-none overflow-hidden rounded border bg-t p-2 leading-normal text-t-dark',
            'border-2 border-hl focus:border-shl',
            className,
          )}
          onInput={handleInput}
          style={{ minHeight: 'calc(2 * 1.5rem)', maxHeight: 'calc(10 * 1.5rem)' }}
          {...props}
        ></textarea>
        {isError && errorMessage && (
          <p className="mt-1 self-center text-sm text-error">{errorMessage}</p>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

export default Textarea
