import { Archive, Heart, Link2 as Link, MapPin, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SpaceStat {
  type: 'warm' | 'comfort' | 'overall'
  title: string
  count: number
  subtitle: string
  icon: React.ReactNode
}

interface HomeTip {
  icon: React.ReactNode
  text: string
  id: string
}

// SpaceTitle 组件
const SpaceTitle = () => {
  return (
    <div className='flex items-center justify-between mb-8'>
      <div className='flex items-center space-x-4'>
        <div className='w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center'>
          <Archive className='w-8 h-8 text-pink-600' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-warmGray-600 mb-2'>家庭空间</h1>
          <p className='text-warmGray-400'>每个空间都承载着生活的美好</p>
        </div>
      </div>
      <Button className='text-white'>
        <Plus className='w-5 h-5 mr-2' />
        添加新房间
      </Button>
    </div>
  )
}

// SpaceStats 组件
const SpaceStats = ({ stats }: { stats: SpaceStat[] }) => {
  const getStyleByType = (type: 'warm' | 'comfort' | 'overall') => {
    const styles = {
      warm: {
        bgClass: 'bg-amber-50',
        iconBgClass: 'bg-amber-200',
        iconColor: 'text-amber-700',
        textColor: 'text-amber-800',
        numberColor: 'text-amber-900',
        subtitleColor: 'text-amber-600',
      },
      comfort: {
        bgClass: 'bg-rose-50',
        iconBgClass: 'bg-rose-200',
        iconColor: 'text-rose-700',
        textColor: 'text-rose-800',
        numberColor: 'text-rose-900',
        subtitleColor: 'text-rose-600',
      },
      overall: {
        bgClass: 'bg-purple-50',
        iconBgClass: 'bg-purple-200',
        iconColor: 'text-purple-700',
        textColor: 'text-purple-800',
        numberColor: 'text-purple-900',
        subtitleColor: 'text-purple-600',
      },
    }
    return styles[type]
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
      {stats.map(stat => {
        const style = getStyleByType(stat.type)
        return (
          <Card
            key={stat.type}
            variant='warm'
            className={`relative py-3 card-hover ${style.bgClass}`}
          >
            <div className='flex items-center space-x-4 py-1.5 px-3'>
              <div className={`p-2 rounded-lg shadow-soft ${style.iconBgClass}`}>
                <div className={style.iconColor}>{stat.icon}</div>
              </div>
              <div>
                <p className={`text-sm font-medium mb-1 ${style.textColor}`}>{stat.title}</p>
                <p className={`text-2xl font-hand font-bold ${style.numberColor}`}>{stat.count}</p>
                <p className={`text-xs mt-1 ${style.subtitleColor}`}>{stat.subtitle}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// FloorPlan 组件
const FloorPlan = () => {
  return (
    <div className='lg:col-span-2'>
      <Card className='border-cream-200'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <MapPin className='w-5 h-5 text-warmGray-600' />
              <CardTitle className='text-lg font-semibold text-warmGray-800'>房屋平面图</CardTitle>
            </div>
            <div className='flex items-center space-x-4 text-sm'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                <span className='text-warmGray-600'>宽敞</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                <span className='text-warmGray-600'>刚好</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                <span className='text-warmGray-600'>拥挤</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-warmGray-600'>点击房间查看详细信息</p>
        </CardContent>
      </Card>
    </div>
  )
}

// SelectRoom 组件
const SelectRoom = () => {
  return (
    <Card className='border-cream-200'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg font-semibold text-warmGray-800'>选择房间</CardTitle>
      </CardHeader>
      <CardContent className='text-center py-12'>
        <MapPin className='w-12 h-12 text-warmGray-400 mx-auto mb-4' />
        <p className='text-warmGray-600'>点击左侧任意房间卡片查看详细信息</p>
      </CardContent>
    </Card>
  )
}

// HomeTips 组件
const HomeTips = ({ tips }: { tips: HomeTip[] }) => {
  return (
    <Card className='border-cream-200'>
      <CardHeader className='pb-4'>
        <div className='flex items-center space-x-3'>
          <Sparkles className='w-5 h-5 text-purple-600' />
          <CardTitle className='text-lg font-semibold text-warmGray-800'>家居小贴士</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {tips.map(tip => (
            <div key={tip.id} className='flex items-center space-x-3 p-3 bg-white/50 rounded-lg'>
              {tip.icon}
              <span className='text-warmGray-700 text-sm'>{tip.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Spaces() {
  const spaceStats: SpaceStat[] = [
    {
      type: 'warm',
      title: '温馨房间',
      count: 0,
      subtitle: '个房间',
      icon: <Archive className='w-8 h-8' />,
    },
    {
      type: 'comfort',
      title: '舒适空间',
      count: 0,
      subtitle: '个房间',
      icon: <Link className='w-8 h-8' />,
    },
    {
      type: 'overall',
      title: '整体状况',
      count: 0,
      subtitle: '温馨度',
      icon: <Heart className='w-8 h-8' />,
    },
  ]

  const homeTips: HomeTip[] = [
    {
      icon: <Sparkles className='w-4 h-4 text-yellow-500' />,
      text: '定期整理能让家居空间更加舒适',
      id: 'tip-1',
    },
    {
      icon: <Archive className='w-4 h-4 text-orange-500' />,
      text: '保持70%以下的使用率更加舒适',
      id: 'tip-2',
    },
    {
      icon: <Sparkles className='w-4 h-4 text-purple-500' />,
      text: '合理分类让找物品更轻松',
      id: 'tip-3',
    },
  ]

  return (
    <div className='min-h-screen'>
      {/* 主内容区域 */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* 标题区域 */}
        <SpaceTitle />

        {/* 统计卡片区域 */}
        <SpaceStats stats={spaceStats} />

        {/* 房屋平面图和选择房间区域 */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* 房屋平面图 */}
          <FloorPlan />

          {/* 右侧列：选择房间 + 家居小贴士 */}
          <div className='space-y-6'>
            <SelectRoom />
            <HomeTips tips={homeTips} />
          </div>
        </div>
      </main>
    </div>
  )
}
