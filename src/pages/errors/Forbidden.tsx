import { Home, RefreshCw, ShieldX } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/card'

export default function Forbidden() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-lg p-8 md:p-12 relative'>
        <div className='text-center space-y-6'>
          {/* 403 数字动画 */}
          <div className='relative h-32 flex items-center justify-center'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-9xl font-bold text-honey-200 select-none'>403</span>
            </div>
            <div className='absolute inset-0 flex items-center justify-center animate-bounce'>
              <span className='text-9xl font-bold text-lavender-600 select-none'>403</span>
            </div>
          </div>

          {/* 错误图标 */}
          <div className='w-20 h-20 mx-auto bg-lavender-100 rounded-full flex items-center justify-center'>
            <ShieldX className='w-10 h-10 text-lavender-500' />
          </div>

          {/* 错误信息 */}
          <div className='space-y-3'>
            <h1 className='text-3xl font-bold text-honey-700'>访问被拒绝</h1>
            <p className='text-warmGray-600 text-lg leading-relaxed'>
              抱歉！你没有权限访问这个页面。
              <br />
              请检查你的账户权限或联系管理员。
            </p>
          </div>

          {/* 操作按钮 */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
            <button
              type='button'
              onClick={handleGoHome}
              className='inline-flex items-center space-x-3 bg-linear-to-r from-lavender-400 to-lavender-500 text-gray-50 px-8 py-3 rounded-xl hover:from-lavender-500 hover:to-lavender-600 transition-all duration-300 shadow-lg hover:shadow-xl group'
            >
              <Home className='w-4 h-4 group-hover:scale-110 transition-transform' />
              <span className='font-medium'>返回首页</span>
            </button>
            <button
              type='button'
              onClick={handleRefresh}
              className='inline-flex items-center space-x-3 bg-linear-to-r from-honey-100 to-honey-200 text-honey-700 px-8 py-3 rounded-xl hover:from-honey-200 hover:to-honey-300 transition-all duration-300 shadow-warm-sm hover:shadow-warm-md border border-honey-300 group'
            >
              <RefreshCw className='w-4 h-4 group-hover:scale-110 transition-transform' />
              <span className='font-medium'>刷新页面</span>
            </button>
          </div>

          {/* 提示文字 */}
          <div className='text-sm text-warmGray-500 space-y-1'>
            <p>如果你认为这是一个错误，请联系我们</p>
            <div className='flex items-center justify-center gap-2 text-honey-600 hover:text-honey-700 transition-colors cursor-pointer'>
              <span>📧</span>
              <span>support@myhome.com</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
