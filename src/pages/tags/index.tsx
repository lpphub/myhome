import { Plus } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState, useEffect } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/LoadingState'
import { getCategories, getTags, createTag, updateTag, deleteTag, reorderTags } from '@/api/tags'
import type { SortByType, TagCategoryCode, Tag } from '@/types/tags'
import { TagNote } from './components/TagNote'
import { AddTagDialog } from './components/AddTagDialog'
import { TagFilter } from './components/TagFilter'
import { TagSection } from './components/TagSection'
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

const sortTags = (tags: Tag[], sortBy: SortByType): Tag[] => {
  const sorted = [...tags]
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.label.localeCompare(b.label))
    case 'name-desc':
      return sorted.sort((a, b) => b.label.localeCompare(a.label))
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
  const queryClient = useQueryClient()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TagCategoryCode | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortByType>('date-desc')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragOverCategory, setDragOverCategory] = useState<TagCategoryCode | null>(null)
  const [localTags, setLocalTags] = useState<Tag[]>([])

  const { data: tagsData, isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['tag-categories'],
    queryFn: getCategories,
  })

  const isLoading = tagsLoading || categoriesLoading

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('标签添加成功')
    },
    onError: () => toast.error('添加标签失败'),
  })

  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Tag> }) => updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('标签更新成功')
    },
    onError: () => toast.error('更新标签失败'),
  })

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('标签删除成功')
    },
    onError: () => toast.error('删除标签失败'),
  })

  const reorderTagsMutation = useMutation({
    mutationFn: reorderTags,
    onError: () => toast.error('排序保存失败'),
  })

  useEffect(() => {
    if (tagsData) {
      setLocalTags(tagsData)
    }
  }, [tagsData])

  const tagItems = useMemo(
    () => localTags.map(tag => ({ ...tag, sortableId: `${tag.category}-${tag.id}` })),
    [localTags]
  )

  const filteredTags = useMemo(() => {
    let filtered = localTags

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        tag =>
          tag.label.toLowerCase().includes(term) || tag.description?.toLowerCase().includes(term)
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tag => tag.category === selectedCategory)
    }

    return sortTags(filtered, sortBy)
  }, [localTags, searchTerm, selectedCategory, sortBy])

  const filteredTagItems = useMemo(
    () => filteredTags.map(tag => ({ ...tag, sortableId: `${tag.category}-${tag.id}` })),
    [filteredTags]
  )

  const categoryItems = useMemo(() => {
    const items: Record<TagCategoryCode, typeof filteredTagItems> = {
      storage: [],
      todo: [],
      other: [],
    }
    filteredTagItems.forEach(item => {
      items[item.category].push(item)
    })
    return items
  }, [filteredTagItems])

  const categoryItemIds = useMemo(() => {
    const ids: Record<TagCategoryCode, string[]> = {
      storage: [],
      todo: [],
      other: [],
    }
    ;(['storage', 'todo', 'other'] as const).forEach(cat => {
      ids[cat] = categoryItems[cat].map(t => t.sortableId)
    })
    return ids
  }, [categoryItems])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const activeTag = useMemo(
    () => (activeId ? tagItems.find(t => t.sortableId === activeId) : null),
    [activeId, tagItems]
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      setDragOverCategory(null)
      return
    }
    const overCategory = event.over.id as string
    setDragOverCategory(overCategory.split('-')[0] as TagCategoryCode)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setDragOverCategory(null)

    if (!over) return

    const activeSortableId = active.id as string
    const overSortableId = over.id as string

    const activeCategory = activeSortableId.split('-')[0] as TagCategoryCode
    const overCategory = overSortableId.split('-')[0] as TagCategoryCode
    const activeTagId = parseInt(activeSortableId.split('-')[1], 10)

    if (activeCategory === overCategory) {
      const activeIndex = tagItems.findIndex(t => t.sortableId === activeSortableId)
      const overIndex = tagItems.findIndex(t => t.sortableId === overSortableId)

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const newItems = arrayMove(tagItems, activeIndex, overIndex)
        setLocalTags(newItems.map(({ sortableId: _id, ...tag }) => tag))

        const targetTag = newItems[overIndex]
        reorderTagsMutation.mutate({
          fromId: activeTagId,
          toId: targetTag.id,
          toCategory: overCategory,
          toIndex: overIndex,
        })

        if (sortBy !== 'custom') setSortBy('custom')
      }
    } else {
      const overIndex = tagItems.findIndex(t => t.sortableId === overSortableId)
      const activeIndex = tagItems.findIndex(t => t.sortableId === activeSortableId)

      if (activeIndex !== -1 && overIndex !== -1) {
        const updatedItem = {
          ...tagItems[activeIndex],
          category: overCategory,
          sortableId: `${overCategory}-${activeTagId}`,
        }

        const withoutActive = tagItems.filter(t => t.sortableId !== activeSortableId)
        const newItems = [
          ...withoutActive.slice(0, overIndex),
          updatedItem,
          ...withoutActive.slice(overIndex),
        ]

        setLocalTags(newItems.map(({ sortableId: _id, ...tag }) => tag))

        updateTagMutation.mutate({ id: activeTagId, data: { category: overCategory } })

        const targetTag = tagItems[overIndex]
        reorderTagsMutation.mutate({
          fromId: activeTagId,
          toId: targetTag.id,
          toCategory: overCategory,
          toIndex: overIndex,
        })

        if (sortBy !== 'custom') setSortBy('custom')
      }
    }
  }

  const handleAddTag = (tag: Tag) => {
    createTagMutation.mutate({
      label: tag.label,
      category: tag.category,
      color: tag.color,
      description: tag.description,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag)
    setIsAddDialogOpen(true)
  }

  const handleUpdateTag = (tag: Tag) => {
    updateTagMutation.mutate({
      id: tag.id,
      data: {
        label: tag.label,
        category: tag.category,
        color: tag.color,
        description: tag.description,
      },
    })
    setIsAddDialogOpen(false)
    setEditingTag(null)
  }

  if (isLoading) return <LoadingState type='loading' />

  const categories = categoriesData || []

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
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-warmGray-800 mb-1'>标签管理</h1>
              <p className='text-warmGray-500'>整理和分类你的所有便签</p>
            </div>
            <Button
              onClick={() => {
                setEditingTag(null)
                setIsAddDialogOpen(true)
              }}
              className='bg-linear-to-r from-honey-400 to-honey-500 hover:from-honey-500 hover:to-honey-600 text-white shadow-warm-md hover:shadow-warm-lg transition-all duration-300 flex items-center gap-2'
            >
              <Plus className='w-5 h-5' />
              添加便签
            </Button>
          </div>

          <TagFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {categories.map(cat => {
            if (selectedCategory !== 'all' && selectedCategory !== cat.code) return null

            const displayItems =
              selectedCategory === 'all' ? categoryItems[cat.code] : filteredTagItems

            return (
              <SortableContext
                key={cat.code}
                items={categoryItemIds[cat.code]}
                strategy={rectSortingStrategy}
              >
                <TagSection
                  title={cat.name}
                  category={cat.code}
                  tags={displayItems}
                  isDragOver={dragOverCategory === cat.code}
                  onDeleteTag={id => deleteTagMutation.mutate(id)}
                  onEditTag={handleEditTag}
                />
              </SortableContext>
            )
          })}
        </main>
      </DndContext>

      <AddTagDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddTag={handleAddTag}
        onUpdateTag={handleUpdateTag}
        editingTag={editingTag}
      />
    </div>
  )
}
