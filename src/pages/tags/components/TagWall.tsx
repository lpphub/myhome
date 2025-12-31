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
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import type { Tag, TagCategory } from '@/types/tags'
import { TagCard } from './TagCard'
import { type TagActions, TagSection } from './TagSection'

/* ---------------- utils ---------------- */

const parseSortableId = (id: string) => Number(id.replace('tag-', ''))

const findTagAndCategory = (
  categories: TagCategory[],
  tagId: number
): { tag: Tag; category: TagCategory; index: number } | null => {
  for (const cat of categories) {
    const index = cat.tags.findIndex(t => t.id === tagId)
    if (index !== -1) return { tag: cat.tags[index], category: cat, index }
  }
  return null
}

/* ---------------- props ---------------- */

interface TagWallProps {
  tags: TagCategory[]
  tagActions: TagActions & {
    onReorder?: (data: { fromId: number; toCategory: string; toIndex: number }) => void
  }
  onAddTagClick?: (category: string) => void
}

/* ---------------- component ---------------- */

export function TagWall({ tags, tagActions, onAddTagClick }: TagWallProps) {
  const [localTags, setLocalTags] = useState<TagCategory[]>(tags)
  useEffect(() => setLocalTags(tags), [tags])

  const [activeTag, setActiveTag] = useState<Tag | null>(null)
  const [overCategory, setOverCategory] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  /* ---------------- drag handlers ---------------- */

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const tagId = parseSortableId(active.id as string)
      const result = findTagAndCategory(localTags, tagId)
      if (result) setActiveTag({ ...result.tag })
    },
    [localTags]
  )

  const handleDragOver = useCallback(
    ({ over }: DragOverEvent) => {
      if (!over) return setOverCategory(null)

      const overId = over.id as string
      const nextCategory = overId.startsWith('tag-')
        ? findTagAndCategory(localTags, parseSortableId(overId))?.category
        : localTags.find(c => c.code === overId)

      if (nextCategory?.code !== overCategory) {
        setOverCategory(nextCategory?.code ?? null)
      }
    },
    [localTags, overCategory]
  )

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveTag(null)
      setOverCategory(null)
      if (!over) return

      const activeId = parseSortableId(active.id as string)
      const moving = findTagAndCategory(localTags, activeId)
      if (!moving) return

      let toCategoryCode: string
      let toIndex: number

      if (typeof over.id === 'string' && over.id.startsWith('tag-')) {
        const overResult = findTagAndCategory(localTags, parseSortableId(over.id))
        if (!overResult) return
        toCategoryCode = overResult.category.code
        toIndex = overResult.index
      } else {
        const cat = localTags.find(c => c.code === over.id)
        if (!cat) return
        toCategoryCode = cat.code
        toIndex = cat.tags.length
      }

      if (moving.category.code === toCategoryCode && moving.index === toIndex) return // 无变化

      setLocalTags(prev =>
        prev.map(cat => {
          let newTags = cat.tags
          if (cat.code === moving.category.code) newTags = newTags.filter(t => t.id !== activeId)
          if (cat.code === toCategoryCode) {
            const temp = [...newTags]
            temp.splice(toIndex, 0, moving.tag)
            newTags = temp
          }
          return { ...cat, tags: newTags }
        })
      )

      tagActions.onReorder?.({ fromId: activeId, toCategory: toCategoryCode, toIndex })
    },
    [localTags, tagActions]
  )

  const handleDragCancel = useCallback(() => {
    setActiveTag(null)
    setOverCategory(null)
  }, [])

  /* ---------------- render ---------------- */

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
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              exit={{ scale: 1 }}
              className='opacity-80'
            >
              <TagCard tag={activeTag} />
            </motion.div>
          )}
        </AnimatePresence>
      </DragOverlay>

      <div className='flex flex-col gap-4 overflow-y-auto overflow-x-hidden touch-pan-y'>
        {localTags.map(cat => (
          <TagSection
            key={cat.code}
            isDragOver={overCategory === cat.code}
            tagCategory={cat}
            tagActions={tagActions}
            onAddTagClick={onAddTagClick}
          />
        ))}
      </div>
    </DndContext>
  )
}
