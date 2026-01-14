import { Outlet } from 'react-router'
import Navigation from './Navigation'

export default function MainLayout() {
  return (
    <>
      {/* 顶部导航 */}
      <Navigation />

      {/* 主内容区域 */}
      <main className='pt-16 pb-20 h-[calc(100vh-5rem)] overflow-y-auto'>
        <Outlet />
      </main>
    </>
  )
}
