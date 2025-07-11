"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useWindowRouter } from "@/hooks/useWindowRouter"
import DesktopIcon from "@/components/home/DesktopIcon"
import MyPharosContent from "@/src/components/window-content/MyPharosContent"
import DashboardContent from "@/components/window-content/DashboardContent"
import type { JSX } from "react/jsx-runtime"
import MintContent from "@/components/window-content/MintContent" 
import ClaimWearableContent from "@/src/components/window-content/ClaimWearableContent"
import DailyTaskHallContent from "@/src/components/window-content/DailyTaskHallContent"
import AIContent from "@/src/components/window-content/AIContent"

interface DesktopProps {
  onOpenWindow: (id: string, title: string, content: JSX.Element) => void
  activeWindow: string | null
  isMobile?: boolean
  openWindowIds?: string[]
}

const icons = [
  {
    id: "ai",
    title: "Chat",
    icon: "/ai-pus.png",
  },
  {
    id: "mint",
    title: "Mint",
    icon: "/mint.png",
  },
  {
    id: "pharos",
    title: "My Pharos",
    icon: "/pharos.png",
  },
  {
    id: "dashboard",
    title: "My Gotchipus",
    icon: "/dashboard.png",
  },
  {
    id: "wearable",
    title: "Claim Wearable",
    icon: "/claim-wearable.svg",
  },
  {
    id: "daily-task-hall",
    title: "Daily Task Hall",
    icon: "/icons/pharos-proof.png",
  },

]

const getWindowContent = (windowId: string, onOpenWindow: (id: string, title: string, content: JSX.Element) => void) => {
  switch (windowId) {
    case "mint":
      return <MintContent />
    case "pharos":
      return <MyPharosContent />
    case "dashboard":
      return <DashboardContent />
    case "wearable":
      return <ClaimWearableContent />
    case "daily-task-hall":
      return <DailyTaskHallContent openWindow={(view: string) => {
        onOpenWindow(view, view, <div>Loading...</div>)
      }} />
    case "ai":
      return <AIContent />
    default:
      return <div>Unknown window: {windowId}</div>
  }
}

export default function Desktop({ onOpenWindow, isMobile = false, openWindowIds = [] }: DesktopProps) {
  const [activeIcon, setActiveIcon] = useState<string | null>(null)
  const windowRouter = useWindowRouter()
  
  const MAX_ICONS_PER_COLUMN = isMobile ? 6 : 6
  
  const numberOfColumns = Math.ceil(icons.length / MAX_ICONS_PER_COLUMN)
  
  const columns = Array.from({ length: numberOfColumns }, (_, columnIndex) => {
    const columnStart = columnIndex * MAX_ICONS_PER_COLUMN
    const columnEnd = Math.min((columnIndex + 1) * MAX_ICONS_PER_COLUMN, icons.length)
    return icons.slice(columnStart, columnEnd)
  })

  useEffect(() => {
    windowRouter.openWindows.forEach(windowId => {
      const icon = icons.find(i => i.id === windowId)
      if (icon && !openWindowIds.includes(windowId)) {
        const content = getWindowContent(windowId, onOpenWindow)
        onOpenWindow(windowId, icon.title, content)
      }
    })
  }, [windowRouter.openWindows])

  const handleIconClick = (iconId: string) => {
    setActiveIcon(iconId)
    
    windowRouter.openWindow(iconId)
    
    const icon = icons.find(i => i.id === iconId)
    if (icon) {
      const content = getWindowContent(iconId, onOpenWindow)
      onOpenWindow(iconId, icon.title, content)
    }
  }

  return (
    <div className={`top-0 left-0 w-full h-[calc(100%-28px)] p-4 flex flex-col items-start gap-2 relative ${isMobile ? 'p-2' : ''}`}>
      <div className={`absolute inset-0 left-10 flex items-center justify-center z-0 pointer-events-none ${isMobile ? 'left-2' : ''}`}>
        <Image 
          src="/gotchipus.png" 
          alt="Gotchipus" 
          width={isMobile ? 300 : 600} 
          height={isMobile ? 300 : 600} 
          className="object-contain"
          priority
        />
      </div>
      
      <div className={`relative z-10 flex flex-row gap-4 p-2 ${isMobile ? 'gap-2 p-1' : ''}`}>
        {columns.map((columnIcons, columnIndex) => (
          <div key={`column-${columnIndex}`} className={`flex flex-col gap-2 ${isMobile ? 'gap-1' : ''}`}>
            {columnIcons.map((icon) => (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                title={icon.title}
                icon={icon.icon}
                onClick={() => handleIconClick(icon.id)}
                isActive={windowRouter.activeWindow === icon.id}
                isMobile={isMobile}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

