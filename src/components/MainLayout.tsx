import { Outlet } from 'react-router'
import Navigation from './navigation'

export default function MainLayout() {
  return (
    <div className='flex flex-col h-screen'>
      <Navigation />

      <main className='flex-1 overflow-y-auto pt-16 md:pb-0 pb-12'>
        <Outlet />
      </main>
    </div>
  )
}
