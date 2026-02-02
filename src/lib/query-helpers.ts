import type { QueryClient, UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * 查询键函数
 */
export const queryKeys = {
  // 用户维度查询键
  spaces: (userId: number | null) => ['spaces', userId],
  pendingInvites: (userId: number | null) => ['invites', userId, 'pending'],
  // 空间维度查询键
  spaceMembers: (spaceId: number) => ['members', spaceId],
  tags: (spaceId: number | undefined) => (spaceId ? ['tags', spaceId] : ['tags']),
  notes: (spaceId?: number) => (spaceId ? ['notes', spaceId] : ['notes']),
}

/**
 * 操作成功/失败提示消息
 */
const toastMessages = {
  create: { success: '创建成功', error: '创建失败' },
  update: { success: '更新成功', error: '更新失败' },
  delete: { success: '删除成功', error: '删除失败' },
  invite: { success: '邀请已发送', error: '邀请失败' },
  accept: { success: '已加入空间', error: '操作失败' },
  reject: { success: '已拒绝邀请', error: '操作失败' },
  remove: { success: '移除成功', error: '移除失败' },
  operation: { success: '操作成功', error: '操作失败' },
} as const

export type ToastMessageKey = keyof typeof toastMessages

/* ============================================================
 * withToast
 * - 可选 UI 副作用
 * - 不侵入业务
 * ============================================================ */
export function withToast<TData, TError, TVariables, TContext>(
  mutationOptions?: UseMutationOptions<TData, TError, TVariables, TContext>,
  messageOptions?: ToastMessageKey | { success?: string; error?: string }
): UseMutationOptions<TData, TError, TVariables, TContext> {
  const messages =
    typeof messageOptions === 'string' ? toastMessages[messageOptions] : messageOptions

  return {
    ...mutationOptions,
    onSuccess: (...args) => {
      mutationOptions?.onSuccess?.(...args)

      if (messages?.success) toast.success(messages.success)
    },
    onError: (...args) => {
      mutationOptions?.onError?.(...args)

      if (messages?.error) toast.error(messages.error)
    },
  }
}

/* ============================================================
 * withOptimisticUpdate
 * - 三段式乐观更新
 * - 不包含 onSuccess（刻意设计）
 * ============================================================ */
export function withOptimisticUpdate<
  TQueryData,
  TVariables = void,
  TMutationData = unknown,
>(options: {
  queryClient: QueryClient
  /** 被乐观更新的主 query */
  queryKey: readonly unknown[]
  /** 乐观更新逻辑（只处理已有数据） */
  updater: (old: TQueryData, vars: TVariables) => TQueryData
  /** 额外需要刷新的 query（可选） */
  invalidate?: readonly (readonly unknown[])[]
}): UseMutationOptions<TMutationData, unknown, TVariables, { previous?: TQueryData }> {
  const { queryClient, queryKey, updater, invalidate = [] } = options

  return {
    /** 1️⃣ 假装成功（立即更新 UI） */
    onMutate: async vars => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<TQueryData>(queryKey)

      if (previous) {
        queryClient.setQueryData<TQueryData>(queryKey, updater(previous, vars))
      }

      return { previous }
    },

    /** 2️⃣ 失败回滚 */
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous)
      }
    },

    /** 3️⃣ 最终一致性 */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })

      invalidate.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  }
}

/* ============================================================
 * mergeMutationOptions
 * - 解决 React Query 回调覆盖问题
 * - 允许多个 options 安全组合
 * ============================================================ */
export function mergeMutationOptions<TData, TError, TVariables, TContext>(
  ...options: Array<UseMutationOptions<TData, TError, TVariables, TContext> | undefined>
): UseMutationOptions<TData, TError, TVariables, TContext> {
  const result: UseMutationOptions<TData, TError, TVariables, TContext> = {}

  for (const cur of options) {
    if (!cur) continue

    // 先缓存旧 handler
    const prevOnSuccess = result.onSuccess
    const prevOnError = result.onError
    const prevOnSettled = result.onSettled

    // 普通字段直接覆盖（这是预期行为）
    Object.assign(result, cur)

    // 手动合并回调（不使用 spread）
    if (prevOnSuccess || cur.onSuccess) {
      result.onSuccess = (...args) => {
        prevOnSuccess?.(...args)
        cur.onSuccess?.(...args)
      }
    }

    if (prevOnError || cur.onError) {
      result.onError = (...args) => {
        prevOnError?.(...args)
        cur.onError?.(...args)
      }
    }

    if (prevOnSettled || cur.onSettled) {
      result.onSettled = (...args) => {
        prevOnSettled?.(...args)
        cur.onSettled?.(...args)
      }
    }
  }

  return result
}
