import { useCallback, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { LabelFormDialog } from '@/pages/labels/components/LabelFormDialog'
import { LabelWall } from '@/pages/labels/components/LabelWall'
import { useLabels } from '@/pages/labels/hooks/useLabels'
import type { LabelFormData } from '@/types/labels'
import { LabelToolbar } from '@/pages/labels/components/LabelToolbar'

export default function LabelsPage() {
  const { data: labels, isLoading } = useLabels()

  const handleAddLabelClick = useCallback((category: string) => {
    setEditingLabel(null)
    setCategory(category)
    setDialogOpen(true)
  }, [])

  const handleEditLabelClick = useCallback((label: LabelFormData) => {
    setEditingLabel(label)
    setCategory(undefined)
    setDialogOpen(true)
  }, [])

  const labelActions = useMemo(
    () => ({
      onEdit: handleEditLabelClick,
      onDelete: (id: number) => console.log('delete', id),
      onReorder: (data: { fromId: number; toId?: number; toCategory: string; toIndex: number }) =>
        console.log('reorder', data),
    }),
    [handleEditLabelClick]
  )

  // 弹窗状态
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editingLabel, setEditingLabel] = useState<LabelFormData | null>(null)
  const [category, setCategory] = useState<string | undefined>(undefined)
  // 弹窗动作
  const dialogActions = useMemo(
    () => ({
      addLabel: (data: LabelFormData) => {
        console.log('add', data)
        setDialogOpen(false)
      },
      updateLabel: (data: LabelFormData) => {
        console.log('update', data)
        setDialogOpen(false)
      },
    }),
    []
  )

  if (isLoading) return <LoadingState type='loading' />

  if (!labels) return <LoadingState type='error' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <LabelToolbar onAddCategory={handleAddLabelClick} />

      <LabelWall
        labels={labels}
        labelActions={labelActions}
        onAddLabelClick={handleAddLabelClick}
      />

      {/* 弹窗 */}
      <LabelFormDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={{
          label: editingLabel,
          category,
        }}
        actions={dialogActions}
      />
    </div>
  )
}
