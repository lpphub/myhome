import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { LoadingState } from '@/components/LoadingState'
import { useDialogState } from '@/hooks'
import type { Space } from '@/types/spaces'
import { InviteListDialog } from './components/InviteListDialog'
import { InviteReminder } from './components/InviteReminder'
import { SpaceCard } from './components/SpaceCard'
import { SpaceMemberDialog } from './components/SpaceMemberDialog'
import { usePendingInvitesQuery, useSpaceQuery } from './hooks/useSpaces'

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

export default function SpaceList() {
  const navigate = useNavigate()
  const { data: spaceList = [], isLoading, error } = useSpaceQuery()
  const { data: invites = [] } = usePendingInvitesQuery()
  const { greeting, message } = useMemo(() => getGreeting(), [])

  const memberDialog = useDialogState<Space>()
  const inviteDialog = useDialogState()

  if (isLoading) return <LoadingState type='loading' />
  if (error) return <LoadingState type='error' />

  return (
    <div className='min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <main className='max-w-6xl mx-auto px-6 py-8'>
        <header className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>👋 {greeting}</h1>
          <p className='text-muted-foreground'>{message}</p>
        </header>

        <InviteReminder count={invites.length} onClick={() => inviteDialog.openWithData()} />

        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
          {spaceList.map((space, index) => (
            <div
              key={space.id}
              className='animate-in fade-in zoom-in-95 duration-300'
              style={{ animationDelay: `${Math.floor(index / 5) * 50}ms` }}
            >
              <SpaceCard
                space={space}
                onOpenMemberDialog={space => memberDialog.openWithData(space)}
                navigateTo={navigate}
              />
            </div>
          ))}
        </div>
      </main>

      <SpaceMemberDialog
        open={memberDialog.open}
        onClose={memberDialog.close}
        space={memberDialog.data}
      />

      <InviteListDialog open={inviteDialog.open} onClose={inviteDialog.close} />
    </div>
  )
}
