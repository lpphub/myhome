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

// ⚡ OPT：重排序本地标签
function reorderLocalTags(
  prev: TagCategory[],
  fromCategory: string,
  fromIndex: number,
  fromTag: Tag,
  toCategory: string,
  toIndex: number
): TagCategory[] {
  if (fromCategory === toCategory) {
    // 同分类，仅调整顺序
    return prev.map(cat => {
      if (cat.code !== toCategory) return cat
      const tags = [...cat.tags]
      const [removed] = tags.splice(fromIndex, 1)
      tags.splice(toIndex, 0, removed)
      return { ...cat, tags }
    })
  }

  // 跨分类移动
  return prev.map(cat => {
    if (cat.code === fromCategory) {
      // 删除源 tag
      return { ...cat, tags: cat.tags.filter((_, i) => i !== fromIndex) }
    }
    if (cat.code === toCategory) {
      // 插入目标分类，更新 category
      const tags = [...cat.tags]
      const tagWithUpdatedCategory = { ...fromTag, category: toCategory }
      tags.splice(toIndex, 0, tagWithUpdatedCategory)
      return { ...cat, tags }
    }
    return cat
  })
}

/* ---------------- props ---------------- */

interface TagWallProps {
  tags: TagCategory[]
  tagActions: TagActions
  onClickAddTag: (category: string) => void
  onDraggingTag: (data: ReorderParams) => void
}

interface DragState {
  isDragging: boolean
  activeTag: Tag | null
  overId: string | null
}

/* ---------------- component ---------------- */

export function TagWall({ tags, tagActions, onClickAddTag, onDraggingTag }: TagWallProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    activeTag: null,
    overId: null,
  })
  // ✅ 1️⃣ 初始化本地状态
  const [localTags, setLocalTags] = useState<TagCategory[]>(tags)

  useEffect(() => {
    // if (dragState.isDragging) return
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
      if (result) setDragState({ isDragging: true, activeTag: { ...result.tag }, overId: null })
    },
    [tagLookup]
  )

  const handleDragOver = useCallback(({ over }: DragOverEvent) => {
    const newOverId = over ? String(over.id) : null

    setDragState(prev => {
      if (prev.overId === newOverId) return prev
      return { ...prev, overId: newOverId }
    })
  }, [])

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setDragState({ isDragging: false, activeTag: null, overId: null })
      if (!over) return

      const activeId = parseTagId(active.id as string)
      const moving = tagLookup.get(activeId)
      if (!moving) return

      const { category: fromCategory, index: fromIndex, tag: fromTag } = moving

      // 处理目标位置
      let toTarget: string
      let toIndex: number
      const overTagId = parseTagId(over.id as string)
      if (overTagId !== -1) {
        const overResult = tagLookup.get(overTagId)
        if (!overResult) return

        toTarget = overResult.category.code
        toIndex = overResult.index
      } else {
        const targetCategory = localTags.find(c => c.code === over.id)
        if (!targetCategory) return

        toTarget = targetCategory.code
        toIndex = targetCategory.tags.length
      }
      // 检查是否无变化
      if (fromCategory.code === toTarget && fromIndex === toIndex) return

      // ✅ 2️⃣ 触发拖拽回调（仅更新本地状态）
      setLocalTags(prev =>
        reorderLocalTags(prev, fromCategory.code, fromIndex, fromTag, toTarget, toIndex)
      )

      // ✅ 3️⃣ 触发拖拽回调（同步后端）
      onDraggingTag({
        fromId: activeId,
        toCategory: toTarget,
        toIndex,
      })
    },
    [localTags, tagLookup, onDraggingTag]
  )

  const handleDragCancel = () => {
    setDragState({ isDragging: false, activeTag: null, overId: null })
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

      <div className='flex flex-col gap-4 overflow-y-auto overflow-x-hidden touch-pan-y'>
        {localTags.map(cat => (
          <TagSection
            key={cat.code}
            dragOverId={dragState.overId}
            tagCategory={cat}
            tagActions={tagActions}
            onClickAddTag={onClickAddTag}
          />
        ))}
      </div>
    </DndContext>
  )
}
