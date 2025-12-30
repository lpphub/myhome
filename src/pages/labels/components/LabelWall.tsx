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
import type { Label, LabelCategory } from '@/types/labels'
import { LabelCard } from './LabelCard'
import { type LabelActions, LabelSection } from './LabelSection'

interface LabelWallProps {
  categories: LabelCategory[]
  labelActions: LabelActions & {
    onReorder?: (data: {
      fromId: number
      toId?: number
      toCategory: string
      toIndex: number
    }) => void
  }
  onAddLabelClick?: (category: string) => void
}

// 拖拽相关辅助函数
const parseSortableId = (id: string) => {
  return Number(id.replace('label-', ''))
}
const findCategoryByLabelId = (categories: LabelCategory[], labelId: number) => {
  return categories.find(cat => cat.labels.some(l => l.id === labelId))
}
const findLabelIndex = (cat: LabelCategory, labelId: number) => {
  return cat.labels.findIndex(l => l.id === labelId)
}

export function LabelWall({ categories, labelActions, onAddLabelClick }: LabelWallProps) {
  const [localCategories, setLocalCategories] = useState<LabelCategory[]>(categories)

  useEffect(() => {
    setLocalCategories(categories)
  }, [categories])

  const [activeLabel, setActiveLabel] = useState<Label | null>(null)
  const [overDroppable, setOverDroppable] = useState<string | null>(null)

  // 初始化传感器
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )
  // 处理拖拽开始事件
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const labelId = parseSortableId(event.active.id as string)
      const label = localCategories.flatMap(c => c.labels).find(l => l.id === labelId)
      setActiveLabel(label ? { ...label } : null)
    },
    [localCategories]
  )

  // 处理拖拽悬停事件
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) {
        setOverDroppable(null)
        return
      }

      const activeId = parseSortableId(active.id as string)
      const overId =
        typeof over.id === 'string' && over.id.startsWith('label-')
          ? parseSortableId(over.id)
          : over.id // 可能是 droppable 容器 id

      const fromCategory = findCategoryByLabelId(localCategories, activeId)
      if (!fromCategory) return

      const toCategory =
        typeof overId === 'number'
          ? findCategoryByLabelId(localCategories, overId)
          : localCategories.find(c => c.code === overId)
      if (!toCategory) return

      // 检查是否在不同分类之间移动
      setOverDroppable(toCategory.code)

      // —— 同分类排序预览 ——
      if (fromCategory.code === toCategory.code && typeof overId === 'number') {
        const oldIndex = findLabelIndex(fromCategory, activeId)
        const newIndex = findLabelIndex(fromCategory, overId)
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

        setLocalCategories(prev =>
          prev.map(cat =>
            cat.code === fromCategory.code
              ? { ...cat, labels: arrayMove(cat.labels, oldIndex, newIndex) }
              : cat
          )
        )
        return
      }

      // —— 跨分类预览（不改 category） ——
      if (fromCategory.code !== toCategory.code) {
        setLocalCategories(prev => {
          // 找到源分类、目标分类以及正拖拽的label
          const source = prev.find(c => c.code === fromCategory.code)
          const target = prev.find(c => c.code === toCategory.code)
          if (!source || !target) return prev
          const moving = source.labels.find(l => l.id === activeId)
          if (!moving) return prev

          // 从源分类移除
          const newSource = source.labels.filter(l => l.id !== activeId)

          // 确定插入位置
          const targetIndex =
            typeof overId === 'number' ? findLabelIndex(target, overId) : target.labels.length

          const insertIndex = targetIndex === -1 ? target.labels.length : targetIndex

          const newTarget = [
            ...target.labels.slice(0, insertIndex),
            moving, // ⚠️ 不改 category
            ...target.labels.slice(insertIndex),
          ]

          return prev.map(cat => {
            if (cat.code === source.code) return { ...cat, labels: newSource }
            if (cat.code === target.code) return { ...cat, labels: newTarget }
            return cat
          })
        })
      }
    },
    [localCategories]
  )

  // 处理拖拽结束事件
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveLabel(null)
      setOverDroppable(null)
      if (!over) return

      const activeId = parseSortableId(active.id as string)
      const overId =
        typeof over.id === 'string' && over.id.startsWith('label-')
          ? parseSortableId(over.id)
          : over.id // 可能是 droppable 容器 id

      const fromCategory = findCategoryByLabelId(localCategories, activeId)
      if (!fromCategory) return

      const toCategory =
        typeof overId === 'number'
          ? findCategoryByLabelId(localCategories, overId)
          : localCategories.find(c => c.code === overId)
      if (!toCategory) return

      // const fromIndex = findLabelIndex(fromCategory, activeId)
      const toIndex =
        typeof overId === 'number'
          ? findLabelIndex(toCategory, overId)
          : toCategory.labels.length - 1

      // 提交给外部（onReorder）
      labelActions.onReorder?.({
        fromId: activeId,
        toCategory: toCategory.code,
        toIndex: Math.max(toIndex, 0),
      })
    },
    [localCategories, labelActions.onReorder]
  )

  // 处理拖拽取消事件
  const handleDragCancel = useCallback(() => {
    setActiveLabel(null)
    setOverDroppable(null)
  }, [])

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
          {activeLabel && (
            <motion.div initial={{ scale: 1 }} animate={{ scale: 1.05 }} className='opacity-80'>
              <LabelCard label={activeLabel} />
            </motion.div>
          )}
        </AnimatePresence>
      </DragOverlay>
      <div className='overflow-auto touch-pan-y'>
        {localCategories.map(cat => (
          <SortableContext
            key={cat.code}
            items={cat.labels.map(l => `label-${l.id}`)}
            strategy={rectSortingStrategy}
          >
            <LabelSection
              category={cat}
              labelActions={labelActions}
              isDragOver={overDroppable === cat.code}
              onAddLabelClick={onAddLabelClick}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  )
}
