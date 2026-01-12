import React from "react"
import type { JSX } from "react/jsx-runtime"
import MintContent from "@/components/window-content/MintContent"
import MyPharosContent from "@/components/window-content/MyPharosContent"
import DashboardContent from "@/components/window-content/DashboardContent"
import WearableMarketplaceContent from "@/src/components/window-content/WearableMarketplaceContent"
import DailyTaskHallContent from "@/components/window-content/DailyTaskHallContent"
import AIContent from "@/components/window-content/AIContent"
import AllGotchiContent from "@/components/window-content/AllGotchiContent"

export interface WindowIconConfig {
  id: string
  title: string
  icon: string
  enabled: boolean
}

export interface WindowContentFactory {
  (props?: any): JSX.Element
}

export const WINDOW_ICONS: WindowIconConfig[] = [
  {
    id: "mint",
    title: "Mint",
    icon: "/mint.png",
    enabled: true,
  },
  {
    id: "pharos",
    title: "My Pharos",
    icon: "/pharos.png",
    enabled: true,
  },
  {
    id: "dashboard",
    title: "My Gotchipus",
    icon: "/dashboard.png",
    enabled: true,
  },
  {
    id: "wearable",
    title: "Wearable Marketplace",
    icon: "/wearable-marketplace.svg",
    enabled: true,
  },
  {
    id: "ai",
    title: "Chat",
    icon: "/ai-pus.png",
    enabled: false,
  },
  {
    id: "daily-task-hall",
    title: "Daily Task Hall",
    icon: "/icons/pharos-proof.png",
    enabled: false,
  },
  {
    id: "all-gotchi",
    title: "All Gotchi",
    icon: "/all-gotchi.png",
    enabled: true,
  },
]

export const getEnabledWindowIcons = (): WindowIconConfig[] => {
  return WINDOW_ICONS.filter(icon => icon.enabled)
}

export const getWindowIcon = (windowId: string): WindowIconConfig | undefined => {
  return WINDOW_ICONS.find(icon => icon.id === windowId && icon.enabled)
}

export const getWindowContent = (
  windowId: string,
  props?: any
): JSX.Element => {
  switch (windowId) {
    case "mint":
      return <MintContent />
    case "pharos":
      return <MyPharosContent />
    case "dashboard":
      return <DashboardContent />
    case "wearable":
      return <WearableMarketplaceContent />
    case "daily-task-hall":
      return <DailyTaskHallContent openWindow={props?.openWindow} />
    case "ai":
      return <AIContent />
    case "all-gotchi":
      return <AllGotchiContent />
    default:
      return <div>Unknown window: {windowId}</div>
  }
}

export const isValidWindowId = (windowId: string): boolean => {
  return getWindowIcon(windowId) !== undefined
}

