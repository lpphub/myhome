import { type RefObject, useEffect } from 'react'

/**
 * Hook to detect clicks outside a component
 * @param ref - Reference to the element to check for outside clicks
 * @param callback - Function to call when clicking outside
 * @param enabled - Whether the click outside detection is active (default: true)
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return

    const handleClick = (e: MouseEvent) => {
      if (ref?.current && !ref.current.contains(e.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, callback, enabled])
}
