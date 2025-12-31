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
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Tag, TagCategory } from '@/types/tags'
import { TagCard } from './TagCard'
import { type TagActions, TagSection } from './TagSection'

/* ---------------- utils ---------------- */

const parseTagId = (id: string) => {
  if (!id.startsWith('tag-')) return -1
  const num = Number(id.replace('tag-', ''))
  return Number.isNaN(num) ? -1 : num
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
  useEffect(() => {
    setLocalTags(tags)
  }, [tags])

  const tagLookup = useMemo(() => {
    const map = new Map<number, { tag: Tag; category: TagCategory; index: number }>()
    localTags.forEach(cat => {
      cat.tags.forEach((tag, index) => {
        map.set(tag.id, { tag, category: cat, index })
      })
    })
    return map
  }, [localTags])

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
    if (!over) return
    setOverId(over.id as string)
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

      if (typeof over.id === 'string' && over.id.startsWith('tag-')) {
        const overResult = tagLookup.get(parseTagId(over.id))
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
          // 如果是源列表，移除旧项
          if (cat.code === moving.category.code) {
            newTags = newTags.filter(t => t.id !== activeId)
          }
          // 如果是目标列表，插入新项
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
    [localTags, tagLookup, tagActions.onReorder]
  )

  const handleDragCancel = useCallback(() => {
    setActiveTag(null)
    setOverId(null)
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
