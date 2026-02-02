import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { LoadingState } from '@/components/LoadingState'
import { SpaceProvider } from '@/pages/spaces/contexts/SpaceContext'
import { useSpaceId } from '@/pages/spaces/hooks/useSpaceLocal'
import type { NoteFormData } from '@/types/notes'
import { NoteEditor } from './components/NoteEditor'
import { NoteList } from './components/NoteList'
import { useCreateNoteMutation } from './hooks/useNotes'

export default function NotesPage() {
  const navigate = useNavigate()
  const { getSpaceId } = useSpaceId()
  const spaceId = getSpaceId()

  if (!spaceId) {
    return (
      <LoadingState
        type='error'
        message='请选择空间'
        action={{ label: '返回首页', onClick: () => navigate('/') }}
      />
    )
  }

  return (
    <SpaceProvider spaceId={Number(spaceId)}>
      <NotesPageInner />
    </SpaceProvider>
  )
}

function NotesPageInner() {
  const createMutation = useCreateNoteMutation()

  const handleSave = useCallback(
    (noteData: NoteFormData) => {
      createMutation.mutate(noteData)
    },
    [createMutation]
  )

  return (
    <div className='max-w-3xl mx-auto px-4 py-6'>
      <NoteEditor onSave={handleSave} enableFullscreen />

      <NoteList />
    </div>
  )
}
