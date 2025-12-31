import { useCallback, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { LabelFormDialog } from '@/pages/labels/components/LabelFormDialog'
import { LabelToolbar } from '@/pages/labels/components/LabelToolbar'
import { LabelWall } from '@/pages/labels/components/LabelWall'
import { useCreateCategory, useLabels } from '@/pages/labels/hooks/useLabels'
import type { Category, LabelFormData } from '@/types/labels'

export default function LabelsPage() {
  const { data: labels, isLoading } = useLabels()
  const createCategory = useCreateCategory()

  const categories = useMemo<Category[]>(
    () => labels?.map(cat => ({ id: cat.id, code: cat.code, name: cat.name })) || [],
    [labels]
  )

  // 弹窗状态
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [dialogLabel, setDialogLabel] = useState<LabelFormData | null>(null)
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

  // 新增分类
  const handleAddCategory = useCallback(
    (categoryName: string) => {
      createCategory.mutate(categoryName)
    },
    [createCategory]
  )

  // 新增便签
  const handleAddLabelClick = useCallback((category: string) => {
    setDialogLabel({ name: '', category, color: 'lemon' })
    setDialogOpen(true)
  }, [])

  // 编辑便签
  const handleEditLabelClick = useCallback((label: LabelFormData) => {
    setDialogLabel(label)
    setDialogOpen(true)
  }, [])

  // 便签操作
  const labelActions = useMemo(
    () => ({
      onEdit: handleEditLabelClick,
      onDelete: (id: number) => console.log('delete', id),
      onReorder: (data: { fromId: number; toId?: number; toCategory: string; toIndex: number }) =>
        console.log('reorder', data),
    }),
    [handleEditLabelClick]
  )

  if (isLoading) return <LoadingState type='loading' />

  if (!labels) return <LoadingState type='error' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      {/* 工具栏 */}
      <LabelToolbar onAddCategory={handleAddCategory} />

      {/* 便签墙 */}
      <LabelWall
        labels={labels}
        labelActions={labelActions}
        onAddLabelClick={handleAddLabelClick}
      />

      {/* 弹窗 */}
      <LabelFormDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={dialogLabel}
        categories={categories}
        actions={dialogActions}
      />
    </div>
  )
}
