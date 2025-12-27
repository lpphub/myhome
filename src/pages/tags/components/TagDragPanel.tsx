import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SortByType, Tag } from '@/types/tags'
import { TagNote, TagSection } from './TagSection'

interface TagDragItem extends Tag {
  sortableId: string
}

interface TagDragProps {
  tags: Tag[]
  categories: Array<{ code: string; name: string }>
  onReorder: (params: { fromId: number; toId: number; toCategory: string; toIndex: number }) => void
  onEditTag: (tag: Tag) => void
  onDeleteTag: (tagId: number) => void
}

export function TagDragPanel({
  tags,
  categories,
  onReorder,
  onEditTag,
  onDeleteTag,
}: TagDragProps) {
  const [sortBy, setSortBy] = useState<SortByType>('date-desc')
  const [localTags, setLocalTags] = useState<Tag[]>(tags)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null)

  useEffect(() => {
    if (tags.length > 0) setLocalTags(tags)
  }, [tags])

  const sortTagsFn = useCallback((tagsToSort: Tag[], sortType: SortByType): Tag[] => {
    const sorted = [...tagsToSort]
    switch (sortType) {
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
  }, [])

  const filteredTags = useMemo(() => {
    return sortTagsFn(localTags, sortBy)
  }, [localTags, sortBy, sortTagsFn])

  const categoryItems = useMemo(() => {
    const items: Record<string, TagDragItem[]> = { storage: [], todo: [], other: [] }
    filteredTags.forEach(t => {
      items[t.category].push({ ...t, sortableId: `${t.category}-${t.id}` })
    })
    return items
  }, [filteredTags])

  const categoryItemIds = useMemo(() => {
    const ids: Record<string, string[]> = { storage: [], todo: [], other: [] }
    ;(['storage', 'todo', 'other'] as const).forEach(cat => {
      ids[cat] = categoryItems[cat].map(t => t.sortableId)
    })
    return ids
  }, [categoryItems])

  const activeTag = useMemo<TagDragItem | null>(() => {
    if (!activeId) return null
    for (const items of Object.values(categoryItems)) {
      const found = items.find(t => t.sortableId === activeId)
      if (found) return found
    }
    return null
  }, [activeId, categoryItems])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      setDragOverCategory(null)
      return
    }
    const overCategory = event.over.id as string
    setDragOverCategory(overCategory.split('-')[0])
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setDragOverCategory(null)
    if (!over) return

    const activeSortableId = active.id as string
    const overSortableId = over.id as string
    const activeCategory = activeSortableId.split('-')[0]
    const overCategory = overSortableId.split('-')[0]
    const activeTagId = parseInt(activeSortableId.split('-')[1], 10)

    if (activeCategory === overCategory) {
      const activeIndex = filteredTags.findIndex(t => `${t.category}-${t.id}` === activeSortableId)
      const overIndex = filteredTags.findIndex(t => `${t.category}-${t.id}` === overSortableId)
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const newItems = arrayMove(filteredTags, activeIndex, overIndex)
        setLocalTags(newItems)
        const targetTag = newItems[overIndex]
        onReorder({
          fromId: activeTagId,
          toId: targetTag.id,
          toCategory: overCategory,
          toIndex: overIndex,
        })
        if (sortBy !== 'custom') setSortBy('custom')
      }
    } else {
      const overIndex = filteredTags.findIndex(t => `${t.category}-${t.id}` === overSortableId)
      const activeIndex = filteredTags.findIndex(t => `${t.category}-${t.id}` === activeSortableId)
      if (activeIndex !== -1 && overIndex !== -1) {
        const updatedItem = { ...filteredTags[activeIndex], category: overCategory }
        const withoutActive = filteredTags.filter((_, i) => i !== activeIndex)
        const newItems = [
          ...withoutActive.slice(0, overIndex),
          updatedItem,
          ...withoutActive.slice(overIndex),
        ]
        setLocalTags(newItems)
        const targetTag = filteredTags[overIndex]
        onReorder({
          fromId: activeTagId,
          toId: targetTag.id,
          toCategory: overCategory,
          toIndex: overIndex,
        })
        if (sortBy !== 'custom') setSortBy('custom')
      }
    }
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  return (
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
              <TagNote tag={activeTag} />
            </motion.div>
          )}
        </AnimatePresence>
      </DragOverlay>
      {categories.map(cat => (
        <SortableContext
          key={cat.code}
          items={categoryItemIds[cat.code]}
          strategy={rectSortingStrategy}
        >
          <TagSection
            title={cat.name}
            category={cat.code}
            tags={categoryItems[cat.code]}
            isDragOver={dragOverCategory === cat.code}
            onDeleteTag={onDeleteTag}
            onEditTag={onEditTag}
          />
        </SortableContext>
      ))}
    </DndContext>
  )
}
