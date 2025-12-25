import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import type { Item, ItemCategory, RecentActivity, SortByType, ViewMode } from '@/types/items'
import { CATEGORY_ICONS, ITEM_CATEGORY_LABELS } from '@/types/items'
import { ItemFilter } from './components/ItemFilter'
import { ItemList } from './components/ItemList'
import { ItemSidebar } from './components/ItemSidebar'
import { ItemTitle } from './components/ItemTitle'

const useMockData = async () => {
  const mockItems: Item[] = [
    {
      id: '1',
      storagePointId: '1-1',
      name: '白色棉质T恤',
      category: 'clothing',
      type: '上衣',
      quantity: 3,
      price: 89,
      description: '100%纯棉，舒适透气',
      status: 'active',
      location: '主卧衣柜第二层',
      createdAt: '2024-12-20T00:00:00Z',
      updatedAt: '2024-12-20T00:00:00Z',
    },
    {
      id: '2',
      storagePointId: '1-1',
      name: '苹果iPhone 15',
      category: 'electronics',
      type: '手机',
      quantity: 1,
      price: 6999,
      description: '128GB 黑色',
      status: 'active',
      location: '床头柜抽屉',
      createdAt: '2024-12-21T00:00:00Z',
      updatedAt: '2024-12-21T00:00:00Z',
    },
    {
      id: '3',
      storagePointId: '1-2',
      name: '人类简史',
      category: 'books',
      type: '历史类',
      quantity: 1,
      price: 68,
      description: '尤瓦尔·赫拉利著作',
      status: 'active',
      location: '书架第三层',
      createdAt: '2024-12-22T00:00:00Z',
      updatedAt: '2024-12-22T00:00:00Z',
    },
    {
      id: '4',
      storagePointId: '2-1',
      name: '陶瓷花瓶',
      category: 'decor',
      type: '装饰品',
      quantity: 2,
      price: 199,
      description: '手工制作，简约设计',
      status: 'active',
      location: '电视柜左侧',
      createdAt: '2024-12-23T00:00:00Z',
      updatedAt: '2024-12-23T00:00:00Z',
    },
    {
      id: '5',
      storagePointId: '3-1',
      name: '不粘平底锅',
      category: 'kitchen',
      type: '厨具',
      quantity: 1,
      price: 299,
      description: '28cm，含木质锅盖',
      status: 'active',
      location: '橱柜上层',
      createdAt: '2024-12-24T00:00:00Z',
      updatedAt: '2024-12-24T00:00:00Z',
    },
    {
      id: '6',
      storagePointId: '1-1',
      name: '牛仔外套',
      category: 'clothing',
      type: '外套',
      quantity: 1,
      price: 399,
      description: '浅蓝色，春秋款',
      status: 'inactive',
      location: '主卧衣柜第三层',
      createdAt: '2024-12-19T00:00:00Z',
      updatedAt: '2024-12-19T00:00:00Z',
    },
  ]

  const mockActivities: RecentActivity[] = [
    {
      id: '1',
      action: '添加了新物品',
      itemName: '不粘平底锅',
      timestamp: '2024-12-24T10:30:00Z',
      icon: <span className='text-lg'>🍳</span>,
    },
    {
      id: '2',
      action: '更新了物品信息',
      itemName: '白色棉质T恤',
      timestamp: '2024-12-23T14:20:00Z',
      icon: <span className='text-lg'>👕</span>,
    },
    {
      id: '3',
      action: '添加了新物品',
      itemName: '陶瓷花瓶',
      timestamp: '2024-12-23T09:15:00Z',
      icon: <span className='text-lg'>🎨</span>,
    },
    {
      id: '4',
      action: '添加了新物品',
      itemName: '人类简史',
      timestamp: '2024-12-22T16:45:00Z',
      icon: <span className='text-lg'>📚</span>,
    },
    {
      id: '5',
      action: '添加了新物品',
      itemName: '苹果iPhone 15',
      timestamp: '2024-12-21T11:30:00Z',
      icon: <span className='text-lg'>📱</span>,
    },
    {
      id: '6',
      action: '添加了新物品',
      itemName: '白色棉质T恤',
      timestamp: '2024-12-20T13:20:00Z',
      icon: <span className='text-lg'>👕</span>,
    },
    {
      id: '7',
      action: '添加了新物品',
      itemName: '牛仔外套',
      timestamp: '2024-12-19T15:10:00Z',
      icon: <span className='text-lg'>👔</span>,
    },
    {
      id: '8',
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
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

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus)
    }

    return sortItems(filtered, sortBy)
  }, [items, searchTerm, selectedCategory, selectedStatus, sortBy])

  const categories = useMemo(() => {
    const categoryCount = items.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return Object.entries(ITEM_CATEGORY_LABELS).map(([type, name]) => ({
      id: type,
      name,
      type: type as ItemCategory,
      count: categoryCount[type] || 0,
      icon: <span className='text-xl'>{CATEGORY_ICONS[type as ItemCategory]}</span>,
    }))
  }, [items])

  const handleAddItem = (item: Item) => {
    setItems(prev => [item, ...prev])
    setActivities(prev => [
      {
        id: Date.now().toString(),
        action: '添加了新物品',
        itemName: item.name,
        timestamp: new Date().toISOString(),
        icon: <span className='text-lg'>{CATEGORY_ICONS[item.category]}</span>,
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
        <ItemTitle onAddItem={handleAddItem} />

        <ItemFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3'>
            <ItemList items={filteredItems} viewMode={viewMode} />
          </div>

          <ItemSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            activities={activities}
          />
        </div>
      </main>
    </div>
  )
}
