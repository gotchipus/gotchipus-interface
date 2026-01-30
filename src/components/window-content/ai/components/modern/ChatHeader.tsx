"use client"

import { ChevronDown } from "lucide-react"

interface ChatHeaderProps {
  modelName?: string;
  modelVersion?: string;
}

export function ChatHeader({
  modelName = "GOTCHIPUS",
  modelVersion = "GOTCHI-V1.0 Beta"
}: ChatHeaderProps) {
  return (
    <header className="flex items-center px-3 py-2 bg-[#c0c0c0] border-b-2 border-[#808080]">
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 px-2 py-1 text-xs text-[#000080] bg-[#d4d0c8] border-2 border-white border-r-[#808080] border-b-[#808080] active:border-r-white active:border-b-white active:border-l-[#808080] active:border-t-[#808080]">
          {modelVersion}
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </header>
  )
}
