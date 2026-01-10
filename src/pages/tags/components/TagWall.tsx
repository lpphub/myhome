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
import { FolderOpen } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useMemo, useState } from 'react'
import type { ReorderParams, Tag, TagGroup } from '@/types/tags'
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
  prev: TagGroup[],
  fromGroup: string,
  fromIndex: number,
  fromTag: Tag,
  toGroup: string,
  toIndex: number
): TagGroup[] {
  if (fromGroup === toGroup) {
    return prev.map(group => {
      if (group.code !== toGroup) return group
      const tags = [...group.tags]
      const [removed] = tags.splice(fromIndex, 1)
      tags.splice(toIndex, 0, removed)
      return { ...group, tags }
    })
  }

  return prev.map(group => {
    if (group.code === fromGroup) {
      return { ...group, tags: group.tags.filter((_, i) => i !== fromIndex) }
    }
    if (group.code === toGroup) {
      const tags = [...group.tags]
      tags.splice(toIndex, 0, { ...fromTag, group: toGroup })
      return { ...group, tags }
    }
    return group
  })
}

/* ---------------- props ---------------- */

interface TagWallProps {
  tags: TagGroup[]
  tagActions: TagActions
  onAddTag: (group: string) => void
  onDragReorder: (params: ReorderParams, next: TagGroup[]) => void
  onDeleteGroup?: (code: string) => void
}

interface DragState {
  activeTag: Tag | null
  overId: string | null
}

/* ---------------- component ---------------- */

export function TagWall({
  tags,
  tagActions,
  onAddTag,
  onDragReorder,
  onDeleteGroup,
}: TagWallProps) {
  const [dragState, setDragState] = useState<DragState>({
    activeTag: null,
    overId: null,
  })

  const tagLookup = useMemo(() => {
    const map = new Map<number, { tag: Tag; group: TagGroup; index: number }>()
    tags.forEach(group => {
      group.tags.forEach((tag, index) => {
        map.set(tag.id, { tag, group, index })
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

      const { group: fromGroup, index: fromIndex, tag } = moving

      let toGroup: string
      let toIndex: number

      const overTagId = parseTagId(over.id as string)
      if (overTagId !== -1) {
        const overFound = tagLookup.get(overTagId)
        if (!overFound) return
        toGroup = overFound.group.code
        toIndex = overFound.index
      } else {
        const target = tags.find(g => g.code === over.id)
        if (!target) return
        toGroup = target.code
        toIndex = target.tags.length
      }

      if (fromGroup.code === toGroup && fromIndex === toIndex) return

      const next = reorderTags(tags, fromGroup.code, fromIndex, tag, toGroup, toIndex)

      onDragReorder(
        {
          fromId: activeId,
          toGroup,
          toIndex,
        },
        next
      )
    },
    [tags, tagLookup, onDragReorder]
  )

  /* ---------------- render ---------------- */

  if (tags.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <div className='w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4'>
          <FolderOpen className='w-8 h-8 text-honey-600' />
        </div>
        <h3 className='text-lg font-semibold text-foreground mb-2'>暂无分组</h3>
        <p className='text-sm text-foreground-secondary'>请先点击右上角的「新建分组」按钮</p>
      </div>
    )
  }

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
        {tags.map(group => (
          <TagSection
            key={group.code}
            dragOverId={dragState.overId}
            tagGroup={group}
            tagActions={tagActions}
            onAddTag={onAddTag}
            onDeleteGroup={onDeleteGroup}
          />
        ))}
      </div>
    </DndContext>
  )
}
