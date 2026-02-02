import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { queryKeys, withOptimisticUpdate, withToast } from '@/lib/query-helpers'
import {
  createSpace,
  deleteSpace,
  getPendingInvites,
  getSpaceMembers,
  getSpaces,
  inviteSpaceMember,
  removeSpaceMember,
  respondInvite,
  updateSpace,
} from '@/services/spaces'
import type { Space, SpaceForm } from '@/types/spaces'

const MEMBERS_QUERY_KEY = (spaceId: number) => queryKeys.spaceMembers(spaceId)

export function useSpaceQuery(options?: { enabled?: boolean }) {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.spaces(user?.id ?? null),
    queryFn: getSpaces,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  })
}

export function useSpaceMembersQuery(spaceId: number) {
  return useQuery({
    queryKey: MEMBERS_QUERY_KEY(spaceId),
    queryFn: () => getSpaceMembers(spaceId),
    staleTime: 1 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
    enabled: !!spaceId,
  })
}

export function useCreateSpace() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation(
    withToast(
      {
        mutationFn: createSpace,
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: queryKeys.spaces(user?.id ?? null) }),
      },
      'create'
    )
  )
}

export function useUpdateSpace() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const queryKey = queryKeys.spaces(user?.id ?? null)

  return useMutation(
    withToast(
      {
        mutationFn: updateSpace,
        ...withOptimisticUpdate<Space[], SpaceForm>({
          queryClient,
          queryKey,
          updater: (prev, data) => prev.map(s => (s.id === data.id ? { ...s, ...data } : s)),
        }),
      },
      'update'
    )
  )
}

export function useDeleteSpace() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const queryKey = queryKeys.spaces(user?.id ?? null)

  return useMutation(
    withToast(
      {
        mutationFn: deleteSpace,
        ...withOptimisticUpdate<Space[], number>({
          queryClient,
          queryKey,
          updater: (prev, id) => prev.filter(s => s.id !== id),
        }),
      },
      { error: '删除失败' }
    )
  )
}

export function useInviteSpaceMember() {
  const queryClient = useQueryClient()

  return useMutation(
    withToast(
      {
        mutationFn: ({ spaceId, emails }: { spaceId: number; emails: string[] }) =>
          inviteSpaceMember(spaceId, emails),
        onSuccess: (_data, variables) => {
          queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY(variables.spaceId) })
        },
      },
      'invite'
    )
  )
}

export function useRemoveSpaceMember() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ spaceId, userId }: { spaceId: number; userId: number }) =>
      removeSpaceMember(spaceId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY(variables.spaceId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.spaces(user?.id ?? null) })
    },
    onError: () => {
      toast.error('移除失败')
    },
  })
}

export function usePendingInvitesQuery() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.pendingInvites(user?.id ?? null),
    queryFn: getPendingInvites,
    staleTime: 30 * 1000,
    gcTime: 1 * 60 * 1000,
  })
}

export function useRespondInvite() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ inviteId, action }: { inviteId: number; action: 'accept' | 'reject' }) =>
      respondInvite(inviteId, action),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingInvites(user?.id ?? null) })
      queryClient.invalidateQueries({ queryKey: queryKeys.spaces(user?.id ?? null) })
      const message = variables.action === 'accept' ? '已加入空间' : '已拒绝邀请'
      toast.success(message)
    },
    onError: () => {
      toast.error('操作失败')
    },
  })
}
