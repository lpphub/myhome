import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { changePassword, updateUserProfile } from '@/api/user'
import { useAuth } from '@/hooks'
import type { ChangePasswordForm, UpdateProfileForm } from '@/types/auth'

export function useUpdateProfile() {
  const { updateUser } = useAuth()

  return useMutation({
    mutationFn: (data: UpdateProfileForm) => updateUserProfile(data),
    onSuccess: res => {
      if (res) {
        updateUser(res)
      }
    },
    onError: () => {
      toast.error('保存失败，请重试')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordForm) => changePassword(data),
    onSuccess: () => {
      toast.success('密码修改成功 ✨')
    },
    onError: () => {
      toast.error('密码修改失败，请检查原密码是否正确')
    },
  })
}
