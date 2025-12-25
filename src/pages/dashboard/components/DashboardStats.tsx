import {
  Archive,
  AlertTriangle,
  Coffee,
  Heart,
  Package,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import { Card } from '@/components/ui/card'

interface StatCardProps {
  title: string
  count: number | string
  subtitle: string
  icon: React.ReactNode
  decoration: React.ReactNode
  bgColor: string
  iconBg: string
  iconColor: string
  countColor: string
}

interface DashboardStatsProps {
  data: {
    overview: {
      totalItems: number
      totalSpaces: number
      utilizationRate: number
      expiredItems: number
      lowStockItems: number
    }
  }
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const StatCard = ({
    title,
    count,
    subtitle,
    icon,
    decoration,
    bgColor,
    iconBg,
    iconColor,
    countColor,
  }: StatCardProps) => {
    return (
      <Card variant='warm' className={`relative py-3 card-hover ${bgColor}`}>
        <div className='flex items-center justify-between py-1.5 px-3'>
          <div>
            <p className='text-sm font-medium text-warmGray-600 mb-1'>{title}</p>
            <p className={`text-2xl font-hand font-bold ${countColor}`}>{count}</p>
            <p className='text-xs text-warmGray-500 mt-1'>{subtitle}</p>
          </div>
          <div className={`p-2 bg-linear-to-br rounded-lg shadow-soft ${iconBg}`}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
        <div className='absolute top-2 right-2'>{decoration}</div>
      </Card>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      <StatCard
        title='我的收藏'
        count={data.overview.totalItems}
        subtitle='件温馨小物'
        icon={<Package className='w-6 h-6' />}
        decoration={<Star className='w-4 h-4 text-honey-500 animate-pulse' />}
        bgColor=''
        iconBg='from-honey-200 to-honey-300'
        iconColor='text-honey-700'
        countColor='text-honey-700'
      />
      <StatCard
        title='收纳空间'
        count={data.overview.totalSpaces}
        subtitle='个温馨角落'
        icon={<Archive className='w-6 h-6' />}
        decoration={<Sparkles className='w-4 h-4 text-lavender-500 animate-pulse' />}
        bgColor=''
        iconBg='from-lavender-200 to-lavender-300'
        iconColor='text-lavender-700'
        countColor='text-lavender-700'
      />
      <StatCard
        title='空间利用率'
        count={`${data.overview.utilizationRate}%`}
        subtitle='利用率刚好'
        icon={<TrendingUp className='w-6 h-6' />}
        decoration={<Heart className='w-4 h-4 text-coral-500 animate-pulse' />}
        bgColor=''
        iconBg='from-coral-200 to-coral-300'
        iconColor='text-coral-700'
        countColor='text-coral-700'
      />
      <StatCard
        title='待处理事项'
        count={data.overview.expiredItems + data.overview.lowStockItems}
        subtitle='个小提醒'
        icon={<AlertTriangle className='w-6 h-6' />}
        decoration={<Coffee className='w-4 h-4 text-lemon-500 animate-pulse' />}
        bgColor=''
        iconBg='from-lemon-200 to-lemon-300'
        iconColor='text-lemon-700'
        countColor='text-lemon-700'
      />
    </div>
  )
}
