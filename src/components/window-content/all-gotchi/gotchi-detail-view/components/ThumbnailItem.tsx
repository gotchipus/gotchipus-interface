"use client";

import React from "react";
import Image from "next/image";
import EnhancedGotchiSvg from "@/components/gotchiSvg/EnhancedGotchiSvg";
import { useAllEquipLayers } from "@/hooks/useAllEquipLayers";
import { GotchiMetadata } from "@/lib/types";

interface ThumbnailItemProps {
  item: GotchiMetadata;
  isActive: boolean;
  onClick: () => void;
}

export const ThumbnailItem: React.FC<ThumbnailItemProps> = ({
  item,
  isActive,
  onClick
}) => {
  const itemWearableIndices = useAllEquipLayers(item.all_equip);

  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex-shrink-0 border-2 overflow-hidden bg-white transition-all ${
        isActive
          ? 'border-[#000080] shadow-win98-outer scale-110'
          : 'border-[#808080] shadow-win98-inner opacity-70 hover:opacity-100 hover:border-[#000080]'
      }`}
    >
      {item.status !== 0 ? (
        <EnhancedGotchiSvg
          wearableIndices={itemWearableIndices}
          width={40}
          height={40}
        />
      ) : (
        <Image
          src="/pharos-summon.gif"
          alt="Unsummoned"
          width={40}
          height={40}
          className="object-cover"
          unoptimized
        />
      )}
    </button>
  );
};
