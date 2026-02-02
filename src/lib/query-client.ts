import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { env } from '@/utils/env'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 10 * 60 * 1000,
      staleTime: 30 * 1000,
      networkMode: 'online' as const,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retryOnMount: true,
      retry: 1,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      networkMode: 'online' as const,
      retry: 0,
    },
  },
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      if (env.IS_DEV) {
        console.error('Mutation error:', error)
      }
    },
  }),
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (env.IS_DEV) {
        console.error('Query error:', error)
      }
    },
  }),
})
