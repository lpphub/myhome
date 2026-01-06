import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion, useScroll, useSpring } from 'motion/react'
import { Search, Settings, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { LoadingState } from '@/components/LoadingState'
import type { Space, Group, Tag, TagForm } from '@/types/space'
import { SpaceSidebar } from './components/SpaceSidebar'
import { MasonrySection } from './components/MasonrySection'

const useMockSpaceData = (spaceId: string) => {
  const mockSpace: Space = {
    id: spaceId,
    name: '主卧',
    icon: '🛏️',
    color: 'honey',
    description: '卧室收纳整理',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z',
  }

  const mockGroups: Group[] = [
    {
      id: 'default',
      spaceId,
      name: '未分类',
      order: 0,
      createdAt: '2024-12-01T00:00:00Z',
    },
    {
      id: '1',
      spaceId,
      name: '待办',
      order: 1,
      createdAt: '2024-12-05T00:00:00Z',
    },
    {
      id: '2',
      spaceId,
      name: '购物清单',
      order: 2,
      createdAt: '2024-12-10T00:00:00Z',
    },
    {
      id: '3',
      spaceId,
      name: '灵感',
      order: 3,
      createdAt: '2024-12-15T00:00:00Z',
    },
  ]

  const mockTags: Tag[] = [
    {
      id: '1',
      spaceId,
      groupId: 'default',
      title: '整理衣柜',
      content: '把冬天的衣服收起来，放到最上层',
      color: 'yellow',
      order: 0,
      createdAt: '2024-12-20T00:00:00Z',
      updatedAt: '2024-12-20T00:00:00Z',
    },
    {
      id: '2',
      spaceId,
      groupId: 'default',
      title: '购买床头灯',
      content: '需要一个柔和的灯光，暖黄色调',
      color: 'sky',
      order: 1,
      createdAt: '2024-12-19T00:00:00Z',
      updatedAt: '2024-12-19T00:00:00Z',
    },
    {
      id: '3',
      spaceId,
      groupId: '1',
      title: '周一开会',
      content: '10点，项目讨论，准备好PPT',
      color: 'rose',
      order: 0,
      createdAt: '2024-12-18T00:00:00Z',
      updatedAt: '2024-12-18T00:00:00Z',
    },
    {
      id: '4',
      spaceId,
      groupId: '1',
      title: '周五前提交报告',
      content: '季度总结报告，包含所有数据',
      color: 'violet',
      order: 1,
      createdAt: '2024-12-17T00:00:00Z',
      updatedAt: '2024-12-17T00:00:00Z',
    },
    {
      id: '5',
      spaceId,
      groupId: '2',
      title: '牛奶',
      content: '1L 牛奶，买有机的那种',
      color: 'mint',
      order: 0,
      createdAt: '2024-12-16T00:00:00Z',
      updatedAt: '2024-12-16T00:00:00Z',
    },
    {
      id: '6',
      spaceId,
      groupId: '2',
      title: '面包',
      content: '全麦面包，配牛奶',
      color: 'orange',
      order: 1,
      createdAt: '2024-12-15T00:00:00Z',
      updatedAt: '2024-12-15T00:00:00Z',
    },
    {
      id: '7',
      spaceId,
      groupId: '2',
      title: '鸡蛋',
      content: '一盒鸡蛋，6个装',
      color: 'yellow',
      order: 2,
      createdAt: '2024-12-14T00:00:00Z',
      updatedAt: '2024-12-14T00:00:00Z',
    },
    {
      id: '8',
      spaceId,
      groupId: '3',
      title: '换个新窗帘',
      content: '想要浅蓝色的，遮光效果好一点的',
      color: 'sky',
      order: 0,
      createdAt: '2024-12-13T00:00:00Z',
      updatedAt: '2024-12-13T00:00:00Z',
    },
    {
      id: '9',
      spaceId,
      groupId: '3',
      title: '买盆绿植',
      content: '适合卧室的植物，绿萝或者龟背竹',
      color: 'mint',
      order: 1,
      createdAt: '2024-12-12T00:00:00Z',
      updatedAt: '2024-12-12T00:00:00Z',
    },
    {
      id: '10',
      spaceId,
      groupId: '3',
      title: '装饰画',
      content: '卧室墙上需要一幅画',
      color: 'violet',
      order: 2,
      createdAt: '2024-12-11T00:00:00Z',
      updatedAt: '2024-12-11T00:00:00Z',
    },
    {
      id: '11',
      spaceId,
      groupId: '1',
      title: '预约牙医',
      content: '下周二下午3点',
      color: 'rose',
      order: 2,
      createdAt: '2024-12-10T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
    },
    {
      id: '12',
      spaceId,
      groupId: 'default',
      title: '更换床单',
      content: '用那套浅灰色的新床单',
      color: 'gray',
      order: 2,
      createdAt: '2024-12-09T00:00:00Z',
      updatedAt: '2024-12-09T00:00:00Z',
    },
  ]

  return {
    space: mockSpace,
    groups: mockGroups,
    tags: mockTags,
    isLoading: false,
  }
}

export default function SpaceDetail() {
  const { spaceId } = useParams()
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)

  const { space, groups, tags, isLoading } = useMockSpaceData(spaceId || '')

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const filteredGroups = groups.filter(group => {
    if (!searchTerm.trim()) return true
    const groupTags = tags.filter(tag => tag.groupId === group.id)
    return groupTags.some(
      tag =>
        tag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.content?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const getTagsByGroup = (groupId: string) => {
    return tags.filter(tag => tag.groupId === groupId)
  }

  const handleAddTag = (groupId: string, data: TagForm) => {
    console.log('Add tag:', groupId, data)
  }

  const handleGroupClick = (groupId: string) => {
    const element = document.getElementById(`group-${groupId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setActiveGroupId(groupId)
  }

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  if (!space) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-warmGray-700 mb-2'>空间不存在</h2>
          <button
            type='button'
            onClick={() => navigate('/spaces')}
            className='px-4 py-2 border border-warmGray-300 rounded-lg text-warmGray-700 hover:bg-warmGray-50'
          >
            返回空间列表
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <motion.div
        className='fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-coral-400 to-coral-600 z-50'
        style={{ scaleX }}
      />

      <main className='flex flex-col h-screen'>
        <header className='flex-shrink-0 px-4 py-3 bg-white border-b border-warmGray-200'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={() => navigate('/spaces')}
                className='p-2 rounded-lg hover:bg-warmGray-100 text-warmGray-500 hover:text-warmGray-700 transition-colors'
              >
                <Home className='w-5 h-5' />
              </button>
              <div className='flex items-center gap-2'>
                <span className='text-2xl'>{space.icon}</span>
                <h1 className='text-xl font-semibold text-warmGray-800'>{space.name}</h1>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='relative w-64'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmGray-400' />
                <Input
                  className='pl-9 h-9 bg-warmGray-50 border-0 focus:bg-white'
                  placeholder='搜索便签...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type='button'
                className='p-2 rounded-lg hover:bg-warmGray-100 text-warmGray-500 hover:text-warmGray-700 transition-colors'
              >
                <Settings className='w-5 h-5' />
              </button>
              <button
                type='button'
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className='p-2 rounded-lg hover:bg-warmGray-100 text-warmGray-500 hover:text-warmGray-700 transition-colors'
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className='w-5 h-5' />
                ) : (
                  <ChevronLeft className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>
        </header>

        <div className='flex-1 flex overflow-hidden'>
          <SpaceSidebar
            groups={filteredGroups}
            tags={tags}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            activeGroupId={activeGroupId}
            onGroupClick={handleGroupClick}
          />

          <div className='flex-1 overflow-y-auto'>
            <div className='max-w-7xl mx-auto px-6 py-8'>
              {filteredGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  id={`group-${group.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <MasonrySection
                    group={group}
                    tags={getTagsByGroup(group.id)}
                    onAddTag={data => handleAddTag(group.id, data)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
