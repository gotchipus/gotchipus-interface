"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { WindowType } from "@/lib/types"
import { Clock } from "lucide-react"
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import AboutContent from "@/components/window-content/AboutContent"

interface TaskbarProps {
  onOpenWindow: (id: string, title: string, content: JSX.Element) => void
  openWindows: WindowType[]
  activeWindow: string | null
  onActivateWindow: (id: string) => void
  onRestoreWindow: (id: string) => void
}

export default function Taskbar({
  onOpenWindow,
  openWindows,
  activeWindow,
  onActivateWindow,
  onRestoreWindow,
}: TaskbarProps) {
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [isStartPressed, setIsStartPressed] = useState(false)
  const [pressedButton, setPressedButton] = useState<string | null>(null)
  const [clockPressed, setClockPressed] = useState(false)
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Windows 98 button press effect helpers
  const handleButtonMouseDown = (id: string) => {
    setPressedButton(id);
  };

  const handleButtonMouseUp = (id: string) => {
    setPressedButton(null);
    if (id === pressedButton) {
      if (openWindows.find(w => w.id === id)?.minimized) {
        onRestoreWindow(id);
      } else {
        onActivateWindow(id);
      }
    }
  };

  const handleButtonMouseLeave = () => {
    setPressedButton(null);
  };

  const handleOpenAboutWindow = () => {
    onOpenWindow("about", "About", <AboutContent />)
  }

  return (
    <div className="absolute bottom-0 left-0 w-full h-14 bg-[#c0c0c0] border-t-2 border-[#dfdfdf] shadow-win98-outer flex items-center justify-between px-1 z-50">
      <div className="flex items-center h-10">
        <button
          className={`h-10 px-4 mr-2 font-bold text-sm flex items-center justify-center text-white border border-[#808080] ${
            isStartPressed || startMenuOpen
              ? "bg-uni-bg-01 shadow-win98-inner"
              : "bg-uni-bg-01 shadow-win98-outer"
          }`}
          onClick={handleOpenAboutWindow}
          onMouseDown={() => setIsStartPressed(true)}
          onMouseUp={() => setIsStartPressed(false)}
          onMouseLeave={() => setIsStartPressed(false)}
        >
          <Image src="/windows98.svg" alt="Start" width={24} height={24} />
          <span className="ml-2">Gotchipus</span>
        </button>

        <div
          className="h-10 px-3 text-sm flex items-center justify-center bg-[#c0c0c0] border border-[#808080] shadow-win98-outer active:shadow-inner"
        >
          <CustomConnectButton />
        </div>

        {openWindows.map((window) => (
          <button
            key={window.id}
            className={`h-10 min-w-[120px] px-3 ml-1 text-sm flex items-center justify-start truncate border border-[#808080] bg-[#c0c0c0] ${
              pressedButton === window.id
                ? "shadow-win98-inner"
                : activeWindow === window.id
                ? "shadow-win98-outer"
                : "shadow-win98-inner"
            }`}
            onMouseDown={() => handleButtonMouseDown(window.id)}
            onMouseUp={() => handleButtonMouseUp(window.id)}
            onMouseLeave={handleButtonMouseLeave}
          >
            {window.title}
          </button>
        ))}
      </div>

      <div className="flex items-center h-10">
        <div
          className="flex flex-row gap-2 items-center bg-[#c0c0c0] h-10 px-2 mr-2 border border-[#808080] cursor-pointer shadow-win98-inner"
        >
          <Link href="https://x.com/gotchipus" target="_blank">
            <Image src="/x.svg" alt="X" width={24} height={24} />
          </Link>
          <Link href="https://discord.gg/gotchipus" target="_blank">
            <Image src="/discord.svg" alt="Discord" width={24} height={24} />
          </Link>
          <Link href="https://github.com/gotchipus" target="_blank">
            <Image src="/github.svg" alt="GitHub" width={24} height={24} />
          </Link>
          <Link href="https://docs.gotchipus.com" target="_blank">
            <Image src="/gitbook.svg" alt="GitBook" width={24} height={24} />
          </Link>
        </div>

        <div
          className={`flex items-center bg-[#c0c0c0] h-10 px-3 border border-[#808080] cursor-pointer shadow-win98-inner `}
          onMouseDown={() => setClockPressed(true)}
          onMouseUp={() => setClockPressed(false)}
          onMouseLeave={() => setClockPressed(false)}
        >
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">{currentTime}</span>
        </div>
      </div>
    </div>
  )
}

