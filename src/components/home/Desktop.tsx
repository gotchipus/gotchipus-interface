"use client"

import Image from "next/image"
import { useState } from "react"
import DesktopIcon from "@/components/home/DesktopIcon"
import AIContent from "@/src/components/window-content/AIContent"
import ComingSoonContent from "@/components/window-content/SoonContent"
import MyPharosContent from "@/src/components/window-content/MyPharosContent"
import DashboardContent from "@/components/window-content/DashboardContent"
import type { JSX } from "react/jsx-runtime"
import FarmContent from "@/src/components/window-content/FarmContent"
import HookContent from "@/src/components/window-content/HookContent"
import DesktopPet from "@/components/home/DesktopPet"
import DNAAnalyzerContent from "@/components/window-content/DNAAnalyzerContent"
import MintContent from "@/components/window-content/MintContent" 

interface DesktopProps {
  onOpenWindow: (id: string, title: string, content: JSX.Element) => void
  activeWindow: string | null
}

// Desktop icons configuration
const icons = [
  {
    id: "ai",
    title: "AI",
    icon: "/ai-pus.png",
  },
  {
    id: "pharos",
    title: "Pharos",
    icon: "/pharos.png",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "/dashboard.png",
  },
  {
    id: "hooks",
    title: "Hooks",
    icon: "/hooks.png",
  },
  {
    id: "dna",
    title: "DNA Analyzer",
    icon: "/dna.png",
  },
  {
    id: "mint",
    title: "Mint",
    icon: "/mint.png",
  }
]

export default function Desktop({ onOpenWindow, activeWindow }: DesktopProps) {
  const [activeIcon, setActiveIcon] = useState<string | null>(null)
  
  // Maximum icons per column
  const MAX_ICONS_PER_COLUMN = 6
  
  // Calculate how many columns we need
  const numberOfColumns = Math.ceil(icons.length / MAX_ICONS_PER_COLUMN)
  
  // Create an array of columns, each with its icons
  const columns = Array.from({ length: numberOfColumns }, (_, columnIndex) => {
    const columnStart = columnIndex * MAX_ICONS_PER_COLUMN
    const columnEnd = Math.min((columnIndex + 1) * MAX_ICONS_PER_COLUMN, icons.length)
    return icons.slice(columnStart, columnEnd)
  })

  const handleIconClick = (iconId: string) => {
    setActiveIcon(iconId)

    switch (iconId) {
      case "ai":
        onOpenWindow("ai", "AI", <AIContent />)
        break
      case "pharos":
        onOpenWindow("pharos", "Pharos", <MyPharosContent />)
        break
      case "dashboard":
        onOpenWindow("dashboard", "Dashboard", <DashboardContent />)
        break
      case "hooks":
        onOpenWindow("hooks", "Hooks", <HookContent />)
        break
      case "dna":
        onOpenWindow("dna", "DNA Analyzer", <DNAAnalyzerContent />)
        break
      case "mint":
        onOpenWindow("mint", "Mint", <MintContent />)
        break
      default:
        break
    }
  }

  return (
    <div className="top-0 left-0 w-full h-[calc(100%-28px)] p-4 flex flex-col items-start gap-2 relative">
      {/* Background image centered in the screen */}
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
      
      {/* Desktop icons with higher z-index to appear above the background */}
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
      <DesktopPet />
    </div>
  )
}

