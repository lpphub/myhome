import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  AlertTriangle,
  BookOpen,
  Coffee,
  Edit,
  Hash,
  Heart,
  Home,
  Lightbulb,
  Merge,
  Moon,
  Package,
  Pin,
  Plus,
  Search,
  Sparkles,
  Star,
  StickyNote as StickyNoteIcon,
  Sun,
  Tag,
  Trash2,
  Users,
} from 'lucide-react'

import { useState } from 'react'
import { toast } from 'sonner'
import { getTagsData } from '@/api/tags'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TagCategory, TagColor, TagInfo, TagStats, TagsData } from '@/types/tags'

// Get sticky note gradient based on color
const getNoteGradient = (color: TagColor) => {
  const gradients = {
    honey: 'from-honey-100 to-honey-200 border-honey-300',
    coral: 'from-coral-100 to-coral-200 border-coral-300',
    lavender: 'from-lavender-100 to-lavender-200 border-lavender-300',
    lemon: 'from-lemon-100 to-lemon-200 border-lemon-300',
    cream: 'from-cream-100 to-cream-200 border-cream-300',
  }
  return gradients[color]
}

// Get category emoji
const getCategoryEmoji = (category: TagCategory) => {
  const emojis: Record<TagCategory, string> = {
    房间: '🏠',
    功能: '⚙️',
    类型: '📋',
    人群: '👥',
    安全: '⚠️',
    频率: '🔄',
    存储: '📦',
  }
  return emojis[category]
}

// Get category icon
const getCategoryIcon = (category: TagCategory) => {
  switch (category) {
    case '房间':
      return Home
    case '功能':
      return Package
    case '类型':
      return Tag
    case '人群':
      return Users
    case '安全':
      return AlertTriangle
    case '频率':
      return Hash
    case '存储':
      return Package
    default:
      return Tag
  }
}

// TagsStats 组件
const TagsStats = ({ data }: { data: TagStats }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      <Card
        variant='warm'
        className='relative py-3 hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-1'
      >
        <div className='flex items-center justify-between py-1.5 px-3'>
          <div>
            <p className='text-sm font-medium text-warmGray-600 mb-1'>便签总数</p>
            <p className='text-2xl font-hand font-bold text-honey-700'>{data.totalTags}</p>
            <p className='text-xs text-warmGray-500 mt-1'>张便签</p>
          </div>
          <div className='p-2 bg-linear-to-br from-honey-200 to-honey-300 rounded-lg shadow-soft'>
            <StickyNoteIcon className='w-6 h-6 text-honey-700' />
          </div>
        </div>
        <div className='absolute top-2 right-2'>
          <Star className='w-4 h-4 text-honey-500 animate-pulse' />
        </div>
      </Card>

      <Card
        variant='warm'
        className='relative py-3 hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-1'
      >
        <div className='flex items-center justify-between py-1.5 px-3'>
          <div>
            <p className='text-sm font-medium text-warmGray-600 mb-1'>标记物品</p>
            <p className='text-2xl font-hand font-bold text-coral-700'>{data.totalItems}</p>
            <p className='text-xs text-warmGray-500 mt-1'>件物品</p>
          </div>
          <div className='p-2 bg-linear-to-br from-coral-200 to-coral-300 rounded-lg shadow-soft'>
            <Tag className='w-6 h-6 text-coral-700' />
          </div>
        </div>
        <div className='absolute top-2 right-2'>
          <Heart className='w-4 h-4 text-coral-500 animate-pulse' />
        </div>
      </Card>

      <Card
        variant='warm'
        className='relative py-3 hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-1'
      >
        <div className='flex items-center justify-between py-1.5 px-3'>
          <div>
            <p className='text-sm font-medium text-warmGray-600 mb-1'>安全提醒</p>
            <p className='text-2xl font-hand font-bold text-lemon-700'>{data.securityTags}</p>
            <p className='text-xs text-warmGray-500 mt-1'>张便签</p>
          </div>
          <div className='p-2 bg-linear-to-br from-lemon-200 to-lemon-300 rounded-lg shadow-soft'>
            <AlertTriangle className='w-6 h-6 text-lemon-700' />
          </div>
        </div>
        <div className='absolute top-2 right-2'>
          <Sparkles className='w-4 h-4 text-lemon-500 animate-pulse' />
        </div>
      </Card>

      <Card
        variant='warm'
        className='relative py-3 hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-1'
      >
        <div className='flex items-center justify-between py-1.5 px-3'>
          <div>
            <p className='text-sm font-medium text-warmGray-600 mb-1'>待使用</p>
            <p className='text-2xl font-hand font-bold text-lavender-700'>{data.unusedTags}</p>
            <p className='text-xs text-warmGray-500 mt-1'>张便签</p>
          </div>
          <div className='p-2 bg-linear-to-br from-lavender-200 to-lavender-300 rounded-lg shadow-soft'>
            <BookOpen className='w-6 h-6 text-lavender-700' />
          </div>
        </div>
        <div className='absolute top-2 right-2'>
          <Coffee className='w-4 h-4 text-lavender-500 animate-pulse' />
        </div>
      </Card>
    </div>
  )
}

