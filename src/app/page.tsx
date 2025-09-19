"use client"

import { useState, useEffect } from "react"
import { useWindowRouter } from "@/hooks/useWindowRouter"
import useResponsive from "@/hooks/useResponsive"
import Desktop from "@/components/home/Desktop"
import Taskbar from "@/components/home/Taskbar"
import Window from "@/components/home/Window"
import NFTSalesPopup from "@/components/home/NFTSalesPopup"
import MintContent from "@/components/window-content/MintContent"
import MyPharosContent from "@/components/window-content/MyPharosContent"
import DashboardContent from "@/components/window-content/DashboardContent"
import ClaimWearableContent from "@/components/window-content/ClaimWearableContent"
import DailyTaskHallContent from "@/components/window-content/DailyTaskHallContent"
import AIContent from "@/components/window-content/AIContent"
import type { WindowType } from "@/lib/types"
import type { JSX } from "react/jsx-runtime"
import { WINDOW_SIZE } from "@/lib/constant"

export default function Home() {
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

  useEffect(() => {
    windowRouter.openWindows.forEach(windowId => {
      if (!openWindows.some(w => w.id === windowId)) {
        const icons = [
          { id: "ai", title: "Chat" },
          { id: "mint", title: "Mint" },
          { id: "pharos", title: "My Pharos" },
          { id: "dashboard", title: "My Gotchipus" },
          { id: "wearable", title: "Claim Wearable" },
          { id: "daily-task-hall", title: "Daily Task Hall" },
        ]
        
        const icon = icons.find(i => i.id === windowId)
        if (icon) {
          let content: JSX.Element
          switch (windowId) {
            case "mint":
              content = <MintContent />
              break
            case "pharos":
              content = <MyPharosContent />
              break
            case "dashboard":
              content = <DashboardContent />
              break
            case "wearable":
              content = <ClaimWearableContent />
              break
            case "daily-task-hall":
              content = <DailyTaskHallContent openWindow={(view: string) => {
                const targetIcon = icons.find(i => i.id === view)
                if (targetIcon) {
                  handleOpenWindow(view, targetIcon.title, <div>Loading...</div>)
                }
              }} />
              break
            case "ai":
              content = <AIContent />
              break
            default:
              content = <div>Unknown window: {windowId}</div>
          }
          
          handleOpenWindow(windowId, icon.title, content)
        }
      }
    })
  }, [windowRouter.openWindows, openWindows])

  const handleOpenWindow = (windowId: string, title: string, content: JSX.Element) => {
    if (openWindows.some((w) => w.id === windowId)) {
      handleActivateWindow(windowId)
      return
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
      
      const offset = openWindows.length * 20
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
      content,
      position,
      size,
      zIndex: windowZIndex,
      minimized: false,
    }

    setOpenWindows((prev) => [...prev, newWindow])
    setZIndexCounter((prev) => Math.max(prev + 1, windowZIndex + 1))
    
    if (!windowRouter.openWindows.includes(windowId)) {
      windowRouter.openWindow(windowId)
    }
  }

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

  const handleActivateWindow = (windowId: string) => {
    let newZIndex = zIndexCounter;
    if (windowId === "wallet-connect-tba") {
      newZIndex = Math.max(zIndexCounter, 1000);
    }
    
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, zIndex: newZIndex, minimized: false } : w)),
    )
    setZIndexCounter((prev) => Math.max(prev + 1, newZIndex + 1))
    
    windowRouter.activateWindow(windowId)
  }

  const handleMoveWindow = (windowId: string, position: { x: number; y: number }) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, position } : w)))
  }

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

      <NFTSalesPopup />
    </main>
  )
}

