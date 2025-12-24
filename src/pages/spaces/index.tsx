import { useQuery } from '@tanstack/react-query'
import { Archive, Heart, Home, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Room, SortType, Storage, StorageItem } from '@/types/spaces'
import { AddItemDrawer, type AddItemDrawerRef } from './components/AddItemDrawer'
import { AddRoomDrawer } from './components/AddRoomDrawer'
import { RoomCard } from './components/RoomCard'
import { SortDropdown } from './components/SortDropdown'
import { StoragePointCard } from './components/StorageCard'

interface SpaceStat {
  type: 'warm' | 'comfort' | 'overall'
  title: string
  count: number
  subtitle: string
  icon: React.ReactNode
}

interface HomeTip {
  icon: React.ReactNode
  text: string
  id: string
}

const SpaceTitle = ({ onAddRoom }: { onAddRoom: (room: Room) => void }) => {
  return (
    <div className='flex items-center justify-between mb-8'>
      <div className='flex items-center space-x-4'>
        <div className='w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center'>
          <Archive className='w-8 h-8 text-pink-600' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-warmGray-600 mb-2'>家庭空间</h1>
          <p className='text-warmGray-400'>每个空间都承载着生活的美好</p>
        </div>
      </div>
      <AddRoomDrawer onAddRoom={onAddRoom} />
    </div>
  )
}

