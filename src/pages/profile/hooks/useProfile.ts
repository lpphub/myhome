import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { changePassword, updateUserProfile } from '@/api/user'
import { useAuth } from '@/hooks'

export function useUpdateProfile() {
  const { updateUserPartial } = useAuth()

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (_, variables) => {
      updateUserPartial(variables)
      toast.success('保存成功 ✨')
    },
    onError: () => {
      toast.error('保存失败，请重试')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('密码修改成功 ✨')
    },
    onError: () => {
      toast.error('密码修改失败，请检查原密码是否正确')
    },
  })
}
