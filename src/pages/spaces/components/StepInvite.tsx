import { Plus, Send, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface StepInviteProps {
  spaceName: string
  onSubmit: (invitees: string[]) => void
  onBack: () => void
  onSkip: () => void
  isLoading: boolean
}

export function StepInvite({ spaceName, onSubmit, onBack, onSkip, isLoading }: StepInviteProps) {
  const [email, setEmail] = useState('')
  const [invitees, setInvitees] = useState<string[]>([])

  const handleAdd = () => {
    if (email?.includes('@') && !invitees.includes(email)) {
      setInvitees([...invitees, email])
      setEmail('')
    }
  }

  const handleRemove = (e: string) => {
    setInvitees(invitees.filter(i => i !== e))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className='space-y-6'>
      <div className='text-center py-6'>
        <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-honey-100 to-mint-green-100 flex items-center justify-center shadow-lg'>
          <UserPlus className='w-8 h-8 text-honey-600' />
        </div>
        <h2 className='text-2xl font-bold text-foreground mb-2'>邀请协作人</h2>
        <p className='text-muted-foreground'>邀请家人朋友一起记录生活的点滴</p>
      </div>

      <Card variant='warm'>
        <CardContent className='pt-6 space-y-6'>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground mb-1'>为「{spaceName}」添加协作人</p>
            <p className='text-xs text-muted-foreground'>此步骤可选，稍后也可以在空间设置中邀请</p>
          </div>

          <div className='flex gap-2'>
            <Input
              placeholder='输入协作人的邮箱地址'
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className='h-11 text-base'
            />
            <Button
              type='button'
              onClick={handleAdd}
              disabled={!email}
              className='h-11 px-4 text-white bg-primary/80 hover:bg-primary'
            >
              <Plus className='w-4 h-4' />
            </Button>
          </div>

          {invitees.length > 0 && (
            <div className='space-y-3'>
              <p className='text-sm font-medium text-foreground'>已邀请 ({invitees.length})</p>
              <div className='flex flex-wrap gap-2'>
                {invitees.map(e => (
                  <span
                    key={e}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-honey-50 border border-honey-200 rounded-full text-sm text-foreground'
                  >
                    {e}
                    <button
                      type='button'
                      onClick={() => handleRemove(e)}
                      className='ml-1 text-muted-foreground hover:text-coral-500 transition-colors'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className='flex gap-3 pt-2'>
            <Button type='button' variant='outline' onClick={onBack} className='flex-1 h-11'>
              上一步
            </Button>
            <Button
              type='button'
              variant='ghost'
              onClick={onSkip}
              disabled={isLoading}
              className='flex-1 h-11'
            >
              跳过
            </Button>
            <Button
              type='button'
              onClick={() => onSubmit(invitees)}
              disabled={isLoading}
              className={cn('flex-1 h-11 text-white bg-primary/80 hover:bg-primary')}
            >
              {isLoading ? (
                '创建中...'
              ) : invitees.length > 0 ? (
                <>
                  <Send className='w-4 h-4 mr-1.5' />
                  创建并邀请
                </>
              ) : (
                '创建空间'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
