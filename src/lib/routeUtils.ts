
export interface WindowState {
  id: string
  title: string
  active?: boolean
}

export interface RouteState {
  windows: WindowState[]
  activeWindow: string | null
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

export function encodeWindowsToUrl(windows: string[], activeWindow: string | null): string {
  const params = new URLSearchParams()
  
  if (windows.length > 0) {
    params.set('windows', windows.join(','))
  }
  
  if (activeWindow) {
    params.set('active', activeWindow)
  }
  
  return params.toString()
}

export function getWindowTitle(windowId: string): string {
  const titles: Record<string, string> = {
    'ai': 'Chat',
    'mint': 'Mint',
    'pharos': 'My Pharos',
    'dashboard': 'My Gotchipus',
    'wearable': 'Claim Wearable',
    'daily-task-hall': 'Daily Task Hall',
  }
  return titles[windowId] || windowId
}

export function isValidWindowId(windowId: string): boolean {
  const validIds = ['ai', 'mint', 'pharos', 'dashboard', 'wearable', 'daily-task-hall']
  return validIds.includes(windowId)
}

export function generateWindowUrl(windowId: string, baseUrl: string = ''): string {
  if (!isValidWindowId(windowId)) {
    return baseUrl || '/'
  }
  
  return `${baseUrl}/?windows=${windowId}&active=${windowId}`
}

export function addWindowToUrl(
  currentWindows: string[], 
  newWindowId: string, 
  activeWindow: string | null
): string {
  const updatedWindows = currentWindows.includes(newWindowId) 
    ? currentWindows 
    : [...currentWindows, newWindowId]
  
  return `/?${encodeWindowsToUrl(updatedWindows, activeWindow || newWindowId)}`
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

  if (updatedWindows.length === 0) {
    return '/'
  }

  return `/?${encodeWindowsToUrl(updatedWindows, newActiveWindow)}`
}

export function updateActiveWindowUrl(
  currentWindows: string[], 
  newActiveWindow: string
): string {
  if (!currentWindows.includes(newActiveWindow)) {
    return addWindowToUrl(currentWindows, newActiveWindow, newActiveWindow)
  }
  
  return `/?${encodeWindowsToUrl(currentWindows, newActiveWindow)}`
}