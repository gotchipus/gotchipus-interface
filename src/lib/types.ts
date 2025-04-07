import type { JSX } from "react"

export interface WindowType {
  id: string
  title: string
  content: JSX.Element
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  minimized: boolean
}

export interface DesktopIconProps {
  id: string
  title: string
  icon: string
  onClick: () => void
  isActive: boolean
}

