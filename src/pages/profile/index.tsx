import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useChangePassword, useUpdateProfile } from './hooks/useProfile'
import { BasicInfoSection } from './components/BasicInfoSection'
import { PasswordChangeSection } from './components/PasswordChangeSection'
import { useAuth } from '@/hooks'

const profileSchema = z.object({
  name: z.string().min(1, '请输入显示名称').max(20, '名称最多20个字符'),
  email: z.string().email(),
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export default function Profile() {
  const { user } = useAuth()
  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } = useUpdateProfile()
  const { mutate: changePasswordMutation, isPending: isChangingPassword } = useChangePassword()

  const [selectedAvatar, setSelectedAvatar] = useState('')

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setSelectedAvatar(user.avatar || 'avatar-1')
    }
  }, [user, form])

  const handleSaveAvatar = (avatar: string) => {
    updateProfileMutation(
      {
        name: user?.name || '',
        avatar,
      },
      {
        onSuccess: () => {
          toast.success('头像保存成功 ✨')
        },
      }
    )
  }

  const handleSaveName = () => {
    const nameValue = form.getValues('name')
    if (!nameValue) {
      toast.error('请输入显示名称')
      return
    }
    updateProfileMutation({
      name: nameValue,
    })
  }

  const handleChangePassword = () => {
    const oldPassword = form.getValues('oldPassword')
    const newPassword = form.getValues('newPassword')
    const confirmPassword = form.getValues('confirmPassword')

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

    const passwordValid = passwordSchema.safeParse({
      oldPassword: oldPassword || '',
      newPassword: newPassword || '',
      confirmPassword: confirmPassword || '',
    })

    if (!passwordValid.success) {
      passwordValid.error.issues.forEach(err => {
        if (err.path[0]) {
          form.setError(err.path[0] as keyof ProfileFormValues, {
            message: err.message,
          })
        }
      })
      return
    }

    changePasswordMutation(
      {
        oldPassword: oldPassword || '',
        newPassword: newPassword || '',
      },
      {
        onSuccess: () => {
          form.reset({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          })
        },
      }
    )
  }

  return (
    <div className='min-h-screen pb-20 relative'>
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-coral-100/20 to-transparent rounded-full blur-3xl' />
        <div className='absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-honey-100/20 to-transparent rounded-full blur-3xl' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-mint-green-50/10 to-transparent rounded-full blur-3xl' />
      </div>

      <div className='max-w-3xl mx-auto px-4 py-4 md:py-6 relative z-10'>
        <header className='relative mb-4'>
          <div>
            <h1 className='text-xl font-bold text-foreground mb-1'>个人中心</h1>
            <p className='text-xs text-muted/80'>管理您的个人信息和安全设置</p>
          </div>
          <div className='absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-coral-200/30 to-honey-200/30 rounded-full blur-3xl pointer-events-none' />
        </header>

        <div className='space-y-4'>
          <FormProvider {...form}>
            <BasicInfoSection
              currentAvatar={user?.avatar || 'avatar-1'}
              selectedAvatar={selectedAvatar}
              onAvatarSelect={handleSaveAvatar}
              onNameSave={handleSaveName}
              isSaving={isUpdatingProfile}
            />

            <PasswordChangeSection
              onPasswordChange={handleChangePassword}
              isSaving={isChangingPassword}
            />
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
