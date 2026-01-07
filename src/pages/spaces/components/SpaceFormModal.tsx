import { X } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { createSpace } from '@/api/spaces'
import { SPACE_ICONS, SPACE_COLOR_CLASSES, type SpaceForm } from '@/types/spaces'

interface SpaceFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SpaceFormModal({ isOpen, onClose }: SpaceFormModalProps) {
  const [form, setForm] = useState<SpaceForm>({
    name: '',
    icon: '🏠',
    color: 'honey',
    description: '',
  })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
      onClose()
      setForm({ name: '', icon: '🏠', color: 'honey', description: '' })
    },
  })

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    mutation.mutate(form)
  }

  if (!isOpen) return null

  return (
    <>
      <button
        type='button'
        className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-200 cursor-pointer border-0 p-0'
        onClick={onClose}
        aria-label='关闭'
      />
      <div
        className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md
                    bg-white rounded-lg shadow-lg z-50
                   animate-in zoom-in-95 fade-in duration-200'
      >
        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-foreground'>新建空间</h2>
            <button
              type='button'
              onClick={onClose}
              className='p-2 rounded-lg hover:bg-muted-background text-foreground hover:text-foreground transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='space-y-5'>
            <div>
              <Label
                htmlFor='space-name'
                className='block text-sm font-medium text-foreground mb-2'
              >
                空间名称
              </Label>
              <Input
                id='space-name'
                autoFocus
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder='输入空间名称'
                className='h-11'
              />
            </div>

            <div>
              <Label
                htmlFor='space-icon'
                className='block text-sm font-medium text-foreground mb-2'
              >
                选择图标
              </Label>
              <div className='grid grid-cols-10 gap-2'>
                {SPACE_ICONS.map(icon => (
                  <button
                    key={icon}
                    type='button'
                    onClick={() => setForm({ ...form, icon })}
                    className={cn(
                      'w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all',
                      form.icon === icon
                        ? 'bg-coral-100 ring-1 ring-coral-300 scale-110'
                        : 'hover:bg-muted-background'
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor='space-color'
                className='block text-sm font-medium text-foreground mb-2'
              >
                选择颜色
              </Label>
              <div className='flex gap-2'>
                {Object.entries(SPACE_COLOR_CLASSES).map(([value, config]) => (
                  <button
                    key={value}
                    type='button'
                    onClick={() => setForm({ ...form, color: value })}
                    className={cn(
                      'w-8 h-8 rounded-full transition-all',
                      config.classes,
                      form.color === value && 'ring-1 ring-offset-1 ring-primary scale-110'
                    )}
                    title={config.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor='space-description'
                className='block text-sm font-medium text-foreground mb-2'
              >
                描述（可选）
              </Label>
              <Textarea
                id='space-description'
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder='添加空间描述...'
                rows={3}
                className='w-full px-3 py-2 border border-border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
              />
            </div>
          </div>

          <div className='flex gap-3 mt-6'>
            <Button variant='outline' onClick={onClose} className='flex-1'>
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.name.trim() || mutation.isPending}
              className='flex-1 bg-linear-to-r from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700 disabled:opacity-50'
            >
              {mutation.isPending ? '创建中...' : '创建空间'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
