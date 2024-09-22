import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex h-full min-h-screen w-full items-start justify-center bg-base">
      <div className="flex h-full w-full max-w-[1800px] flex-col">{children}</div>
    </div>
  )
}

export default Layout
