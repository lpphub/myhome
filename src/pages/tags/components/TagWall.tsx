import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core'
import { Tag } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { ReorderParams, Tag as TagType, TagGroup } from '@/types/tags'
import { useTagDragDrop } from '../hooks/useTagDragDrop'
import { TagCard } from './TagCard'
import { TagSection } from './TagSection'

interface TagWallProps {
  tags: TagGroup[]
  onAddTag: (groupId: number, data: { name: string; color: string }) => void
  onClickTag: (tag: TagType) => void
  onDragReorder: (params: ReorderParams, next: TagGroup[]) => void
  onDeleteGroup?: (id: number) => void
}

export function TagWall({ tags, onAddTag, onClickTag, onDragReorder, onDeleteGroup }: TagWallProps) {
  const { dragState, sensors, handleDragStart, handleDragOver, handleDragEnd } = useTagDragDrop({
    tags,
    onDragHandle: onDragReorder,
  })

  if (tags.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <div className='w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4'>
          <Tag className='w-8 h-8 text-honey-600' />
        </div>
        <h3 className='text-lg font-semibold text-muted-foreground mb-2'>暂无数据</h3>
        <p className='text-sm text-muted-foreground'>请先点击右上角的「新建分组」按钮</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <DragOverlay>
        <AnimatePresence>
          {dragState.activeTag && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              exit={{ scale: 1 }}
              className='opacity-80'
            >
              <TagCard tag={dragState.activeTag} />
            </motion.div>
          )}
        </AnimatePresence>
      </DragOverlay>

      <div className='flex flex-col gap-4'>
        {tags.map(group => (
          <TagSection
            key={group.id}
            dragOverId={dragState.overId}
            tagGroup={group}
            onAddTag={onAddTag}
            onClickTag={onClickTag}
            onDeleteGroup={onDeleteGroup}
          />
        ))}
      </div>
    </DndContext>
  )
}