"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DesktopIcon from "@/components/home/DesktopIcon"
import AIContent from "@/src/components/window-content/AIContent"
import ComingSoonContent from "@/components/window-content/SoonContent"
import MyPharosContent from "@/src/components/window-content/MyPharosContent"
import DashboardContent from "@/components/window-content/DashboardContent"
import type { JSX } from "react/jsx-runtime"
import FarmContent from "@/src/components/window-content/FarmContent"
import HookContent from "@/src/components/window-content/HookContent"
import DNAAnalyzerContent from "@/components/window-content/DNAAnalyzerContent"
import MintContent from "@/components/window-content/MintContent" 
import ClaimWearableContent from "@/src/components/window-content/ClaimWearableContent"
import DailyTaskHallContent from "@/src/components/window-content/DailyTaskHallContent"

interface DesktopProps {
  onOpenWindow: (id: string, title: string, content: JSX.Element) => void
  activeWindow: string | null
}

// Desktop icons configuration
const icons = [
  // {
  //   id: "ai",
  //   title: "AI",
  //   icon: "/ai-pus.png",
  // },
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

  // {
  //   id: "hooks",
  //   title: "Hooks",
  //   icon: "/hooks.png",
  // },
  // {
  //   id: "dna",
  //   title: "DNA Analyzer",
  //   icon: "/dna.png",
  // },
]

export default function Desktop({ onOpenWindow, activeWindow }: DesktopProps) {
  const [activeIcon, setActiveIcon] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const MAX_ICONS_PER_COLUMN = 6
  
  const numberOfColumns = Math.ceil(icons.length / MAX_ICONS_PER_COLUMN)
  
  const columns = Array.from({ length: numberOfColumns }, (_, columnIndex) => {
    const columnStart = columnIndex * MAX_ICONS_PER_COLUMN
    const columnEnd = Math.min((columnIndex + 1) * MAX_ICONS_PER_COLUMN, icons.length)
    return icons.slice(columnStart, columnEnd)
  })

  useEffect(() => {
    const viewParam = searchParams.get('view')
    if (viewParam && !activeWindow) {
      openWindowByView(viewParam)
    }
  }, [searchParams])

  const openWindowByView = (view: string) => {
    switch (view) {
      case "mint":
        onOpenWindow("mint", "Mint", <MintContent />)
        break
      case "pharos":
        onOpenWindow("pharos", "My Pharos", <MyPharosContent />)
        break
      case "dashboard":
        onOpenWindow("dashboard", "My Gotchipus", <DashboardContent />)
        break
      case "wearable":
        onOpenWindow("wearable", "Claim Wearable", <ClaimWearableContent />)
        break
      case "daily-task-hall":
        onOpenWindow("daily-task-hall", "Daily Task Hall", <DailyTaskHallContent />)
        break
      default:
        break
    }
  }

  const handleIconClick = (iconId: string) => {
    setActiveIcon(iconId)
    
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', iconId)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="top-0 left-0 w-full h-[calc(100%-28px)] p-4 flex flex-col items-start gap-2 relative">
      <div className="absolute inset-0 left-10 flex items-center justify-center z-0 pointer-events-none">
        <Image 
          src="/gotchipus.png" 
          alt="Gotchipus" 
          width={600} 
          height={600} 
          className="object-contain"
          priority
        />
      </div>
      
      <div className="relative z-10 flex flex-row gap-4 p-2">
        {columns.map((columnIcons, columnIndex) => (
          <div key={`column-${columnIndex}`} className="flex flex-col gap-2">
            {columnIcons.map((icon) => (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                title={icon.title}
                icon={icon.icon}
                onClick={() => handleIconClick(icon.id)}
                isActive={activeWindow === icon.id}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

