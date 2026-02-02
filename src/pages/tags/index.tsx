import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { parseEditorContent } from '@/components/editor/utils'
import { LoadingState } from '@/components/LoadingState'
import { useDialogState } from '@/hooks'
import { SpaceProvider } from '@/pages/spaces/contexts/SpaceContext'
import { useSpaceId } from '@/pages/spaces/hooks/useSpaceLocal'
import type { TagFormData } from '@/types/tags'
import { TagFormDialog } from './components/TagFormDialog'
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
  const tagDialog = useDialogState<TagFormData>()

  const filteredTags = useMemo(() => {
    if (!searchKeyword.trim()) return tags
    const keyword = searchKeyword.toLowerCase()

    return tags
      .map(group => ({
        ...group,
        tags: group.tags.filter(tag => {
          const { text } = parseEditorContent(tag.content)
          return text.toLowerCase().includes(keyword)
        }),
      }))
      .filter(group => group.tags.length > 0)
  }, [tags, searchKeyword])

  const handleSubmitTag = useCallback(
    (data: TagFormData) => {
      submitTag(data)
      tagDialog.close()
    },
    [submitTag, tagDialog]
  )

  const handleOpenDialog = useCallback(
    (tag?: TagFormData) => {
      if (tag) {
        tagDialog.openWithData(tag)
      } else {
        tagDialog.openWithData({ groupId: 0 })
      }
    },
    [tagDialog]
  )

  if (isLoading) return <LoadingState type='loading' />
  if (error) return <LoadingState type='error' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <TagToolbar onAddGroup={handleAddGroup} onSearch={setSearchKeyword} />

      <TagWall
        tags={filteredTags}
        tagActions={{
          onAdd: groupId => handleOpenDialog({ groupId }),
          onEdit: handleOpenDialog,
          onDelete: handleDeleteTag,
        }}
        onDragReorder={handleDragReorder}
        onDeleteGroup={handleDeleteGroup}
      />

      <TagFormDialog
        open={tagDialog.open}
        onClose={tagDialog.close}
        initialData={tagDialog.data}
        onSubmit={handleSubmitTag}
      />
    </div>
  )
}
