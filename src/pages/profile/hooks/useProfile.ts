import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { changePassword, updateUserProfile } from '@/api/user'
import { useAuth } from '@/hooks'
import type { ChangePasswordRequest, UpdateProfileRequest } from '@/types/auth'

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { login } = useAuth()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateUserProfile(data),
    onSuccess: res => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      if (res.user) {
        login({
          user: res.user,
          accessToken: '',
          refreshToken: '',
        })
      }
      toast.success('保存成功 ✨')
    },
    onError: () => {
      toast.error('保存失败，请重试')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onSuccess: () => {
      toast.success('密码修改成功 ✨')
    },
    onError: () => {
      toast.error('密码修改失败，请检查原密码是否正确')
    },
  })
}
