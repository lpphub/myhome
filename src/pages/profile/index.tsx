import { ChangePassword } from './components/ChangePassword'
import { SetupProfile } from './components/SetupProfile'
import { useChangePassword } from './hooks/useProfile'

export default function Profile() {
  const { mutate: changePassword, isPending } = useChangePassword()

  return (
    <div className='min-h-screen relative'>
      <div className='max-w-2xl mx-auto px-4 py-6'>
        <header className='mb-6'>
          <h1 className='text-xl font-bold text-foreground mb-1'>个人设置</h1>
          <p className='text-sm text-muted-foreground'>管理您的个人信息和安全设置</p>
        </header>

        <div className='space-y-4'>
          <SetupProfile />

          <ChangePassword onSubmit={changePassword} isPending={isPending} />
        </div>
      </div>
    </div>
  )
}
