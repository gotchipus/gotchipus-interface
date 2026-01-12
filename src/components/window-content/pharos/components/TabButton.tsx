"use client"

import { ReactNode } from "react"

interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: ReactNode
  icon?: ReactNode
}

export const TabButton = ({ active, onClick, children, icon }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 border-2 border-b-0 flex items-center gap-2
      ${
        active
          ? "bg-[#d4d0c8] border-[#808080] shadow-win98-inner relative z-10"
          : "bg-[#c0c0c0] border-[#808080] shadow-win98-outer hover:bg-[#d4d0c8]"
      }
      transition-colors font-bold text-sm
    `}
  >
    {icon}
    {children}
  </button>
)

