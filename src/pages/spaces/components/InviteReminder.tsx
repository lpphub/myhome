import { Bell, ChevronRight } from 'lucide-react'
import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface InviteReminderProps {
  count: number
  onClick: () => void
}

export const InviteReminder = memo(({ count, onClick }: InviteReminderProps) => {
  if (count === 0) return null

  return (
    <Card
      variant='warm'
      className='mb-6 border-honey-300 hover:shadow-md transition-shadow cursor-pointer'
      onClick={onClick}
    >
      <CardContent className='py-1 px-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <Bell className='w-5 h-5 text-coral-500' />
              <Badge
                variant='coral'
                className='absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs'
              >
                {count}
              </Badge>
            </div>
            <p className='text-sm text-foreground'>点击查看邀请并接受协作</p>
          </div>
          <ChevronRight className='w-5 h-5 text-gray-400' />
        </div>
      </CardContent>
    </Card>
  )
})

InviteReminder.displayName = 'InviteReminder'
