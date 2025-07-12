
import { useCallback, useEffect, useLayoutEffect, useState, useRef } from 'react'
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
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!isInitialized.current) {
      const routeState = parseWindowsFromUrl(searchParams)
      setOpenWindows(routeState.windows.map(w => w.id))
      setActiveWindow(routeState.activeWindow)
      isInitialized.current = true
    }
  }, [searchParams])

  const openWindow = useCallback((windowId: string) => {
    if (!isValidWindowId(windowId)) {
      console.warn(`Invalid window ID: ${windowId}`)
      return
    }

    const newWindows = openWindows.includes(windowId) ? openWindows : [...openWindows, windowId]
    
    setOpenWindows(newWindows)
    setActiveWindow(windowId)
    
    const newUrl = addWindowToUrl(newWindows, windowId, activeWindow)
    router.push(newUrl, { scroll: false })
  }, [router, activeWindow, openWindows])

  const closeWindow = useCallback((windowId: string) => {
    const newWindows = openWindows.filter(id => id !== windowId)
    const newActiveWindow = activeWindow === windowId ? 
      (newWindows.length > 0 ? newWindows[newWindows.length - 1] : null) : 
      activeWindow
    
    setOpenWindows(newWindows)
    setActiveWindow(newActiveWindow)
    
    const newUrl = removeWindowFromUrl(openWindows, windowId, activeWindow)
    router.push(newUrl, { scroll: false })
  }, [router, activeWindow, openWindows])

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