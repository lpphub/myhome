import parse from 'html-react-parser'
import { Clock, Edit2, MoreVertical, Trash2 } from 'lucide-react'
import { memo, useState } from 'react'
import { parseEditorContent } from '@/components/editor/utils'
import { Button } from '@/components/ui/button'
import { Popover } from '@/components/ui/popover'
import type { Note } from '@/types/notes'
import { formatRelativeTime } from '@/utils/date'
import { NoteEditor } from './NoteEditor'

interface NoteCardProps {
  note: Note
  isEditing: boolean
  onEdit: () => void
  onUpdate: (content: string) => void
  onCancel: () => void
  onDelete: () => void
}

export const NoteCard = memo(function NoteCard({
  note,
  isEditing,
  onEdit,
  onUpdate,
  onCancel,
  onDelete,
}: NoteCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { html } = parseEditorContent(note.content)

  const handleEdit = () => {
    setIsMenuOpen(false)
    onEdit()
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    onDelete()
  }

  if (isEditing) {
    return (
      <NoteEditor
        id={note.id}
        initialContent={html}
        onSave={data => {
          onUpdate(data.content)
          onCancel()
        }}
        onCancel={onCancel}
      />
    )
  }

  return (
    <div className='bg-white rounded-sm border group max-h-200 flex flex-col'>
      <div className='flex justify-between px-3 py-2 shrink-0'>
        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
          <Clock className='w-3 h-3' />
          {formatRelativeTime(note.createdAt)}
        </div>

        <div>
          <Popover
            open={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            align='end'
            trigger={
              <Button size='icon' variant='ghost' className='h-6 w-6'>
                <MoreVertical className='w-3.5 h-3.5' />
              </Button>
            }
            content={
              <div className='bg-white border rounded-md shadow-md'>
                <button
                  type='button'
                  onClick={handleEdit}
                  className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-coral-50 text-left'
                >
                  <Edit2 className='w-3 h-3' />
                  编辑
                </button>
                <button
                  type='button'
                  onClick={handleDelete}
                  className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-coral-50 text-red-500 text-left'
                >
                  <Trash2 className='w-3 h-3' />
                  删除
                </button>
              </div>
            }
          />
        </div>
      </div>

      <div className='tiptap tiptap-compact flex-1 px-4 py-2 overflow-y-auto'>{parse(html)}</div>
    </div>
  )
})
