import { useCallback, useMemo } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { LabelWall } from '@/pages/labels/components/LabelWall'
import { groupByCategory, useCategories, useLabels } from '@/pages/labels/hooks/useLabels'
import type { LabelCategory, LabelFormData } from '@/types/labels'

export default function LabelsPage() {
  const { data: labels, isLoading: labelsLoading } = useLabels()
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  const isLoading = labelsLoading || categoriesLoading

  const groupedCategories = useMemo<LabelCategory[]>(
    () => groupByCategory(labels || [], categories || []),
    [labels, categories]
  )

  const labelActions = useMemo(
    () => ({
      onEdit: (id: number, label: LabelFormData) => console.log('edit', id, label),
      onDelete: (id: number) => console.log('delete', id),
      onReorder: (data: { fromId: number; toId?: number; toCategory: string; toIndex: number }) =>
        console.log('reorder', data),
    }),
    []
  )

  const handleAddLabelClick = useCallback((category: string) => {
    console.log('add', category)
  }, [])

  if (isLoading) return <LoadingState type='loading' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <LabelWall
        categories={groupedCategories}
        labelActions={labelActions}
        onAddLabelClick={handleAddLabelClick}
      />
    </div>
  )
}
