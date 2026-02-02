import { useCallback, useState } from 'react'

/**
 * Hook for managing dialog state with optional data
 * @param initialData - Optional initial data for the dialog
 * @returns Dialog state and handlers
 */
export function useDialogState<T>(initialData?: T) {
  const [state, setState] = useState<{ open: boolean; data?: T }>({
    open: false,
    data: initialData,
  })

  const openWithData = useCallback((data?: T) => {
    setState({ open: true, data })
  }, [])

  const close = useCallback(() => {
    setState({ open: false, data: undefined })
  }, [])

  return { ...state, openWithData, close }
}
