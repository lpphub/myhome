import { Archive, Camera, Clock, Heart, Home, Sparkles, Tag } from 'lucide-react'
import { Link } from 'react-router'

interface ComingSoonProps {
  feature: 'spaces' | 'items' | 'tags'
}
function ComingSoon({ feature }: ComingSoonProps) {
  const getFeatureInfo = () => {
    switch (feature) {
      case 'spaces':
        return {
          title: '收纳空间',
          description: '房屋平面图',
          icon: Archive,
          color: 'lavender',
          details: '这里将显示您的房屋收纳平面图，帮助您直观管理每个空间的收纳情况',
        }
      case 'items':
        return {
          title: '物品收藏',
          description: '物品收藏展示',
          icon: Camera,
          color: 'honey',
          details: '这里将展示您收藏的所有物品，支持拍照记录和智能分类',
        }
      case 'tags':
        return {
          title: '分类标签',
          description: '分类标签管理',
          icon: Tag,
          color: 'coral',
          details: '这里将帮助您管理物品分类标签，让收纳更加井井有条',
        }
    }
  }

  const featureInfo = getFeatureInfo()
  const Icon = featureInfo.icon

  return (
    <div className='min-h-screen bg-linear-to-br from-cream-50 via-cream-100 to-honey-50 pt-20 pb-20 md:pb-8'>
      {/* 背景装饰 */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-10 w-64 h-64 bg-linear-to-bl from-honey-200/20 to-transparent rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 left-10 w-48 h-48 bg-linear-to-tr from-coral-200/20 to-transparent rounded-full blur-2xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-lavender-200/10 to-transparent rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* 主要内容卡片 */}
        <div className='bg-white/80 backdrop-blur-lg rounded-3xl shadow-warm-xl border border-honey-200 p-8 md:p-12'>
          {/* 图标和标题区域 */}
          <div className='text-center mb-8'>
            <div
              className={`inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-${featureInfo.color}-400 to-${featureInfo.color}-600 rounded-3xl shadow-lg mb-6 animate-float`}
            >
              <Icon className='w-12 h-12 text-white' />
            </div>

            <h1 className='text-4xl font-bold text-warmGray-800 mb-2 flex items-center justify-center space-x-3'>
              <span>{featureInfo.title}</span>
              <Heart className='w-8 h-8 text-coral-400 animate-pulse' />
            </h1>

            <p className='text-xl text-warmGray-600 mb-4'>{featureInfo.description}</p>

            {/* 敬请期待标签 */}
            <div className='inline-flex items-center space-x-2 bg-linear-to-r from-honey-100 to-coral-100 px-6 py-3 rounded-2xl border border-honey-200'>
              <Sparkles className='w-5 h-5 text-honey-600 animate-bounce-gentle' />
              <span className='text-lg font-medium text-warmGray-700'>敬请期待</span>
              <Sparkles className='w-5 h-5 text-coral-600 animate-bounce-gentle' />
            </div>
          </div>

          {/* 功能描述 */}
          <div className='bg-linear-to-r from-cream-50 to-honey-50 rounded-2xl p-6 mb-8 border border-cream-200'>
            <p className='text-warmGray-700 text-center leading-relaxed'>{featureInfo.details}</p>
          </div>

          {/* 开发进度 */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-sm font-medium text-warmGray-600'>开发进度</span>
              <span className='text-sm font-medium text-honey-600'>进行中...</span>
            </div>
            <div className='w-full bg-cream-200 rounded-full h-3 overflow-hidden'>
              <div
                className='bg-linear-to-r from-honey-400 to-coral-400 h-3 rounded-full animate-pulse transition-all duration-1000'
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>

          {/* 快捷操作 */}
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

          {/* 返回首页按钮 */}
          <div className='text-center'>
            <Link
              to='/'
              className='inline-flex items-center space-x-3 bg-linear-to-r from-coral-400 to-coral-500 text-white px-8 py-4 rounded-2xl hover:from-coral-500 hover:to-coral-600 transition-all duration-300 shadow-lg hover:shadow-xl group'
            >
              <Home className='w-5 h-5 group-hover:scale-110 transition-transform' />
              <span className='font-medium'>返回首页</span>
              <Sparkles className='w-4 h-4 animate-pulse' />
            </Link>
          </div>
        </div>

        {/* 提示信息 */}
        <div className='text-center mt-8'>
          <p className='text-warmGray-500 text-sm'>
            感谢您的耐心等待，我们正在努力为您打造更好的收纳体验 ✨
          </p>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
