import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { LoadingState } from '@/components/LoadingState'
import { SpaceProvider } from '@/pages/spaces/contexts/SpaceContext'
import { useSpaceId } from '@/pages/spaces/hooks/useSpaceLocal'
import type { Tag, TagFormData } from '@/types/tags'
import { TagDetailDrawer } from './components/TagDetailDrawer'
import { TagToolbar } from './components/TagToolbar'
import { TagWall } from './components/TagWall'
import {
  useDeleteTagAction,
  useGroupActions,
  useReorderTagsAction,
  useTagActions,
  useTags,
} from './hooks/useTags'

export default function TagsPage() {
  const navigate = useNavigate()
  const { getSpaceId } = useSpaceId()
  const spaceId = getSpaceId()

  if (!spaceId) {
    return (
      <LoadingState
        type='error'
        message='请选择空间'
        action={{ label: '返回首页', onClick: () => navigate('/') }}
      />
    )
  }

  return (
    <SpaceProvider spaceId={Number(spaceId)}>
      <TagsPageInner />
    </SpaceProvider>
  )
}

function TagsPageInner() {
  const { tags, isLoading, error } = useTags()

  const submitTag = useTagActions()
  const handleDeleteTag = useDeleteTagAction()
  const handleDragReorder = useReorderTagsAction()
  const { handleAddGroup, handleDeleteGroup } = useGroupActions()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const filteredTags = useMemo(() => {
    if (!searchKeyword.trim()) return tags
    const keyword = searchKeyword.toLowerCase()

    return tags
      .map(group => ({
        ...group,
        tags: group.tags.filter(tag => {
          const nameMatch = tag.name.toLowerCase().includes(keyword)
          const descMatch = tag.description?.toLowerCase().includes(keyword) ?? false
          return nameMatch || descMatch
        }),
      }))
      .filter(group => group.tags.length > 0)
  }, [tags, searchKeyword])

  const handleAddTag = useCallback(
    (groupId: number, data: { name: string; color: string }) => {
      submitTag({
        name: data.name,
        color: data.color,
        groupId,
      })
    },
    [submitTag]
  )

  const handleClickTag = useCallback((tag: Tag) => {
    setSelectedTag(tag)
    setIsDrawerOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    setSelectedTag(null)
  }, [])

  const handleUpdateTag = useCallback(
    (data: TagFormData) => {
      submitTag(data)
    },
    [submitTag]
  )

  if (isLoading) return <LoadingState type='loading' />
  if (error) return <LoadingState type='error' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <TagToolbar onAddGroup={handleAddGroup} onSearch={setSearchKeyword} />

      <TagWall
        tags={filteredTags}
        onAddTag={handleAddTag}
        onClickTag={handleClickTag}
        onDragReorder={handleDragReorder}
        onDeleteGroup={handleDeleteGroup}
      />

      <TagDetailDrawer
        open={isDrawerOpen}
        tag={selectedTag}
        onClose={handleCloseDrawer}
        onUpdate={handleUpdateTag}
        onDelete={handleDeleteTag}
      />
    </div>
  )
}