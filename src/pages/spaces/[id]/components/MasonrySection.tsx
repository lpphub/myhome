import { useState, useRef, useCallback, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { Group, Tag, TagForm } from '@/types/space'
import { TAG_COLORS } from '@/types/space'
import { TagCard } from './TagCard'

interface MasonrySectionProps {
  group: Group
  tags: Tag[]
  onAddTag: (data: TagForm) => void
}

export function MasonrySection({ group, tags, onAddTag }: MasonrySectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTagTitle, setNewTagTitle] = useState('')
  const [newTagContent, setNewTagContent] = useState('')
  const [newTagColor, setNewTagColor] = useState<string>(TAG_COLORS[0].value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  const handleAddTag = useCallback(() => {
    if (!newTagTitle.trim()) return
    onAddTag({
      title: newTagTitle,
      content: newTagContent,
      color: newTagColor,
      groupId: group.id,
    })
    setNewTagTitle('')
    setNewTagContent('')
    setNewTagColor(TAG_COLORS[0].value)
    setIsAdding(false)
  }, [newTagTitle, newTagContent, newTagColor, group.id, onAddTag])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag()
    } else if (e.key === 'Escape') {
      setIsAdding(false)
      setNewTagTitle('')
      setNewTagContent('')
    }
  }

  if (tags.length === 0 && !isAdding) {
    return (
      <div className='mb-12'>
        <div className='flex items-center gap-2 mb-4'>
          <span className='text-lg'>{group.id === 'default' ? '📝' : '📁'}</span>
          <h3 className='text-lg font-medium text-warmGray-800'>{group.name}</h3>
          <span className='text-xs text-warmGray-400'>({tags.length})</span>
        </div>
        <button
          type='button'
          onClick={() => setIsAdding(true)}
          className='w-full max-w-xs py-8 border-2 border-dashed border-warmGray-200 rounded-xl text-warmGray-400 hover:border-coral-300 hover:text-coral-500 hover:bg-coral-50/50 transition-all'
        >
          <Plus className='w-5 h-5 mx-auto mb-2' />
          <span className='text-sm'>添加第一个便签</span>
        </button>
      </div>
    )
  }

  return (
    <div className='mb-12 scroll-mt-20'>
      <div className='flex items-center gap-2 mb-4'>
        <span className='text-lg'>{group.id === 'default' ? '📝' : '📁'}</span>
        <h3 className='text-lg font-medium text-warmGray-800'>{group.name}</h3>
        <span className='text-xs text-warmGray-400'>({tags.length})</span>
      </div>

      <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'>
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className='break-inside-avoid'
            >
              <TagCard tag={tag} />
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isAdding ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='break-inside-avoid'
            >
              <div className='bg-white rounded-lg border-2 border-coral-200 shadow-lg'>
                <input
                  ref={inputRef}
                  value={newTagTitle}
                  onChange={e => setNewTagTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='输入便签标题...'
                  className='w-full px-3 py-2 text-sm font-medium outline-none placeholder:text-warmGray-400'
                />
                {newTagTitle && (
                  <textarea
                    value={newTagContent}
                    onChange={e => setNewTagContent(e.target.value)}
                    placeholder='添加描述...'
                    rows={2}
                    className='w-full px-3 py-2 text-xs outline-none resize-none placeholder:text-warmGray-400'
                  />
                )}
                <div className='flex items-center justify-between px-2 pb-2'>
                  <div className='flex gap-1'>
                    {TAG_COLORS.map(color => (
                      <button
                        key={color.value}
                        type='button'
                        onClick={() => setNewTagColor(color.value)}
                        className={`w-5 h-5 rounded-full transition-all ${
                          color.class
                        } ${newTagColor === color.value ? 'ring-2 ring-offset-1 ring-warmGray-400 scale-110' : ''}`}
                      />
                    ))}
                  </div>
                  <div className='flex gap-1'>
                    <button
                      type='button'
                      onClick={() => setIsAdding(false)}
                      className='p-1.5 rounded hover:bg-warmGray-100 text-warmGray-400'
                    >
                      <X className='w-4 h-4' />
                    </button>
                    <button
                      type='button'
                      onClick={handleAddTag}
                      disabled={!newTagTitle.trim()}
                      className='px-3 py-1 text-xs bg-coral-500 text-white rounded hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      添加
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(true)}
              className='w-full py-8 border-2 border-dashed border-warmGray-200 rounded-xl text-warmGray-400 hover:border-coral-300 hover:text-coral-500 hover:bg-coral-50/50 transition-all'
            >
              <Plus className='w-5 h-5 mx-auto mb-2' />
              <span className='text-sm'>添加便签</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
