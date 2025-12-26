import { Sparkles } from 'lucide-react'
import type { ActivityType, DashboardActivity } from '@/api/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RecentActivitiesProps {
  activities: DashboardActivity[]
}

function getActivityIcon(type: ActivityType): React.ReactNode {
  const iconClass = 'text-lg'
  switch (type) {
    case 'item-add':
      return <span className={iconClass}>📦</span>
    case 'item-update':
      return <span className={iconClass}>✏️</span>
    case 'item-delete':
      return <span className={iconClass}>🗑️</span>
    case 'item-move':
      return <span className={iconClass}>📤</span>
    case 'room-add':
      return <span className={iconClass}>🏠</span>
    case 'room-update':
      return <span className={iconClass}>✏️</span>
    case 'storage-add':
      return <span className={iconClass}>🗃️</span>
    case 'storage-update':
      return <span className={iconClass}>✏️</span>
    default:
      return <span className={iconClass}>✨</span>
  }
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const ActivityItem = ({ activity, index }: { activity: DashboardActivity; index: number }) => {
    return (
      <div
        key={activity.id}
        className='p-4 bg-linear-to-r from-white/80 to-cream-50/60 rounded-xl border border-cream-200 shadow-soft item-hover'
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        <div className='flex items-center space-x-3 mb-2'>
          <div className='shrink-0'>{activity.icon || getActivityIcon(activity.type)}</div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-warmGray-800 truncate'>{activity.action}</p>
          </div>
          <span className='text-xs text-warmGray-400 shrink-0'>
            {formatTime(activity.timestamp)}
          </span>
        </div>
        <p className='text-xs text-warmGray-600 truncate pl-11'>{activity.itemName}</p>
      </div>
    )
  }

  return (
    <Card variant='soft'>
      <CardHeader>
        <div className='flex items-center space-x-2'>
          <Sparkles className='w-5 h-5 text-lavender-600' />
          <CardTitle className='text-lg font-semibold text-warmGray-800'>最近的小变化</CardTitle>
        </div>
        <p className='text-sm text-warmGray-500 mt-1'>记录每一次美好的改变</p>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className='text-center py-8 text-warmGray-500'>
            <Sparkles className='w-12 h-12 mx-auto mb-3 opacity-50' />
            <p>暂无活动记录</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {activities.map((activity, index) => (
              <ActivityItem key={activity.id} activity={activity} index={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
