import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks'
import { ChangePassword } from './components/ChangePassword'
import { SetProfile } from './components/SetProfile'
import { useUpdateProfile } from './hooks/useProfile'

export default function Profile() {
  const { user } = useAuth()
  const { mutate: updateProfileMutation } = useUpdateProfile()

  const [selectedAvatar, setSelectedAvatar] = useState('')

  useEffect(() => {
    if (user) {
      setSelectedAvatar(user.avatar || 'avatar-1')
    }
  }, [user])

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

  return (
    <div className='min-h-screen relative'>
      <div className='max-w-2xl mx-auto px-4 py-6'>
        <header className='mb-6'>
          <h1 className='text-xl font-bold text-foreground mb-1'>个人中心</h1>
          <p className='text-sm text-muted-foreground'>管理您的个人信息和安全设置</p>
        </header>

        <div className='space-y-4'>
          <SetProfile
            selectedAvatar={selectedAvatar}
            onAvatarSelect={handleSaveAvatar}
          />

          <ChangePassword />
        </div>
      </div>
    </div>
  )
}
