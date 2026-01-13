import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { useState } from 'react'
import { type FieldValues, type Path, type UseFormRegister, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useChangePassword } from '@/pages/profile/hooks/useProfile'

/* ==================== Schema ==================== */

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, '请输入旧密码'),
    newPassword: z.string().min(6, '新密码至少6个字符'),
    confirmPassword: z.string().min(1, '请确认新密码'),
  })
  .refine(val => val.newPassword === val.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

/* ==================== PasswordInput ==================== */

interface PasswordInputProps<T extends FieldValues> {
  name: Path<T>
  label: string
  placeholder: string
  showPassword: boolean
  onToggleVisibility: () => void
  register: UseFormRegister<T>
  error?: string
}

function PasswordInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  showPassword,
  onToggleVisibility,
  register,
  error,
}: PasswordInputProps<T>) {
  return (
    <div className='space-y-2.5'>
      <Label htmlFor={name}>{label}</Label>

      <div className='relative'>
        <Input
          id={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={cn('pr-10', error && 'border-destructive ring-1 ring-destructive')}
          {...register(name)}
        />

        <button
          type='button'
          onClick={onToggleVisibility}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-muted/50 hover:text-muted transition-colors'
        >
          {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
        </button>
      </div>

      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  )
}

/* ==================== ChangePassword ==================== */

export function ChangePassword() {
  const { mutate: changePassword, isPending } = useChangePassword()
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = (values: PasswordFormValues) => {
    changePassword(
      {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          form.reset()
        },
      }
    )
  }

  return (
    <Card variant='warm' className='card-hover'>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-linear-to-br from-coral-100 to-honey-100 rounded-lg flex items-center justify-center'>
              <Shield className='w-4 h-4 text-coral-600' />
            </div>
            <CardTitle>安全设置</CardTitle>
          </div>
        </CardHeader>

        <CardContent className='space-y-5'>
          <PasswordInput<PasswordFormValues>
            name='oldPassword'
            label='旧密码'
            placeholder='输入旧密码'
            showPassword={showPasswords.oldPassword}
            onToggleVisibility={() =>
              setShowPasswords(prev => ({ ...prev, oldPassword: !prev.oldPassword }))
            }
            register={form.register}
            error={form.formState.errors.oldPassword?.message}
          />

          <PasswordInput<PasswordFormValues>
            name='newPassword'
            label='新密码'
            placeholder='输入新密码'
            showPassword={showPasswords.newPassword}
            onToggleVisibility={() =>
              setShowPasswords(prev => ({ ...prev, newPassword: !prev.newPassword }))
            }
            register={form.register}
            error={form.formState.errors.newPassword?.message}
          />

          <PasswordInput<PasswordFormValues>
            name='confirmPassword'
            label='确认新密码'
            placeholder='再次输入新密码'
            showPassword={showPasswords.confirmPassword}
            onToggleVisibility={() =>
              setShowPasswords(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))
            }
            register={form.register}
            error={form.formState.errors.confirmPassword?.message}
          />
        </CardContent>

        <CardFooter className='justify-end mt-3'>
          <Button
            type='submit'
            disabled={isPending}
            className='bg-primary/80 hover:bg-primary text-white transition-all'
          >
            {isPending ? '修改中' : '修改密码'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
