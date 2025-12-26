import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import type { Item, RecentActivity, SortByType, ViewMode } from '@/types/items'
import { ItemFilter } from './components/ItemFilter'
import { ItemHeader } from './components/ItemHeader'
import { ItemList } from './components/ItemList'
import { ItemSidebar } from './components/ItemSidebar'

const useMockData = async () => {
  const mockItems: Item[] = [
    {
      id: 1,
      storageId: 1,
      name: '白色棉质T恤',
      quantity: 3,
      description: '100%纯棉，舒适透气',
      tags: ['日常', '夏季'],
      status: 'active',
      location: '主卧衣柜第二层',
      createdAt: '2024-12-20T00:00:00Z',
      updatedAt: '2024-12-20T00:00:00Z',
    },
    {
      id: 2,
      storageId: 1,
      name: '苹果iPhone 15',
      quantity: 1,
      description: '128GB 黑色',
      tags: ['电子', '贵重'],
      status: 'active',
      location: '床头柜抽屉',
      createdAt: '2024-12-21T00:00:00Z',
      updatedAt: '2024-12-21T00:00:00Z',
    },
    {
      id: 3,
      storageId: 2,
      name: '人类简史',
      quantity: 1,
      description: '尤瓦尔·赫拉利著作',
      tags: ['书籍', '历史'],
      status: 'active',
      location: '书架第三层',
      createdAt: '2024-12-22T00:00:00Z',
      updatedAt: '2024-12-22T00:00:00Z',
    },
    {
      id: 4,
      storageId: 3,
      name: '陶瓷花瓶',
      quantity: 2,
      description: '手工制作，简约设计',
      tags: ['装饰', '易碎'],
      status: 'active',
      location: '电视柜左侧',
      createdAt: '2024-12-23T00:00:00Z',
      updatedAt: '2024-12-23T00:00:00Z',
    },
    {
      id: 5,
      storageId: 4,
      name: '不粘平底锅',
      quantity: 1,
      description: '28cm，含木质锅盖',
      tags: ['厨具', '日常'],
      status: 'active',
      location: '橱柜上层',
      createdAt: '2024-12-24T00:00:00Z',
      updatedAt: '2024-12-24T00:00:00Z',
    },
    {
      id: 6,
      storageId: 1,
      name: '牛仔外套',
      quantity: 1,
      description: '浅蓝色，春秋款',
      tags: ['衣物', '春秋'],
      status: 'inactive',
      location: '主卧衣柜第三层',
      createdAt: '2024-12-19T00:00:00Z',
      updatedAt: '2024-12-19T00:00:00Z',
    },
  ]

  const mockActivities: RecentActivity[] = [
    {
      id: 1,
      action: '添加了新物品',
      itemName: '不粘平底锅',
      timestamp: '2024-12-24T10:30:00Z',
      icon: <span className='text-lg'>🍳</span>,
    },
    {
      id: 2,
      action: '更新了物品信息',
      itemName: '白色棉质T恤',
      timestamp: '2024-12-23T14:20:00Z',
      icon: <span className='text-lg'>👕</span>,
    },
    {
      id: 3,
      action: '添加了新物品',
      itemName: '陶瓷花瓶',
      timestamp: '2024-12-23T09:15:00Z',
      icon: <span className='text-lg'>🎨</span>,
    },
    {
      id: 4,
      action: '添加了新物品',
      itemName: '人类简史',
      timestamp: '2024-12-22T16:45:00Z',
      icon: <span className='text-lg'>📚</span>,
    },
    {
      id: 5,
      action: '添加了新物品',
      itemName: '苹果iPhone 15',
      timestamp: '2024-12-21T11:30:00Z',
      icon: <span className='text-lg'>📱</span>,
    },
    {
      id: 6,
      action: '添加了新物品',
      itemName: '白色棉质T恤',
      timestamp: '2024-12-20T13:20:00Z',
      icon: <span className='text-lg'>👕</span>,
    },
    {
      id: 7,
      action: '添加了新物品',
      itemName: '牛仔外套',
      timestamp: '2024-12-19T15:10:00Z',
      icon: <span className='text-lg'>👔</span>,
    },
    {
      id: 8,
      action: '系统初始化',
      itemName: '欢迎使用物品收纳',
      timestamp: '2024-12-18T00:00:00Z',
      icon: <span className='text-lg'>✨</span>,
    },
  ]

  return new Promise<{ data: { items: Item[]; activities: RecentActivity[] } }>(resolve => {
    setTimeout(() => {
      resolve({ data: { items: mockItems, activities: mockActivities } })
    }, 500)
  })
}

const sortItems = (items: Item[], sortBy: SortByType): Item[] => {
  const sorted = [...items]
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'date-asc':
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    case 'date-desc':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'quantity-asc':
      return sorted.sort((a, b) => a.quantity - b.quantity)
    case 'quantity-desc':
      return sorted.sort((a, b) => b.quantity - a.quantity)
    default:
      return sorted
  }
}

export default function Items() {
  const { data: mockData, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: useMockData,
  })

  const [items, setItems] = useState<Item[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [sortBy, setSortBy] = useState<SortByType>('date-desc')

  useEffect(() => {
    if (mockData?.data) {
      setItems(mockData.data.items)
      setActivities(mockData.data.activities)
    }
  }, [mockData])

  const filteredItems = useMemo(() => {
    let filtered = items

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.location?.toLowerCase().includes(term)
      )
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus)
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(item => selectedTags.every(tag => item.tags?.includes(tag)))
    }

    return sortItems(filtered, sortBy)
  }, [items, searchTerm, selectedStatus, selectedTags, sortBy])

  const tags = useMemo(() => {
    const allTags = items.reduce((acc, item) => {
      if (item.tags && item.tags.length > 0) {
        item.tags.forEach(tag => {
          acc.add(tag)
        })
      }
      return acc
    }, new Set<string>())

    return Array.from(allTags)
      .map((name, index) => ({ id: index.toString(), name }))
      .slice(0, 8)
  }, [items])

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    )
  }

  const handleAddItem = (item: Item) => {
    setItems(prev => [item, ...prev])
    setActivities(prev => [
      {
        id: Date.now(),
        action: '添加了新物品',
        itemName: item.name,
        timestamp: new Date().toISOString(),
        icon: <span className='text-lg'>📦</span>,
      },
      ...prev,
    ])
  }

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='min-h-screen'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <ItemHeader onAddItem={handleAddItem} />

        <ItemFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3'>
            <ItemList items={filteredItems} viewMode={viewMode} />
          </div>

          <ItemSidebar activities={activities} />
        </div>
      </main>
    </div>
  )
}
