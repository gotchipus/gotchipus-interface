"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import EnhancedGotchiSvg from "@/components/gotchiSvg/EnhancedGotchiSvg";
import { backgrounds } from "@/components/gotchiSvg/svgs";
import { renderToStaticMarkup } from "react-dom/server";
import { GotchiMetadata } from "@/lib/types";
import { useAllEquipLayers } from "@/hooks/useAllEquipLayers";

interface GotchiCardProps {
  metadata: GotchiMetadata;
  onClick?: (metadata: GotchiMetadata) => void;
}

const RARITY_NAMES: Record<number, string> = {
  0: "Common",
  1: "Rare",
  2: "Epic",
  3: "Legendary",
};

const RARITY_COLORS: Record<number, string> = {
  0: "bg-[#808080] text-white",
  1: "bg-[#0066cc] text-white",
  2: "bg-[#9933cc] text-white",
  3: "bg-[#ff9900] text-white",
};

const GotchiCard: React.FC<GotchiCardProps> = ({ metadata, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(metadata);
    }
  };

  const isSummoned = metadata.status !== 0;
  const wearableIndices = useAllEquipLayers(metadata.all_equip);

  const backgroundComponent = backgrounds(wearableIndices.backgroundIndex);
  const backgroundSvg = backgroundComponent
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${renderToStaticMarkup(backgroundComponent)}</svg>`
    : null;

  const backgroundStyle = backgroundSvg
    ? { backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(backgroundSvg)}")` }
    : {};

  const currentExp = metadata.leveling_data?.current_exp || 0;
  const calculatedLevel = Math.floor(Number(currentExp) / 100);

  // Get rarity from dna_data
  const rarity = metadata.dna_data?.rarity ?? 0;
  const rarityName = RARITY_NAMES[rarity] || "Common";
  const rarityColor = RARITY_COLORS[rarity] || "bg-[#808080] text-white";

  return (
    <motion.div
      className="bg-[#c0c0c0] flex flex-col items-center justify-center cursor-pointer border-2 border-[#808080] shadow-win98-outer rounded-none p-2 hover:border-dashed hover:border-[#000080] transition-all"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-full flex justify-between items-center mb-1">
        {isSummoned ? (
          <>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold bg-[#000080] text-white px-1">
                Lv.{calculatedLevel}
              </span>
              {metadata.is_evolved && (
                <span className="text-[10px] font-bold bg-[#ffd700] text-[#000080] px-1">
                  ★{metadata.core_evolution}
                </span>
              )}
              {metadata.locked && (
                <span className="text-[10px]">🔒</span>
              )}
            </div>
            <span className={`text-[10px] font-bold px-1 ${rarityColor}`}>
              {rarityName}
            </span>
          </>
        ) : (
          <span className="text-[10px] font-bold bg-[#808080] text-white px-1">
            Not Summoned
          </span>
        )}
      </div>

      <div
        className="relative w-full aspect-square mb-2 bg-white/30 border-2 border-[#808080] shadow-win98-inner p-2 bg-cover bg-center"
        style={isSummoned ? backgroundStyle : {}}
      >
        {!isSummoned ? (
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/pharos-summon.gif"
              alt="Unsummoned Gotchipus"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        ) : (
          <EnhancedGotchiSvg
            wearableIndices={wearableIndices}
            className="w-full h-full"
          />
        )}
      </div>

      <div className="text-center text-xs font-bold text-[#000080] px-1 py-0.5 bg-white/30 border border-[#808080] shadow-win98-inner w-full truncate">
        {metadata.name || `Gotchipus #${metadata.token_id}`}
      </div>
    </motion.div>
  );
};

export default GotchiCard;
