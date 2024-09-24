import * as React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="min-w-screen flex min-h-screen flex-col justify-center bg-base">
      <Header />
      <div className="flex h-full w-full flex-1 justify-center">
        <div className="w-full max-w-[1600px] p-4">{children}</div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
