import { getWindowIcon, isValidWindowId as isValidWindowIdFromConfig } from './windowConfig'

export interface WindowState {
  id: string
  title: string
  active?: boolean
}

export interface RouteState {
  windows: WindowState[]
  activeWindow: string | null
}

export function parseWindowsFromPath(pathname: string, searchParams: URLSearchParams): RouteState {
  const pathParts = pathname.split('/').filter(Boolean)
  const activeParam = searchParams.get('active')
  
  if (pathParts.length === 0) {
    return { windows: [], activeWindow: null }
  }

  const validWindowIds = pathParts.filter(id => isValidWindowId(id))
  
  if (validWindowIds.length === 0) {
    return { windows: [], activeWindow: null }
  }

  const activeWindow = activeParam || validWindowIds[0]
  const windows = validWindowIds.map(id => ({
    id: id.trim(),
    title: getWindowTitle(id.trim()),
    active: id.trim() === activeWindow
  }))

  return {
    windows,
    activeWindow: activeWindow
  }
}

export function parseWindowsFromUrl(searchParams: URLSearchParams): RouteState {
  const windowsParam = searchParams.get('windows')
  const activeParam = searchParams.get('active')
  
  if (!windowsParam) {
    return { windows: [], activeWindow: null }
  }

  const windowIds = windowsParam.split(',').filter(Boolean)
  const windows = windowIds.map(id => ({
    id: id.trim(),
    title: getWindowTitle(id.trim()),
    active: id.trim() === activeParam
  }))

  return {
    windows,
    activeWindow: activeParam || (windows.length > 0 ? windows[0].id : null)
  }
}

export function getWindowTitle(windowId: string): string {
  const icon = getWindowIcon(windowId)
  return icon?.title || windowId
}

export function isValidWindowId(windowId: string): boolean {
  return isValidWindowIdFromConfig(windowId)
}

export function generateWindowUrl(windowId: string, baseUrl: string = ''): string {
  if (!isValidWindowId(windowId)) {
    return baseUrl || '/'
  }
  
  return `${baseUrl}/${windowId}`
}

export function encodeWindowsToPath(windows: string[], activeWindow: string | null): string {
  if (windows.length === 0) {
    return '/'
  }

  const validWindows = windows.filter(id => isValidWindowId(id))
  if (validWindows.length === 0) {
    return '/'
  }

  const active = activeWindow || validWindows[0]
  const needsActiveParam = active !== validWindows[0]

  const path = '/' + validWindows.join('/')
  if (needsActiveParam) {
    return `${path}?active=${active}`
  }

  return path
}

export function addWindowToUrl(
  currentWindows: string[], 
  newWindowId: string, 
  activeWindow: string | null
): string {
  const updatedWindows = currentWindows.includes(newWindowId) 
    ? currentWindows 
    : [...currentWindows, newWindowId]
  
  return encodeWindowsToPath(updatedWindows, activeWindow || newWindowId)
}

export function removeWindowFromUrl(
  currentWindows: string[], 
  windowIdToRemove: string, 
  activeWindow: string | null
): string {
  const updatedWindows = currentWindows.filter(id => id !== windowIdToRemove)
  const newActiveWindow = activeWindow === windowIdToRemove 
    ? (updatedWindows.length > 0 ? updatedWindows[updatedWindows.length - 1] : null)
    : activeWindow

  return encodeWindowsToPath(updatedWindows, newActiveWindow)
}

export function updateActiveWindowUrl(
  currentWindows: string[], 
  newActiveWindow: string
): string {
  if (!currentWindows.includes(newActiveWindow)) {
    return addWindowToUrl(currentWindows, newActiveWindow, newActiveWindow)
  }
  
  return encodeWindowsToPath(currentWindows, newActiveWindow)
}