"use client"

import { useState, useEffect, useCallback } from "react"
import { useWindowRouter } from "@/hooks/useWindowRouter"
import useResponsive from "@/hooks/useResponsive"
import Desktop from "@/components/home/Desktop"
import Taskbar from "@/components/home/Taskbar"
import Window from "@/components/home/Window"
import type { WindowType } from "@/lib/types"
import type { JSX } from "react/jsx-runtime"
import { WINDOW_SIZE } from "@/lib/constant"
import { getWindowIcon, getWindowContent } from "@/lib/windowConfig"
import { WINDOW_OPEN_EVENT, type WindowOpenEventDetail } from "@/lib/windowEvents"

export const runtime = 'edge';

export default function CatchAllPage() {
  const [openWindows, setOpenWindows] = useState<WindowType[]>([])
  const [zIndexCounter, setZIndexCounter] = useState(100)
  const isMobile = useResponsive()
  const windowRouter = useWindowRouter() 

  useEffect(() => {
    setOpenWindows(prev => {
      const shouldKeep = prev.filter(window => 
        windowRouter.openWindows.includes(window.id)
      )
      return shouldKeep
    })
  }, [windowRouter.openWindows])

  const handleCloseWindow = (windowId: string) => {
    windowRouter.closeWindow(windowId)
  }

  const handleMinimizeWindow = (windowId: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, minimized: true } : w)))
  }

  const handleRestoreWindow = (windowId: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, minimized: false } : w)))
    handleActivateWindow(windowId)
  }

  const handleMoveWindow = (windowId: string, position: { x: number; y: number }) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, position } : w)))
  }

  const handleActivateWindow = useCallback((windowId: string) => {
    let newZIndex = zIndexCounter;
    if (windowId === "wallet-connect-tba") {
      newZIndex = Math.max(zIndexCounter, 1000);
    }
    
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, zIndex: newZIndex, minimized: false } : w)),
    )
    setZIndexCounter((prev) => Math.max(prev + 1, newZIndex + 1))
    
    windowRouter.activateWindow(windowId)
  }, [zIndexCounter, windowRouter])

  const handleOpenWindow = useCallback((windowId: string, title: string, content: JSX.Element, icon?: string) => {
    setOpenWindows((prev) => {
      if (prev.some((w) => w.id === windowId)) {
        handleActivateWindow(windowId)
        return prev
      }

      let size = { 
        width: WINDOW_SIZE[windowId as keyof typeof WINDOW_SIZE].width, 
        height: WINDOW_SIZE[windowId as keyof typeof WINDOW_SIZE].height 
      }

      let position: { x: number; y: number }

      if (isMobile) {
        size = {
          width: Math.min(window.innerWidth - 20, 400),
          height: Math.min(window.innerHeight - 120, 600)
        }
        
        if (windowId === "wallet-connect-tba") {
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          position = {
            x: Math.max(5, (screenWidth - size.width) / 2),
            y: Math.max(40, (screenHeight - size.height) / 2)
          };
        } else {
          position = { x: 10, y: 60 }
        }
      } else {
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const centerX = Math.max(0, (screenWidth - size.width) / 2)
        const centerY = Math.max(0, (screenHeight - size.height) / 2)
        
        const offset = prev.length * 20
        position = { 
          x: centerX + offset, 
          y: centerY + offset 
        }
      }

      let windowZIndex = zIndexCounter;
      if (windowId === "wallet-connect-tba") {
        windowZIndex = Math.max(zIndexCounter, 5000);
      }

      const newWindow: WindowType = {
        id: windowId,
        title,
        icon,
        content,
        position,
        size,
        zIndex: windowZIndex,
        minimized: false,
      }

      setZIndexCounter((current) => Math.max(current + 1, windowZIndex + 1))
      
      if (!windowRouter.openWindows.includes(windowId)) {
        windowRouter.openWindow(windowId)
      }

      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          handleActivateWindow(windowId)
        })
      } else {
        handleActivateWindow(windowId)
      }

      return [...prev, newWindow]
    })
  }, [isMobile, zIndexCounter, windowRouter, handleActivateWindow])

  useEffect(() => {
    windowRouter.openWindows.forEach(windowId => {
      setOpenWindows((prev) => {
        if (prev.some(w => w.id === windowId)) {
          return prev
        }
        
        const icon = getWindowIcon(windowId)
        if (icon) {
          const content = getWindowContent(windowId)
          
          const size = { 
            width: WINDOW_SIZE[windowId as keyof typeof WINDOW_SIZE].width, 
            height: WINDOW_SIZE[windowId as keyof typeof WINDOW_SIZE].height 
          }

          let position: { x: number; y: number }
          
          if (isMobile) {
            const adjustedSize = {
              width: Math.min(window.innerWidth - 20, 400),
              height: Math.min(window.innerHeight - 120, 600)
            }
            
            if (windowId === "wallet-connect-tba") {
              const screenWidth = window.innerWidth;
              const screenHeight = window.innerHeight;
              position = {
                x: Math.max(5, (screenWidth - adjustedSize.width) / 2),
                y: Math.max(40, (screenHeight - adjustedSize.height) / 2)
              };
            } else {
              position = { x: 10, y: 60 }
            }
            
            size.width = adjustedSize.width
            size.height = adjustedSize.height
          } else {
            const screenWidth = window.innerWidth
            const screenHeight = window.innerHeight
            const centerX = Math.max(0, (screenWidth - size.width) / 2)
            const centerY = Math.max(0, (screenHeight - size.height) / 2)
            
            const offset = prev.length * 20
            position = { 
              x: centerX + offset, 
              y: centerY + offset 
            }
          }

          let windowZIndex = zIndexCounter;
          if (windowId === "wallet-connect-tba") {
            windowZIndex = Math.max(zIndexCounter, 5000);
          }

          const newWindow: WindowType = {
            id: windowId,
            title: icon.title,
            icon: icon.icon,
            content,
            position,
            size,
            zIndex: windowZIndex,
            minimized: false,
          }

          setZIndexCounter((current) => Math.max(current + 1, windowZIndex + 1))
          
          if (!windowRouter.openWindows.includes(windowId)) {
            windowRouter.openWindow(windowId)
          }

          return [...prev, newWindow]
        }
        
        return prev
      })
    })
  }, [windowRouter.openWindows, isMobile, zIndexCounter, windowRouter])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handleExternalOpen = (event: Event) => {
      const { windowId } = (event as CustomEvent<WindowOpenEventDetail>).detail || {}
      if (!windowId) {
        return
      }

      const icon = getWindowIcon(windowId)
      if (!icon) {
        return
      }

      const content = getWindowContent(windowId)
      handleOpenWindow(windowId, icon.title, content, icon.icon)
    }

    window.addEventListener(WINDOW_OPEN_EVENT, handleExternalOpen)
    return () => {
      window.removeEventListener(WINDOW_OPEN_EVENT, handleExternalOpen)
    }
  }, [handleOpenWindow])

  return (
    <main className={`w-full min-w-[800px] min-h-screen overflow-auto bg-uni-bg-01 relative ${isMobile ? 'touch-manipulation' : ''}`}>
      <Desktop
        onOpenWindow={handleOpenWindow}
        activeWindow={windowRouter.activeWindow}
        isMobile={isMobile}
        openWindowIds={openWindows.map(w => w.id)}
      />

      {openWindows.map(
        (window) =>
          !window.minimized && (
            <Window
              key={window.id}
              window={window}
              isActive={windowRouter.activeWindow === window.id}
              onClose={() => handleCloseWindow(window.id)}
              onMinimize={() => handleMinimizeWindow(window.id)}
              onActivate={() => handleActivateWindow(window.id)}
              onMove={(position) => handleMoveWindow(window.id, position)}
              isMobile={isMobile}
            />
          ),
      )}

      <Taskbar
        onOpenWindow={handleOpenWindow}
        openWindows={openWindows}
        activeWindow={windowRouter.activeWindow}
        onActivateWindow={handleActivateWindow}
        onRestoreWindow={handleRestoreWindow}
        isMobile={isMobile}
      />
    </main>
  )
}

