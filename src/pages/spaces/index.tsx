import { motion } from 'motion/react'
import { useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import type { Space } from '@/types/space'
import { SpaceCard } from './components/SpaceCard'
import { SpaceFormModal } from './components/SpaceFormModal'
import { useAuthStore } from '@/stores/useAuthStore'
import { Plus } from 'lucide-react'

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

export default function Spaces() {
  const { data: spaces, isLoading } = useMockSpaces()
  const user = useAuthStore(state => state.user)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='min-h-screen'>
      <main className='max-w-6xl mx-auto px-6 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>
              👋 你好，{user?.name || '朋友'}
            </h1>
            <p className='text-gray-500'>今天也要温柔地记录生活哦 ✨</p>
          </div>

          {spaces && spaces.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {spaces.map((space, index) => (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SpaceCard space={space} />
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: spaces.length * 0.05 }}
              >
                <button
                  type='button'
                  onClick={() => setIsCreateModalOpen(true)}
                  className='group w-full bg-white rounded-2xl shadow-sm border border-gray-200 border-dashed overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:border-solid'
                >
                  <div className='p-6 flex flex-col items-center justify-center text-center min-h-[160px]'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors'>
                      <Plus className='w-8 h-8 text-gray-400 group-hover:text-gray-600 transition-colors' />
                    </div>
                    <h3 className='font-semibold text-gray-600 group-hover:text-gray-800 transition-colors'>
                      新建空间
                    </h3>
                  </div>
                </button>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-16'
            >
              <button
                type='button'
                onClick={() => setIsCreateModalOpen(true)}
                className='group w-full max-w-sm mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 border-dashed overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:border-solid'
              >
                <div className='p-8 flex flex-col items-center justify-center text-center min-h-[200px]'>
                  <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors'>
                    <Plus className='w-10 h-10 text-gray-400 group-hover:text-gray-600 transition-colors' />
                  </div>
                  <h3 className='font-semibold text-gray-600 group-hover:text-gray-800 transition-colors mb-2'>
                    创建第一个空间
                  </h3>
                  <p className='text-gray-500 text-sm'>开始记录你的美好生活</p>
                </div>
              </button>
            </motion.div>
          )}
        </motion.div>

        <SpaceFormModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </main>
    </div>
  )
}
