"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
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

  const router = useRouter() 

  const handleOpenWindow = (windowId: string, title: string, content: JSX.Element) => {
    if (openWindows.some((w) => w.id === windowId)) {
      handleActivateWindow(windowId)
      return
    }

    const newWindow: WindowType = {
      id: windowId,
      title,
      content,
      position: { x: 50 + openWindows.length * 20, y: 50 + openWindows.length * 20 },
      size: { width: WINDOW_SIZE[windowId as keyof typeof WINDOW_SIZE].width, height: WINDOW_SIZE[windowId as keyof typeof WINDOW_SIZE].height },
      zIndex: zIndexCounter,
      minimized: false,
    }

    setOpenWindows((prev) => [...prev, newWindow])
    setActiveWindow(windowId)
    setZIndexCounter((prev) => prev + 1)
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
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, zIndex: zIndexCounter, minimized: false } : w)),
    )
    setZIndexCounter((prev) => prev + 1)
  }

  const handleMoveWindow = (windowId: string, position: { x: number; y: number }) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, position } : w)))
  }

  return (
    <main className="w-screen h-screen overflow-hidden bg-uni-bg-01 relative">
      <Desktop onOpenWindow={handleOpenWindow} activeWindow={activeWindow} />

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
            />
          ),
      )}

      <Taskbar
        onOpenWindow={handleOpenWindow}
        openWindows={openWindows}
        activeWindow={activeWindow}
        onActivateWindow={handleActivateWindow}
        onRestoreWindow={handleRestoreWindow}
      />
    </main>
  )
}