const SpaceStats = ({ stats }: { stats: SpaceStat[] }) => {
  const getStyleByType = (type: 'warm' | 'comfort' | 'overall') => {
    const styles = {
      warm: {
        bgClass: 'bg-amber-50',
        iconBgClass: 'bg-amber-200',
        iconColor: 'text-amber-700',
        textColor: 'text-amber-800',
        numberColor: 'text-amber-900',
        subtitleColor: 'text-amber-600',
      },
      comfort: {
        bgClass: 'bg-rose-50',
        iconBgClass: 'bg-rose-200',
        iconColor: 'text-rose-700',
        textColor: 'text-rose-800',
        numberColor: 'text-rose-900',
        subtitleColor: 'text-rose-600',
      },
      overall: {
        bgClass: 'bg-purple-50',
        iconBgClass: 'bg-purple-200',
        iconColor: 'text-purple-700',
        textColor: 'text-purple-800',
        numberColor: 'text-purple-900',
        subtitleColor: 'text-purple-600',
      },
    }
    return styles[type]
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
      {stats.map(stat => {
        const style = getStyleByType(stat.type)
        return (
          <Card
            key={stat.type}
            variant='warm'
            className={`relative py-3 card-hover ${style.bgClass}`}
          >
            <div className='flex items-center space-x-4 py-1.5 px-3'>
              <div className={`p-2 rounded-lg shadow-soft ${style.iconBgClass}`}>
                <div className={style.iconColor}>{stat.icon}</div>
              </div>
              <div>
                <p className={`text-sm font-medium mb-1 ${style.textColor}`}>{stat.title}</p>
                <p className={`text-2xl font-hand font-bold ${style.numberColor}`}>{stat.count}</p>
                <p className={`text-xs mt-1 ${style.subtitleColor}`}>{stat.subtitle}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

const HomeTips = ({ tips }: { tips: HomeTip[] }) => {
  return (
    <Card className='border-cream-200'>
      <CardHeader className='pb-1'>
        <div className='flex items-center space-x-2'>
          <Sparkles className='w-4 h-4 text-lavender-600' />
          <CardTitle className='text-base font-semibold text-warmGray-800'>家居小贴士</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {tips.map(tip => (
            <div key={tip.id} className='flex items-start gap-2 p-2 bg-white/50 rounded-lg'>
              <span className='mt-0.5'>{tip.icon}</span>
              <span className='text-warmGray-700 text-xs leading-relaxed'>{tip.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface RoomListProps {
  rooms: Room[]
  selectedRoomId: string | null
  onSelectRoom: (roomId: string) => void
}

const RoomList = ({ rooms, selectedRoomId, onSelectRoom }: RoomListProps) => {
  return (
    <Card className='border-cream-200'>
      <CardHeader className='pb-4'>
        <div className='flex items-center space-x-3'>
          <Home className='w-5 h-5 text-warmGray-600' />
          <CardTitle className='text-lg font-semibold text-warmGray-800'>房间</CardTitle>
          <span className='text-sm text-warmGray-500'>({rooms.length} 个房间)</span>
        </div>
      </CardHeader>
      <CardContent>
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

interface StorageListProps {
  room: Room
  sortedStorages: Storage[]
  sortType: SortType
  onChangeSortType: (type: SortType) => void
  onAddItem: (pointId: string) => void
}

const StorageList = ({
  room,
  sortedStorages,
  sortType,
  onChangeSortType,
  onAddItem,
}: StorageListProps) => {
  return (
    <Card className='border-cream-200'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Archive className='w-5 h-5 text-warmGray-600' />
            <div>
              <CardTitle className='text-lg font-semibold text-warmGray-800'>收纳空间</CardTitle>
              <p className='text-sm text-warmGray-500 mt-1'>
                {room.name} · {sortedStorages.length} 个收纳点
              </p>
            </div>
          </div>
          <SortDropdown sortType={sortType} onChangeSortType={onChangeSortType} />
        </div>
      </CardHeader>
      <CardContent>
        {sortedStorages.length === 0 ? (
          <div className='text-center py-12 text-warmGray-500'>
            <Archive className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <p>该房间还没有收纳点</p>
            <p className='text-sm'>稍后添加吧</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {sortedStorages.map(storage => (
              <StoragePointCard key={storage.id} point={storage} onAddItem={onAddItem} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const useMockData = () => {
  const mockRooms: Room[] = [
    {
      id: '1',
      name: '主卧',
      type: 'bedroom',
      area: 20,
      position: { x: 10, y: 10, width: 30, height: 40 },
      storages: [
        {
          id: '1-1',
          roomId: '1',
          name: '衣柜',
          type: 'closet',
          capacity: 60,
          itemCount: 45,
          utilization: 75,
          lastOrganized: '2024-12-20T00:00:00Z',
          items: [],
          createdAt: '2024-12-01T00:00:00Z',
          updatedAt: '2024-12-01T00:00:00Z',
        },
        {
          id: '1-2',
          roomId: '1',
          name: '床头柜',
          type: 'cabinet',
          capacity: 20,
          itemCount: 18,
          utilization: 90,
          lastOrganized: '2024-12-18T00:00:00Z',
          items: [],
          createdAt: '2024-12-01T00:00:00Z',
          updatedAt: '2024-12-01T00:00:00Z',
        },
      ],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
    },
    {
      id: '2',
      name: '客厅',
      type: 'living',
      area: 35,
      position: { x: 50, y: 10, width: 40, height: 35 },
      storages: [
        {
          id: '2-1',
          roomId: '2',
          name: '电视柜',
          type: 'cabinet',
          capacity: 40,
          itemCount: 20,
          utilization: 50,
          lastOrganized: '2024-12-19T00:00:00Z',
          items: [],
          createdAt: '2024-12-01T00:00:00Z',
          updatedAt: '2024-12-01T00:00:00Z',
        },
      ],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
    },
    {
      id: '3',
      name: '厨房',
      type: 'kitchen',
      area: 15,
      position: { x: 10, y: 60, width: 25, height: 30 },
      storages: [
        {
          id: '3-1',
          roomId: '3',
          name: '橱柜',
          type: 'cabinet',
          capacity: 80,
          itemCount: 65,
          utilization: 81,
          lastOrganized: '2024-12-21T00:00:00Z',
          items: [],
          createdAt: '2024-12-01T00:00:00Z',
          updatedAt: '2024-12-01T00:00:00Z',
        },
        {
          id: '3-2',
          roomId: '3',
          name: '冰箱',
          type: 'other',
          capacity: 50,
          itemCount: 40,
          utilization: 80,
          lastOrganized: '2024-12-17T00:00:00Z',
          items: [],
          createdAt: '2024-12-01T00:00:00Z',
          updatedAt: '2024-12-01T00:00:00Z',
        },
      ],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
    },
  ]

  return { data: mockRooms }
}

const sortStorages = (storages: Storage[], sortType: SortType): Storage[] => {
  const sorted = [...storages]
  switch (sortType) {
    case 'utilization-desc':
      return sorted.sort((a, b) => b.utilization - a.utilization)
    case 'utilization-asc':
      return sorted.sort((a, b) => a.utilization - b.utilization)
    case 'count-desc':
      return sorted.sort((a, b) => b.itemCount - a.itemCount)
    case 'count-asc':
      return sorted.sort((a, b) => a.itemCount - b.itemCount)
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'date-desc':
      return sorted.sort((a, b) => (b.lastOrganized || '').localeCompare(a.lastOrganized || ''))
    case 'date-asc':
      return sorted.sort((a, b) => (a.lastOrganized || '').localeCompare(b.lastOrganized || ''))
    default:
      return sorted
  }
}

export default function Spaces() {
  const { data: mockData, isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: useMockData,
  })

  // 内部状态
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [sortType, setSortType] = useState<SortType>('utilization-desc')
  const addItemDrawerRef = useRef<AddItemDrawerRef>(null)

  // 同步 API 数据
  useEffect(() => {
    if (mockData?.data) {
      setRooms(mockData.data)
    }
  }, [mockData])

  // 计算选中的房间
  const selectedRoom = useMemo(
    () => rooms.find(r => r.id === selectedRoomId) || null,
    [rooms, selectedRoomId]
  )

  // 计算排序后的收纳点
  const sortedStorages = useMemo(() => {
    const storages = selectedRoom?.storages || []
    return sortStorages(storages, sortType)
  }, [selectedRoom, sortType])

  // 操作函数
  const handleAddRoom = (room: Room) => {
    setRooms(prev => [...prev, room])
  }

  const handleAddItem = (pointId: string, item: StorageItem) => {
    setRooms(prev =>
      prev.map(room => ({
        ...room,
        storagePoints: room.storages.map(point =>
          point.id === pointId
            ? {
                ...point,
                itemCount: point.itemCount + item.quantity,
                items: [...point.items, item],
              }
            : point
        ),
      }))
    )
  }

  const handleOpenAddItem = (pointId: string) => {
    addItemDrawerRef.current?.open(pointId)
  }

  // 统计数据
  const spaceStats: SpaceStat[] = useMemo(() => {
    const totalRooms = rooms.length
    const totalStoragePoints = rooms.reduce((sum, room) => sum + room.storages.length, 0)
    const avgUtilization =
      totalStoragePoints > 0
        ? rooms.reduce(
            (sum, room) =>
              sum + room.storages.reduce((acc, p) => acc + p.utilization, 0) / room.storages.length,
            0
          ) / rooms.length
        : 0

    return [
      {
        type: 'warm',
        title: '温馨房间',
        count: totalRooms,
        subtitle: '个房间',
        icon: <Home className='w-8 h-8' />,
      },
      {
        type: 'comfort',
        title: '收纳空间',
        count: totalStoragePoints,
        subtitle: '个收纳点',
        icon: <Archive className='w-8 h-8' />,
      },
      {
        type: 'overall',
        title: '整体状况',
        count: Math.round(avgUtilization),
        subtitle: '平均利用率%',
        icon: <Heart className='w-8 h-8' />,
      },
    ]
  }, [rooms])

  const homeTips: HomeTip[] = [
    {
      icon: <Heart className='w-4 h-4 text-lemon-500' />,
      text: '定期整理能让家居空间更加舒适',
      id: 'tip-1',
    },
    {
      icon: <Archive className='w-4 h-4 text-orange-500' />,
      text: '保持70%以下的使用率更加舒适',
      id: 'tip-2',
    },
    {
      icon: <Sparkles className='w-4 h-4 text-purple-500' />,
      text: '合理分类让找物品更轻松',
      id: 'tip-3',
    },
  ]

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='min-h-screen'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <SpaceTitle onAddRoom={handleAddRoom} />
        <SpaceStats stats={spaceStats} />

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3 space-y-6'>
            <RoomList
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              onSelectRoom={setSelectedRoomId}
            />

            {selectedRoom && (
              <StorageList
                room={selectedRoom}
                sortedStorages={sortedStorages}
                sortType={sortType}
                onChangeSortType={setSortType}
                onAddItem={handleOpenAddItem}
              />
            )}
          </div>

          <div className='lg:col-span-1'>
            <HomeTips tips={homeTips} />
          </div>
        </div>
      </main>

      <AddItemDrawer ref={addItemDrawerRef} onAddItem={handleAddItem} />
    </div>
  )
}
