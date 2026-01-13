import { zodResolver } from '@hookform/resolvers/zod'
import { Lock } from 'lucide-react'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks'
import { cn } from '@/lib/utils'
import { useUpdateProfile } from '@/pages/profile/hooks/useProfile'

const AVATAR_SVGS: Record<string, ReactElement> = {
  'avatar-1': (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
      <title>卡通头像1</title>
      <circle cx='50' cy='50' r='50' fill='#FFE4C4' />
      <circle cx='50' cy='40' r='20' fill='#FFDAB9' />
      <circle cx='43' cy='37' r='3' fill='#333' />
      <circle cx='57' cy='37' r='3' fill='#333' />
      <path d='M 43 48 Q 50 55 57 48' stroke='#333' strokeWidth='2' fill='none' />
      <ellipse cx='50' cy='70' rx='25' ry='15' fill='#FFB6C1' />
    </svg>
  ),
  'avatar-2': (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
      <title>卡通头像2</title>
      <circle cx='50' cy='50' r='50' fill='#E6E6FA' />
      <circle cx='50' cy='40' r='20' fill='#FFF8DC' />
      <circle cx='43' cy='37' r='3' fill='#333' />
      <circle cx='57' cy='37' r='3' fill='#333' />
      <circle cx='50' cy='47' r='2' fill='#FFB6C1' />
      <path d='M 35 65 Q 50 75 65 65' stroke='#8B4513' strokeWidth='3' fill='none' />
      <circle cx='30' cy='40' r='12' fill='#8B4513' opacity='0.9' />
      <circle cx='70' cy='40' r='12' fill='#8B4513' opacity='0.9' />
    </svg>
  ),
  'avatar-3': (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
      <title>卡通头像3</title>
      <circle cx='50' cy='50' r='50' fill='#98FB98' />
      <circle cx='50' cy='40' r='20' fill='#FFFACD' />
      <circle cx='43' cy='37' r='3' fill='#333' />
      <circle cx='57' cy='37' r='3' fill='#333' />
      <path d='M 43 48 Q 50 52 57 48' stroke='#333' strokeWidth='2' fill='none' />
      <path
        d='M 30 35 L 25 25 M 35 30 L 32 20 M 70 35 L 75 25 M 65 30 L 68 20'
        stroke='#32CD32'
        strokeWidth='3'
        fill='none'
      />
    </svg>
  ),
  'avatar-4': (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
      <title>卡通头像4</title>
      <circle cx='50' cy='50' r='50' fill='#FFA07A' />
      <circle cx='50' cy='40' r='20' fill='#FFEFD5' />
      <circle cx='43' cy='37' r='3' fill='#333' />
      <circle cx='57' cy='37' r='3' fill='#333' />
      <circle cx='44' cy='46' r='2' fill='#FF69B4' />
      <circle cx='56' cy='46' r='2' fill='#FF69B4' />
      <path d='M 40 55 Q 50 62 60 55' stroke='#333' strokeWidth='2' fill='none' />
      <rect x='35' y='20' width='30' height='20' rx='5' fill='#FF6347' />
    </svg>
  ),
  'avatar-5': (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
      <title>卡通头像5</title>
      <circle cx='50' cy='50' r='50' fill='#DDA0DD' />
      <circle cx='50' cy='40' r='20' fill='#F0E68C' />
      <circle cx='43' cy='37' r='3' fill='#333' />
      <circle cx='57' cy='37' r='3' fill='#333' />
      <path d='M 43 48 Q 50 53 57 48' stroke='#333' strokeWidth='2' fill='none' />
      <circle cx='38' cy='45' r='3' fill='#FFB6C1' opacity='0.5' />
      <circle cx='62' cy='45' r='3' fill='#FFB6C1' opacity='0.5' />
      <path d='M 28 70 Q 50 85 72 70' stroke='#9370DB' strokeWidth='4' fill='none' />
    </svg>
  ),
}

const AVATAR_KEYS = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5'] as const
type AvatarKey = (typeof AVATAR_KEYS)[number]

