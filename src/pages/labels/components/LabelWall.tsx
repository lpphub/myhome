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
import { useEffect, useMemo, useState } from 'react'
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
  categories: externalCategories,
  onEditLabel,
  onDeleteLabel,
  onReorderLabel,
}: LabelWallProps) {
  const [localLabels, setLocalLabels] = useState<Label[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null)

  useEffect(() => {
    const allLabels = externalCategories.flatMap(cat => cat.labels)
    setLocalLabels(allLabels)
  }, [externalCategories])

  const labelActions = useMemo(
    () => ({
      onEdit: (id: number, label: LabelFormData) => onEditLabel?.(id, label),
      onDelete: (id: number) => onDeleteLabel?.(id),
    }),
    [onEditLabel, onDeleteLabel]
  )

  const categoryItemIds = useMemo(() => {
    const ids: Record<string, string[]> = {}
    externalCategories.forEach(cat => {
      ids[cat.code] = cat.labels.map(l => `label-${l.id}`)
    })
    return ids
  }, [externalCategories])

  const activeLabel = useMemo<Label | null>(() => {
    if (!activeId) return null
    const allLabels = externalCategories.flatMap(cat => cat.labels)
    return allLabels.find(l => `label-${l.id}` === activeId) || null
  }, [activeId, externalCategories])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      setDragOverCategory(null)
      return
    }
    const overCategory = event.over.id as string
    setDragOverCategory(overCategory.replace('category-', ''))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setDragOverCategory(null)
    if (!over) return

    const activeSortableId = active.id as string
    const overSortableId = over.id as string

    const activeLabelId = parseInt(activeSortableId.replace('label-', ''), 10)
    const activeLabel = externalCategories
      .flatMap(cat => cat.labels)
      .find(l => l.id === activeLabelId)
    if (!activeLabel) return

    const activeCategory = activeLabel.category
    let overCategory: string
    let overLabelId: number | undefined

    if (overSortableId.startsWith('category-')) {
      overCategory = overSortableId.replace('category-', '')
      overLabelId = undefined
    } else if (overSortableId.startsWith('label-')) {
      overLabelId = parseInt(overSortableId.replace('label-', ''), 10)
      const overLabel = externalCategories
        .flatMap(cat => cat.labels)
        .find(l => l.id === overLabelId)
      overCategory = overLabel?.category || ''
    } else {
      return
    }

    if (activeCategory === overCategory) {
      const currentCategory = externalCategories.find(cat => cat.code === activeCategory)
      if (!currentCategory) return

      const activeIndex = currentCategory.labels.findIndex(l => l.id === activeLabelId)
      const overIndex =
        overLabelId !== undefined
          ? currentCategory.labels.findIndex(l => l.id === overLabelId)
          : currentCategory.labels.length - 1

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const newLabels = arrayMove(currentCategory.labels, activeIndex, overIndex)
        const updatedLocalLabels = localLabels.map(l =>
          l.id === activeLabelId ? { ...l, order: overIndex } : l
        )
        setLocalLabels(updatedLocalLabels)

        onReorderLabel?.({
          fromId: activeLabelId,
          toId: newLabels[overIndex].id,
          toCategory: activeCategory,
          toIndex: overIndex,
        })
      }
    } else {
      const activeCategoryData = externalCategories.find(cat => cat.code === activeCategory)
      const overCategoryData = externalCategories.find(cat => cat.code === overCategory)
      if (!activeCategoryData || !overCategoryData) return

      const toIndex =
        overLabelId !== undefined
          ? overCategoryData.labels.findIndex(l => l.id === overLabelId)
          : overCategoryData.labels.length

      const updatedLocalLabels = localLabels.map(l =>
        l.id === activeLabelId ? { ...l, category: overCategory } : l
      )
      setLocalLabels(updatedLocalLabels)

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

      {externalCategories.map(cat => (
        <SortableContext
          key={cat.code}
          id={`category-${cat.code}`}
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

      {externalCategories.length === 0 && (
        <div className='flex h-64 w-full items-center justify-center text-muted-foreground'>
          暂无标签，点击上方按钮添加
        </div>
      )}
    </DndContext>
  )
}
