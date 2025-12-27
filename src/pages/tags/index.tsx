import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

import { LoadingState } from '@/components/LoadingState'
import type { SortByType, Tag, TagCategory } from '@/types/tags'
import { AddTagDialog } from './components/AddTagDialog'
import { TagFilter } from './components/TagFilter'
import { TagHeader } from './components/TagHeader'
import { TagSection } from './components/TagSection'
import { TagNote } from './components/TagNote'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'

const useMockData = async () => {
  const mockTags: Tag[] = [
    {
      id: 1,
      name: '卧室',
      category: 'room',
      color: 'honey',
      itemCount: 25,
      description: '主卧和次卧的物品',
      createdAt: '2024-12-20T00:00:00Z',
      updatedAt: '2024-12-20T00:00:00Z',
    },
    {
      id: 2,
      name: '厨房',
      category: 'room',
      color: 'lemon',
      itemCount: 42,
      description: '厨具、餐具和食材',
      createdAt: '2024-12-19T00:00:00Z',
      updatedAt: '2024-12-19T00:00:00Z',
    },
    {
      id: 3,
      name: '书房',
      category: 'room',
      color: 'lavender',
      itemCount: 18,
      description: '书籍、文具和办公用品',
      createdAt: '2024-12-18T00:00:00Z',
      updatedAt: '2024-12-18T00:00:00Z',
    },
    {
      id: 4,
      name: '客厅',
      category: 'room',
      color: 'coral',
      itemCount: 35,
      description: '客厅家具和装饰品',
      createdAt: '2024-12-17T00:00:00Z',
      updatedAt: '2024-12-17T00:00:00Z',
    },
    {
      id: 5,
      name: '卫生间',
      category: 'room',
      color: 'cream',
      itemCount: 15,
      description: '洗漱用品和毛巾',
      createdAt: '2024-12-16T00:00:00Z',
      updatedAt: '2024-12-16T00:00:00Z',
    },
    {
      id: 6,
      name: '阳台',
      category: 'room',
      color: 'mint',
      itemCount: 8,
      description: '植物和园艺用品',
      createdAt: '2024-12-15T00:00:00Z',
      updatedAt: '2024-12-15T00:00:00Z',
    },
    {
      id: 7,
      name: '零食',
      category: 'type',
      color: 'lemon',
      itemCount: 28,
      description: '各种零食和零食包装',
      createdAt: '2024-12-20T00:00:00Z',
      updatedAt: '2024-12-20T00:00:00Z',
    },
    {
      id: 8,
      name: '玩具',
      category: 'type',
      color: 'coral',
      itemCount: 12,
      description: '儿童玩具和游戏',
      createdAt: '2024-12-19T00:00:00Z',
      updatedAt: '2024-12-19T00:00:00Z',
    },
    {
      id: 9,
      name: '主食',
      category: 'type',
      color: 'honey',
      itemCount: 33,
      description: '米、面、油等主食',
      createdAt: '2024-12-18T00:00:00Z',
      updatedAt: '2024-12-18T00:00:00Z',
    },
    {
      id: 10,
      name: '饮品',
      category: 'type',
      color: 'lavender',
      itemCount: 20,
      description: '饮料、茶和咖啡',
      createdAt: '2024-12-17T00:00:00Z',
      updatedAt: '2024-12-17T00:00:00Z',
    },
    {
      id: 11,
      name: '文具',
      category: 'type',
      color: 'cream',
      itemCount: 16,
      description: '笔、本子和办公用品',
      createdAt: '2024-12-16T00:00:00Z',
      updatedAt: '2024-12-16T00:00:00Z',
    },
    {
      id: 12,
      name: '数码',
      category: 'type',
      color: 'pink',
      itemCount: 8,
      description: '电子产品和配件',
      createdAt: '2024-12-15T00:00:00Z',
      updatedAt: '2024-12-15T00:00:00Z',
    },
    {
      id: 13,
      name: '化妆品',
      category: 'type',
      color: 'coral',
      itemCount: 22,
      description: '护肤品和彩妆',
      createdAt: '2024-12-14T00:00:00Z',
      updatedAt: '2024-12-14T00:00:00Z',
    },
    {
      id: 14,
      name: '书籍',
      category: 'type',
      color: 'lavender',
      itemCount: 45,
      description: '各类书籍和杂志',
      createdAt: '2024-12-13T00:00:00Z',
      updatedAt: '2024-12-13T00:00:00Z',
    },
    {
      id: 15,
      name: '待办事项',
      category: 'functional',
      color: 'coral',
      itemCount: 12,
      description: '记录需要完成的任务',
      createdAt: '2024-12-12T00:00:00Z',
      updatedAt: '2024-12-12T00:00:00Z',
    },
    {
      id: 16,
      name: '购物清单',
      category: 'functional',
      color: 'lemon',
      itemCount: 28,
      description: '需要购买的物品列表',
      createdAt: '2024-12-11T00:00:00Z',
      updatedAt: '2024-12-11T00:00:00Z',
    },
    {
      id: 17,
      name: '备忘录',
      category: 'functional',
      color: 'lavender',
      itemCount: 8,
      description: '记录重要的提醒信息',
      createdAt: '2024-12-10T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
    },
    {
      id: 18,
      name: '生日提醒',
      category: 'functional',
      color: 'honey',
      itemCount: 15,
      description: '亲友的生日和纪念日',
      createdAt: '2024-12-09T00:00:00Z',
      updatedAt: '2024-12-09T00:00:00Z',
    },
    {
      id: 19,
      name: '常用地址',
      category: 'functional',
      color: 'cream',
      itemCount: 6,
      description: '记录常用的家庭地址',
      createdAt: '2024-12-08T00:00:00Z',
      updatedAt: '2024-12-08T00:00:00Z',
    },
    {
      id: 20,
      name: '保修信息',
      category: 'functional',
      color: 'pink',
      itemCount: 10,
      description: '家电和产品的保修期记录',
      createdAt: '2024-12-07T00:00:00Z',
      updatedAt: '2024-12-07T00:00:00Z',
    },
  ]

  return new Promise<{ data: Tag[] }>(resolve => {
    setTimeout(() => {
      resolve({ data: mockTags })
    }, 500)
  })
}

