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

/* -------------------------------- utils -------------------------------- */

const parseSortableId = (id: string) => Number(id.replace('tag-', ''))

const findCategoryByTagId = (categories: TagCategory[], tagId: number) =>
  categories.find(cat => cat.tags.some(t => t.id === tagId))

const findTagIndex = (cat: TagCategory, tagId: number) => cat.tags.findIndex(t => t.id === tagId)

/** 核心：统一解析拖拽位置 */
function resolveDragPosition(categories: TagCategory[], activeId: number, overId: number | string) {
  const fromCategory = findCategoryByTagId(categories, activeId)
  if (!fromCategory) return null

  const toCategory =
    typeof overId === 'number'
      ? findCategoryByTagId(categories, overId)
      : categories.find(c => c.code === overId)

  if (!toCategory) return null

  const fromIndex = findTagIndex(fromCategory, activeId)
  const toIndex =
    typeof overId === 'number' ? findTagIndex(toCategory, overId) : toCategory.tags.length

  return {
    fromCategory,
    toCategory,
    fromIndex,
    toIndex,
  }
}

/* -------------------------------- props -------------------------------- */

interface TagWallProps {
  tags: TagCategory[]
  tagActions: TagActions & {
    onReorder?: (data: { fromId: number; toCategory: string; toIndex: number }) => void
  }
  onAddTagClick?: (category: string) => void
}

/* -------------------------------- component -------------------------------- */

export function TagWall({ tags, tagActions, onAddTagClick }: TagWallProps) {
  /** 本地顺序（仅 dragEnd 更新） */
  const [localTags, setLocalTags] = useState<TagCategory[]>(tags)

  useEffect(() => {
    setLocalTags(tags)
  }, [tags])

  /** 拖拽 UI 状态 */
  const [activeTag, setActiveTag] = useState<Tag | null>(null)
  const [overCategoryCode, setOverCategoryCode] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  /* ----------------------------- drag start ----------------------------- */

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const tagId = parseSortableId(event.active.id as string)
      const tag = localTags.flatMap(c => c.tags).find(t => t.id === tagId)
      setActiveTag(tag ? { ...tag } : null)
    },
    [localTags]
  )

  /* ----------------------------- drag over ----------------------------- */

  const handleDragOver = useCallback(
    ({ over }: DragOverEvent) => {
      if (!over) {
        setOverCategoryCode(null)
        return
      }

      let overCategory: TagCategory | undefined
      if (typeof over.id === 'string' && over.id.startsWith('tag-')) {
        // tag 上方 → 找到它所在的分类
        const tagId = parseSortableId(over.id)
        overCategory = localTags.find(cat => cat.tags.some(t => t.id === tagId))
      } else {
        // 分类容器上方
        overCategory = localTags.find(cat => cat.code === over.id)
      }
      setOverCategoryCode(overCategory?.code ?? null)
    },
    [localTags]
  )

  /* ----------------------------- drag end ----------------------------- */

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveTag(null)
      setOverCategoryCode(null)
      if (!over) return

      const activeId = parseSortableId(active.id as string)
      const overId =
        typeof over.id === 'string' && over.id.startsWith('tag-')
          ? parseSortableId(over.id)
          : over.id

      let finalToCategory: TagCategory | undefined
      let finalToIndex = 0

      setLocalTags(prev => {
        const resolved = resolveDragPosition(prev, activeId, overId)
        if (!resolved || resolved.fromIndex === -1) return prev

        const { fromCategory, toCategory, fromIndex, toIndex } = resolved
        finalToCategory = toCategory
        finalToIndex = Math.max(toIndex, 0)

        // 同分类
        if (fromCategory.code === toCategory.code) {
          if (fromIndex === toIndex) return prev
          return prev.map(cat =>
            cat.code === fromCategory.code
              ? { ...cat, tags: arrayMove(cat.tags, fromIndex, toIndex) }
              : cat
          )
        }

        // 跨分类
        const moving = fromCategory.tags[fromIndex]
        return prev.map(cat => {
          if (cat.code === fromCategory.code)
            return { ...cat, tags: cat.tags.filter(t => t.id !== activeId) }
          if (cat.code === toCategory.code) {
            const next = [...cat.tags]
            next.splice(finalToIndex, 0, moving)
            return { ...cat, tags: next }
          }
          return cat
        })
      })

      if (finalToCategory) {
        tagActions.onReorder?.({
          fromId: activeId,
          toCategory: finalToCategory.code,
          toIndex: finalToIndex,
        })
      }
    },
    [tagActions]
  )

  const handleDragCancel = useCallback(() => {
    setActiveTag(null)
    setOverCategoryCode(null)
  }, [])

  /* -------------------------------- render -------------------------------- */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* 拖拽预览 */}
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

      <div className='overflow-y-auto overflow-x-hidden touch-pan-y'>
        {localTags.map(cat => (
          <SortableContext
            key={cat.code}
            strategy={rectSortingStrategy}
            items={cat.tags.map(t => `tag-${t.id}`)}
          >
            <TagSection
              tagCategory={cat}
              tagActions={tagActions}
              isDragOver={overCategoryCode === cat.code}
              onAddTagClick={onAddTagClick}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  )
}
