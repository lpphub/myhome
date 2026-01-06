import { X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SPACE_COLORS, SPACE_ICONS, type SpaceForm } from '@/types/space'

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Creating space:', form)
    setIsSubmitting(false)
    onClose()
    setForm({ name: '', icon: '🏠', color: 'honey', description: '' })
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
                   bg-white rounded-2xl shadow-2xl z-50
                   animate-in zoom-in-95 fade-in duration-200'
      >
        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-warmGray-800'>新建空间</h2>
            <button
              type='button'
              onClick={onClose}
              className='p-2 rounded-lg hover:bg-warmGray-100 text-warmGray-400 hover:text-warmGray-600 transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='space-y-5'>
            <div>
              <label
                htmlFor='space-name'
                className='block text-sm font-medium text-warmGray-700 mb-2'
              >
                空间名称
              </label>
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
              <span className='block text-sm font-medium text-warmGray-700 mb-2'>选择图标</span>
              <div className='grid grid-cols-10 gap-2'>
                {SPACE_ICONS.map(icon => (
                  <button
                    key={icon}
                    type='button'
                    onClick={() => setForm({ ...form, icon })}
                    className={cn(
                      'w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all',
                      form.icon === icon
                        ? 'bg-coral-100 ring-2 ring-coral-300 scale-110'
                        : 'hover:bg-warmGray-100'
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className='block text-sm font-medium text-warmGray-700 mb-2'>选择颜色</span>
              <div className='flex gap-2'>
                {SPACE_COLORS.map(color => (
                  <button
                    key={color.value}
                    type='button'
                    onClick={() => setForm({ ...form, color: color.value })}
                    className={cn(
                      'w-8 h-8 rounded-full transition-all',
                      color.class,
                      form.color === color.value &&
                        'ring-2 ring-offset-2 ring-warmGray-400 scale-110'
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor='space-description'
                className='block text-sm font-medium text-warmGray-700 mb-2'
              >
                描述（可选）
              </label>
              <textarea
                id='space-description'
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder='添加空间描述...'
                rows={3}
                className='w-full px-3 py-2 border border-warmGray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-coral-200 focus:border-coral-300'
              />
            </div>
          </div>

          <div className='flex gap-3 mt-6'>
            <Button variant='outline' onClick={onClose} className='flex-1'>
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.name.trim() || isSubmitting}
              className='flex-1 bg-linear-to-r from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700 disabled:opacity-50'
            >
              {isSubmitting ? '创建中...' : '创建空间'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
