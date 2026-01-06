import { FolderOpen, Plus, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Space } from '@/types/space'
import { CreateSpaceModal } from './components/CreateSpaceModal'
import { SpaceCard } from './components/SpaceCard'

const useMockSpaces = () => {
  const mockSpaces: Space[] = [
    {
      id: '1',
      name: '主卧',
      icon: '🛏️',
      color: 'honey',
      description: '卧室收纳整理',
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-20T00:00:00Z',
    },
    {
      id: '2',
      name: '书房',
      icon: '📚',
      color: 'lavender',
      description: '书籍和办公用品',
      createdAt: '2024-12-05T00:00:00Z',
      updatedAt: '2024-12-19T00:00:00Z',
    },
    {
      id: '3',
      name: '厨房',
      icon: '🍳',
      color: 'coral',
      description: '厨具和食材管理',
      createdAt: '2024-12-10T00:00:00Z',
      updatedAt: '2024-12-21T00:00:00Z',
    },
    {
      id: '4',
      name: '客厅',
      icon: '🛋️',
      color: 'lemon',
      description: '客厅物品整理',
      createdAt: '2024-12-15T00:00:00Z',
      updatedAt: '2024-12-18T00:00:00Z',
    },
  ]

  return { data: mockSpaces, isLoading: false }
}

export default function Spaces() {
  const { data: spaces, isLoading } = useMockSpaces()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'recent'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredSpaces = spaces?.filter(space =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const recentSpaces = [...(spaces || [])]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)

  const displaySpaces = activeTab === 'recent' ? recentSpaces : filteredSpaces

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
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold text-warmGray-800 mb-2'>我的空间</h1>
              <p className='text-warmGray-500'>选择或创建一个空间来管理你的便签</p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className='bg-linear-to-r from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700 shadow-coral-md'
            >
              <Plus className='w-4 h-4 mr-2' />
              新建空间
            </Button>
          </div>

          <div className='flex items-center gap-4 mb-6'>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmGray-400' />
              <Input
                className='pl-10 bg-white border-warmGray-200 focus:border-coral-300 focus:ring-coral-200'
                placeholder='搜索空间...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='flex gap-1 bg-warmGray-100 p-1 rounded-lg'>
              <button
                type='button'
                onClick={() => setActiveTab('all')}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  activeTab === 'all'
                    ? 'bg-white text-warmGray-800 shadow-sm'
                    : 'text-warmGray-600 hover:text-warmGray-800'
                )}
              >
                全部
              </button>
              <button
                type='button'
                onClick={() => setActiveTab('recent')}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  activeTab === 'recent'
                    ? 'bg-white text-warmGray-800 shadow-sm'
                    : 'text-warmGray-600 hover:text-warmGray-800'
                )}
              >
                最近
              </button>
            </div>
          </div>

          {displaySpaces && displaySpaces.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {displaySpaces.map((space, index) => (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SpaceCard space={space} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-16'
            >
              <div className='w-20 h-20 bg-warmGray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FolderOpen className='w-10 h-10 text-warmGray-400' />
              </div>
              <h3 className='text-lg font-medium text-warmGray-700 mb-2'>
                {searchTerm ? '没有找到相关空间' : '还没有空间'}
              </h3>
              <p className='text-warmGray-500 mb-6'>
                {searchTerm ? '试试其他关键词' : '创建一个新空间开始管理你的便签吧'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className='bg-linear-to-r from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  创建第一个空间
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>

        <CreateSpaceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </main>
    </div>
  )
}
