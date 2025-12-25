import { Clock } from 'lucide-react'
import type { DashboardReminder } from '@/api/dashboard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RemindersProps {
  reminders: DashboardReminder[]
}

export function Reminders({ reminders }: RemindersProps) {
  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'coral'
      case 'medium':
        return 'lemon'
      case 'low':
        return 'lavender'
      default:
        return 'honey'
    }
  }

  const ReminderItem = ({ reminder, index }: { reminder: DashboardReminder; index: number }) => {
    return (
      <div
        className='p-4 bg-linear-to-r from-white/80 to-cream-50/60 rounded-xl border border-cream-200 shadow-soft item-hover'
        style={{
          animationDelay: `${(reminders.length + index) * 100}ms`,
        }}
      >
        <div className='flex items-start justify-between mb-2'>
          <h4 className='text-sm font-medium text-warmGray-800'>{reminder.itemName}</h4>
          <Badge variant={getUrgencyBadgeVariant(reminder.urgency)}>
            {reminder.urgency === 'high' ? '紧急' : reminder.urgency === 'medium' ? '重要' : '温和'}
          </Badge>
        </div>
        <p className='text-xs text-warmGray-600 leading-relaxed'>{reminder.description}</p>
        {reminder.dueDate && (
          <p className='text-xs text-warmGray-500 mt-2 flex items-center'>
            <Clock className='w-3 h-3 mr-1' />
            截止: {new Date(reminder.dueDate).toLocaleDateString('zh-CN')}
          </p>
        )}
      </div>
    )
  }

  return (
    <Card variant='warm'>
      <CardHeader>
        <CardTitle>贴心提醒</CardTitle>
        <CardDescription>需要关注的小事情</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {reminders.map((reminder, index) => (
            <ReminderItem key={reminder.id} reminder={reminder} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
