import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeWearableId(wearableId: number): number {
  return wearableId > 85 ? wearableId - 85 : wearableId;
}
