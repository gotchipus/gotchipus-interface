"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getWearableImagePath, WearableType } from "@/src/utils/wearableMapping";

interface EquippedWearableItemProps {
  type: string;
  name: string;
  wearableType: WearableType;
  index: number;
  itemIndex: number;
}

export const EquippedWearableItem: React.FC<EquippedWearableItemProps> = ({
  type,
  name,
  wearableType,
  index,
  itemIndex
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isFirstRow = itemIndex < 4;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full aspect-square border-2 border-[#808080] shadow-win98-inner bg-[#d4d0c8] rounded-sm flex items-center justify-center cursor-pointer hover:bg-[#c0c0c0] overflow-hidden">
        <div className="w-full h-full relative p-2">
          <Image
            src={getWearableImagePath(wearableType, index)}
            alt={name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: isFirstRow ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isFirstRow ? -10 : 10 }}
            className={`absolute z-30 ${
              isFirstRow
                ? 'top-full mt-2'
                : 'bottom-full mb-2'
            } left-1/2 transform -translate-x-1/2 bg-[#FFFFCC] border-2 border-[#000000] p-2 rounded whitespace-nowrap text-xs shadow-win98-outer`}
          >
            {name}
            <div className={`absolute left-1/2 transform -translate-x-1/2 ${
              isFirstRow
                ? 'top-0 -translate-y-full'
                : 'bottom-0 translate-y-full'
            }`}>
              <div className={`border-4 border-transparent ${
                isFirstRow
                  ? 'border-b-[#000000]'
                  : 'border-t-[#000000]'
              }`}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
