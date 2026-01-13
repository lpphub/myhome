import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useSpaceQuery } from './useSpaces'

export function useCurrentSpaceId() {
  const [searchParams] = useSearchParams()
  const { data: spaces, isLoading } = useSpaceQuery()
  const pinnedId = useMemo(() => spaces?.find(s => s.pin)?.id, [spaces])

  const spaceId = useMemo(() => {
    const fromQuery = searchParams.get('spaceId')
    if (fromQuery) {
      const parsed = Number(fromQuery)
      return Number.isNaN(parsed) ? undefined : parsed
    }
    return pinnedId
  }, [searchParams, pinnedId])

  return { spaceId, isLoading }
}
