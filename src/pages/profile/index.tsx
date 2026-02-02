import { Home, Settings } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks'
import { ChangePassword } from './components/ChangePassword'
import { PersonProfile } from './components/PersonProfile'
import { useChangePassword, useUpdateProfile } from './hooks/useProfile'

function MySpace() {
  const navigate = useNavigate()

  return (
    <Card variant='warm'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-linear-to-br from-coral-100 to-honey-100 rounded-lg flex items-center justify-center'>
            <Home className='w-4 h-4 text-coral-600' />
          </div>
          <CardTitle>空间管理</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          type='button'
          onClick={() => navigate('/spaces')}
          className='w-full bg-primary/80 hover:bg-primary text-white'
        >
          <Settings className='w-4 h-4 mr-2' />
          我的空间
        </Button>
      </CardContent>
    </Card>
  )
}

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
          <PersonProfile user={user} onSubmit={updateProfile} isPending={isUpdatingProfile} />

          <ChangePassword onSubmit={changePassword} isPending={isChangingPassword} />

          <MySpace />
        </div>
      </div>
    </div>
  )
}
