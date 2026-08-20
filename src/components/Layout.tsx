import type { ReactNode } from 'react'
import Nav from './Nav'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[150vh] flex-col bg-gray-1">
      <div className="w-full px-8 pt-12 sm:px-12">
        <Nav />
      </div>
      <div className="relative mx-auto w-full max-w-[1600px] flex-1 px-8 sm:px-16 lg:px-28 xl:px-40">{children}</div>
      <div className="w-full px-8 py-12 sm:px-12">
        <Footer />
      </div>
    </div>
  )
}
