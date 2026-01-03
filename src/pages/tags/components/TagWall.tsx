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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
    if (!dragState.isDragging) return
    setLocalTags(tags)
  }, [tags, dragState.isDragging])

  const tagLookup = useMemo(() => {
    const map = new Map<number, { tag: Tag; category: TagCategory; index: number }>()
    localTags.forEach(cat => {
      cat.tags.forEach((tag, index) => {
        map.set(tag.id, { tag, category: cat, index })
      })
    })
    return map
  }, [localTags])

  // const [activeTag, setActiveTag] = useState<Tag | null>(null)
  // const [overId, setOverId] = useState<string | null>(null)

  // 🔑 关键：用 ref 存防抖定时器
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

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
    setDragState(prev => ({
      ...prev,
      overId: prev.overId === newOverId ? prev.overId : newOverId,
    }))
  }, [])

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setDragState({ isDragging: false, activeTag: null, overId: null })
      if (!over) return

      const activeId = parseTagId(active.id as string)
      const moving = tagLookup.get(activeId)
      if (!moving) return

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
      const isSamePosition = moving.category.code === toTarget && moving.index === toIndex
      if (isSamePosition) return

      // ✅ 2️⃣ 触发拖拽回调（仅更新本地状态）
      setLocalTags(prev => {
        if (moving.category.code === toTarget) {
          // 同分类内拖拽：直接重排
          return prev.map(cat => {
            if (cat.code === toTarget) {
              const tags = [...cat.tags]
              const [removed] = tags.splice(moving.index, 1)
              tags.splice(toIndex, 0, removed)
              return { ...cat, tags }
            }
            return cat
          })
        } else {
          // 跨分类拖拽：删除 + 插入
          return prev.map(cat => {
            if (cat.code === moving.category.code) {
              return {
                ...cat,
                tags: [...cat.tags.slice(0, moving.index), ...cat.tags.slice(moving.index + 1)],
              }
            }
            if (cat.code === toTarget) {
              return {
                ...cat,
                tags: [...cat.tags.slice(0, toIndex), moving.tag, ...cat.tags.slice(toIndex)],
              }
            }
            return cat
          })
        }
      })

      // ✅ 3️⃣ 触发拖拽回调（防抖，同步后端）
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        onDraggingTag({ fromId: activeId, toCategory: toTarget, toIndex })
      }, 500) // 500ms 内不操作才发请求
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
