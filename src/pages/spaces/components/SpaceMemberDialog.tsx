import { zodResolver } from '@hookform/resolvers/zod'
import { Crown, Mail, UserMinus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks'
import type { Space, SpaceMember } from '@/types/spaces'
import {
  useInviteSpaceMember,
  useRemoveSpaceMember,
  useSpaceMembersQuery,
} from '../hooks/useSpaces'

const inviteMemberSchema = z.object({
  email: z.email('请输入有效的邮箱地址').min(1, '请输入邮箱地址').max(200),
})

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>

interface SpaceMemberDialogProps {
  open: boolean
  onClose: () => void
  space?: Space
}

type ConfirmDialogState = {
  open: boolean
  member?: SpaceMember
}

export const SpaceMemberDialog = ({ open, onClose, space }: SpaceMemberDialogProps) => {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
  })
  const { user } = useAuth()
  const isOwner = user?.id === space?.owner

  const { data: members = [], isLoading: isLoadingMembers } = useSpaceMembersQuery(space?.id ?? 0)
  const inviteMember = useInviteSpaceMember()
  const removeMember = useRemoveSpaceMember()

  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setConfirmDialog({ open: false })
    }
  }, [open, form])

  const handleInvite = (values: InviteMemberFormValues) => {
    if (!space) return
    inviteMember.mutate(
      { spaceId: space.id, emails: [values.email] },
      {
        onSuccess: () => {
          form.reset()
        },
      }
    )
  }

  const handleConfirm = () => {
    if (!space || !confirmDialog.member) return

    removeMember.mutate(
      { spaceId: space.id, userId: confirmDialog.member.userId },
      {
        onSuccess: () => {
          setConfirmDialog({ open: false })
        },
      }
    )
  }

  const handleActionClick = (member: SpaceMember) => {
    setConfirmDialog({ open: true, member })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={open => !open && onClose()}>
        <DialogContent className='sm:max-w-md bg-white border-honey-200 rounded-lg max-h-[80vh] overflow-y-auto'>
          <DialogTrigger onClick={e => e.currentTarget.blur()} />
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold text-foreground flex items-center gap-2'>
              <Users className='w-6 h-6 text-primary' />
              协作成员
            </DialogTitle>
            <DialogDescription>
              <span className='text-foreground'>{space?.name}</span>
              <span className='text-gray-500 ml-2'>（{members.length} 人）</span>
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 mt-4'>
            {isLoadingMembers ? (
              <div className='flex items-center justify-center py-8 text-primary'>加载中...</div>
            ) : members.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
                <Users className='w-12 h-12 mb-2 text-gray-300' />
                <p>暂无协作者</p>
              </div>
            ) : (
              <div className='space-y-2'>
                {members.map(member => (
                  <div
                    key={member.id}
                    className='flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <Avatar src={member.avatar} name={member.name} size='md' />
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium text-foreground'>{member.name}</span>
                          {member.isOwner && (
                            <span className='flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full'>
                              <Crown className='w-3 h-3' />
                            </span>
                          )}
                        </div>
                        <span className='text-sm text-gray-500'>{member.email}</span>
                      </div>
                    </div>
                    {isOwner && !member.isOwner && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => handleActionClick(member)}
                        className='text-red-500 hover:text-red-600 hover:bg-red-50'
                      >
                        <UserMinus className='w-4 h-4' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isOwner && (
              <div className='pt-4 border-t border-gray-200'>
                <form onSubmit={form.handleSubmit(handleInvite)} className='space-y-3'>
                  <div className='space-y-2'>
                    <Label htmlFor='email' className='flex items-center gap-2'>
                      <Mail className='w-4 h-4 text-primary' />
                      邀请新成员
                    </Label>
                    <div className='flex gap-2'>
                      <Input
                        id='email'
                        type='email'
                        placeholder='输入邮箱地址'
                        {...form.register('email')}
                        disabled={inviteMember.isPending}
                        className={
                          form.formState.errors.email ? 'border-red-500 ring-1 ring-red-500' : ''
                        }
                      />
                      <Button
                        type='submit'
                        disabled={inviteMember.isPending}
                        className='bg-primary/80 hover:bg-primary text-white whitespace-nowrap'
                      >
                        {inviteMember.isPending ? '发送中...' : '发送邀请'}
                      </Button>
                    </div>
                    {form.formState.errors.email && (
                      <p className='text-sm text-red-500'>{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={open => setConfirmDialog(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent className='max-w-md'>
          <AlertDialogHeader>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
                <UserMinus className='h-5 w-5 text-red-600' />
              </div>
              <AlertDialogTitle className='text-lg'>确认移除成员？</AlertDialogTitle>
            </div>
            <AlertDialogDescription className='ml-13 pl-2'>
              将移除成员 <span className='font-medium'>{confirmDialog.member?.name}</span>
              ，此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-honey-300 text-foreground hover:bg-honey-100'>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={removeMember.isPending}
              className='bg-red-500 hover:bg-red-600 text-white'
            >
              {removeMember.isPending ? '处理中...' : '确认移除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
