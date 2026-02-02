import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useCallback, useMemo, useState } from 'react'
import type { ReorderParams, Tag, TagGroup } from '@/types/tags'

interface DragState {
  activeTag: Tag | null
  overId: string | null
}

interface UseTagDragDropParams {
  tags: TagGroup[]
  onDragHandle: (params: ReorderParams, next: TagGroup[]) => void
}

const parseTagId = (overId: string | number) => {
  const strId = String(overId)
  const parts = strId.split('-')
  if (parts.length < 2) return -1
  const num = Number(parts[1])
  return Number.isNaN(num) ? -1 : num
}

function reorderTags(
  prev: TagGroup[],
  fromGroupId: number,
  fromIndex: number,
  fromTag: Tag,
  toGroupId: number,
  toIndex: number
): TagGroup[] {
  if (fromGroupId === toGroupId) {
    return prev.map(group => {
      if (group.id !== toGroupId) return group
      const tags = [...group.tags]
      const [removed] = tags.splice(fromIndex, 1)
      tags.splice(toIndex, 0, removed)
      return { ...group, tags }
    })
  }

  return prev.map(group => {
    if (group.id === fromGroupId) {
      return { ...group, tags: group.tags.filter((_, i) => i !== fromIndex) }
    }
    if (group.id === toGroupId) {
      const tags = [...group.tags]
      tags.splice(toIndex, 0, { ...fromTag, groupId: toGroupId })
      return { ...group, tags }
    }
    return group
  })
}

/**
 * Hook to manage drag and drop logic for TagWall
 * Handles drag state, sensors, and drag events
 */
export function useTagDragDrop({ tags, onDragHandle }: UseTagDragDropParams) {
  const [dragState, setDragState] = useState<DragState>({ activeTag: null, overId: null })

  const tagLookup = useMemo(() => {
    const map = new Map<number, { tag: Tag; group: TagGroup; index: number }>()
    tags.forEach(group => {
      group.tags.forEach((tag, index) => {
        map.set(tag.id, { tag, group, index })
      })
    })
    return map
  }, [tags])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const id = parseTagId(active.id)
      const found = tagLookup.get(id)
      if (found) {
        setDragState({ activeTag: { ...found.tag }, overId: null })
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

      const activeId = parseTagId(active.id)
      const moving = tagLookup.get(activeId)
      if (!moving) return

      const { group: fromGroup, index: fromIndex, tag } = moving
      let toGroupId: number, toIndex: number

      const overTagId = parseTagId(over.id)
      if (overTagId !== -1) {
        const overFound = tagLookup.get(overTagId)
        if (!overFound) return
        toGroupId = overFound.group.id
        toIndex = overFound.index
      } else {
        const target = tags.find(g => g.id === over.id)
        if (!target) return
        toGroupId = target.id
        toIndex = target.tags.length
      }

      if (fromGroup.id === toGroupId && fromIndex === toIndex) return

      const next = reorderTags(tags, fromGroup.id, fromIndex, tag, toGroupId, toIndex)
      onDragHandle({ fromId: activeId, toGroupId, toIndex }, next)
    },
    [tags, tagLookup, onDragHandle]
  )

  return {
    dragState,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}
