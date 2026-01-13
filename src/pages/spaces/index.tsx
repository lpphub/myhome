import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { LoadingState } from '@/components/LoadingState'
import { useAuth } from '@/hooks'
import type { Space, SpaceForm } from '@/types/spaces'
import { InviteListDialog } from './components/InviteListDialog'
import { InviteReminder } from './components/InviteReminder'
import { SpaceCard } from './components/SpaceCard'
import { SpaceFormDialog } from './components/SpaceFormDialog'
import { SpaceMemberDialog } from './components/SpaceMemberDialog'
import {
  useCreateSpace,
  useDeleteSpace,
  usePendingInvitesQuery,
  useSpaceQuery,
  useTogglePinSpace,
  useUpdateSpace,
} from './hooks/useSpaces'

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
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: spaceList = [], isLoading } = useSpaceQuery()
  const { data: invites = [] } = usePendingInvitesQuery()
  const { greeting, message } = useMemo(() => getGreeting(), [])

  const createSpace = useCreateSpace()
  const updateSpace = useUpdateSpace()
  const deleteSpace = useDeleteSpace()
  const togglePinSpace = useTogglePinSpace()

  const [spaceDialog, setSpaceDialog] = useState<DialogState>({ open: false })
  const [memberDialog, setMemberDialog] = useState<DialogState>({ open: false })
  const [inviteDialog, setInviteDialog] = useState(false)

  const handleAdd = () => setSpaceDialog({ open: true })
  const handleEdit = (space: Space) => setSpaceDialog({ open: true, initialData: space })

  const handleSubmit = (values: SpaceForm) => {
    values.id ? updateSpace.mutate(values) : createSpace.mutate(values)
    setSpaceDialog({ open: false })
  }
  const handleDelete = (id: number) => {
    deleteSpace.mutate(id)
    setSpaceDialog({ open: false })
  }

  if (isLoading) return <LoadingState type='loading' />

  return (
    <div className='min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <main className='max-w-6xl mx-auto px-6 py-8'>
        <header className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>👋 {greeting}</h1>
          <p className='text-foreground-secondary'>{message}</p>
        </header>

        <InviteReminder count={invites.length} onClick={() => setInviteDialog(true)} />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {spaceList.map((space, index) => (
            <div
              key={space.id}
              className='animate-in fade-in zoom-in-95 duration-300'
              style={{ animationDelay: `${Math.floor(index / 5) * 50}ms` }}
            >
              <SpaceCard
                space={space}
                currentUserId={user?.id ?? 0}
                onEdit={handleEdit}
                onTogglePin={togglePinSpace.mutate}
                onOpenMemberDialog={space => setMemberDialog({ open: true, initialData: space })}
                navigateTo={navigate}
              />
            </div>
          ))}

          {/* 新建空间按钮 */}
          <button
            type='button'
            onClick={handleAdd}
            className='group relative bg-white rounded-2xl p-6
                       border-2 border-primary/20 hover:border-primary
                       shadow-[6px_6px_0_0_#ff8c4233,inset_0_-4px_0_0_#00000008]
                       hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#ff8c4233,inset_0_-4px_0_0_#00000008]
                       overflow-hidden transition-all duration-300 ease-out cursor-pointer
                       animate-in fade-in zoom-in-95 min-h-50 flex flex-col justify-center'
          >
            <div className='flex flex-col items-center gap-3'>
              <div
                className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center
                              transition-colors group-hover:bg-gray-200'
              >
                <Plus className='w-5 h-5 text-primary' />
              </div>
              <h3 className='font-semibold text-foreground-secondary text-base'>新建空间</h3>
              {spaceList.length === 0 && (
                <p className='text-sm text-gray-500'>开始记录你的美好生活</p>
              )}
            </div>
          </button>
        </div>
      </main>

      {/* 弹窗 */}
      <SpaceFormDialog
        open={spaceDialog.open}
        onClose={() => setSpaceDialog({ open: false })}
        onSubmit={handleSubmit}
        initialData={spaceDialog.initialData}
        onDelete={spaceDialog.initialData?.id ? handleDelete : undefined}
      />

      <SpaceMemberDialog
        open={memberDialog.open}
        onClose={() => setMemberDialog({ open: false })}
        space={memberDialog.initialData}
        isOwner={memberDialog.initialData?.owner === user?.id}
      />

      <InviteListDialog open={inviteDialog} onClose={() => setInviteDialog(false)} />
    </div>
  )
}
