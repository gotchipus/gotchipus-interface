"use client"

import Image from "next/image"
import type { DesktopIconProps } from "@/lib/types"

export default function DesktopIcon({ id, title, icon, onClick, isActive }: DesktopIconProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-24 h-28 cursor-pointer m-1 p-2 rounded-md ${
        isActive ? "bg-uni-bg-02 text-white" : "text-white hover:bg-uni-bg-02/20"
      }`}
      onClick={onClick}
    >
      <Image src={icon} alt={title} width={86} height={86} className="mb-2" />
      <div className="text-center text-xs px-1 text-shadow">{title}</div>
    </div>
  )
}

