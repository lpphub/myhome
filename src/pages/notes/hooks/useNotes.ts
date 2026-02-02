import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { queryKeys, withToast } from '@/lib/query-helpers'
import { useSpace } from '@/pages/spaces/contexts/SpaceContext'
import { createNote, deleteNote, getNotes, updateNote } from '@/services/notes'
import type { CursorPageData, GetNotesQuery, Note } from '@/types/notes'

/* --------------------------------
 * Query（server state）
 * -------------------------------- */
export function useNotesQuery(params: Omit<GetNotesQuery, 'cursor' | 'spaceId'>) {
  const { spaceId } = useSpace()

  return useInfiniteQuery({
    queryKey: queryKeys.notes(spaceId),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getNotes({
        ...params,
        cursor: pageParam,
        spaceId: spaceId ?? 0,
      }),
    initialPageParam: '',
    getNextPageParam: (lastPage: CursorPageData<Note>) => lastPage.nextCursor,
    enabled: !!spaceId,
    staleTime: 3 * 60 * 1000,
  })
}

export function useNotesScrollQuery(limit = 10) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotesQuery({
    limit,
  })

  const observer = useRef<IntersectionObserver | null>(null)

  // 绑定最后一个元素
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      setTimeout(() => {
        if (node) observer.current?.observe(node)
      }, 10)
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  return {
    data,
    fetchNextPage,
    sentinelRef,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
  }
}

/* --------------------------------
 * Mutations（server effect）
 * - update 使用乐观更新，create/delete 仍使用重新查询
 * -------------------------------- */

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()
  const { spaceId } = useSpace()

  return useMutation(
    withToast(
      {
        mutationFn: createNote,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.notes(spaceId) })
        },
      },
      'create'
    )
  )
}

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient()
  const { spaceId } = useSpace()

  return useMutation(
    withToast(
      {
        mutationFn: updateNote,
        onMutate: async updatedNote => {
          // 取消正在进行的查询，避免覆盖我们的乐观更新
          await queryClient.cancelQueries({ queryKey: queryKeys.notes(spaceId) })

          // 保存当前数据用于回滚
          const previous = queryClient.getQueryData(queryKeys.notes(spaceId))

          // 乐观更新缓存
          queryClient.setQueryData(
            queryKeys.notes(spaceId),
            (
              old: { pages: CursorPageData<Note>[]; pageParams: (string | undefined)[] } | undefined
            ) => {
              if (!old) return old

              return {
                ...old,
                pages: old.pages.map(page => ({
                  ...page,
                  list: page.list.map((note: Note) =>
                    note.id === updatedNote.id ? { ...note, ...updatedNote } : note
                  ),
                })),
              }
            }
          )

          return { previous }
        },
        onError: (_err, _variables, context) => {
          // 出错时回滚到之前的数据
          if (context?.previous) {
            queryClient.setQueryData(queryKeys.notes(spaceId), context.previous)
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.notes(spaceId) })
        },
      },
      'update'
    )
  )
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient()
  const { spaceId } = useSpace()

  return useMutation(
    withToast(
      {
        mutationFn: deleteNote,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.notes(spaceId) })
        },
      },
      'delete'
    )
  )
}
