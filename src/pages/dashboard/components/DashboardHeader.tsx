import { Heart, Home, Moon, Sun } from 'lucide-react'

export function DashboardHeader() {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: '早上好', icon: Sun, color: 'text-honey-500' }
    if (hour < 18) return { text: '下午好', icon: Sun, color: 'text-coral-500' }
    return { text: '晚上好', icon: Moon, color: 'text-lavender-500' }
  }

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  return (
    <div className='relative overflow-hidden'>
      <div className='absolute inset-0 bg-linear-to-r from-honey-100/50 via-cream-200/30 to-coral-100/50'></div>
      <div className='absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-honey-200/20 to-transparent rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-coral-200/20 to-transparent rounded-full blur-2xl'></div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 bg-linear-to-br from-honey-400 to-honey-600 rounded-3xl flex items-center justify-center shadow-warm-lg animate-float'>
            <Home className='w-8 h-8 text-white' />
          </div>
          <div>
            <div className='flex items-center space-x-3 mb-2'>
              <GreetingIcon className={`w-6 h-6 ${greeting.color}`} />
              <h1 className='text-3xl font-hand font-bold text-warmGray-800'>{greeting.text}！</h1>
              <Heart className='w-6 h-6 text-coral-400 animate-pulse' />
            </div>
            <p className='text-warmGray-600 text-lg'>
              今天是{' '}
              {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
            <p className='text-warmGray-500 mt-1'>让我们一起整理温馨的小窝吧 ✨</p>
          </div>
        </div>
      </div>
    </div>
  )
}
