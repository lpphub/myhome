import { ReactNode } from "react"
import { FixedHeader } from "./FixedHeader"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <FixedHeader />
      <main className="pt-16">{children}</main>
    </div>
  )
}
