import { Clock, Edit2, Package, Plus } from 'lucide-react'
import { useState } from 'react'
import type { StoragePoint } from '@/types/spaces'
import { STORAGE_TYPE_LABELS, getRoomStatus, getRoomStatusColor } from '@/types/spaces'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useSpacesStore } from '@/stores/useSpacesStore'

interface StoragePointCardProps {
  point: StoragePoint
}

export function StoragePointCard({ point }: StoragePointCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { setAddItemDrawerOpen, setActiveStoragePointId } = useSpacesStore()

  const status = getRoomStatus(point.utilization)
  const statusColor = getRoomStatusColor(status)

  const handleAddItem = () => {
    setActiveStoragePointId(point.id)
    setAddItemDrawerOpen(true)
  }

  const formatLastOrganized = (date?: string) => {
    if (!date) return '未整理'
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    if (days < 30) return `${Math.floor(days / 7)}周前`
    return `${Math.floor(days / 30)}个月前`
  }

  return (
    <Card
      className='bg-gradient-to-br from-white to-cream-50 border-cream-200 shadow-soft card-hover cursor-pointer relative overflow-hidden group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className='p-4'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <Package className='w-5 h-5 text-warmGray-600' />
              <h3 className='font-semibold text-warmGray-800'>{point.name}</h3>
            </div>
            <Badge
              variant={
                statusColor === 'lemon' ? 'lemon' : statusColor === 'honey' ? 'honey' : 'coral'
              }
              className='text-xs'
            >
              {STORAGE_TYPE_LABELS[point.type]}
            </Badge>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-warmGray-600'>
              {point.itemCount} / {point.capacity}
            </span>
            <span
              className={
                statusColor === 'lemon'
                  ? 'font-medium text-lemon-700'
                  : statusColor === 'honey'
                    ? 'font-medium text-honey-700'
                    : 'font-medium text-coral-700'
              }
            >
              {point.utilization}%
            </span>
          </div>

          <Progress value={point.utilization} className={`h-2 bg-cream-100`} />
          <Progress
            value={point.utilization}
            className={`h-2 -mt-2 bg-transparent`}
            style={{
              background: `linear-gradient(90deg, ${statusColor === 'lemon' ? '#a3e01f' : statusColor === 'honey' ? '#dfaa50' : '#ff7250'} ${point.utilization}%, transparent ${point.utilization}%)`,
            }}
          />
        </div>

        <div className='flex items-center gap-2 mt-3 text-xs text-warmGray-600'>
          <Clock className='w-3 h-3' />
          <span>距离上次整理：{formatLastOrganized(point.lastOrganized)}</span>
        </div>

        <div
          className={`absolute top-2 right-2 flex gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <Button
            size='icon'
            variant='ghost'
            className='h-8 w-8'
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='h-8 w-8'
            onClick={e => {
              e.stopPropagation()
              handleAddItem()
            }}
          >
            <Plus className='w-4 h-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
