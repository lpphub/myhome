import { Lock } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AvatarSection } from './AvatarSection'

interface BasicInfoSectionProps {
  currentAvatar: string
  selectedAvatar: string
  onAvatarSelect: (avatar: string) => void
  onNameSave: () => void
  isSaving: boolean
}

export function BasicInfoSection({
  currentAvatar,
  selectedAvatar,
  onAvatarSelect,
  onNameSave,
  isSaving,
}: BasicInfoSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()

  const emailValue = watch('email') || ''

  return (
    <div className='bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-honey-100/60 hover:shadow-md transition-all duration-300'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-8 h-8 bg-gradient-to-br from-coral-100 to-honey-100 rounded-lg flex items-center justify-center'>
          <span className='text-sm'>📝</span>
        </div>
        <h2 className='text-lg font-semibold text-foreground'>基本信息</h2>
      </div>

      <div className='space-y-6'>
        <AvatarSection
          currentAvatar={currentAvatar}
          selectedAvatar={selectedAvatar}
          onAvatarSelect={onAvatarSelect}
        />

        <div className='space-y-5'>
          <div className='space-y-2.5'>
            <Label htmlFor='name'>显示名称</Label>
            <Input
              id='name'
              placeholder='输入您的显示名称'
              className={cn(errors.name && 'border-destructive ring-1 ring-destructive')}
              {...register('name')}
            />
            {errors.name && (
              <p className='text-sm text-destructive'>{String(errors.name.message)}</p>
            )}
          </div>

          <div className='space-y-2.5'>
            <Label htmlFor='email'>邮箱地址</Label>
            <div className='relative'>
              <Input
                id='email'
                type='email'
                disabled
                value={emailValue}
                className='bg-muted-background/50 border-honey-100/50 text-muted/70 cursor-not-allowed pr-10'
                {...register('email')}
              />
              <Lock className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40' />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-6 flex justify-end'>
        <Button
          type='button'
          onClick={onNameSave}
          disabled={isSaving}
          className='px-6 py-2.5 bg-gradient-to-r from-coral-400 to-coral-500 hover:from-coral-500 hover:to-coral-600 text-white rounded-xl shadow-lg shadow-coral-200/50 hover:shadow-xl hover:shadow-coral-200/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSaving ? '保存中...' : '保存名称'}
        </Button>
      </div>
    </div>
  )
}
