import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { TAG_COLOR_CLASSES } from '@/types/tags'

interface NewTagCardProps {
  groupId: number
  onSave: (data: { name: string; color: string; groupId: number }) => void
  onCancel: () => void
}

const ROTATIONS = ['-rotate-1', 'rotate-1', 'rotate-2', '-rotate-2', 'rotate-0']

const COLOR_KEYS = Object.keys(TAG_COLOR_CLASSES)

function getRandomColor(): string {
  return COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)]
}

export function NewTagCard({ groupId, onSave, onCancel }: NewTagCardProps) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const rotationRef = useRef(ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)])
  const colorRef = useRef(getRandomColor())

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = useCallback(() => {
    if (!name.trim()) {
      onCancel()
      return
    }
    onSave({ name: name.trim(), color: colorRef.current, groupId })
  }, [name, groupId, onSave, onCancel])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    },
    [handleSubmit, onCancel]
  )

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (name.trim()) {
        handleSubmit()
      } else {
        onCancel()
      }
    }, 100)
  }, [name, handleSubmit, onCancel])

  return (
    <div
      className={cn(
        'relative p-3 max-sm:p-2.5 rounded-sm shadow-tag transition-all duration-250',
        'w-56 h-46 max-[480px]:w-full box-border',
        'flex items-center',
        TAG_COLOR_CLASSES[colorRef.current]?.classes || TAG_COLOR_CLASSES.lemon?.classes,
        rotationRef.current
      )}
    >
      <input
        ref={inputRef}
        type='text'
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder='输入名称...'
        maxLength={100}
        className='w-full bg-transparent border-none outline-none text-lg font-medium placeholder:text-current/50'
      />
    </div>
  )
}
