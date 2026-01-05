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

function reorderTags(
  prev: TagCategory[],
  fromCategory: string,
  fromIndex: number,
  fromTag: Tag,
  toCategory: string,
  toIndex: number
): TagCategory[] {
  if (fromCategory === toCategory) {
    return prev.map(cat => {
      if (cat.code !== toCategory) return cat
      const tags = [...cat.tags]
      const [removed] = tags.splice(fromIndex, 1)
      tags.splice(toIndex, 0, removed)
      return { ...cat, tags }
    })
  }

  return prev.map(cat => {
    if (cat.code === fromCategory) {
      return { ...cat, tags: cat.tags.filter((_, i) => i !== fromIndex) }
    }
    if (cat.code === toCategory) {
      const tags = [...cat.tags]
      tags.splice(toIndex, 0, { ...fromTag, category: toCategory })
      return { ...cat, tags }
    }
    return cat
  })
}

/* ---------------- props ---------------- */

interface TagWallProps {
  tags: TagCategory[]
  tagActions: TagActions
  onAddTag: (category: string) => void
  onReorder: (params: ReorderParams, next: TagCategory[]) => void
  onDeleteCategory?: (code: string) => void
}

interface DragState {
  activeTag: Tag | null
  overId: string | null
}

/* ---------------- component ---------------- */

export function TagWall({ tags, tagActions, onAddTag, onReorder, onDeleteCategory }: TagWallProps) {
  const [dragState, setDragState] = useState<DragState>({
    activeTag: null,
    overId: null,
  })

  const tagLookup = useMemo(() => {
    const map = new Map<number, { tag: Tag; category: TagCategory; index: number }>()
    tags.forEach(cat => {
      cat.tags.forEach((tag, index) => {
        map.set(tag.id, { tag, category: cat, index })
      })
    })
    return map
  }, [tags])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  /* ---------------- handlers ---------------- */

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const id = parseTagId(active.id as string)
      const found = tagLookup.get(id)
      if (found) {
        setDragState({
          activeTag: { ...found.tag },
          overId: null,
        })
      }
    },
    [tagLookup]
  )

  const handleDragOver = useCallback(({ over }: DragOverEvent) => {
    setDragState(prev => {
      const nextId = over ? String(over.id) : null
      return prev.overId === nextId ? prev : { ...prev, overId: nextId }
    })
  }, [])

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setDragState({ activeTag: null, overId: null })
      if (!over) return

      const activeId = parseTagId(active.id as string)
      const moving = tagLookup.get(activeId)
      if (!moving) return

      const { category: fromCat, index: fromIndex, tag } = moving

      let toCategory: string
      let toIndex: number

      const overTagId = parseTagId(over.id as string)
      if (overTagId !== -1) {
        const overFound = tagLookup.get(overTagId)
        if (!overFound) return
        toCategory = overFound.category.code
        toIndex = overFound.index
      } else {
        const target = tags.find(c => c.code === over.id)
        if (!target) return
        toCategory = target.code
        toIndex = target.tags.length
      }

      if (fromCat.code === toCategory && fromIndex === toIndex) return

      const next = reorderTags(tags, fromCat.code, fromIndex, tag, toCategory, toIndex)

      onReorder(
        {
          fromId: activeId,
          toCategory,
          toIndex,
        },
        next
      )
    },
    [tags, tagLookup, onReorder]
  )

  /* ---------------- render ---------------- */

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
          {dragState.activeTag && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              exit={{ scale: 1 }}
              className='opacity-80'
            >
              <TagCard tag={dragState.activeTag} />
            </motion.div>
          )}
        </AnimatePresence>
      </DragOverlay>

      <div className='flex flex-col gap-4'>
        {tags.map(cat => (
          <TagSection
            key={cat.code}
            dragOverId={dragState.overId}
            tagCategory={cat}
            tagActions={tagActions}
            onAddTag={onAddTag}
            onDeleteCategory={onDeleteCategory}
          />
        ))}
      </div>
    </DndContext>
  )
}
