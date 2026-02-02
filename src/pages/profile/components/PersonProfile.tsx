import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AVATAR_KEYS, Avatar, type AvatarKey } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { User } from '@/types/auth'

// 表单校验规则
const profileSchema = z.object({
  name: z.string().min(1, '请输入显示名称').max(20, '名称最多20个字符'),
  avatar: z.enum(AVATAR_KEYS),
})

type FormValues = z.infer<typeof profileSchema>

// 头像选择器组件 —— 抽离出来，更清晰
function AvatarSelector({
  selectedAvatar,
  onSelect,
  onClose,
}: {
  selectedAvatar: AvatarKey
  onSelect: (key: AvatarKey) => void
  onClose: () => void
}) {
  return (
    <div className='mt-4 grid grid-cols-5 gap-3 justify-items-center'>
      {AVATAR_KEYS.map(key => (
        <button
          key={key}
          type='button'
          onClick={() => {
            onSelect(key)
            onClose()
          }}
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200',
            selectedAvatar === key
              ? 'bg-coral-100 ring-2 ring-coral-300 scale-110 shadow-sm'
              : 'bg-honey-50 hover:bg-honey-100 hover:scale-105'
          )}
        >
          <Avatar src={key} size='md' />
        </button>
      ))}
    </div>
  )
}

interface PersonProfileProps {
  user?: User | null
  onSubmit: (data: { name: string; avatar: AvatarKey }) => void | Promise<void>
  isPending?: boolean
}

export function PersonProfile({ user, onSubmit, isPending = false }: PersonProfileProps) {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      avatar: (user?.avatar as AvatarKey) || 'avatar-1',
    },
  })

  const handleAvatarSelect = (avatar: AvatarKey) => {
    form.setValue('avatar', avatar, { shouldValidate: true })
  }

  return (
    <Card variant='warm'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-linear-to-br from-coral-100 to-honey-100 rounded-lg flex items-center justify-center'>
            <UserIcon className='w-4 h-4 text-coral-600' />
          </div>
          <CardTitle>基本信息</CardTitle>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        <form
          onSubmit={form.handleSubmit(data => onSubmit({ name: data.name, avatar: data.avatar }))}
          className='space-y-6'
        >
          {/* 头像区域 */}
          <Controller
            name='avatar'
            control={form.control}
            render={({ field }) => (
              <div className='flex flex-col items-center'>
                <button
                  type='button'
                  onClick={() => setShowAvatarSelector(prev => !prev)}
                  className='relative w-12 h-12 rounded-xl flex items-center justify-center shadow-md ring-2 ring-white cursor-pointer hover:scale-105 transition-transform duration-300'
                >
                  <Avatar src={field.value} size='lg' />
                </button>
                <p className='mt-2 text-xs text-muted/70'>点击头像更换</p>

                {/* 条件渲染头像选择器 */}
                {showAvatarSelector && (
                  <AvatarSelector
                    selectedAvatar={field.value}
                    onSelect={handleAvatarSelect}
                    onClose={() => setShowAvatarSelector(false)}
                  />
                )}
              </div>
            )}
          />

          {/* 显示名称 */}
          <div className='space-y-2.5'>
            <Label htmlFor='name'>显示名称</Label>
            <Input
              id='name'
              placeholder='输入您的显示名称'
              className={cn(
                form.formState.errors.name && 'border-destructive ring-1 ring-destructive'
              )}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className='text-sm text-destructive'>{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* 邮箱只读 */}
          <div className='space-y-2.5'>
            <Label htmlFor='email'>邮箱地址</Label>
            <div className='relative'>
              <Input
                id='email'
                type='email'
                disabled
                className='bg-muted/30 text-foreground cursor-not-allowed pr-10'
                value={user?.email || ''}
              />
              <Lock className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted' />
            </div>
          </div>

          {/* 保存按钮 */}
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={isPending}
              className='bg-primary/80 hover:bg-primary text-white'
            >
              {isPending ? '保存中' : '保存'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
