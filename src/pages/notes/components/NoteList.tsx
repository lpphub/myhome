// components/NoteList.tsx
import { FileEdit, Smile } from 'lucide-react'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import {
  useDeleteNoteMutation,
  useNotesScrollQuery,
  useUpdateNoteMutation,
} from '../hooks/useNotes'
import { NoteCard } from './NoteCard'

export function NoteList() {
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data, sentinelRef, isFetchingNextPage, isLoading } = useNotesScrollQuery()
  const notes = data?.pages.flatMap(page => page.list) ?? []

  const updateMutation = useUpdateNoteMutation()
  const deleteMutation = useDeleteNoteMutation()

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <Spinner />
      </div>
    )
  }

  if (!notes.length) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <div className='w-20 h-20 mb-6 rounded-full bg-primary/5 flex items-center justify-center'>
          <FileEdit className='w-10 h-10 text-primary/40' />
        </div>
        <p className='text-lg font-medium text-foreground mb-2'>还没有笔记</p>
        <p className='text-sm text-muted-foreground flex items-center gap-1.5'>
          <Smile className='w-4 h-4 text-macaron-pink-400' />
          在这里记录每一个美好瞬间 ✨
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          isEditing={editingId === note.id}
          onEdit={() => setEditingId(note.id)}
          onCancel={() => setEditingId(null)}
          onUpdate={content =>
            updateMutation.mutate({ id: note.id, spaceId: note.spaceId, content })
          }
          onDelete={() => deleteMutation.mutate(note.id)}
        />
      ))}

      {/* 哨兵元素 */}
      <div ref={sentinelRef} className='h-1' />

      {isFetchingNextPage && (
        <div className='flex justify-center py-4'>
          <Spinner />
        </div>
      )}
    </div>
  )
}
