import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RecentActivity } from '@/types/items'

interface ItemSidebarProps {
  activities: RecentActivity[]
}

export function ItemSidebar({ activities }: ItemSidebarProps) {
  const ActivitySection = () => {
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

    return (
      <Card className='border-cream-200 gap-3'>
        <CardHeader className='pb-0'>
          <div className='flex items-center space-x-2'>
            <Sparkles className='w-5 h-5 text-lavender-600' />
            <CardTitle className='text-lg font-semibold text-warmGray-800'>最近活动</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          {activities.length === 0 ? (
            <div className='text-center py-8 text-warmGray-500'>
              <Sparkles className='w-12 h-12 mx-auto mb-3 opacity-50' />
              <p>暂无活动记录</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {activities.slice(0, 8).map(activity => (
                <div
                  key={activity.id}
                  className='flex items-start space-x-3 p-2 hover:bg-cream-50 rounded-lg transition-colors'
                >
                  <div className='shrink-0 mt-0.5'>{activity.icon}</div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-warmGray-700 truncate'>{activity.action}</p>
                    <p className='text-xs text-warmGray-500 truncate mt-0.5'>{activity.itemName}</p>
                  </div>
                  <span className='text-xs text-warmGray-400 shrink-0'>
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='lg:col-span-1 space-y-6'>
      <ActivitySection />
    </div>
  )
}
