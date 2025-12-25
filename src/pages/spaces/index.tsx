import { useQuery } from '@tanstack/react-query'
import { Archive, Heart, Home, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import type { Room, SortType, Storage } from '@/types/spaces'
import { RoomList } from './components/RoomList'
import { SpaceSidebar } from './components/SpaceSidebar'
import { SpaceStats } from './components/SpaceStats'
import { SpaceTitle } from './components/SpaceTitle'
import { StorageList } from './components/StorageList'

interface SpaceStat {
  type: 'warm' | 'comfort' | 'overall'
  title: string
  count: number
  subtitle: string
  icon: React.ReactNode
}

const useMockData = async () => {
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

  return new Promise<{ data: Room[] }>(resolve => {
    setTimeout(() => {
      resolve({ data: mockRooms })
    }, 500)
  })
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

  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [sortType, setSortType] = useState<SortType>('utilization-desc')

  useEffect(() => {
    if (mockData?.data) {
      setRooms(mockData.data)
      if (mockData.data.length > 0) {
        setSelectedRoomId(mockData.data[0].id)
      }
    }
  }, [mockData])

  const selectedRoom = useMemo(
    () => rooms.find(r => r.id === selectedRoomId) || null,
    [rooms, selectedRoomId]
  )

  const sortedStorages = useMemo(() => {
    const storages = selectedRoom?.storages || []
    return sortStorages(storages, sortType)
  }, [selectedRoom, sortType])

  const handleAddRoom = (room: Room) => {
    setRooms(prev => [...prev, room])
  }

  const handleAddStorage = (storage: Storage) => {
    setRooms(prev =>
      prev.map(room =>
        room.id === storage.roomId ? { ...room, storages: [...room.storages, storage] } : room
      )
    )
  }

  const spaceStats: SpaceStat[] = useMemo(() => {
    const totalRooms = rooms.length
    const totalStorages = rooms.reduce((sum, room) => sum + room.storages.length, 0)
    const avgUtilization =
      totalStorages > 0
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
        count: totalStorages,
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

  const homeTips = [
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
        <SpaceTitle onAddRoom={handleAddRoom} onAddStorage={handleAddStorage} rooms={rooms} />
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
              />
            )}
          </div>

          <SpaceSidebar tips={homeTips} />
        </div>
      </main>
    </div>
  )
}
