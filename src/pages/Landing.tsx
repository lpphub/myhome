import {
  Archive,
  ArrowRight,
  Camera,
  Heart,
  Home as HomeIcon,
  Lightbulb,
  Palette,
  Sparkles,
  StickyNote,
  Tag,
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks'
import { env } from '@/utils/env'

const appName = env.APP_NAME || '拾序'

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  bgColor: string
  iconColor: string
}

function FeatureCard({ icon: Icon, title, description, bgColor, iconColor }: FeatureCardProps) {
  return (
    <div
      className={`group ${bgColor} rounded-3xl p-8 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
    >
      <div
        className={`w-16 h-16 ${iconColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
      >
        <Icon className='w-8 h-8 text-white' />
      </div>
      <h3 className='text-xl font-medium text-gray-800 mb-3'>{title}</h3>
      <p className='text-gray-600 leading-relaxed'>{description}</p>
    </div>
  )
}

interface UseCaseCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  bgColor: string
  iconBg: string
}

function UseCaseCard({ icon: Icon, title, description, bgColor, iconBg }: UseCaseCardProps) {
  return (
    <div
      className={`group ${bgColor} rounded-2xl p-6 shadow-sm border hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
    >
      <div
        className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className='w-6 h-6 text-white' />
      </div>
      <h3 className='text-lg font-medium text-gray-800 mb-2'>{title}</h3>
      <p className='text-gray-600 text-sm leading-relaxed'>{description}</p>
    </div>
  )
}

export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className='min-h-screen bg-linear-to-br from-cream-50 via-honey-50 to-coral-50'>
      {/* Navigation */}
      <nav className='fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-cream-200'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
          <Link to='/' className='flex items-center gap-3 group'>
            <div className='w-12 h-12 bg-linear-to-br from-honey-400 to-coral-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
              <HomeIcon className='w-6 h-6 text-white' />
            </div>
            <span className='text-2xl font-medium text-gray-800'>{appName}</span>
          </Link>
          {isAuthenticated ? (
            <Link to='/tags'>
              <Button
                variant='ghost'
                className='text-gray-600 hover:text-gray-800 hover:bg-cream-100 font-medium'
              >
                进入空间
              </Button>
            </Link>
          ) : (
            <Link to='/login'>
              <Button className='bg-linear-to-r from-honey-400 to-coral-400 hover:from-honey-500 hover:to-coral-500 text-white shadow-lg hover:shadow-xl transition-all font-medium px-6 rounded-2xl'>
                立即登录
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <main className='pt-20'>
        {/* Hero Section */}
        <section className='py-20 md:py-32 relative overflow-hidden'>
          <div className='absolute top-20 left-10 w-72 h-72 bg-honey-200/20 rounded-full blur-3xl' />
          <div className='absolute bottom-20 right-10 w-96 h-96 bg-coral-200/20 rounded-full blur-3xl' />
          <div className='absolute top-40 right-20 w-48 h-48 bg-lavender-200/20 rounded-full blur-2xl' />

          <div className='max-w-7xl mx-auto px-6 relative z-10'>
            <div className='text-center max-w-4xl mx-auto'>
              <div className='inline-flex items-center gap-2 bg-honey-100 text-honey-700 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm'>
                <Sparkles className='w-4 h-4' />
                温柔整理，优雅生活
              </div>

              <h1 className='text-5xl md:text-7xl font-medium text-gray-800 mb-8 leading-tight'>
                让生活中的
                <span className='text-honey-500 block'>每一份美好</span>
                都有序可循
              </h1>

              <p className='text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto'>
                用 <span className='font-semibold text-coral-500'>{appName}</span>{' '}
                整理你的想法、记录、收藏和灵感， 让散落的信息变成温暖记忆
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                <Link to={isAuthenticated ? '/tags' : '/login'}>
                  <Button
                    size='lg'
                    className='bg-linear-to-r from-honey-400 to-coral-400 hover:from-honey-500 hover:to-coral-500 text-white shadow-xl hover:shadow-2xl transition-all px-8 py-4 text-lg font-semibold rounded-2xl'
                  >
                    {isAuthenticated ? '进入空间' : '免费开始使用'}
                    <ArrowRight className='w-5 h-5 ml-2' />
                  </Button>
                </Link>
                <Button
                  variant='outline'
                  size='lg'
                  className='border-2 border-cream-300 hover:border-honey-300 text-gray-700 hover:text-honey-700 hover:bg-honey-50 px-8 py-4 text-lg font-medium rounded-2xl'
                >
                  <Heart className='w-5 h-5 mr-2' />
                  了解更多
                </Button>
              </div>
            </div>

            {/* Floating Cards Preview */}
            <div className='mt-20 relative max-w-4xl mx-auto hidden md:block'>
              <div className='grid grid-cols-3 gap-6 p-8'>
                <div className='bg-white rounded-2xl p-6 shadow-lg -rotate-3 translate-y-4 border border-cream-200'>
                  <div className='w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center mb-3'>
                    <StickyNote className='w-6 h-6 text-coral-500' />
                  </div>
                  <div className='h-2 bg-coral-100 rounded w-3/4 mb-2' />
                  <div className='h-2 bg-cream-200 rounded w-1/2' />
                </div>

                <div className='bg-white rounded-2xl p-6 shadow-lg rotate-2 translate-y-2 border border-cream-200'>
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

                <div className='bg-white rounded-2xl p-6 shadow-lg -rotate-1 translate-y-6 border border-cream-200'>
                  <div className='w-12 h-12 bg-honey-100 rounded-xl flex items-center justify-center mb-3'>
                    <Lightbulb className='w-6 h-6 text-honey-600' />
                  </div>
                  <div className='h-2 bg-honey-100 rounded w-full mb-2' />
                  <div className='h-2 bg-honey-100 rounded w-5/6' />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className='py-20 bg-white/60'>
          <div className='max-w-7xl mx-auto px-6'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center gap-2 bg-lavender-100 text-lavender-700 px-4 py-2 rounded-full text-sm font-medium mb-6'>
                <Palette className='w-4 h-4' />
                核心功能
              </div>
              <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                从个人笔记到生活记录，从灵感收集到美好回忆，让整理变成一种享受
              </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              <FeatureCard
                icon={HomeIcon}
                title='温馨空间管理'
                description='为不同的生活场景创建专属空间，工作、学习、爱好都有自己的小天地'
                bgColor='bg-honey-50'
                iconColor='bg-linear-to-br from-honey-400 to-honey-500'
              />
              <FeatureCard
                icon={Archive}
                title='有序整理系统'
                description='按类别、标签建立清晰的整理体系，让每个信息都有固定的位置和归属'
                bgColor='bg-coral-50'
                iconColor='bg-linear-to-br from-coral-400 to-coral-500'
              />
              <FeatureCard
                icon={Palette}
                title='彩色标签系统'
                description='7种温柔的配色方案，用颜色为内容分类，让整理变得赏心悦目'
                bgColor='bg-lavender-50'
                iconColor='bg-linear-to-br from-lavender-400 to-lavender-500'
              />
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className='py-20 bg-linear-to-br from-cream-100/50 via-honey-50/50 to-coral-50/30'>
          <div className='max-w-7xl mx-auto px-6'>
            <div className='text-center mb-16'>
              <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                无论你是学生、上班族还是生活家，都能找到属于你的整理节奏
              </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <UseCaseCard
                icon={Archive}
                title='收纳整理'
                description='记录家中物品位置，整理收藏品清单，再也不用到处找东西了'
                bgColor='bg-coral-50'
                iconBg='bg-linear-to-br from-coral-400 to-coral-500'
              />
              <UseCaseCard
                icon={Lightbulb}
                title='灵感收集'
                description='随时记录闪现的创意想法，用标签分类管理，让灵感不再溜走'
                bgColor='bg-lemon-50'
                iconBg='bg-linear-to-br from-lemon-400 to-honey-400'
              />
              <UseCaseCard
                icon={Tag}
                title='学习笔记'
                description='整理课程笔记、读书心得，建立个人知识库，学习更有条理'
                bgColor='bg-mint-green-50'
                iconBg='bg-linear-to-br from-mint-green-400 to-mint-green-500'
              />
              <UseCaseCard
                icon={Camera}
                title='生活记录'
                description='记录生活中的美好瞬间，旅行日记、美食分享，珍藏每份回忆'
                bgColor='bg-macaron-pink-50'
                iconBg='bg-linear-to-br from-macaron-pink-400 to-macaron-pink-500'
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-20 bg-linear-to-br from-honey-100 via-coral-100 to-macaron-pink-100 relative overflow-hidden'>
          <div className='absolute inset-0 bg-white/20' />
          <div className='absolute top-0 left-0 w-full h-full'>
            <div className='absolute top-20 left-20 w-40 h-40 bg-white/30 rounded-full blur-2xl' />
            <div className='absolute bottom-20 right-20 w-60 h-60 bg-white/20 rounded-full blur-3xl' />
          </div>

          <div className='max-w-4xl mx-auto px-6 text-center relative z-10'>
            <p className='text-xl text-gray-700 mb-10 leading-relaxed'>
              加入千万用户的选择，让生活变得更有序、更温暖、更美好
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Link to={isAuthenticated ? '/tags' : '/login'}>
                <Button
                  size='lg'
                  className='bg-linear-to-r from-honey-400 to-coral-400 hover:from-honey-500 hover:to-coral-500 text-white shadow-xl hover:shadow-2xl transition-all px-8 py-4 text-lg font-semibold rounded-2xl'
                >
                  {isAuthenticated ? '进入空间' : '免费开始使用'}
                  <ArrowRight className='w-5 h-5 ml-2' />
                </Button>
              </Link>
              <div className='text-gray-600 text-sm flex items-center gap-2'>
                <Heart className='w-4 h-4 text-coral-400' />
                完全免费 · 温柔体验 · 立即开始
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='py-12 bg-cream-100 border-t border-cream-200'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center gap-3 mb-4 md:mb-0'>
              <div className='w-10 h-10 bg-linear-to-br from-honey-400 to-coral-400 rounded-xl flex items-center justify-center'>
                <HomeIcon className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-medium text-gray-800'>{appName}</span>
            </div>
            <div className='text-gray-600 text-sm flex items-center gap-2'>
              <Heart className='w-4 h-4 text-coral-400' />© 2026 {appName}.
              让生活更有序，让整理更温柔
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
