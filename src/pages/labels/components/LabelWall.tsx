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
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import type { Label, LabelCategory, LabelFormData } from '@/types/labels'
import { LabelCard } from './LabelCard'
import { LabelSection } from './LabelSection'

interface LabelWallProps {
  categories: LabelCategory[]
  onEditLabel?: (labelId: number, label: LabelFormData) => void
  onDeleteLabel?: (labelId: number) => void
  onReorderLabel?: (data: {
    fromId: number
    toId?: number
    toCategory: string
    toIndex: number
  }) => void
}

export function LabelWall({
  categories,
  onEditLabel,
  onDeleteLabel,
  onReorderLabel,
}: LabelWallProps) {
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null)
  const [activeLabel, setActiveLabel] = useState<Label | null>(null)

  const labelActions = useMemo(
    () => ({
      onEdit: (id: number, label: LabelFormData) => onEditLabel?.(id, label),
      onDelete: (id: number) => onDeleteLabel?.(id),
    }),
    [onEditLabel, onDeleteLabel]
  )

  const categoryItemIds = useMemo(() => {
    const ids: Record<string, string[]> = {}
    categories.forEach(cat => {
      ids[cat.code] = cat.labels.map(l => `${l.category}-${l.id}`)
    })
    return ids
  }, [categories])

  const handleDragStart = (event: DragStartEvent) => {
    const activeIdValue = event.active.id as string
    const activeLabelId = parseInt(activeIdValue.split('-')[1], 10)
    const label = categories.flatMap(cat => cat.labels).find(l => l.id === activeLabelId)
    setActiveLabel(label ? { ...label } : null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      setDragOverCategory(null)
      return
    }
    const overCategory = event.over.id as string
    setDragOverCategory(overCategory.split('-')[0])
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveLabel(null)
    setDragOverCategory(null)
    if (!over) return

    const activeSortableId = active.id as string
    const overSortableId = over.id as string
    const activeCategory = activeSortableId.split('-')[0]
    const overCategory = overSortableId.split('-')[0]
    const activeLabelId = parseInt(activeSortableId.split('-')[1], 10)

    const activeLabel = categories.flatMap(cat => cat.labels).find(l => l.id === activeLabelId)
    if (!activeLabel) return

    if (activeCategory === overCategory) {
      const currentCategory = categories.find(cat => cat.code === activeCategory)
      if (!currentCategory) return

      const activeIndex = currentCategory.labels.findIndex(
        l => `${l.category}-${l.id}` === activeSortableId
      )
      const overIndex = currentCategory.labels.findIndex(
        l => `${l.category}-${l.id}` === overSortableId
      )

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        currentCategory.labels = arrayMove(currentCategory.labels, activeIndex, overIndex)
        onReorderLabel?.({
          fromId: activeLabelId,
          toId: currentCategory.labels[overIndex].id,
          toCategory: activeCategory,
          toIndex: overIndex,
        })
      }
    } else {
      const activeCategoryData = categories.find(cat => cat.code === activeCategory)
      const overCategoryData = categories.find(cat => cat.code === overCategory)
      if (!activeCategoryData || !overCategoryData) return

      const labelToMove = activeCategoryData.labels.find(l => l.id === activeLabelId)
      if (!labelToMove) return

      const newActiveCategoryLabels = activeCategoryData.labels.filter(l => l.id !== activeLabelId)

      let toIndex = overCategoryData.labels.length
      if (overSortableId.startsWith(overCategory)) {
        const overLabelId = parseInt(overSortableId.split('-')[1], 10)
        const overIndex = overCategoryData.labels.findIndex(l => l.id === overLabelId)
        if (overIndex !== -1) toIndex = overIndex
      }

      const updatedLabel = { ...labelToMove, category: overCategory }
      const newOverCategoryLabels = [
        ...overCategoryData.labels.slice(0, toIndex),
        updatedLabel,
        ...overCategoryData.labels.slice(toIndex),
      ]

      activeCategoryData.labels = newActiveCategoryLabels
      overCategoryData.labels = newOverCategoryLabels

      onReorderLabel?.({
        fromId: activeLabelId,
        toCategory: overCategory,
        toIndex,
      })
    }
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

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
          {activeLabel && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.05, rotate: 2 }}
              className='opacity-80'
            >
              <LabelCard label={activeLabel} />
            </motion.div>
          )}
        </AnimatePresence>
      </DragOverlay>

      {categories.map(cat => (
        <SortableContext
          key={cat.code}
          items={categoryItemIds[cat.code]}
          strategy={rectSortingStrategy}
        >
          <LabelSection
            category={cat}
            labelActions={labelActions}
            isDragOver={dragOverCategory === cat.code}
          />
        </SortableContext>
      ))}

      {categories.length === 0 && (
        <div className='flex h-64 w-full items-center justify-center text-muted-foreground'>
          暂无标签，点击上方按钮添加
        </div>
      )}
    </DndContext>
  )
}
