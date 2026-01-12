"use client"

import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getWearableImagePath, getWearableName } from "@/src/utils/wearableMapping"

interface WearableSlotProps {
  type: 'background' | 'body' | 'eye';
  wearableIndex: number;
}

export const WearableSlot = ({ type, wearableIndex }: WearableSlotProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const getWearableImage = () => {
    const typeMapping = {
      'background': 'backgrounds' as const,
      'body': 'bodys' as const,
      'eye': 'eyes' as const
    };

    return getWearableImagePath(typeMapping[type], wearableIndex);
  }

  const getWearableDisplayName = () => {
    const typeMapping = {
      'background': 'backgrounds' as const,
      'body': 'bodys' as const,
      'eye': 'eyes' as const
    };

    return getWearableName(typeMapping[type], wearableIndex);
  }

  return (
    <div
      className={`relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          w-32 h-32 border-2 rounded-sm
          ${
            wearableIndex !== null
              ? "border-[#808080] shadow-win98-inner bg-[#d4d0c8]"
              : "border-[#808080] shadow-win98-outer bg-[#d4d0c8]"
          }
          ${wearableIndex !== null ? "cursor-pointer hover:bg-[#c0c0c0]" : "cursor-not-allowed"}
          flex items-center justify-center relative overflow-hidden
        `}
      >
        <div className="w-full h-full relative">
          <Image
            src={getWearableImage()}
            alt={getWearableDisplayName()}
            fill
            className="object-contain"
            unoptimized={true}
          />
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-20 bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                       bg-[#FFFFCC] border-2 border-[#000000] p-2 rounded whitespace-nowrap text-xs shadow-win98-outer"
          >
            {wearableIndex !== null ? getWearableDisplayName() : `No ${type}`}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="border-4 border-transparent border-t-[#000000]"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

