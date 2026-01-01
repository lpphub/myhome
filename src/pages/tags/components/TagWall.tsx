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
import { useCallback, useMemo, useState } from 'react'
import type { ReorderParams, Tag, TagCategory } from '@/types/tags'
import { TagCard } from './TagCard'
import { type TagActions, TagSection } from './TagSection'

/* ---------------- utils ---------------- */

const parseTagId = (id: string) => {
  const parts = id.split('-')
  if (parts.length < 2) return -1
  const num = Number(parts[1])
  return Number.isNaN(num) ? -1 : num
}
/* ---------------- props ---------------- */

interface TagWallProps {
  tags: TagCategory[]
  tagActions: TagActions
  onAddTagClick?: (category: string) => void
  onDraggingTag?: (data: ReorderParams) => void
}

/* ---------------- component ---------------- */

export function TagWall({ tags, tagActions, onAddTagClick, onDraggingTag }: TagWallProps) {
  const tagLookup = useMemo(() => {
    const map = new Map<number, { tag: Tag; category: TagCategory; index: number }>()
    tags.forEach(cat => {
      cat.tags.forEach((tag, index) => {
        map.set(tag.id, { tag, category: cat, index })
      })
    })
    return map
  }, [tags])

  const [activeTag, setActiveTag] = useState<Tag | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  /* ---------------- drag sensors ---------------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  /* ---------------- drag handlers ---------------- */
  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const tagId = parseTagId(active.id as string)
      const result = tagLookup.get(tagId)
      if (result) setActiveTag({ ...result.tag })
    },
    [tagLookup]
  )

  const handleDragOver = useCallback(({ over }: DragOverEvent) => {
    const newOverId = over ? String(over.id) : null
    setOverId(prev => {
      return prev === newOverId ? prev : newOverId
    })
  }, [])

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveTag(null)
      setOverId(null)
      if (!over) return

      const activeId = parseTagId(active.id as string)
      const moving = tagLookup.get(activeId)
      if (!moving) return

      let toCategoryCode: string
      let toIndex: number

      const overTagId = parseTagId(over.id as string)
      if (overTagId !== -1) {
        const overResult = tagLookup.get(overTagId)
        if (!overResult) return

        toCategoryCode = overResult.category.code
        toIndex = overResult.index
      } else {
        const targetCategory = tags.find(c => c.code === over.id)
        if (!targetCategory) return

        toCategoryCode = targetCategory.code
        toIndex = targetCategory.tags.length
      }

      // 检查是否真的有变化
      const isSamePosition = moving.category.code === toCategoryCode && moving.index === toIndex
      if (isSamePosition) return

      onDraggingTag?.({ fromId: activeId, toCategory: toCategoryCode, toIndex })
    },
    [tags, tagLookup, onDraggingTag]
  )

  const handleDragCancel = () => {
    setActiveTag(null)
    setOverId(null)
  }

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
        {tags.map(cat => (
          <TagSection
            key={cat.code}
            dragOverId={overId}
            tagCategory={cat}
            tagActions={tagActions}
            onAddTagClick={onAddTagClick}
          />
        ))}
      </div>
    </DndContext>
  )
}
