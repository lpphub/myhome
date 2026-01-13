import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { LoadingState } from '@/components/LoadingState'
import { SpaceProvider } from '@/pages/spaces/contexts/SpaceContext'
import { useCurrentSpaceId } from '@/pages/spaces/hooks/useCurrentSpace'
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

/* =======================================================
 * 外层：只做 spaceId 判断（无业务 hooks）
 * ======================================================= */
export default function TagsPage() {
  const navigate = useNavigate()
  const { spaceId, isLoading } = useCurrentSpaceId()

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  if (!spaceId) {
    return (
      <LoadingState
        type='error'
        message='请选择一个空间作为默认便签墙'
        action={{ label: '去选择', onClick: () => navigate('/') }}
      />
    )
  }

  return (
    <SpaceProvider spaceId={spaceId}>
      <TagsPageInner />
    </SpaceProvider>
  )
}

/* =======================================================
 * 内层：完整页面逻辑（所有 hooks 都在这里）
 * ======================================================= */
function TagsPageInner() {
  const { tags, isLoading } = useTags()

  // command hooks
  const submitTag = useTagActions()
  const handleDeleteTag = useDeleteTagAction()
  const handleDragReorder = useReorderTagsAction()
  const { handleAddGroup, handleDeleteGroup } = useGroupActions()

  /* ---------------- ui ---------------- */
  const [searchKeyword, setSearchKeyword] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTag, setEditingTag] = useState<TagFormData | undefined>()

  /* ---------------- derived ---------------- */
  const filteredTags = useMemo(() => {
    if (!searchKeyword.trim()) return tags
    const keyword = searchKeyword.toLowerCase()

    return tags
      .map(group => ({
        ...group,
        tags: group.tags.filter(
          tag =>
            tag.name.toLowerCase().includes(keyword) ||
            tag.description?.toLowerCase().includes(keyword)
        ),
      }))
      .filter(group => group.tags.length > 0)
  }, [tags, searchKeyword])

  const handleSubmitTag = useCallback(
    (data: TagFormData) => {
      submitTag(data)
      setOpenDialog(false)
    },
    [submitTag]
  )

  const handleOpenDialog = useCallback((tag?: TagFormData) => {
    setEditingTag(tag)
    setOpenDialog(true)
  }, [])

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      {/* 操作栏 */}
      <TagToolbar onAddGroup={handleAddGroup} onSearch={setSearchKeyword} />

      {/* 标签墙 */}
      <TagWall
        tags={filteredTags}
        tagActions={{
          onAdd: group => handleOpenDialog({ group }),
          onEdit: handleOpenDialog,
          onDelete: handleDeleteTag,
        }}
        onDragReorder={handleDragReorder}
        onDeleteGroup={handleDeleteGroup}
      />

      {/* Dialog */}
      <TagFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        initialData={editingTag}
        onSubmit={handleSubmitTag}
      />
    </div>
  )
}
