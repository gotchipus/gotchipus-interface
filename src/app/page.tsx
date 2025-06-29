"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import useResponsive from "@/hooks/useResponsive"
import Desktop from "@/components/home/Desktop"
import Taskbar from "@/components/home/Taskbar"
import Window from "@/components/home/Window"
import type { WindowType } from "@/lib/types"
import type { JSX } from "react/jsx-runtime"
import { WINDOW_SIZE } from "@/lib/constant"

export default function Home() {
  const [openWindows, setOpenWindows] = useState<WindowType[]>([])
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const [zIndexCounter, setZIndexCounter] = useState(100)
  const isMobile = useResponsive()

  const router = useRouter() 

  const handleOpenWindow = (windowId: string, title: string, content: JSX.Element) => {
    if (openWindows.some((w) => w.id === windowId)) {
      handleActivateWindow(windowId)
      return
    }

    let position = { x: 50 + openWindows.length * 20, y: 50 + openWindows.length * 20 }
    let size = { 
      width: WINDOW_SIZE[windowId as keyof typeof WINDOW_SIZE].width, 
      height: WINDOW_SIZE[windowId as keyof typeof WINDOW_SIZE].height 
    }

    if (isMobile) {
      position = { x: 10, y: 60 }
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
      }
    }

    let windowZIndex = zIndexCounter;
    if (windowId === "wallet-connect-tba") {
      windowZIndex = Math.max(zIndexCounter, 5000);
    }

    const newWindow: WindowType = {
      id: windowId,
      title,
      content,
      position,
      size,
      zIndex: windowZIndex,
      minimized: false,
    }

    setOpenWindows((prev) => [...prev, newWindow])
    setActiveWindow(windowId)
    setZIndexCounter((prev) => Math.max(prev + 1, windowZIndex + 1))
  }

  const handleCloseWindow = (windowId: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== windowId))
    if (activeWindow === windowId) {
      const remainingWindows = openWindows.filter((w) => w.id !== windowId)
      setActiveWindow(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null)
    }

    router.push('/', { scroll: false });
  }

  const handleMinimizeWindow = (windowId: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, minimized: true } : w)))
  }

  const handleRestoreWindow = (windowId: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, minimized: false } : w)))
    handleActivateWindow(windowId)
  }

  const handleActivateWindow = (windowId: string) => {
    setActiveWindow(windowId)
    
    let newZIndex = zIndexCounter;
    if (windowId === "wallet-connect-tba") {
      newZIndex = Math.max(zIndexCounter, 1000);
    }
    
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, zIndex: newZIndex, minimized: false } : w)),
    )
    setZIndexCounter((prev) => Math.max(prev + 1, newZIndex + 1))
  }

  const handleMoveWindow = (windowId: string, position: { x: number; y: number }) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, position } : w)))
  }

  return (
    <main className={`w-screen h-screen overflow-hidden bg-uni-bg-01 relative ${isMobile ? 'touch-manipulation' : ''}`}>
      <Desktop onOpenWindow={handleOpenWindow} activeWindow={activeWindow} isMobile={isMobile} />

      {openWindows.map(
        (window) =>
          !window.minimized && (
            <Window
              key={window.id}
              window={window}
              isActive={activeWindow === window.id}
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
        activeWindow={activeWindow}
        onActivateWindow={handleActivateWindow}
        onRestoreWindow={handleRestoreWindow}
        isMobile={isMobile}
      />
    </main>
  )
}

