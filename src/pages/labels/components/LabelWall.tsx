// components/labels/LabelWall.tsx

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { groupByCategory, useReorderLabels } from '@/pages/labels/hooks/useLabels'
import { handleDragEnd as processDragEnd } from '@/pages/labels/utils/dnd-utils'
import type { Label, LabelFormData } from '@/types/labels'
import { LabelCard } from './LabelCard'
import { LabelSection } from './LabelSection'

interface LabelWallProps {
  labels: Label[]
  onEditLabel?: (labelId: number, label: LabelFormData) => void
  onDeleteLabel?: (labelId: number) => void
}

export function LabelWall({ labels, onEditLabel, onDeleteLabel }: LabelWallProps) {
  const queryClient = useQueryClient()
  const { mutate: reorderLabels } = useReorderLabels()

  const [activeLabel, setActiveLabel] = useState<Label | null>(null)
  const [localLabels, setLocalLabels] = useState<Label[]>(labels)

  // 同步外部数据
  useMemo(() => {
    setLocalLabels(labels)
  }, [labels])

  const categories = useMemo(() => groupByCategory(localLabels), [localLabels])

  const labelActions = useMemo(
    () => ({
      onEdit: (id: number, label: LabelFormData) => onEditLabel?.(id, label),
      onDelete: (id: number) => onDeleteLabel?.(id),
    }),
    [onEditLabel, onDeleteLabel]
  )

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 拖动8px后激活
      },
    })
  )

  // 拖拽开始
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event
      const label = localLabels.find(l => l.id === active.id)
      setActiveLabel(label || null)
    },
    [localLabels]
  )

  // 拖拽经过（用于跨分类实时预览）
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return

      const activeId = active.id as number
      const overId = over.id

      // 检查是否拖到分类容器上
      if (typeof overId === 'string' && overId.startsWith('category-')) {
        const targetCategory = overId.replace('category-', '')
        const activeLabel = localLabels.find(l => l.id === activeId)

        if (activeLabel && activeLabel.category !== targetCategory) {
          // 实时更新预览
          setLocalLabels(prev =>
            prev.map(l => (l.id === activeId ? { ...l, category: targetCategory } : l))
          )
        }
      }
    },
    [localLabels]
  )

  // 拖拽结束
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveLabel(null)

      if (!over) {
        // 取消拖拽，恢复原数据
        setLocalLabels(labels)
        return
      }

      const activeId = active.id as number
      let overId = over.id
      let overCategory: string

      // 判断放置目标
      if (typeof overId === 'string' && overId.startsWith('category-')) {
        overCategory = overId.replace('category-', '')
        overId = -1 // 放在分类末尾
      } else {
        const overLabel = localLabels.find(l => l.id === overId)
        overCategory = overLabel?.category || ''
      }

      if (!overCategory) {
        setLocalLabels(labels)
        return
      }

      // 处理拖拽结果
      const { updatedLabels, reorderRequest } = processDragEnd(
        localLabels,
        activeId,
        overId as number,
        overCategory
      )

      // Optimistic update
      setLocalLabels(updatedLabels)

      // 持久化到后端
      if (reorderRequest.items.length > 0) {
        // 同时更新 React Query 缓存
        queryClient.setQueryData(['labels'], updatedLabels)

        // 调用后端 API
        reorderLabels(reorderRequest)
      }
    },
    [labels, localLabels, queryClient, reorderLabels]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className='flex gap-4 overflow-x-auto p-4'>
        {categories.map(category => (
          <LabelSection key={category.id} category={category} labelActions={labelActions} />
        ))}

        {categories.length === 0 && (
          <div className='flex h-64 w-full items-center justify-center text-muted-foreground'>
            暂无标签，点击上方按钮添加
          </div>
        )}
      </div>

      {/* 拖拽覆盖层 */}
      <DragOverlay>
        {activeLabel && (
          <div className='rotate-3 scale-105'>
            <LabelCard label={activeLabel} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
