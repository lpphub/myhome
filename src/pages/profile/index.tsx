import { useAuth } from '@/hooks'
import { ChangePassword } from './components/ChangePassword'
import { SetupProfile } from './components/SetupProfile'
import { useChangePassword, useUpdateProfile } from './hooks/useProfile'

export default function Profile() {
  const { user } = useAuth()
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword()
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile()

  return (
    <div className='min-h-screen relative'>
      <div className='max-w-2xl mx-auto px-4 py-6'>
        <header className='mb-6'>
          <h1 className='text-xl font-bold text-foreground mb-1'>个人设置</h1>
          <p className='text-sm text-muted-foreground'>管理您的个人信息和安全设置</p>
        </header>

        <div className='space-y-4'>
          <SetupProfile user={user} onSubmit={updateProfile} isPending={isUpdatingProfile} />

          <ChangePassword onSubmit={changePassword} isPending={isChangingPassword} />
        </div>
      </div>
    </div>
  )
}
