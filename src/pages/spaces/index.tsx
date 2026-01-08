import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { createSpace, getSpaces, updateSpace } from '@/api/spaces'
import { LoadingState } from '@/components/LoadingState'
import type { Space, SpaceForm } from '@/types/spaces'
import { SpaceFormDialog } from './components/SpaceFormDialog'
import { SpaceList } from './components/SpaceList'

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

const useSpaceHook = () => {
  const queryClient = useQueryClient()

  const { data: spaceList = [], isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: getSpaces,
  })

  const createMutation = useMutation({
    mutationFn: createSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
    },
  })

  return {
    spaceList,
    isLoading,
    createMutation,
    updateMutation,
  }
}

export default function Spaces() {
  const [openDialog, setOpenDialog] = useState(false)
  const [editingSpace, setEditingSpace] = useState<Space | undefined>()

  const { spaceList, isLoading, createMutation, updateMutation } = useSpaceHook()

  const handleSubmit = useCallback(
    (values: SpaceForm) => {
      if (values.id) {
        updateMutation.mutate(values)
      } else {
        createMutation.mutate(values)
      }

      setOpenDialog(false)
    },
    [createMutation, updateMutation]
  )

  const handleOpenDialog = useCallback((space?: Space) => {
    setEditingSpace(space)
    setOpenDialog(true)
  }, [])

  const { greeting, message } = getGreeting()

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <main className='max-w-6xl mx-auto px-6 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>👋 {greeting}</h1>
          <p className='text-foreground-secondary'>{message}</p>
        </div>

        <SpaceList spaces={spaceList} onAdd={handleOpenDialog} onEdit={s => handleOpenDialog(s)} />
      </main>

      <SpaceFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmit}
        initialData={editingSpace}
      />
    </div>
  )
}
