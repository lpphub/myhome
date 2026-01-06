import { Plus } from 'lucide-react'
import { useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Space } from '@/types/space'
import { SpaceCard } from './components/SpaceCard'
import { SpaceFormModal } from './components/SpaceFormModal'

const useMockSpaces = () => {
  const mockSpaces: Space[] = [
    {
      id: '1',
      name: '工作空间',
      icon: '🧑‍💻',
      color: 'honey',
      noteCount: 12,
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2025-01-05T00:00:00Z',
    },
    {
      id: '2',
      name: '生活空间',
      icon: '🌸',
      color: 'lavender',
      noteCount: 8,
      createdAt: '2024-12-05T00:00:00Z',
      updatedAt: '2025-01-06T00:00:00Z',
    },
    {
      id: '3',
      name: '情绪角落',
      icon: '🌙',
      color: 'coral',
      noteCount: 5,
      createdAt: '2024-12-10T00:00:00Z',
      updatedAt: '2025-01-04T00:00:00Z',
    },
  ]

  return { data: mockSpaces, isLoading: false }
}

function SpacesTitle({ userName }: { userName?: string }) {
  return (
    <div className='mb-8'>
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>👋 你好，{userName || '朋友'}</h1>
      <p className='text-gray-500'>今天也要温柔地记录生活哦 ✨</p>
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
        className='group w-full max-w-sm mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 border-dashed
                   overflow-hidden transition-all cursor-pointer
                   hover:shadow-lg hover:border-gray-300 hover:border-solid
                   animate-in fade-in zoom-in-95 duration-300'
      >
        <div className='p-8 flex flex-col items-center justify-center text-center min-h-50'>
          <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-gray-200'>
            <Plus className='w-10 h-10 text-gray-400 transition-colors group-hover:text-gray-600' />
          </div>
          <h3 className='font-semibold text-gray-600 transition-colors group-hover:text-gray-800 mb-2'>
            创建第一个空间
          </h3>
          <p className='text-gray-500 text-sm'>开始记录你的美好生活</p>
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
        className='group w-full bg-white rounded-2xl shadow-sm border border-gray-200 border-dashed
                   overflow-hidden transition-all duration-300 cursor-pointer
                   hover:shadow-lg hover:border-gray-300 hover:border-solid
                   animate-in fade-in zoom-in-95'
        style={{ animationDelay: `${spaces.length * 50}ms` }}
      >
        <div className='p-6 flex flex-col items-center justify-center text-center min-h-40'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-gray-200'>
            <Plus className='w-8 h-8 text-gray-400 transition-colors group-hover:text-gray-600' />
          </div>
          <h3 className='font-semibold text-gray-600 transition-colors group-hover:text-gray-800'>
            新建空间
          </h3>
        </div>
      </button>
    </div>
  )
}

export default function Spaces() {
  const { data: spaces, isLoading } = useMockSpaces()
  const user = useAuthStore(state => state.user)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <main className='max-w-6xl mx-auto px-6 py-8'>
        <SpacesTitle userName={user?.name} />
        <SpaceList spaces={spaces} onCreate={() => setIsCreateModalOpen(true)} />
      </main>

      <SpaceFormModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
