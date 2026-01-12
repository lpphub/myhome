import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import {
  createSpace,
  deleteSpace,
  getPendingInvites,
  getSpaceMembers,
  getSpaces,
  inviteSpaceMember,
  removeSpaceMember,
  respondInvite,
  togglePinSpace,
  updateSpace,
} from '@/api/spaces'
import type { Space } from '@/types/spaces'

const SPACES_QUERY_KEY = ['spaces'] as const
const MEMBERS_QUERY_KEY = (spaceId: number) => ['spaces', spaceId, 'members'] as const
const INVITES_QUERY_KEY = ['invites', 'pending'] as const

export function useSpaces() {
  return useQuery({
    queryKey: SPACES_QUERY_KEY,
    queryFn: getSpaces,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function usePinnedSpaceId() {
  const { data: spaces, isLoading } = useSpaces()

  const pinnedId = useMemo(() => spaces?.find(s => s.pin)?.id, [spaces])

  return { pinnedId, isLoading }
}

export function useCreateSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACES_QUERY_KEY })
      toast.success('创建成功')
    },
    onError: () => {
      toast.error('创建失败')
    },
  })
}

export function useUpdateSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSpace,
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: SPACES_QUERY_KEY })

      const previous = queryClient.getQueryData<Space[]>(SPACES_QUERY_KEY)

      queryClient.setQueryData<Space[]>(SPACES_QUERY_KEY, prev => {
        if (!prev) return []
        return prev.map(s => (s.id === data.id ? { ...s, ...data } : s))
      })

      return { previous }
    },
    onSuccess: () => {
      toast.success('更新成功')
    },
    onError: (_error, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SPACES_QUERY_KEY, context.previous)
      }
      toast.error('更新失败')
    },
  })
}

export function useDeleteSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSpace,
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: SPACES_QUERY_KEY })

      const previous = queryClient.getQueryData<Space[]>(SPACES_QUERY_KEY)

      queryClient.setQueryData<Space[]>(SPACES_QUERY_KEY, prev => {
        if (!prev) return []
        return prev.filter(s => s.id !== id)
      })

      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SPACES_QUERY_KEY, context.previous)
      }
      toast.error('删除失败')
    },
  })
}

export function useTogglePinSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: togglePinSpace,
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: SPACES_QUERY_KEY })

      const previous = queryClient.getQueryData<Space[]>(SPACES_QUERY_KEY)

      queryClient.setQueryData<Space[]>(SPACES_QUERY_KEY, prev => {
        if (!prev) return []

        const target = prev.find(s => s.id === id)
        const newPin = !target?.pin

        return prev.map(s =>
          s.id === id ? { ...s, pin: newPin } : newPin ? { ...s, pin: false } : s
        )
      })

      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SPACES_QUERY_KEY, context.previous)
      }
      toast.error('设置失败')
    },
  })
}

export function useSpaceMembers(spaceId: number) {
  return useQuery({
    queryKey: MEMBERS_QUERY_KEY(spaceId),
    queryFn: () => getSpaceMembers(spaceId),
    staleTime: 1 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
    enabled: !!spaceId,
  })
}

export function useInviteSpaceMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ spaceId, email }: { spaceId: number; email: string }) =>
      inviteSpaceMember(spaceId, email),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY(variables.spaceId) })
      toast.success('邀请已发送')
    },
    onError: () => {
      toast.error('邀请失败')
    },
  })
}

export function useRemoveSpaceMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ spaceId, userId }: { spaceId: number; userId: number }) =>
      removeSpaceMember(spaceId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY(variables.spaceId) })
    },
    onError: () => {
      toast.error('移除失败')
    },
  })
}

export function usePendingInvites() {
  return useQuery({
    queryKey: INVITES_QUERY_KEY,
    queryFn: getPendingInvites,
    staleTime: 30 * 1000,
    gcTime: 1 * 60 * 1000,
  })
}

export function useRespondInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ inviteId, action }: { inviteId: number; action: 'accept' | 'reject' }) =>
      respondInvite(inviteId, action),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: INVITES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SPACES_QUERY_KEY })
      const message = variables.action === 'accept' ? '已加入空间' : '已拒绝邀请'
      toast.success(message)
    },
    onError: () => {
      toast.error('操作失败')
    },
  })
}
