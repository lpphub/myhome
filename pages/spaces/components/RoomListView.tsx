import { Archive, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useSpacesStore } from '@/stores/useSpacesStore'
import { getRoomStatus, getRoomStatusColor, ROOM_TYPE_LABELS } from '@/types/spaces'

export function RoomListView() {
  const { rooms, selectedRoomId, setSelectedRoom } = useSpacesStore()

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold text-warmGray-800'>所有房间 ({rooms.length})</h2>
      </div>

      {rooms.length === 0 ? (
        <div className='text-center py-12 text-warmGray-500'>
          <Archive className='w-16 h-16 mx-auto mb-4 opacity-50' />
          <p>还没有添加房间</p>
          <p className='text-sm'>点击上方按钮添加你的第一个房间</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {rooms.map(room => {
            const avgUtilization =
              room.storagePoints.length > 0
                ? room.storagePoints.reduce((sum, p) => sum + p.utilization, 0) /
                  room.storagePoints.length
                : 0
            const status = getRoomStatus(avgUtilization)
            const statusColor = getRoomStatusColor(status)
            const isSelected = selectedRoomId === room.id

            return (
              <Card
                key={room.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? `border-${statusColor}-400 bg-${statusColor}-50`
                    : 'border-cream-200 hover:border-honey-300'
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
                        statusColor === 'lemon'
                          ? 'lemon'
                          : statusColor === 'honey'
                            ? 'honey'
                            : 'coral'
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
          })}
        </div>
      )}
    </div>
  )
}
