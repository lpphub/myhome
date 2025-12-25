import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSpacesStore } from '@/stores/useSpacesStore'
import type { Room, StoragePoint } from '@/types/spaces'
import { getRoomStatus, getRoomStatusColor, ROOM_TYPE_LABELS } from '@/types/spaces'

interface RoomNodeProps {
  room: Room
  isSelected: boolean
  onClick: () => void
}

function RoomNode({ room, isSelected, onClick }: RoomNodeProps) {
  const avgUtilization =
    room.storagePoints.length > 0
      ? room.storagePoints.reduce((sum: number, p: StoragePoint) => sum + p.utilization, 0) /
        room.storagePoints.length
      : 0
  const status = getRoomStatus(avgUtilization)
  const statusColor = getRoomStatusColor(status)

  const bgColors = {
    spacious: 'bg-lemon-100',
    comfortable: 'bg-honey-100',
    crowded: 'bg-coral-100',
  }
  const borderColors = {
    spacious: 'border-lemon-300',
    comfortable: 'border-honey-300',
    crowded: 'border-coral-300',
  }

  return (
    <div
      id={`room-${room.id}`}
      className={`absolute cursor-pointer transition-all ${bgColors[status]} ${borderColors[status]} border-2 ${isSelected ? `ring-2 ring-${statusColor}-400 ring-offset-2` : ''} hover:shadow-lg`}
      style={{
        left: `${room.position.x}%`,
        top: `${room.position.y}%`,
        width: `${room.position.width}%`,
        height: `${room.position.height}%`,
      }}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick()
        }
      }}
      role='button'
      tabIndex={0}
      aria-label={room.name}
      data-room-id={room.id}
    >
      <div className='p-2 h-full flex flex-col justify-center items-center text-center'>
        <div className='font-semibold text-warmGray-800 text-sm mb-1'>{room.name}</div>
        <div className='text-xs text-warmGray-600 mb-1'>
          {ROOM_TYPE_LABELS[room.type as keyof typeof ROOM_TYPE_LABELS]}
        </div>
        <Badge
          variant={statusColor === 'lemon' ? 'lemon' : statusColor === 'honey' ? 'honey' : 'coral'}
          className='text-xs'
        >
          {avgUtilization.toFixed(0)}%
        </Badge>
        <div className='text-xs text-warmGray-500 mt-1'>{room.storagePoints.length} 个收纳点</div>
      </div>
    </div>
  )
}

export function FloorPlanEditor() {
  const { rooms, selectedRoomId, setSelectedRoom, updateRoomPosition } = useSpacesStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    if (delta.x === 0 && delta.y === 0) return

    const roomId = active.id as string
    const room = rooms.find(r => r.id === roomId)
    if (!room) return

    const newX = Math.max(0, Math.min(90, room.position.x + delta.x * 0.1))
    const newY = Math.max(0, Math.min(90, room.position.y + delta.y * 0.1))

    updateRoomPosition(roomId, {
      ...room.position,
      x: newX,
      y: newY,
    })
  }

  return (
    <Card className='border-cream-200'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <MapPin className='w-5 h-5 text-warmGray-600' />
            <CardTitle className='text-lg font-semibold text-warmGray-800'>房屋平面图</CardTitle>
          </div>
          <div className='hidden md:flex items-center space-x-4 text-sm'>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-lemon-500 rounded-full'></div>
              <span className='text-warmGray-600'>宽敞</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-honey-500 rounded-full'></div>
              <span className='text-warmGray-600'>刚好</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-coral-500 rounded-full'></div>
              <span className='text-warmGray-600'>拥挤</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='hidden md:block'>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className='relative w-full h-[500px] bg-gradient-to-br from-cream-50 to-honey-50 rounded-xl border-2 border-dashed border-cream-300 overflow-hidden'>
              {rooms.length === 0 ? (
                <div className='absolute inset-0 flex flex-col items-center justify-center text-warmGray-400'>
                  <MapPin className='w-16 h-16 mb-4 opacity-50' />
                  <p>点击右上角"添加新房间"开始</p>
                  <p className='text-sm mt-2'>拖拽房间可调整位置</p>
                </div>
              ) : (
                rooms.map(room => (
                  <RoomNode
                    key={room.id}
                    room={room}
                    isSelected={selectedRoomId === room.id}
                    onClick={() => setSelectedRoom(room.id)}
                  />
                ))
              )}
            </div>
          </DndContext>
        </div>

        <div className='md:hidden'>
          <div className='relative w-full h-[400px] bg-gradient-to-br from-cream-50 to-honey-50 rounded-xl border-2 border-dashed border-cream-300 overflow-hidden'>
            {rooms.length === 0 ? (
              <div className='absolute inset-0 flex flex-col items-center justify-center text-warmGray-400'>
                <MapPin className='w-12 h-12 mb-3 opacity-50' />
                <p className='text-sm'>暂无房间</p>
                <p className='text-xs mt-2'>点击上方按钮添加房间</p>
              </div>
            ) : (
              rooms.map(room => (
                <RoomNode
                  key={room.id}
                  room={room}
                  isSelected={selectedRoomId === room.id}
                  onClick={() => setSelectedRoom(room.id)}
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
