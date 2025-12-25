import { Archive, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useSpacesStore } from '@/stores/useSpacesStore'
import type { Room } from '@/types/spaces'
import { getRoomStatus, getRoomStatusColor, ROOM_TYPE_LABELS } from '@/types/spaces'

interface RoomCardProps {
  room: Room
  isSelected: boolean
}

export function RoomCard({ room, isSelected }: RoomCardProps) {
  const { setSelectedRoom } = useSpacesStore()

  const avgUtilization =
    room.storagePoints.length > 0
      ? room.storagePoints.reduce((sum, p) => sum + p.utilization, 0) / room.storagePoints.length
      : 0
  const status = getRoomStatus(avgUtilization)
  const statusColor = getRoomStatusColor(status)

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? `ring-2 ring-${statusColor}-400 ring-offset-2` : 'card-hover border-cream-200'
      }`}
      onClick={() => setSelectedRoom(room.id)}
    >
      <CardContent className='p-4'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <Archive className='w-5 h-5 text-warmGray-600' />
              <h3 className='font-semibold text-warmGray-800'>{room.name}</h3>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='text-xs'>
                {ROOM_TYPE_LABELS[room.type]}
              </Badge>
              <span className='text-xs text-warmGray-600'>{room.area}㎡</span>
            </div>
          </div>
          <Badge
            variant={
              statusColor === 'lemon' ? 'lemon' : statusColor === 'honey' ? 'honey' : 'coral'
            }
            className='text-xs'
          >
            {avgUtilization.toFixed(0)}%
          </Badge>
        </div>

        <div className='flex items-center gap-2 text-xs text-warmGray-600'>
          <Package className='w-3 h-3' />
          <span>{room.storagePoints.length} 个收纳点</span>
        </div>
      </CardContent>
    </Card>
  )
}
