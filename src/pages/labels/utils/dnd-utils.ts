// utils/dnd-utils.ts
import { arrayMove } from '@dnd-kit/sortable'
import type { Label, ReorderRequest } from '@/types/labels'

export interface DragResult {
  updatedLabels: Label[]
  reorderRequest: ReorderRequest
}

/**
 * 处理拖拽结束后的数据更新
 */
export function handleDragEnd(
  labels: Label[],
  activeId: number,
  overId: number | string,
  overCategory: string
): DragResult {
  const activeLabel = labels.find(l => l.id === activeId)
  if (!activeLabel) {
    return {
      updatedLabels: labels,
      reorderRequest: { items: [] },
    }
  }

  const sourceCategory = activeLabel.category
  const isSameCategory = sourceCategory === overCategory

  // 获取目标分类的标签（按 order 排序）
  const targetCategoryLabels = labels
    .filter(l => l.category === overCategory)
    .sort((a, b) => a.order - b.order)

  // 获取源分类的标签
  const sourceCategoryLabels = labels
    .filter(l => l.category === sourceCategory)
    .sort((a, b) => a.order - b.order)

  const updatedLabels = [...labels]
  const items: ReorderRequest['items'] = []

  if (isSameCategory) {
    // 同分类内排序
    const oldIndex = targetCategoryLabels.findIndex(l => l.id === activeId)
    const newIndex =
      typeof overId === 'number'
        ? targetCategoryLabels.findIndex(l => l.id === overId)
        : targetCategoryLabels.length

    if (oldIndex !== newIndex && newIndex !== -1) {
      const reordered = arrayMove(targetCategoryLabels, oldIndex, newIndex)

      // 更新 order
      reordered.forEach((label, index) => {
        const originalLabel = updatedLabels.find(l => l.id === label.id)
        if (originalLabel && originalLabel.order !== index) {
          originalLabel.order = index
          items.push({
            id: label.id,
            category: overCategory,
            order: index,
          })
        }
      })
    }
  } else {
    // 跨分类移动
    // 1. 从源分类移除
    const filteredSource = sourceCategoryLabels.filter(l => l.id !== activeId)
    filteredSource.forEach((label, index) => {
      const originalLabel = updatedLabels.find(l => l.id === label.id)
      if (originalLabel && originalLabel.order !== index) {
        originalLabel.order = index
        items.push({
          id: label.id,
          category: overCategory,
          order: index,
        })
      }
    })

    // 2. 插入到目标分类
    const insertIndex =
      typeof overId === 'number'
        ? targetCategoryLabels.findIndex(l => l.id === overId)
        : targetCategoryLabels.length

    const newTargetLabels = [...targetCategoryLabels]
    const movedLabel = updatedLabels.find(l => l.id === activeId)
    if (movedLabel) {
      movedLabel.category = overCategory
      newTargetLabels.splice(insertIndex, 0, movedLabel)
    }

    // 更新目标分类的 order
    newTargetLabels.forEach((label, index) => {
      const originalLabel = updatedLabels.find(l => l.id === label.id)
      if (originalLabel && originalLabel.order !== index) {
        originalLabel.order = index
        items.push({
          id: label.id,
          category: overCategory,
          order: index,
        })
      }
    })
  }

  return {
    updatedLabels,
    reorderRequest: { items },
  }
}

/**
 * 生成唯一的拖拽 ID
 */
export function createDragId(labelId: number): string {
  return `label-${labelId}`
}

/**
 * 从拖拽 ID 解析标签 ID
 */
export function parseDragId(dragId: string | number): number | null {
  if (typeof dragId === 'number') return dragId
  const match = dragId.match(/^label-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}
