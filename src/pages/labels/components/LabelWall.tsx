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
import { useEffect, useState } from 'react'
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

export function LabelWall({ categories, labelActions, onAddLabelClick }: LabelWallProps) {
  const [localCategories, setLocalCategories] = useState<LabelCategory[]>(categories)

  useEffect(() => {
    setLocalCategories(categories)
  }, [categories])

  const [activeLabel, setActiveLabel] = useState<Label | null>(null)
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const parseSortableId = (id: string) => {
    const [category, labelId] = id.split('-')
    return { category, labelId: Number(labelId) }
  }

  const findLabel = (id: number) => localCategories.flatMap(c => c.labels).find(l => l.id === id)

  const handleDragStart = (event: DragStartEvent) => {
    const { labelId } = parseSortableId(event.active.id as string)
    const label = findLabel(labelId)
    setActiveLabel(label ? { ...label } : null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) {
      setDragOverCategory(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string
    const { category: fromCategory, labelId } = parseSortableId(activeId)
    const toCategory = overId.includes('-') ? parseSortableId(overId).category : overId

    setDragOverCategory(toCategory)

    // 拖到空分类
    if (overId === toCategory) {
      setLocalCategories(prev => {
        const fromCat = prev.find(c => c.code === fromCategory)
        const toCat = prev.find(c => c.code === toCategory)
        if (!fromCat || !toCat) return prev

        const moving = fromCat.labels.find(l => l.id === labelId)
        if (!moving) return prev

        return prev.map(cat => {
          if (cat.code === fromCategory)
            return { ...cat, labels: cat.labels.filter(l => l.id !== labelId) }
          if (cat.code === toCategory)
            return { ...cat, labels: [{ ...moving, category: toCategory }] }
          return cat
        })
      })
      return
    }

    // 同分类拖拽
    if (fromCategory === toCategory) {
      setLocalCategories(prev =>
        prev.map(cat => {
          if (cat.code !== fromCategory) return cat
          const oldIndex = cat.labels.findIndex(l => l.id === labelId)
          const newIndex = cat.labels.findIndex(l => `${l.category}-${l.id}` === overId)
          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return cat
          return { ...cat, labels: arrayMove(cat.labels, oldIndex, newIndex) }
        })
      )
      return
    }

    // 跨分类拖拽到 label 上
    setLocalCategories(prev => {
      const fromCat = prev.find(c => c.code === fromCategory)
      const toCat = prev.find(c => c.code === toCategory)
      if (!fromCat || !toCat) return prev

      const moving = fromCat.labels.find(l => l.id === labelId)
      if (!moving) return prev

      const newFrom = fromCat.labels.filter(l => l.id !== labelId)
      const overIndex = toCat.labels.findIndex(l => `${l.category}-${l.id}` === overId)
      const newTo = [
        ...toCat.labels.slice(0, overIndex),
        { ...moving, category: toCategory },
        ...toCat.labels.slice(overIndex),
      ]

      return prev.map(cat => {
        if (cat.code === fromCategory) return { ...cat, labels: newFrom }
        if (cat.code === toCategory) return { ...cat, labels: newTo }
        return cat
      })
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveLabel(null)
    setDragOverCategory(null)
    if (!over) return

    const { labelId } = parseSortableId(active.id as string)
    const overId = over.id as string
    const toCategory = overId.includes('-') ? parseSortableId(overId).category : overId
    const targetCategory = localCategories.find(c => c.code === toCategory)
    if (!targetCategory) return

    const toIndex = targetCategory.labels.findIndex(l => l.id === labelId)
    labelActions.onReorder?.({ fromId: labelId, toCategory, toIndex: toIndex === -1 ? 0 : toIndex })
  }

  const handleDragCancel = () => {
    setActiveLabel(null)
    setDragOverCategory(null)
  }

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

      {localCategories.map(cat => (
        <SortableContext
          key={cat.code}
          items={cat.labels.map(l => `${l.category}-${l.id}`)}
          strategy={rectSortingStrategy}
        >
          <LabelSection
            category={cat}
            labelActions={labelActions}
            isDragOver={dragOverCategory === cat.code}
            onAddLabelClick={onAddLabelClick}
          />
        </SortableContext>
      ))}

      {localCategories.length === 0 && (
        <div className='flex h-64 items-center justify-center text-muted-foreground'>暂无标签</div>
      )}
    </DndContext>
  )
}
