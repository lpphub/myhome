import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoadingState } from '@/components/LoadingState'
import { getSpaces } from '@/api/spaces'
import type { Space } from '@/types/spaces'
import { SpaceCard } from './components/SpaceCard'
import { SpaceFormModal } from './components/SpaceFormModal'

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

function SpacesTitle() {
  const { greeting, message } = getGreeting()

  return (
    <div className='mb-8'>
      <h1 className='text-3xl font-bold text-foreground mb-2'>👋 {greeting}</h1>
      <p className='text-foreground-secondary'>{message}</p>
    </div>
  )
}

interface SpaceListProps {
  spaces: Space[]
  onCreate: () => void
}

function SpaceList({ spaces, onCreate }: SpaceListProps) {
  if (spaces.length === 0) {
    return (
      <button
        type='button'
        onClick={onCreate}
        className='group w-full max-w-sm mx-auto bg-white rounded-lg shadow-sm border border-border border-dashed
                   overflow-hidden transition-all cursor-pointer
                   hover:shadow-lg hover:border-border hover:border-solid
                   animate-in fade-in zoom-in-95 duration-300'
      >
        <div className='p-8 flex flex-col items-center justify-center text-center min-h-50'>
          <div className='w-20 h-20 bg-muted-background rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-border'>
            <Plus className='w-10 h-10 text-foreground transition-colors group-hover:text-foreground' />
          </div>
          <h3 className='font-semibold text-foreground transition-colors group-hover:text-foreground mb-2'>
            创建第一个空间
          </h3>
          <p className='text-foreground text-sm'>开始记录你的美好生活</p>
        </div>
      </button>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
      {spaces.map((space, index) => (
        <div
          key={space.id}
          className='animate-in fade-in zoom-in-95 duration-300'
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <SpaceCard space={space} />
        </div>
      ))}
      <button
        type='button'
        onClick={onCreate}
        className='group w-full bg-white rounded-lg shadow-sm border border-border border-dashed
                   overflow-hidden transition-all duration-300 cursor-pointer
                   hover:shadow-lg hover:border-border hover:border-solid
                   animate-in fade-in zoom-in-95'
        style={{ animationDelay: `${spaces.length * 50}ms` }}
      >
        <div className='p-6 flex flex-col items-center justify-center text-center min-h-40'>
          <div className='w-16 h-16 bg-muted-background rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-border'>
            <Plus className='w-8 h-8 text-foreground transition-colors group-hover:text-foreground' />
          </div>
          <h3 className='font-semibold text-foreground transition-colors group-hover:text-foreground'>
            新建空间
          </h3>
        </div>
      </button>
    </div>
  )
}

export default function Spaces() {
  const { data: spaces = [], isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: getSpaces,
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <main className='max-w-6xl mx-auto px-6 py-8'>
        <SpacesTitle />
        <SpaceList spaces={spaces} onCreate={() => setIsCreateModalOpen(true)} />
      </main>

      <SpaceFormModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