const profileSchema = z.object({
  name: z.string().min(1, '请输入显示名称').max(20, '名称最多20个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface AvatarItemProps {
  avatar: AvatarKey
  isSelected: boolean
  onClick: () => void
}

function AvatarItem({ avatar, isSelected, onClick }: AvatarItemProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200',
        isSelected
          ? 'bg-coral-100 ring-2 ring-coral-300 scale-110 shadow-sm'
          : 'bg-honey-50 hover:bg-honey-100 hover:scale-105'
      )}
    >
      {AVATAR_SVGS[avatar] || AVATAR_SVGS['avatar-1']}
    </button>
  )
}

function AvatarManager() {
  const { user } = useAuth()
  const { mutate: updateProfile } = useUpdateProfile()
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'avatar-1')

  const handleAvatarClick = (avatar: AvatarKey) => {
    setSelectedAvatar(avatar)
    setShowAvatarSelector(false)

    updateProfile({ name: user?.name || '', avatar })
  }

  return (
    <div className='flex flex-col items-center mb-6'>
      <button
        type='button'
        onClick={() => setShowAvatarSelector(!showAvatarSelector)}
        className='relative w-16 h-16 bg-linear-to-br from-honey-50 to-coral-50 rounded-xl flex items-center justify-center shadow-md ring-2 ring-white cursor-pointer hover:scale-105 transition-transform duration-300'
      >
        {AVATAR_SVGS[selectedAvatar] || AVATAR_SVGS['avatar-1']}
      </button>
      <p className='mt-2 text-xs text-muted/70'>点击头像更换</p>

      {showAvatarSelector && (
        <div className='w-full space-y-3 pt-4'>
          <div className='grid grid-cols-5 gap-3 justify-items-center'>
            {AVATAR_KEYS.map(key => (
              <AvatarItem
                key={key}
                avatar={key}
                isSelected={selectedAvatar === key}
                onClick={() => handleAvatarClick(key)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface BasicInfoFormProps {
  userName: string
  userEmail: string
}

function BasicInfoForm({ userName, userEmail }: BasicInfoFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userName,
      email: userEmail,
    },
  })

  useEffect(() => {
    form.reset({
      name: userName,
      email: userEmail,
    })
  }, [userName, userEmail, form])

  const handleSubmit = () => {
    const result = form.trigger()
    if (!result) return

    const nameValue = form.getValues('name')
    updateProfile({ name: nameValue })
  }

  return (
    <div className='space-y-5'>
      <div className='space-y-2.5'>
        <Label htmlFor='name'>显示名称</Label>
        <Input
          id='name'
          placeholder='输入您的显示名称'
          className={cn(form.formState.errors.name && 'border-destructive ring-1 ring-destructive')}
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className='text-sm text-destructive'>{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className='space-y-2.5'>
        <Label htmlFor='email'>邮箱地址</Label>
        <div className='relative'>
          <Input
            id='email'
            type='email'
            disabled
            className='bg-muted-background/50 border-honey-100/50 text-foreground cursor-not-allowed pr-10'
            {...form.register('email')}
          />
          <Lock className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40' />
        </div>
      </div>

      <div className='flex justify-end pt-2'>
        <Button
          type='button'
          onClick={() => handleSubmit()}
          disabled={isPending}
          className='bg-primary/80 hover:bg-primary text-white transition-all'
        >
          {isPending ? '保存中' : '保存'}
        </Button>
      </div>
    </div>
  )
}

export function SetProfile() {
  const { user } = useAuth()
  const userName = user?.name || ''
  const userEmail = user?.email || ''

  return (
    <Card variant='warm' className='card-hover'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-linear-to-br from-coral-100 to-honey-100 rounded-lg flex items-center justify-center'>
            <span className='text-sm'>📝</span>
          </div>
          <CardTitle>基本信息</CardTitle>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        <AvatarManager />
        <BasicInfoForm userName={userName} userEmail={userEmail} />
      </CardContent>
    </Card>
  )
}
