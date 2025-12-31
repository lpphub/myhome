import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import type { Tag, TagCategory } from '@/types/tags'
import { TagCard } from './TagCard'
import { type TagActions, TagSection } from './TagSection'

interface TagWallProps {
  tags: TagCategory[]
  tagActions: TagActions & {
    onReorder?: (data: {
      fromId: number
      toId?: number
      toCategory: string
      toIndex: number
    }) => void
  }
  onAddTagClick?: (category: string) => void
}

const parseSortableId = (id: string) => {
  return Number(id.replace('tag-', ''))
}
const findCategoryByTagId = (categories: TagCategory[], tagId: number) => {
  return categories.find(cat => cat.tags.some(l => l.id === tagId))
}
const findTagIndex = (cat: TagCategory, tagId: number) => {
  return cat.tags.findIndex(l => l.id === tagId)
}

export function TagWall({ tags, tagActions, onAddTagClick }: TagWallProps) {
  const [localTags, setLocalTags] = useState<TagCategory[]>(tags)

  useEffect(() => {
    setLocalTags(tags)
  }, [tags])

  const [activeTag, setActiveTag] = useState<Tag | null>(null)
  const [overDroppable, setOverDroppable] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const tagId = parseSortableId(event.active.id as string)
      const tag = localTags.flatMap(c => c.tags).find(l => l.id === tagId)
      setActiveTag(tag ? { ...tag } : null)
    },
    [localTags]
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) {
        setOverDroppable(null)
        return
      }

      const activeId = parseSortableId(active.id as string)
      const overId =
        typeof over.id === 'string' && over.id.startsWith('tag-')
          ? parseSortableId(over.id)
          : over.id

      const fromCategory = findCategoryByTagId(localTags, activeId)
      if (!fromCategory) return

      const toCategory =
        typeof overId === 'number'
          ? findCategoryByTagId(localTags, overId)
          : localTags.find(c => c.code === overId)
      if (!toCategory) return

      setOverDroppable(toCategory.code)

      if (fromCategory.code === toCategory.code && typeof overId === 'number') {
        const oldIndex = findTagIndex(fromCategory, activeId)
        const newIndex = findTagIndex(fromCategory, overId)
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

        setLocalTags(prev =>
          prev.map(cat =>
            cat.code === fromCategory.code
              ? { ...cat, tags: arrayMove(cat.tags, oldIndex, newIndex) }
              : cat
          )
        )
        return
      }

      if (fromCategory.code !== toCategory.code) {
        setLocalTags(prev => {
          const source = prev.find(c => c.code === fromCategory.code)
          const target = prev.find(c => c.code === toCategory.code)
          if (!source || !target) return prev
          const moving = source.tags.find(l => l.id === activeId)
          if (!moving) return prev

          const newSource = source.tags.filter(l => l.id !== activeId)

          const targetIndex =
            typeof overId === 'number' ? findTagIndex(target, overId) : target.tags.length

          const insertIndex = targetIndex === -1 ? target.tags.length : targetIndex

          const newTarget = [
            ...target.tags.slice(0, insertIndex),
            moving,
            ...target.tags.slice(insertIndex),
          ]

          return prev.map(cat => {
            if (cat.code === source.code) return { ...cat, tags: newSource }
            if (cat.code === target.code) return { ...cat, tags: newTarget }
            return cat
          })
        })
      }
    },
    [localTags]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveTag(null)
      setOverDroppable(null)
      if (!over) return

      const activeId = parseSortableId(active.id as string)
      const overId =
        typeof over.id === 'string' && over.id.startsWith('tag-')
          ? parseSortableId(over.id)
          : over.id

      const fromCategory = findCategoryByTagId(localTags, activeId)
      if (!fromCategory) return

      const toCategory =
        typeof overId === 'number'
          ? findCategoryByTagId(localTags, overId)
          : localTags.find(c => c.code === overId)
      if (!toCategory) return

      const toIndex =
        typeof overId === 'number' ? findTagIndex(toCategory, overId) : toCategory.tags.length - 1

      tagActions.onReorder?.({
        fromId: activeId,
        toCategory: toCategory.code,
        toIndex: Math.max(toIndex, 0),
      })
    },
    [localTags, tagActions.onReorder]
  )

  const handleDragCancel = useCallback(() => {
    setActiveTag(null)
    setOverDroppable(null)
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <DragOverlay>
        <AnimatePresence>
          {activeTag && (
            <motion.div initial={{ scale: 1 }} animate={{ scale: 1.05 }} className='opacity-80'>
              <TagCard tag={activeTag} />
            </motion.div>
          )}
        </AnimatePresence>
      </DragOverlay>
      <div className='overflow-y-auto overflow-x-hidden touch-pan-y'>
        {localTags.map(cat => (
          <SortableContext
            key={cat.code}
            items={cat.tags.map(l => `tag-${l.id}`)}
            strategy={rectSortingStrategy}
          >
            <TagSection
              tagCategory={cat}
              tagActions={tagActions}
              isDragOver={overDroppable === cat.code}
              onAddTagClick={onAddTagClick}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  )
}
