import { Archive, Clock, Heart, Home, Sparkles } from 'lucide-react'
import { Link } from 'react-router'

export default function Spaces() {
  const title = '家庭空间'
  const description = '房屋平面图'
  const Icon = Archive
  const details = '这里将显示您的房屋收纳平面图，帮助您直观管理每个空间的收纳情况'

  return (
    <div className='min-h-screen bg-linear-to-br from-cream-50 via-cream-100 to-honey-50 pt-20 pb-20 md:pb-8'>
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-10 w-64 h-64 bg-linear-to-bl from-honey-200/20 to-transparent rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 left-10 w-48 h-48 bg-linear-to-tr from-coral-200/20 to-transparent rounded-full blur-2xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-lavender-200/10 to-transparent rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white/80 backdrop-blur-lg rounded-3xl shadow-warm-xl border border-honey-200 p-8 md:p-12'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-honey-400 to-honey-600 rounded-3xl shadow-lg mb-6 animate-bounce duration-3000'>
              <Icon className='w-12 h-12 text-white' />
            </div>

            <h1 className='text-4xl font-bold text-warmGray-800 mb-2 flex items-center justify-center space-x-3'>
              <span>{title}</span>
              <div className='animate-pulse duration-2000'>
                <Heart className='w-8 h-8 text-coral-400' />
              </div>
            </h1>

            <p className='text-xl text-warmGray-600 mb-4'>{description}</p>

            <div className='inline-flex items-center space-x-2 bg-linear-to-r from-honey-100 to-coral-100 px-6 py-3 rounded-2xl border border-honey-200'>
              <div className='animate-pulse duration-2000'>
                <Sparkles className='w-5 h-5 text-honey-600' />
              </div>
              <span className='text-lg font-medium text-warmGray-700'>敬请期待</span>
              <div className='animate-pulse duration-2000' style={{ animationDelay: '0.5s' }}>
                <Sparkles className='w-5 h-5 text-coral-600' />
              </div>
            </div>
          </div>

          <div className='bg-linear-to-r from-cream-50 to-honey-50 rounded-2xl p-6 mb-8 border border-cream-200'>
            <p className='text-warmGray-700 text-center leading-relaxed'>{details}</p>
          </div>

          <div className='mb-8'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-sm font-medium text-warmGray-600'>开发进度</span>
              <span className='text-sm font-medium text-honey-600'>进行中...</span>
            </div>
            <div className='w-full bg-cream-200 rounded-full h-3 overflow-hidden'>
              <div
                className='bg-linear-to-r from-honey-400 to-coral-400 h-3 rounded-full transition-all duration-1000 animate-pulse duration-1000'
                style={{ width: '65%' }}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            <button
              type='button'
              className='p-4 bg-white/60 rounded-xl border border-cream-200 hover:shadow-warm-sm transition-all duration-300 text-center group'
            >
              <Clock className='w-6 h-6 text-honey-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
              <span className='text-sm text-warmGray-700'>预计完成时间</span>
              <p className='text-xs text-warmGray-500 mt-1'>2024年2月</p>
            </button>

            <button
              type='button'
              className='p-4 bg-white/60 rounded-xl border border-cream-200 hover:shadow-warm-sm transition-all duration-300 text-center group'
            >
              <Sparkles className='w-6 h-6 text-coral-500 mx-auto mb-2 group-hover:rotate-12 transition-transform' />
              <span className='text-sm text-warmGray-700'>新功能</span>
              <p className='text-xs text-warmGray-500 mt-1'>正在开发</p>
            </button>

            <button
              type='button'
              className='p-4 bg-white/60 rounded-xl border border-cream-200 hover:shadow-warm-sm transition-all duration-300 text-center group'
            >
              <Heart className='w-6 h-6 text-lavender-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
              <span className='text-sm text-warmGray-700'>用户体验</span>
              <p className='text-xs text-warmGray-500 mt-1'>优先保证</p>
            </button>
          </div>

          <div className='text-center'>
            <Link
              to='/'
              className='inline-flex items-center space-x-3 bg-linear-to-r from-coral-400 to-coral-500 text-white px-8 py-4 rounded-2xl hover:from-coral-500 hover:to-coral-600 transition-all duration-300 shadow-lg hover:shadow-xl group'
            >
              <Home className='w-5 h-5 group-hover:scale-110 transition-transform' />
              <span className='font-medium'>返回首页</span>
              <div className='animate-pulse duration-1500'>
                <Sparkles className='w-4 h-4' />
              </div>
            </Link>
          </div>
        </div>

        <div className='text-center mt-8'>
          <p className='text-warmGray-500 text-sm'>
            感谢您的耐心等待，我们正在努力为您打造更好的收纳体验 ✨
          </p>
        </div>
      </div>
    </div>
  )
}
