import { useQuery } from '@tanstack/react-query'
import { Archive, Heart, Package } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import type { SortType, StorageSchema } from '@/types/spaces'
import { SpaceFilter } from './components/SpaceFilter'
import { SpaceHeader } from './components/SpaceHeader'
import { SpaceStats } from './components/SpaceStats'
import { StorageList } from './components/StorageList'

interface SpaceStat {
  type: 'warm' | 'comfort' | 'overall'
  title: string
  count: number
  subtitle: string
  icon: React.ReactNode
}

const useMockData = async () => {
  const mockStorages: StorageSchema[] = [
    {
      id: '1',
      name: '衣柜',
      type: 'closet',
      capacity: 60,
      itemCount: 45,
      utilization: 75,
      lastOrganized: '2024-12-20T00:00:00Z',
      tags: ['衣物', '日常'],
      items: [],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
      description: '卧室主衣柜，分三层',
      location: '卧室',
    },
    {
      id: '2',
      name: '床头柜',
      type: 'cabinet',
      capacity: 20,
      itemCount: 18,
      utilization: 90,
      lastOrganized: '2024-12-18T00:00:00Z',
      tags: ['家具', '卧室'],
      items: [],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
      description: '双人床头柜',
      location: '卧室',
    },
    {
      id: '3',
      name: '电视柜',
      type: 'cabinet',
      capacity: 40,
      itemCount: 20,
      utilization: 50,
      lastOrganized: '2024-12-19T00:00:00Z',
      tags: ['家具', '客厅'],
      items: [],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
      description: '客厅电视收纳柜',
      location: '客厅',
    },
    {
      id: '4',
      name: '橱柜',
      type: 'cabinet',
      capacity: 80,
      itemCount: 65,
      utilization: 81,
      lastOrganized: '2024-12-21T00:00:00Z',
      tags: ['厨具', '厨房'],
      items: [],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
      description: '整体厨房橱柜',
      location: '厨房',
    },
    {
      id: '5',
      name: '冰箱',
      type: 'other',
      capacity: 50,
      itemCount: 40,
      utilization: 80,
      lastOrganized: '2024-12-17T00:00:00Z',
      tags: ['厨房', '电器'],
      items: [],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
      description: '双开门冰箱',
      location: '厨房',
    },
  ]

  return new Promise<{ data: StorageSchema[] }>(resolve => {
    setTimeout(() => {
      resolve({ data: mockStorages })
    }, 500)
  })
}

const sortStorages = (storages: StorageSchema[], sortType: SortType): StorageSchema[] => {
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

  const [storages, setStorages] = useState<StorageSchema[]>([])
  const [sortType, setSortType] = useState<SortType>('utilization-desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    if (mockData?.data) {
      setStorages(mockData.data)
    }
  }, [mockData])

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    )
  }

  const tags = useMemo(() => {
    const allTags = storages.reduce((acc, storage) => {
      if (storage.tags && storage.tags.length > 0) {
        storage.tags.forEach((tag: string) => {
          acc.add(tag)
        })
      }
      return acc
    }, new Set<string>())

    return Array.from(allTags)
      .map((name, index) => ({ id: index.toString(), name }))
      .slice(0, 8)
  }, [storages])

  const filteredStorages = useMemo(() => {
    let filtered = storages

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        storage =>
          storage.name.toLowerCase().includes(term) || storage.type.toLowerCase().includes(term)
      )
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(storage => selectedTags.every(tag => storage.tags?.includes(tag)))
    }

    return sortStorages(filtered, sortType)
  }, [storages, searchTerm, selectedTags, sortType])

  const handleAddStorage = (storage: StorageSchema) => {
    setStorages(prev => [...prev, storage])
  }

  const spaceStats: SpaceStat[] = useMemo(() => {
    const totalStorages = storages.length
    const avgUtilization =
      totalStorages > 0
        ? storages.reduce((sum, storage) => sum + storage.utilization, 0) / totalStorages
        : 0

    return [
      {
        type: 'warm',
        title: '温馨空间',
        count: 1,
        subtitle: '个空间',
        icon: <Archive className='w-8 h-8' />,
      },
      {
        type: 'comfort',
        title: '收纳物品',
        count: totalStorages,
        subtitle: '个物品',
        icon: <Package className='w-8 h-8' />,
      },
      {
        type: 'overall',
        title: '整体状况',
        count: Math.round(avgUtilization),
        subtitle: '平均利用率%',
        icon: <Heart className='w-8 h-8' />,
      },
    ]
  }, [storages])

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='min-h-screen'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <SpaceHeader onAddStorage={handleAddStorage} />
        <SpaceStats stats={spaceStats} />
        <SpaceFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortType={sortType}
          onSortChange={setSortType}
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />

        <div className='grid grid-cols-1 gap-6'>
          <StorageList storages={filteredStorages} />
        </div>
      </main>
    </div>
  )
}
