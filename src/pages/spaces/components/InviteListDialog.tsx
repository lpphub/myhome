import { Bell, Clock } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { SpaceInvite } from '@/types/spaces'
import { formatRelativeTime } from '@/utils/date'
import { usePendingInvitesQuery, useRespondInvite } from '../hooks/useSpaces'

interface InviteListDialogProps {
  open: boolean
  onClose: () => void
}

export const InviteListDialog = ({ open, onClose }: InviteListDialogProps) => {
  const [selectedInvite, setSelectedInvite] = useState<{
    inviteId: number
    action: 'accept' | 'reject'
  } | null>(null)
  const { data: invites = [], isLoading } = usePendingInvitesQuery()
  const respondInvite = useRespondInvite()

  useEffect(() => {
    if (!open) {
      setSelectedInvite(null)
    }
  }, [open])

  const handleRespond = useCallback(
    (invite: SpaceInvite, action: 'accept' | 'reject') => {
      setSelectedInvite({ inviteId: invite.id, action })
      respondInvite.mutate(
        { inviteId: invite.id, action },
        {
          onSuccess: () => {
            if (invites.length === 1) {
              onClose()
            }
          },
        }
      )
    },
    [respondInvite, onClose, invites.length]
  )

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className='sm:max-w-md bg-white border-honey-200 rounded-lg max-h-[80vh] overflow-y-auto'>
        <DialogTrigger onClick={e => e.currentTarget.blur()} />

        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-foreground flex items-center gap-2'>
            <Bell className='w-6 h-6 text-primary' />
            邀请协作
          </DialogTitle>
          <DialogDescription>
            <span className='text-foreground'>{invites.length} 个待处理邀请</span>
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3 mt-4'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8 text-primary'>加载中...</div>
          ) : invites.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
              <Bell className='w-12 h-12 mb-2 text-gray-300' />
              <p>暂无待处理邀请</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {invites.map(invite => (
                <div
                  key={invite.id}
                  className='p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden break-inside-avoid'
                >
                  <div className='flex items-start mb-3'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0'>
                        <span className='text-2xl'>{invite.spaceIcon}</span>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-semibold text-foreground text-base mb-1 truncate'>
                          {invite.spaceName}
                        </h4>
                        <div className='flex items-center gap-2 text-sm text-gray-600 min-w-0'>
                          <Avatar src={invite.inviterAvatar} name={invite.inviterName} size='sm' />
                          <span className='truncate max-w-15 sm:max-w-none'>
                            {invite.inviterName}
                          </span>
                          <span className='text-gray-400 truncate hidden sm:block'>
                            {invite.inviterEmail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between pt-3 border-t border-gray-200 gap-2'>
                    <div className='flex items-center gap-1.5 text-sm text-gray-500'>
                      <Clock className='w-3.5 h-3.5' />
                      <span>{formatRelativeTime(invite.createdAt)}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => handleRespond(invite, 'reject')}
                        disabled={respondInvite.isPending && selectedInvite?.inviteId === invite.id}
                        className='border-gray-300 text-muted hover:border-red-300 hover:text-red-500'
                      >
                        {respondInvite.isPending &&
                        selectedInvite?.inviteId === invite.id &&
                        selectedInvite?.action === 'reject'
                          ? '处理中...'
                          : '拒绝'}
                      </Button>
                      <Button
                        type='button'
                        size='sm'
                        onClick={() => handleRespond(invite, 'accept')}
                        disabled={respondInvite.isPending && selectedInvite?.inviteId === invite.id}
                        className='bg-primary/80 hover:bg-primary text-white'
                      >
                        {respondInvite.isPending &&
                        selectedInvite?.inviteId === invite.id &&
                        selectedInvite?.action === 'accept'
                          ? '处理中...'
                          : '接受'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
