
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  parseWindowsFromUrl, 
  addWindowToUrl, 
  removeWindowFromUrl, 
  updateActiveWindowUrl,
  isValidWindowId
} from '@/lib/routeUtils'

export interface UseWindowRouterReturn {
  openWindows: string[]
  activeWindow: string | null
  openWindow: (windowId: string) => void
  closeWindow: (windowId: string) => void
  activateWindow: (windowId: string) => void
  isWindowOpen: (windowId: string) => boolean
}

export function useWindowRouter(): UseWindowRouterReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [openWindows, setOpenWindows] = useState<string[]>([])
  const [activeWindow, setActiveWindow] = useState<string | null>(null)

  useEffect(() => {
    const routeState = parseWindowsFromUrl(searchParams)
    setOpenWindows(routeState.windows.map(w => w.id))
    setActiveWindow(routeState.activeWindow)
  }, [searchParams])

  const openWindow = useCallback((windowId: string) => {
    if (!isValidWindowId(windowId)) {
      console.warn(`Invalid window ID: ${windowId}`)
      return
    }

    setOpenWindows(prev => {
      const newWindows = prev.includes(windowId) ? prev : [...prev, windowId]
      const newUrl = addWindowToUrl(newWindows, windowId, activeWindow)
      router.push(newUrl, { scroll: false })
      return newWindows
    })
    
    setActiveWindow(windowId)
  }, [router, activeWindow])

  const closeWindow = useCallback((windowId: string) => {
    setOpenWindows(prev => {
      const newWindows = prev.filter(id => id !== windowId)
      const newUrl = removeWindowFromUrl(prev, windowId, activeWindow)
      router.push(newUrl, { scroll: false })
      
      if (activeWindow === windowId) {
        const newActiveWindow = newWindows.length > 0 ? newWindows[newWindows.length - 1] : null
        setActiveWindow(newActiveWindow)
      }
      
      return newWindows
    })
  }, [router, activeWindow])

  const activateWindow = useCallback((windowId: string) => {
    if (!openWindows.includes(windowId)) {
      openWindow(windowId)
      return
    }

    setActiveWindow(windowId)
    const newUrl = updateActiveWindowUrl(openWindows, windowId)
    router.push(newUrl, { scroll: false })
  }, [router, openWindows, openWindow])

  const isWindowOpen = useCallback((windowId: string) => {
    return openWindows.includes(windowId)
  }, [openWindows])

  return {
    openWindows,
    activeWindow,
    openWindow,
    closeWindow,
    activateWindow,
    isWindowOpen
  }
}

export function useWindowRouterWithHistory() {
  const windowRouter = useWindowRouter()
  const [history, setHistory] = useState<string[]>([])

  const openWindowWithHistory = useCallback((windowId: string) => {
    windowRouter.openWindow(windowId)
    setHistory(prev => [...prev, windowId])
  }, [windowRouter])

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const prevWindow = history[history.length - 2]
      windowRouter.activateWindow(prevWindow)
      setHistory(prev => prev.slice(0, -1))
    }
  }, [history, windowRouter])

  return {
    ...windowRouter,
    openWindow: openWindowWithHistory,
    goBack,
    canGoBack: history.length > 1,
    history
  }
}