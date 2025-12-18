import { Outlet } from 'react-router'
import Navigation from './Navigation'

function MainLayout() {
  return (
    <>
      {/* 顶部导航 */}
      <Navigation />

      {/* 主内容区域 */}
      <main className="pt-16 md:pt-16">
        {/* 为移动端底部导航留出空间 */}
        <div className="pb-16 md:pb-0">
          <Outlet />
        </div>
      </main>
    </>
  )
}

export default MainLayout