const sortTags = (tags: Tag[], sortBy: SortByType): Tag[] => {
  const sorted = [...tags]
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'count-asc':
      return sorted.sort((a, b) => a.itemCount - b.itemCount)
    case 'count-desc':
      return sorted.sort((a, b) => b.itemCount - a.itemCount)
    case 'date-desc':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    default:
      return sorted
  }
}

export default function Tags() {
  const { data: mockData, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: useMockData,
  })

  const [tags, setTags] = useState<Tag[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TagCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortByType>('date-desc')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragOverCategory, setDragOverCategory] = useState<TagCategory | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    if (mockData?.data) {
      setTags(mockData.data)
    }
  }, [mockData])

  const tagItems = useMemo(
    () => tags.map(tag => ({ ...tag, sortableId: `${tag.category}-${tag.id}` })),
    [tags]
  )

  const filteredTags = useMemo(() => {
    let filtered = tags

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        tag =>
          tag.name.toLowerCase().includes(term) || tag.description?.toLowerCase().includes(term)
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tag => tag.category === selectedCategory)
    }

    return sortTags(filtered, sortBy)
  }, [tags, searchTerm, selectedCategory, sortBy])

  const filteredTagItems = useMemo(
    () => filteredTags.map(tag => ({ ...tag, sortableId: `${tag.category}-${tag.id}` })),
    [filteredTags]
  )

  const roomItems = useMemo(
    () => filteredTagItems.filter(t => t.category === 'room'),
    [filteredTagItems]
  )
  const typeItems = useMemo(
    () => filteredTagItems.filter(t => t.category === 'type'),
    [filteredTagItems]
  )
  const functionalItems = useMemo(
    () => filteredTagItems.filter(t => t.category === 'functional'),
    [filteredTagItems]
  )

  const roomItemIds = useMemo(() => roomItems.map(t => t.sortableId), [roomItems])
  const typeItemIds = useMemo(() => typeItems.map(t => t.sortableId), [typeItems])
  const functionalItemIds = useMemo(() => functionalItems.map(t => t.sortableId), [functionalItems])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const activeTag = useMemo(
    () => (activeId ? tagItems.find(t => t.sortableId === activeId) : null),
    [activeId, tagItems]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    if (!over) {
      setDragOverCategory(null)
      return
    }

    const overId = over.id as string
    const overCategory = overId.split('-')[0] as TagCategory
    setDragOverCategory(overCategory)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)
    setDragOverCategory(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeSortableId = activeId
    const overSortableId = overId

    const activeCategoryTag = activeSortableId.split('-')[0] as TagCategory
    const overCategoryTag = overSortableId.split('-')[0] as TagCategory

    const activeTagId = parseInt(activeSortableId.split('-')[1], 10)

    if (activeCategoryTag === overCategoryTag) {
      const activeIndex = tagItems.findIndex(t => t.sortableId === activeSortableId)
      const overIndex = tagItems.findIndex(t => t.sortableId === overSortableId)

      if (activeIndex !== -1 && overIndex !== -1) {
        const newItems = arrayMove(tagItems, activeIndex, overIndex)
        const newTags = newItems.map(({ sortableId: _sortableId, ...tag }) => tag)
        setTags(newTags)

        if (sortBy !== 'custom') {
          setSortBy('custom')
        }
      }
    } else {
      const overIndex = tagItems.findIndex(t => t.sortableId === overSortableId)
      const activeIndex = tagItems.findIndex(t => t.sortableId === activeSortableId)

      if (activeIndex !== -1 && overIndex !== -1) {
        const updatedItem = {
          ...tagItems[activeIndex],
          category: overCategoryTag,
          sortableId: `${overCategoryTag}-${activeTagId}`,
        }

        const withoutActive = tagItems.filter(t => t.sortableId !== activeSortableId)

        const newItems = [
          ...withoutActive.slice(0, overIndex),
          updatedItem,
          ...withoutActive.slice(overIndex),
        ]

        const newTags = newItems.map(({ sortableId: _sortableId, ...tag }) => tag)
        setTags(newTags)

        if (sortBy !== 'custom') {
          setSortBy('custom')
        }
      }
    }
  }

  const handleAddTag = (tag: Tag) => {
    setTags(prev => [tag, ...prev])
  }

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
  }

  const handleDeleteTag = (tagId: number) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  const handleEditTag = (tag: Tag) => {
    console.log('Edit tag:', tag)
  }

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='min-h-screen'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay>
          <AnimatePresence>
            {activeTag && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.05, rotate: 2 }}
                className='opacity-80'
              >
                <TagNote tag={activeTag} sortableId={activeTag.sortableId} />
              </motion.div>
            )}
          </AnimatePresence>
        </DragOverlay>

        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <TagHeader onAddTag={handleOpenAddDialog} />

          <TagFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {selectedCategory === 'all' || selectedCategory === 'room' ? (
            <SortableContext items={roomItemIds} strategy={rectSortingStrategy}>
              <TagSection
                title='房间 便签区'
                category='room'
                tags={selectedCategory === 'all' ? roomItems : filteredTagItems}
                isDragOver={dragOverCategory === 'room'}
                onDeleteTag={handleDeleteTag}
                onEditTag={handleEditTag}
              />
            </SortableContext>
          ) : null}

          {selectedCategory === 'all' || selectedCategory === 'type' ? (
            <SortableContext items={typeItemIds} strategy={rectSortingStrategy}>
              <TagSection
                title='类型 便签区'
                category='type'
                tags={selectedCategory === 'all' ? typeItems : filteredTagItems}
                isDragOver={dragOverCategory === 'type'}
                onDeleteTag={handleDeleteTag}
                onEditTag={handleEditTag}
              />
            </SortableContext>
          ) : null}

          {selectedCategory === 'all' || selectedCategory === 'functional' ? (
            <SortableContext items={functionalItemIds} strategy={rectSortingStrategy}>
              <TagSection
                title='功能 便签区'
                category='functional'
                tags={selectedCategory === 'all' ? functionalItems : filteredTagItems}
                isDragOver={dragOverCategory === 'functional'}
                onDeleteTag={handleDeleteTag}
                onEditTag={handleEditTag}
              />
            </SortableContext>
          ) : null}
        </main>
      </DndContext>

      <AddTagDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddTag={handleAddTag}
      />
    </div>
  )
}
