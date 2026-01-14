import { Archive, Camera, Home as HomeIcon, Lightbulb, StickyNote, Tag } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks'
import { env } from '@/utils/env'

const appName = env.APP_NAME || '拾序'

interface CardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

function Card({ icon: Icon, title, description }: CardProps) {
  return (
    <div className='group bg-white rounded-2xl p-6 shadow-sm border border-cream-200 hover:shadow-md transition-all duration-300 h-full flex flex-col'>
      <div className='w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300 shrink-0'>
        <Icon className='w-6 h-6 text-primary' />
      </div>
      <h3 className='text-lg font-medium text-foreground mb-2'>{title}</h3>
      <p className='text-foreground-secondary text-sm leading-relaxed flex-1'>{description}</p>
    </div>
  )
}

function SceneItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className='flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm border border-cream-200 hover:shadow-md transition-all duration-300'>
      <div className='w-16 h-16 bg-cream-100 rounded-2xl flex items-center justify-center shrink-0'>
        <Icon className='w-8 h-8 text-primary' />
      </div>
      <div>
        <h3 className='text-xl font-medium text-foreground mb-2'>{title}</h3>
        <p className='text-foreground-secondary leading-relaxed'>{description}</p>
      </div>
    </div>
  )
}

export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className='min-h-screen bg-linear-to-b from-cream-100 via-cream-50 to-honey-50'>
      <nav className='fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-cream-200'>
        <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
          <Link to='/' className='flex items-center gap-3 group'>
            <div className='w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300'>
              <HomeIcon className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-medium text-foreground'>{appName}</span>
          </Link>
          {isAuthenticated ? (
            <Link to='/'>
              <Button
                variant='ghost'
                className='text-foreground-secondary hover:text-foreground hover:bg-cream-100'
              >
                我的空间
              </Button>
            </Link>
          ) : (
            <Link to='/login'>
              <Button className='text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all'>
                登录
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <main className='pt-24'>
        <section className='py-16 md:py-20'>
          <div className='max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center'>
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
              <h1 className='text-4xl md:text-5xl font-medium text-foreground mb-6'>{appName}</h1>
              <p className='text-xl md:text-2xl text-foreground-secondary mb-8 leading-relaxed'>
                把零散的信息，<span className='text-primary font-medium'>拾起并归序</span>
              </p>
              <Link to={isAuthenticated ? '/' : '/login'}>
                <Button
                  size='lg'
                  className='text-white bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all px-8'
                >
                  {isAuthenticated ? '进入我的空间' : '立即开始'}
                </Button>
              </Link>
            </div>

            <div className='relative animate-in fade-in zoom-in-95 duration-500 delay-100 hidden md:block'>
              <div className='relative'>
                <div className='absolute -top-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl' />
                <div className='absolute -bottom-8 -right-8 w-40 h-40 bg-coral-200/30 rounded-full blur-3xl' />

                <div className='relative grid grid-cols-2 gap-4 p-8'>
                  <div className='bg-white rounded-2xl p-6 shadow-lg -rotate-3 translate-y-4'>
                    <div className='w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center mb-3'>
                      <StickyNote className='w-6 h-6 text-coral-500' />
                    </div>
                    <div className='h-2 bg-coral-100 rounded w-3/4 mb-2' />
                    <div className='h-2 bg-cream-200 rounded w-1/2' />
                  </div>

                  <div className='bg-white rounded-2xl p-6 shadow-lg rotate-3 translate-y-2'>
                    <div className='w-12 h-12 bg-lavender-100 rounded-xl flex items-center justify-center mb-3'>
                      <Tag className='w-6 h-6 text-lavender-500' />
                    </div>
                    <div className='flex gap-2 mb-2'>
                      <div className='w-6 h-6 bg-coral-200 rounded-full' />
                      <div className='w-6 h-6 bg-honey-200 rounded-full' />
                      <div className='w-6 h-6 bg-mint-green-200 rounded-full' />
                    </div>
                    <div className='h-2 bg-lavender-100 rounded w-2/3' />
                  </div>

                  <div className='bg-white rounded-2xl p-6 shadow-lg -rotate-2 translate-y-2'>
                    <div className='w-12 h-12 bg-honey-100 rounded-xl flex items-center justify-center mb-3'>
                      <HomeIcon className='w-6 h-6 text-honey-600' />
                    </div>
                    <div className='h-2 bg-honey-100 rounded w-full mb-2' />
                    <div className='h-2 bg-honey-100 rounded w-5/6' />
                  </div>

                  <div className='bg-white rounded-2xl p-6 shadow-lg rotate-2'>
                    <div className='w-12 h-12 bg-mint-green-100 rounded-xl flex items-center justify-center mb-3'>
                      <Lightbulb className='w-6 h-6 text-mint-green-600' />
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 bg-mint-green-200 rounded-lg' />
                      <div className='h-2 bg-mint-green-100 rounded flex-1' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='py-16 bg-white/50'>
          <div className='max-w-6xl mx-auto px-6'>
            <h2 className='text-2xl font-medium text-foreground text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500'>
              核心功能
            </h2>
            <div className='grid md:grid-cols-3 gap-6'>
              <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100'>
                <Card
                  icon={HomeIcon}
                  title='空间分类'
                  description='为生活、工作、爱好创建独立空间，让内容井井有条'
                />
              </div>
              <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200'>
                <Card
                  icon={StickyNote}
                  title='随手记便签'
                  description='像贴便利贴一样记录灵感，随时随地捕捉想法'
                />
              </div>
              <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300'>
                <Card
                  icon={Tag}
                  title='彩色标签'
                  description='用颜色快速分类，找起来更方便，管理更轻松'
                />
              </div>
            </div>
          </div>
        </section>

        <section className='py-16'>
          <div className='max-w-4xl mx-auto px-6'>
            <h2 className='text-2xl font-medium text-foreground text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500'>
              使用场景
            </h2>
            <div className='space-y-4'>
              <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100'>
                <SceneItem
                  icon={Archive}
                  title='物品收纳'
                  description='整理生活物品清单，记录收藏的东西在哪里'
                />
              </div>
              <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200'>
                <SceneItem
                  icon={Lightbulb}
                  title='捕捉灵感'
                  description='随时记录闪过的想法，不让灵感悄悄溜走'
                />
              </div>
              <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300'>
                <SceneItem
                  icon={Camera}
                  title='拾取记忆'
                  description='保存生活中的小确幸，让回忆有迹可循'
                />
              </div>
            </div>
          </div>
        </section>

        <section className='py-20 bg-white/50'>
          <div className='max-w-3xl mx-auto px-6 text-center'>
            <h2 className='text-2xl font-medium text-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
              开始你的整理之旅
            </h2>
            <p className='text-foreground-secondary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100'>
              免费使用，让一切都整整齐齐
            </p>
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200'>
              <Link to={isAuthenticated ? '/' : '/login'}>
                <Button
                  size='lg'
                  className='text-white bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all px-8'
                >
                  {isAuthenticated ? '进入我的空间' : '免费开始'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className='py-8 bg-white/60 border-t border-cream-200'>
        <div className='max-w-6xl mx-auto px-6 text-center'>
          <p className='text-foreground-secondary text-sm'>
            © 2026 {appName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
