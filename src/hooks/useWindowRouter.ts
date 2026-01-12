import { useCallback, useEffect, useState, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { 
  parseWindowsFromPath,
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
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [openWindows, setOpenWindows] = useState<string[]>([])
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    const refreshParam = searchParams.get('refresh')
    const hasRefresh = !!refreshParam
    
    if (!isInitialized.current || hasRefresh) {
      const pathBasedState = parseWindowsFromPath(pathname, searchParams)
      
      if (pathBasedState.windows.length > 0) {
        setOpenWindows(pathBasedState.windows.map(w => w.id))
        setActiveWindow(pathBasedState.activeWindow)
      } else {
        const queryBasedState = parseWindowsFromUrl(searchParams)
        if (queryBasedState.windows.length > 0) {
          setOpenWindows(queryBasedState.windows.map(w => w.id))
          setActiveWindow(queryBasedState.activeWindow)
          const newPath = updateActiveWindowUrl(queryBasedState.windows.map(w => w.id), queryBasedState.activeWindow || '')
          window.history.replaceState({}, '', newPath)
        }
      }
      
      isInitialized.current = true
    }
  }, [pathname, searchParams])

  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href)
      const pathBasedState = parseWindowsFromPath(url.pathname, url.searchParams)
      if (pathBasedState.windows.length > 0) {
        setOpenWindows(pathBasedState.windows.map(w => w.id))
        setActiveWindow(pathBasedState.activeWindow)
      } else {
        setOpenWindows([])
        setActiveWindow(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const openWindow = useCallback((windowId: string) => {
    if (!isValidWindowId(windowId)) {
      console.warn(`Invalid window ID: ${windowId}`)
      return
    }

    const newWindows = openWindows.includes(windowId) ? openWindows : [...openWindows, windowId]
    
    setOpenWindows(newWindows)
    setActiveWindow(windowId)
    
    const newUrl = addWindowToUrl(newWindows, windowId, activeWindow)
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    if (currentUrl !== newUrl && newUrl !== '/') {
      window.history.pushState({}, '', newUrl)
    }
  }, [pathname, searchParams, activeWindow, openWindows])

  const closeWindow = useCallback((windowId: string) => {
    const newWindows = openWindows.filter(id => id !== windowId)
    const newActiveWindow = activeWindow === windowId ? 
      (newWindows.length > 0 ? newWindows[newWindows.length - 1] : null) : 
      activeWindow
    
    setOpenWindows(newWindows)
    setActiveWindow(newActiveWindow)
    
    const newUrl = removeWindowFromUrl(openWindows, windowId, activeWindow)
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    if (currentUrl !== newUrl) {
      window.history.pushState({}, '', newUrl)
    }
  }, [pathname, searchParams, activeWindow, openWindows])

  const activateWindow = useCallback((windowId: string) => {
    if (!openWindows.includes(windowId)) {
      openWindow(windowId)
      return
    }

    setActiveWindow(windowId)
    
    const newUrl = updateActiveWindowUrl(openWindows, windowId)
    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    if (currentUrl !== newUrl && newUrl !== '/') {
      window.history.pushState({}, '', newUrl)
    }
  }, [pathname, searchParams, openWindows, openWindow])

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