// TagsHeader 组件
const TagsHeader = () => {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: '早上好', icon: Sun, color: 'text-honey-500' }
    if (hour < 18) return { text: '下午好', icon: Sun, color: 'text-coral-500' }
    return { text: '晚上好', icon: Moon, color: 'text-lavender-500' }
  }

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  return (
    <div className='relative overflow-hidden'>
      {/* 背景装饰 */}
      <div className='absolute inset-0 bg-linear-to-r from-honey-100/50 via-cream-200/30 to-lavender-100/50'></div>
      <div className='absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-coral-200/20 to-transparent rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-lavender-200/20 to-transparent rounded-full blur-2xl'></div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='w-16 h-16 bg-linear-to-br from-coral-400 to-coral-600 rounded-3xl flex items-center justify-center shadow-warm-lg animate-float'>
              <StickyNoteIcon className='w-8 h-8 text-white' />
            </div>
            <div>
              <div className='flex items-center space-x-3 mb-2'>
                <GreetingIcon className={`w-6 h-6 ${greeting.color}`} />
                <h1 className='text-3xl font-hand font-bold text-warmGray-800'>
                  {greeting.text}，便签墙
                </h1>
                <Heart className='w-6 h-6 text-coral-400 animate-pulse' />
              </div>
              <p className='text-warmGray-600 text-lg'>每一张便签都记录着生活的美好</p>
              <p className='text-warmGray-500 mt-1'>让我们的回忆在这里闪闪发光 ✨</p>
            </div>
          </div>
          <div className='hidden md:flex items-center space-x-4'>
            <Button variant='secondary'>
              <Merge className='w-4 h-4 mr-2' />
              整理便签
            </Button>
            <Button variant='default'>
              <Plus className='w-4 h-4 mr-2' />
              添加便签
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// StickyNote Component
const StickyNote = ({
  tag,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  tag: TagInfo
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) => {
  // Generate random rotation on mount
  const [rotation] = useState(() => Math.floor(Math.random() * 7) - 3)

  return (
    <button
      type='button'
      className={`
        group relative cursor-pointer overflow-hidden rounded-xl border
        bg-gradient-to-br ${getNoteGradient(tag.color)}
        transition-all duration-300 hover:scale-105 hover:rotate-0 hover:shadow-lg
        ${isSelected ? 'ring-2 ring-coral-400 ring-offset-2' : ''}
      `}
      style={{
        minHeight: '120px',
        transform: `rotate(${rotation}deg)`,
      }}
      onClick={onSelect}
    >
      {/* Pin decoration */}
      <div className='absolute -right-1 -top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-gray-400 shadow-md'>
        <Pin className='m-0.5 h-2 w-2 text-white' />
      </div>

      {/* Content */}
      <div className='flex h-full flex-col p-4'>
        {/* Header */}
        <div className='mb-2 flex items-start justify-between'>
          <div className='flex items-center space-x-2'>
            <span className='text-lg'>{getCategoryEmoji(tag.category)}</span>
            <div className='flex items-center space-x-1'>
              <div
                className='h-2 w-2 rounded-full'
                style={{
                  backgroundColor:
                    tag.color === 'honey'
                      ? '#e6a23c'
                      : tag.color === 'coral'
                        ? '#f05b3a'
                        : tag.color === 'lavender'
                          ? '#a78bfa'
                          : tag.color === 'lemon'
                            ? '#84cc16'
                            : '#d6d3d1',
                }}
              />
              {tag.securityFlag && <AlertTriangle className='h-3 w-3 text-red-500' />}
            </div>
          </div>

          {/* Quick actions */}
          <div className='flex space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
            <button
              type='button'
              className='rounded bg-white/50 p-1 hover:bg-white/80 transition-colors'
              onClick={e => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Edit className='h-3 w-3 text-gray-600' />
            </button>
            <button
              type='button'
              className='rounded bg-white/50 p-1 hover:bg-white/80 transition-colors'
              onClick={e => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className='h-3 w-3 text-gray-600' />
            </button>
          </div>
        </div>

        {/* Tag name */}
        <h3 className='mb-2 text-sm font-bold text-gray-800 line-clamp-2'>#{tag.name}</h3>

        {/* Description */}
        {tag.description && (
          <p className='mb-2 text-xs text-gray-600 line-clamp-2'>{tag.description}</p>
        )}

        {/* Stats */}
        <div className='mt-auto'>
          <div className='flex items-center justify-between'>
            <Badge
              className={`text-xs ${tag.count > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
              variant='outline'
            >
              {tag.count} 个物品
            </Badge>
            {tag.aliases.length > 0 && (
              <span className='text-xs text-gray-500'>+{tag.aliases.length} 别名</span>
            )}
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className='absolute left-2 top-2'>
          <div className='flex h-4 w-4 items-center justify-center rounded-full bg-coral-500'>
            <span className='text-white text-xs'>✓</span>
          </div>
        </div>
      )}
    </button>
  )
}

// StickyNoteWall Component
const StickyNoteWall = ({
  title,
  icon: Icon,
  tags,
  selectedTags,
  onTagSelect,
  onTagEdit,
  onTagDelete,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  tags: TagInfo[]
  selectedTags: Set<string>
  onTagSelect: (tagId: string) => void
  onTagEdit: (tag: TagInfo) => void
  onTagDelete: (tag: TagInfo) => void
}) => {
  if (tags.length === 0) return null

  return (
    <Card variant='soft' className='border-cream-200 bg-white/70 backdrop-blur-sm'>
      <CardHeader>
        <div className='flex items-center space-x-3'>
          <div className='rounded-xl bg-gradient-to-br from-coral-100 to-coral-200 p-2'>
            <Icon className='h-5 w-5 text-coral-600' />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <p className='text-sm text-gray-600'>{tags.length} 张便签</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Sticky notes grid */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {tags.map(tag => (
            <StickyNote
              key={tag.id}
              tag={tag}
              isSelected={selectedTags.has(tag.id)}
              onSelect={() => onTagSelect(tag.id)}
              onEdit={() => onTagEdit(tag)}
              onDelete={() => onTagDelete(tag)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// TagsLoading Component
const TagsLoading = () => {
  return (
    <div className='min-h-screen bg-cream-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-12 h-12 border-4 border-honey-200 border-t-honey-500 rounded-full mx-auto mb-4 animate-spin' />
        <p className='text-ring text-lg'>正在布置我们的温馨便签墙...</p>
      </div>
    </div>
  )
}

// TagsError Component
const TagsError = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-cream-50 via-honey-50 to-lavender-50'>
      <p className='text-gray-600'>数据加载失败</p>
    </div>
  )
}

// Main Tags Component
export default function Tags() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TagCategory | ''>('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  // Fetch tags data
  const {
    data: tagsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tags'],
    queryFn: getTagsData,
  })

  // 数据验证函数
  const isValidTagsData = (data: any): data is TagsData => {
    return (
      data &&
      Array.isArray(data.tags) &&
      Array.isArray(data.categories) &&
      data.stats &&
      typeof data.stats.totalTags === 'number' &&
      typeof data.stats.totalItems === 'number'
    )
  }

  // 调试数据加载
  useEffect(() => {
    if (tagsData) {
      console.log('Tags数据加载成功:', {
        tagsCount: tagsData.tags.length,
        categoriesCount: tagsData.categories.length,
        stats: tagsData.stats,
      })
    }
  }, [tagsData])

  // Error handling
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      toast.error(`数据加载失败: ${errorMessage}`)
      console.error('Tags数据获取失败:', error)
    }
  }, [error])

  if (isLoading) {
    return <TagsLoading />
  }

  if (!tagsData || !isValidTagsData(tagsData)) {
    console.error('Tags数据格式无效:', tagsData)
    return <TagsError />
  }

  // Filter tags
  const filteredTags = tagsData.tags.filter(tag => {
    const matchesSearch =
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || tag.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group tags by category
  const tagsByCategory = (tagsData.categories as { name: TagCategory }[]).reduce(
    (acc, category) => {
      acc[category.name] = filteredTags.filter(tag => tag.category === category.name)
      return acc
    },
    {} as Record<TagCategory, TagInfo[]>
  )

  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tagId)) {
        newSet.delete(tagId)
      } else {
        newSet.add(tagId)
      }
      return newSet
    })
  }

  // Handle tag edit
  const handleTagEdit = (tag: TagInfo) => {
    toast.info(`编辑标签: ${tag.name}`)
    console.log('Edit tag:', tag)
  }

  // Handle tag delete
  const handleTagDelete = (tag: TagInfo) => {
    if (window.confirm(`确定要删除标签 "${tag.name}" 吗？这将影响 ${tag.count} 个物品。`)) {
      toast.success(`已删除标签: ${tag.name}`)
      console.log('Delete tag:', tag)
    }
  }

  // Clear all selected tags
  const handleClearSelection = () => {
    setSelectedTags(new Set())
  }

  // Get selected tag names
  const selectedTagNames = tagsData.tags
    .filter(tag => selectedTags.has(tag.id))
    .map(tag => tag.name)

  return (
    <div className='min-h-screen bg-linear-to-br from-cream-50 via-cream-100 to-honey-50'>
      {/* 温馨的头部区域 */}
      <TagsHeader />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* 温馨统计卡片 */}
        <TagsStats data={tagsData.stats} />

        {/* Search and Filter */}
        <Card variant='soft' className='border-cream-200 bg-white/70 backdrop-blur-sm mb-8'>
          <div className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-6'>
            {/* Search */}
            <div className='flex-1 max-w-md'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='在便签墙上寻找...'
                  className='w-full rounded-2xl border border-cream-300 bg-white/80 py-3 pl-10 pr-4 focus:ring-2 focus:ring-coral-400 focus:border-transparent'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className='flex items-center space-x-3'>
              <select
                className='rounded-xl border border-cream-300 bg-white/80 px-4 py-2 focus:ring-2 focus:ring-coral-400 focus:border-transparent'
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as TagCategory | '')}
              >
                <option value=''>全部区域</option>
                {tagsData.categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          {/* Main Content - Sticky Wall */}
          <div className='lg:col-span-3 space-y-8'>
            {/* Selected Tags Display */}
            {selectedTagNames.length > 0 && (
              <Card variant='soft' className='border-cream-200 bg-white/70 backdrop-blur-sm'>
                <div className='mb-4 flex items-center space-x-3 px-6 pt-6'>
                  <Star className='h-5 w-5 text-coral-500' />
                  <h3 className='font-bold text-gray-800'>已选择的便签</h3>
                  <Badge className='bg-coral-100 text-coral-700' variant='outline'>
                    {selectedTagNames.length}
                  </Badge>
                </div>
                <div className='px-6 pb-6'>
                  <div className='flex flex-wrap gap-2'>
                    {selectedTagNames.map(tagName => {
                      const tag = tagsData.tags.find(t => t.name === tagName)
                      return tag ? (
                        <button
                          key={tag.id}
                          type='button'
                          onClick={() => handleTagSelect(tag.id)}
                          className='inline-flex items-center rounded-full bg-coral-100 px-3 py-2 text-sm text-coral-700 transition-colors hover:bg-coral-200'
                        >
                          #{tag.name}
                          <span className='ml-1 text-xs'>×</span>
                        </button>
                      ) : null
                    })}
                    <Button
                      variant='ghost'
                      size='sm'
                      type='button'
                      onClick={handleClearSelection}
                      className='text-gray-500 hover:text-gray-700'
                    >
                      清除全部
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Category View */}
            {selectedCategory ? (
              <StickyNoteWall
                title={`${selectedCategory} 便签区`}
                icon={getCategoryIcon(selectedCategory)}
                tags={tagsByCategory[selectedCategory] || []}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagEdit={handleTagEdit}
                onTagDelete={handleTagDelete}
              />
            ) : (
              /* All Categories */
              Object.entries(tagsByCategory).map(([category, categoryTags]) => (
                <StickyNoteWall
                  key={category}
                  title={`${category} 便签区`}
                  icon={getCategoryIcon(category as TagCategory)}
                  tags={categoryTags}
                  selectedTags={selectedTags}
                  onTagSelect={handleTagSelect}
                  onTagEdit={handleTagEdit}
                  onTagDelete={handleTagDelete}
                />
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Organization Tips */}
            <Card variant='soft' className='border-cream-200 bg-white/70 backdrop-blur-sm'>
              <div className='mb-4 flex items-center space-x-2 px-6 pt-6'>
                <Lightbulb className='h-5 w-5 text-honey-500' />
                <h3 className='font-medium text-gray-800'>整理小贴士</h3>
              </div>
              <div className='space-y-3 px-6 pb-6'>
                {[
                  {
                    type: 'organize',
                    description: '🏠 房间标签可以按楼层分类，让整理更有序',
                    icon: Home,
                    action: '重新组织',
                  },
                  {
                    type: 'merge',
                    description: '🔄 发现可以合并的相似标签，提高查找效率',
                    icon: Merge,
                    action: '合并标签',
                  },
                  {
                    type: 'color',
                    description: '🌈 为标签选择更温暖的颜色，让墙面更温馨',
                    icon: Heart,
                    action: '调整颜色',
                  },
                ].map((suggestion, index) => {
                  const IconComponent = suggestion.icon
                  return (
                    <div
                      key={`${suggestion.type}-${suggestion.action}`}
                      className='rounded-lg border border-honey-200 bg-gradient-to-r from-honey-50 to-cream-50 p-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-warm-sm'
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className='flex items-start space-x-3'>
                        <IconComponent className='mt-0.5 h-4 w-4 flex-shrink-0 text-honey-600' />
                        <div className='flex-1'>
                          <p className='mb-2 text-sm text-gray-700'>{suggestion.description}</p>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='p-0 h-auto text-coral-600 hover:text-coral-700'
                          >
                            {suggestion.action} →
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Activity Feed */}
            <Card variant='soft' className='border-cream-200 bg-white/70 backdrop-blur-sm'>
              <div className='mb-4 flex items-center space-x-2 px-6 pt-6'>
                <Sparkles className='h-5 w-5 text-lavender-500' />
                <h3 className='font-medium text-gray-800'>最近活动</h3>
              </div>
              <div className='space-y-3 px-6 pb-6'>
                {[
                  {
                    icon: Plus,
                    color: 'bg-emerald-100',
                    textColor: 'text-emerald-600',
                    title: '添加了新便签',
                    time: '今天',
                  },
                  {
                    icon: Edit,
                    color: 'bg-amber-100',
                    textColor: 'text-amber-600',
                    title: '整理了标签分类',
                    time: '昨天',
                  },
                  {
                    icon: Heart,
                    color: 'bg-coral-100',
                    textColor: 'text-coral-600',
                    title: '更换了便签颜色',
                    time: '2天前',
                  },
                ].map((activity, index) => {
                  const IconComponent = activity.icon
                  return (
                    <div
                      key={`${activity.title}-${activity.time}`}
                      className='flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-all duration-300 hover:bg-lavender-50 transform hover:-translate-y-1'
                      style={{
                        animationDelay: `${index * 100 + 300}ms`,
                      }}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${activity.color}`}
                      >
                        <IconComponent className={`h-4 w-4 ${activity.textColor}`} />
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm text-gray-700'>{activity.title}</p>
                        <p className='text-xs text-gray-500'>{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Inspirations */}
            <Card variant='soft' className='border-cream-200 bg-white/70 backdrop-blur-sm'>
              <div className='mb-4 flex items-center space-x-2 px-6 pt-6'>
                <BookOpen className='h-5 w-5 text-coral-500' />
                <h3 className='font-medium text-gray-800'>灵感收集</h3>
              </div>
              <div className='space-y-3 px-6 pb-6'>
                {[
                  {
                    text: '💡 用不同颜色区分重要程度',
                    color: 'from-coral-50 to-cream-50',
                    border: 'border-coral-200',
                  },
                  {
                    text: '🌈 定期更换便签保持新鲜感',
                    color: 'from-lavender-50 to-cream-50',
                    border: 'border-lavender-200',
                  },
                  {
                    text: '📝 为每个区域起个温馨的名字',
                    color: 'from-honey-50 to-cream-50',
                    border: 'border-honey-200',
                  },
                ].map((inspiration, index) => (
                  <div
                    key={inspiration.text.replace(/[^a-zA-Z0-9]/g, '-')}
                    className={`rounded-lg border ${inspiration.border} bg-gradient-to-r ${inspiration.color} p-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-warm-sm`}
                    style={{
                      animationDelay: `${index * 100 + 500}ms`,
                    }}
                  >
                    <p className='text-sm text-gray-700'>{inspiration.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
