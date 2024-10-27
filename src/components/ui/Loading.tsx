import { cn } from '../../lib/utils'

type LoadingProps = {
  height?: string
  width?: string
  className?: string
}

const Loading = ({ height = '3rem', width = '100%', className }: LoadingProps) => {
  return (
    <div className={cn(`animate-pulse rounded bg-gray`, className)} style={{ height, width }}></div>
  )
}

export default Loading
