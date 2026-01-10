import { Cloud, Home as HomeIcon, StickyNote, Tag } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks'
import { env } from '@/utils/env'

const appName = env.APP_NAME || 'AI记录'

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col'>
      <div className='w-12 h-12 bg-linear-to-br from-coral-100 to-honey-100 rounded-lg flex items-center justify-center mb-4'>
        <Icon className='w-6 h-6 text-primary' />
      </div>
      <h3 className='text-lg font-semibold text-foreground mb-2'>{title}</h3>
      <p className='text-foreground-secondary text-sm leading-relaxed flex-1'>{description}</p>
    </div>
  )
}

export default function Landing() {
  const { isAuthenticated } = useAuth()
  return (
    <div className='min-h-screen bg-linear-to-br from-cream-50 to-honey-100'>
      <nav className='fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50'>
        <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-linear-to-br from-primary to-coral-300 rounded-lg flex items-center justify-center shadow-lg'>
              <HomeIcon className='w-6 h-6 text-white' />
            </div>
            <span className='text-xl font-bold text-foreground-secondary'>{appName}</span>
          </div>
          {isAuthenticated ? (
            <Link to='/'>
              <Button variant='ghost' className='text-primary hover:bg-coral-100'>
                我的空间
              </Button>
            </Link>
          ) : (
            <Link to='/login'>
              <Button className='text-white bg-linear-to-r from-coral-400 to-primary hover:from-coral-500 hover:to-primary'>
                登录
              </Button>
            </Link>
          )}
          {''}
        </div>
      </nav>

      <section className='min-h-[70vh] flex items-center pt-20'>
        <div className='max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center'>
          <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <h1 className='text-5xl md:text-6xl font-bold text-primary/80'>{appName}</h1>
            <p className='text-lg text-foreground-secondary leading-relaxed'>
              创建专属空间，整理生活点滴。用便签记录每一个小确幸，让灵感不再流失，让回忆永远留存。
            </p>
          </div>
          <div className='flex justify-center items-center animate-in fade-in zoom-in-95 duration-500 delay-100'>
            <div className='relative'>
              <div className='absolute -top-8 -left-8 w-24 h-24 bg-primary/20 rounded-full animate-pulse duration-4000' />
              <div className='absolute -bottom-6 -right-6 w-20 h-20 bg-coral-400/20 rounded-full animate-pulse duration-5000 delay-1000' />
              <div className='relative grid grid-cols-3 gap-4 p-8 bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl'>
                <div className='w-16 h-16 bg-linear-to-br from-coral-100 to-coral-200 rounded-xl flex items-center justify-center shadow-md'>
                  <span className='text-3xl'>🏠</span>
                </div>
                <div className='w-16 h-16 bg-linear-to-br from-honey-100 to-honey-200 rounded-xl flex items-center justify-center shadow-md'>
                  <span className='text-3xl'>📚</span>
                </div>
                <div className='w-16 h-16 bg-linear-to-br from-lemon-100 to-lemon-200 rounded-xl flex items-center justify-center shadow-md'>
                  <span className='text-3xl'>🪴</span>
                </div>
                <div className='w-16 h-16 bg-linear-to-br from-lavender-100 to-lavender-200 rounded-xl flex items-center justify-center shadow-md'>
                  <span className='text-3xl'>🎨</span>
                </div>
                <div className='w-16 h-16 bg-linear-to-br from-mint-green-100 to-mint-green-200 rounded-xl flex items-center justify-center shadow-md'>
                  <span className='text-3xl'>🍳</span>
                </div>
                <div className='w-16 h-16 bg-linear-to-br from-macaron-pink-100 to-macaron-pink-200 rounded-xl flex items-center justify-center shadow-md'>
                  <span className='text-3xl'>🎵</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-20 bg-linear-to-br from-cream-50 to-honey-100'>
        <div className='max-w-6xl mx-auto px-6'>
          <h2 className='text-4xl font-bold text-foreground text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            核心特色
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100'>
              <FeatureCard
                icon={HomeIcon}
                title='专属空间'
                description='为不同场景创建独立空间，让记录井井有条'
              />
            </div>
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200'>
              <FeatureCard
                icon={StickyNote}
                title='便签墙'
                description='灵活的便签系统，自由组织你的想法'
              />
            </div>
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300'>
              <FeatureCard icon={Tag} title='智能分类' description='彩色标签分组，让内容一目了然' />
            </div>
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400'>
              <FeatureCard
                icon={Cloud}
                title='云端同步'
                description='数据云端存储，多设备无缝访问'
              />
            </div>
          </div>
        </div>
      </section>

      <section className='py-20 bg-linear-to-br from-coral-50 to-honey-50'>
        <div className='max-w-4xl mx-auto px-6 text-center space-y-6'>
          <h2 className='text-4xl font-bold text-foreground animate-in fade-in slide-in-from-bottom-4 duration-500'>
            准备好开始记录了吗？
          </h2>
          <p className='text-xl text-foreground-secondary animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100'>
            免费使用，即刻开启你的记录之旅
          </p>
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200'>
            <Link to={isAuthenticated ? '/' : '/login'}>
              <Button
                size='lg'
                className='text-white bg-linear-to-r from-coral-400 to-primary hover:from-coral-500 hover:to-primary shadow-lg hover:shadow-xl'
              >
                {isAuthenticated ? '我的空间' : '立即登录'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className='py-8 bg-foreground text-center'>
        <p className='text-foreground-secondary'>© 2026 {appName}. All rights reserved.</p>
      </footer>
    </div>
  )
}
