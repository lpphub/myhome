import { useCallback, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Space, SpaceForm } from '@/types/spaces'
import { SpaceFormDialog } from './components/SpaceFormDialog'
import { SpaceList } from './components/SpaceList'
import { SpaceMemberDialog } from './components/SpaceMemberDialog'
import { useCreateSpace, useDeleteSpace, useSpaces, useUpdateSpace } from './hooks/useSpaces'

const getGreeting = (): { greeting: string; message: string } => {
  const hour = new Date().getHours()
  let greeting = '你好'
  if (hour >= 5 && hour < 12) greeting = '早上好'
  else if (hour >= 12 && hour < 14) greeting = '中午好'
  else if (hour >= 14 && hour < 18) greeting = '下午好'
  else if (hour >= 18 && hour < 22) greeting = '晚上好'
  else greeting = '夜深了'

  const messages = [
    '今天也要温柔地记录生活哦 ✨',
    '生活因记录而美好 💐',
    '每一个便签都是小确幸 🌸',
    '让美好时光留下印记 🌟',
    '记录生活，留住美好 ✨',
  ]
  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  return { greeting, message: randomMessage }
}

interface DialogState {
  open: boolean
  initialData?: Space
}

export default function Spaces() {
  const [spaceDialog, setSpaceDialog] = useState<DialogState>({
    open: false,
    initialData: undefined,
  })
  const [memberDialog, setMemberDialog] = useState<DialogState>({
    open: false,
    initialData: undefined,
  })

  const user = useAuthStore(state => state.user)

  const { data: spaceList = [], isLoading } = useSpaces()
  const createSpace = useCreateSpace()
  const updateSpace = useUpdateSpace()
  const deleteSpace = useDeleteSpace()

  const handleSubmit = useCallback(
    (values: SpaceForm) => {
      values.id ? updateSpace.mutate(values) : createSpace.mutate(values)

      setSpaceDialog({ open: false, initialData: undefined })
    },
    [createSpace, updateSpace]
  )

  const handleDelete = useCallback(
    (id: number) => {
      deleteSpace.mutate(id)

      setSpaceDialog({ open: false, initialData: undefined })
    },
    [deleteSpace]
  )

  const { greeting, message } = useMemo(() => getGreeting(), [])

  const handleOpenDialog = useCallback((space?: Space) => {
    setSpaceDialog({ open: true, initialData: space })
  }, [])

  const handleOpenMemberDialog = useCallback((space: Space) => {
    setMemberDialog({ open: true, initialData: space })
  }, [])

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <main className='max-w-6xl mx-auto px-6 py-8'>
        <header className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>👋 {greeting}</h1>
          <p className='text-foreground-secondary'>{message}</p>
        </header>

        <SpaceList
          spaces={spaceList}
          onAdd={handleOpenDialog}
          onEdit={handleOpenDialog}
          onOpenMemberDialog={handleOpenMemberDialog}
          currentUserId={user?.id ?? 0}
        />
      </main>

      <SpaceMemberDialog
        open={memberDialog.open}
        onClose={() => setMemberDialog({ open: false, initialData: undefined })}
        space={memberDialog.initialData}
        isOwner={user?.id === memberDialog.initialData?.owner}
      />

      <SpaceFormDialog
        open={spaceDialog.open}
        onClose={() => setSpaceDialog({ open: false, initialData: undefined })}
        onSubmit={handleSubmit}
        initialData={spaceDialog.initialData}
        onDelete={spaceDialog.initialData?.id ? handleDelete : undefined}
      />
    </div>
  )
}
