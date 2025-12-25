import { Archive, Home } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Room } from '@/types/spaces'
import { getRoomStatus, getRoomStatusColor, ROOM_TYPE_LABELS } from '@/types/spaces'

interface RoomListProps {
  rooms: Room[]
  selectedRoomId: string | null
  onSelectRoom: (roomId: string) => void
}

export function RoomList({ rooms, selectedRoomId, onSelectRoom }: RoomListProps) {
  const RoomCard = ({
    room,
    isSelected,
    onSelectRoom: handleSelect,
  }: {
    room: Room
    isSelected: boolean
    onSelectRoom: (roomId: string) => void
  }) => {
    const avgUtilization =
      room.storages.length > 0
        ? room.storages.reduce((sum, p) => sum + p.utilization, 0) / room.storages.length
        : 0
    const status = getRoomStatus(avgUtilization)
    const statusColor = getRoomStatusColor(status)

    return (
      <Card
        className={`cursor-pointer transition-all ${
          isSelected ? `ring-1 ring-primary` : 'card-hover border-cream-200'
        }`}
        onClick={() => handleSelect(room.id)}
      >
        <CardContent className='p-4'>
          <div className='flex items-start justify-between mb-3'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1'>
                <Home className='w-5 h-5 text-warmGray-600' />
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

          <div className='flex items-center gap-2 text-xs text-blue-500'>
            <Archive className='w-3 h-3' />
            <span>{room.storages.length} 个收纳点</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='border-cream-200'>
      <CardContent className='p-4'>
        <div className='flex items-center space-x-3 mb-4'>
          <Home className='w-5 h-5 text-warmGray-600' />
          <h3 className='text-lg font-semibold text-warmGray-800'>房间</h3>
          <span className='text-sm text-warmGray-500'>({rooms.length} 个房间)</span>
        </div>
        {rooms.length === 0 ? (
          <div className='text-center py-12 text-warmGray-500'>
            <Archive className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <p>还没有添加房间</p>
            <p className='text-sm'>点击右上角按钮添加你的第一个房间</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {rooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                isSelected={selectedRoomId === room.id}
                onSelectRoom={onSelectRoom}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
