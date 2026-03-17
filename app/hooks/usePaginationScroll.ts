import { useEffect, useRef } from 'react'
import { useNavigation } from 'react-router'

import { windowSmoothScroll } from '~/utils/scroll'

/**
 * Hook for handling scroll behavior on pagination page changes
 * @param currentPage - Current page number
 * @param targetId - ID of the element to scroll to (without #)
 * @param options - Optional configuration
 */
export const usePaginationScroll = (
  currentPage: number | string,
  targetId: string,
  options?: {
    scrollDelay?: number
    skipInitialMount?: boolean
  }
) => {
  const navigation = useNavigation()
  const prevPageRef = useRef<number | string | null>(null)
  const isInitialMount = useRef(true)

  const { scrollDelay = 100, skipInitialMount = true } = options ?? {}

  useEffect(() => {
    // Skip scroll on initial mount if configured
    if (skipInitialMount && isInitialMount.current) {
      isInitialMount.current = false
      prevPageRef.current = currentPage
      return
    }

    // Check if page actually changed
    if (prevPageRef.current === currentPage) {
      return
    }

    // Wait for navigation to complete before scrolling
    if (navigation.state !== 'idle') {
      return
    }

    // Store current page for next comparison
    prevPageRef.current = currentPage

    // Delay scroll to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      windowSmoothScroll({
        target: `#${targetId}`,
      })
    }, scrollDelay)

    return () => clearTimeout(timeoutId)
  }, [currentPage, targetId, navigation.state, scrollDelay, skipInitialMount])
}
