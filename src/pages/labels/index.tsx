import { useMemo } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { LabelWall } from '@/pages/labels/components/LabelWall'
import { useLabels } from '@/pages/labels/hooks/useLabels'
import type { LabelFormData } from '@/types/labels'

export default function LabelsPage() {
  const { data: labels, isLoading } = useLabels()
  // const { mutate: updateLabel } = useUpdateLabel()
  // const { mutate: deleteLabel } = useDeleteLabel()

  const labelActions = useMemo(
    () => ({
      onEditLabel: (id: number, label: LabelFormData) => console.log('edit', id, label),
      onDeleteLabel: (id: number) => console.log('delete', id),
    }),
    []
  )

  if (isLoading) return <LoadingState type='loading' />

  console.log(labels)

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <LabelWall labels={labels || []} {...labelActions} />
    </div>
  )
}
