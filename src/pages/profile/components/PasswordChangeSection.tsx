import { Eye, EyeOff, Shield } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface PasswordChangeSectionProps {
  onPasswordChange: () => void
  isSaving: boolean
}

export function PasswordChangeSection({ onPasswordChange, isSaving }: PasswordChangeSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const [showPasswords, setShowPasswords] = useState(false)

  const togglePasswordVisibility = () => setShowPasswords(!showPasswords)

  return (
    <div className='bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-honey-100/60 hover:shadow-md transition-all duration-300'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-8 h-8 bg-gradient-to-br from-coral-100 to-honey-100 rounded-lg flex items-center justify-center'>
          <Shield className='w-4 h-4 text-coral-600' />
        </div>
        <h2 className='text-lg font-semibold text-foreground'>安全设置</h2>
      </div>

      <div className='space-y-5'>
        <div className='space-y-2.5'>
          <Label htmlFor='oldPassword'>旧密码</Label>
          <div className='relative'>
            <Input
              id='oldPassword'
              type={showPasswords ? 'text' : 'password'}
              placeholder='输入旧密码'
              className={cn(
                'pr-10',
                errors.oldPassword && 'border-destructive ring-1 ring-destructive'
              )}
              {...register('oldPassword')}
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted/50 hover:text-muted transition-colors'
            >
              {showPasswords ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className='text-sm text-destructive'>{String(errors.oldPassword.message)}</p>
          )}
        </div>

        <div className='space-y-2.5'>
          <Label htmlFor='newPassword'>新密码</Label>
          <div className='relative'>
            <Input
              id='newPassword'
              type={showPasswords ? 'text' : 'password'}
              placeholder='输入新密码'
              className={cn(
                'pr-10',
                errors.newPassword && 'border-destructive ring-1 ring-destructive'
              )}
              {...register('newPassword')}
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted/50 hover:text-muted transition-colors'
            >
              {showPasswords ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
          {errors.newPassword && (
            <p className='text-sm text-destructive'>{String(errors.newPassword.message)}</p>
          )}
        </div>

        <div className='space-y-2.5'>
          <Label htmlFor='confirmPassword'>确认新密码</Label>
          <div className='relative'>
            <Input
              id='confirmPassword'
              type={showPasswords ? 'text' : 'password'}
              placeholder='再次输入新密码'
              className={cn(
                'pr-10',
                errors.confirmPassword && 'border-destructive ring-1 ring-destructive'
              )}
              {...register('confirmPassword')}
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted/50 hover:text-muted transition-colors'
            >
              {showPasswords ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className='text-sm text-destructive'>{String(errors.confirmPassword.message)}</p>
          )}
        </div>
      </div>

      <div className='mt-6 flex justify-end'>
        <Button
          type='button'
          onClick={onPasswordChange}
          disabled={isSaving}
          className='px-6 py-2.5 bg-gradient-to-r from-coral-400 to-coral-500 hover:from-coral-500 hover:to-coral-600 text-white rounded-xl shadow-lg shadow-coral-200/50 hover:shadow-xl hover:shadow-coral-200/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSaving ? '修改中...' : '修改密码'}
        </Button>
      </div>
    </div>
  )
}
