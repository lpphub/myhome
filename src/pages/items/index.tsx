import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoadingState } from '@/components/LoadingState'
import type { Item, RecentActivity, ViewMode } from '@/types/items'
import { getActivities, getItems } from '@/api/items'
import { ItemFormDrawer } from './components/ItemFormDrawer'
import { ItemList } from './components/ItemList'
import { ItemSidebar } from './components/ItemSidebar'
import { ItemToolbar } from './components/ItemToolbar'

export default function Items() {
  const { data: itemsData, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: getItems,
    staleTime: 1000 * 60 * 5,
  })

  const { data: activitiesData } = useQuery({
    queryKey: ['items', 'activities'],
    queryFn: getActivities,
    staleTime: 1000 * 60 * 5,
  })

  const [items, setItems] = useState<Item[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (itemsData) {
      setItems(itemsData)
    }
  }, [itemsData])

  useEffect(() => {
    if (activitiesData) {
      setActivities(activitiesData)
    }
  }, [activitiesData])

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

    if (selectedTags.length > 0) {
      filtered = filtered.filter(item => selectedTags.every(tag => item.tags?.includes(tag)))
    }

    return filtered
  }, [items, searchTerm, selectedTags])

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
        icon: '📦',
      },
      ...prev,
    ])
  }

  const filterProps = {
    searchTerm,
    onSearchChange: setSearchTerm,
    tags,
    selectedTags,
    onTagToggle: handleTagToggle,
  }

  const viewProps = {
    viewMode,
    onViewModeChange: setViewMode,
  }

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='min-h-screen'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <ItemToolbar
          filter={filterProps}
          view={viewProps}
          onAddItem={() => setIsDrawerOpen(true)}
        />

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3'>
            <ItemList items={filteredItems} viewMode={viewMode} />
          </div>

          <ItemSidebar activities={activities} />
        </div>
      </main>

      <ItemFormDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onAddItem={handleAddItem}
      />
    </div>
  )
}
