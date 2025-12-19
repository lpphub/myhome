import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NotFound() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className='min-h-screen bg-honey-50 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* 背景装饰元素 */}
      <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-honey-100 rounded-full filter blur-3xl opacity-30 animate-pulse'></div>
      <div
        className='absolute bottom-1/3 right-1/3 w-80 h-80 bg-coral-100 rounded-full filter blur-3xl opacity-20 animate-pulse'
        style={{ animationDelay: '1s' }}
      ></div>
      <div
        className='absolute top-1/2 left-1/3 w-48 h-48 bg-lavender-100 rounded-full filter blur-2xl opacity-25 animate-pulse'
        style={{ animationDelay: '2s' }}
      ></div>

      {/* 主内容 */}
      <Card className='w-full max-w-lg p-8 md:p-12 z-10 relative'>
        <div className='text-center space-y-6'>
          {/* 404 数字动画 */}
          <div className='relative h-32 flex items-center justify-center'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-9xl font-bold text-honey-200 select-none'>404</span>
            </div>
            <div className='absolute inset-0 flex items-center justify-center animate-bounce'>
              <span className='text-9xl font-bold text-honey-600 select-none'>404</span>
            </div>
          </div>

          {/* 错误图标 */}
          <div className='relative'>
            <div className='w-20 h-20 mx-auto bg-coral-100 rounded-full flex items-center justify-center animate-pulse'>
              <AlertCircle className='w-10 h-10 text-coral-500' />
            </div>
            <div className='absolute -top-2 -right-2 w-6 h-6 bg-lavender-500 rounded-full animate-ping'></div>
          </div>

          {/* 错误信息 */}
          <div className='space-y-3'>
            <h1 className='text-3xl font-bold text-honey-700'>页面走丢了</h1>
            <p className='text-warmGray-600 text-lg leading-relaxed'>
              哎呀！你要找的页面似乎不存在了。
              <br />
              可能是链接过期了，或者被小精灵藏起来了。
            </p>
          </div>

          {/* 动画装饰线 */}
          <div className='relative h-1 bg-linear-to-r from-transparent via-honey-300 to-transparent rounded-full overflow-hidden'>
            <div className='absolute inset-0 bg-linear-to-r from-transparent via-honey-500 to-transparent animate-pulse'></div>
          </div>

          {/* 操作按钮 */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
            <Button onClick={handleGoHome} className='flex items-center gap-2 group'>
              <Home className='w-4 h-4 group-hover:animate-bounce' />
              返回首页
            </Button>
            <Button
              variant='outline'
              onClick={handleRefresh}
              className='flex items-center gap-2 group'
            >
              <RefreshCw className='w-4 h-4 group-hover:animate-spin' />
              刷新页面
            </Button>
          </div>

          {/* 提示文字 */}
          <div className='text-sm text-warmGray-500 space-y-1'>
            <p>如果问题持续存在，请联系我们</p>
            <div className='flex items-center justify-center gap-2 text-honey-600 hover:text-honey-700 transition-colors cursor-pointer'>
              <span>📧</span>
              <span>support@myhome.com</span>
            </div>
          </div>
        </div>

        {/* 装饰元素 */}
        <div className='absolute -bottom-4 -right-4 w-16 h-16 bg-lavender-100 rounded-full opacity-60 blur-md animate-pulse'></div>
        <div className='absolute -top-4 -left-4 w-12 h-12 bg-coral-100 rounded-full opacity-60 blur-md animate-pulse'></div>

        {/* 漂浮的小元素 */}
        <div
          className='absolute top-8 right-8 text-2xl animate-bounce'
          style={{ animationDelay: '0.5s' }}
        >
          ✨
        </div>
        <div
          className='absolute bottom-8 left-8 text-xl animate-bounce'
          style={{ animationDelay: '1.5s' }}
        >
          🌸
        </div>
        <div
          className='absolute top-16 left-12 text-lg animate-bounce'
          style={{ animationDelay: '2.5s' }}
        >
          🍯
        </div>
      </Card>

      {/* 底部装饰 */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center'>
        <p className='text-warmGray-400 text-sm animate-pulse'>让我们回到温暖的家 ✨</p>
      </div>
    </div>
  )
}
