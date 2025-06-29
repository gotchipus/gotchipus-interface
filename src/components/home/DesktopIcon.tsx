"use client"

import Image from "next/image"
import type { DesktopIconProps } from "@/lib/types"

export default function DesktopIcon({ id, title, icon, onClick, isActive, isMobile = false }: DesktopIconProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center cursor-pointer m-1 p-2 rounded-md ${
        isMobile ? 'w-16 h-20' : 'w-24 h-28'
      } ${
        isActive ? "bg-uni-bg-02 text-white" : "text-white hover:bg-uni-bg-02/20"
      }`}
      onClick={onClick}
    >
      <Image 
        src={icon} 
        alt={title} 
        width={isMobile ? 48 : 86} 
        height={isMobile ? 48 : 86} 
        className="mb-2" 
      />
      <div className={`text-center px-1 text-shadow whitespace-nowrap ${isMobile ? 'text-xs' : 'text-xs'}`}>{title}</div>
    </div>
  )
}

