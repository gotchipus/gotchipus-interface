"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSvgLayers } from "@/hooks/useSvgLayers";
import EnhancedGotchiSvg from "@/components/gotchiSvg/EnhancedGotchiSvg";
import { backgrounds } from "@/components/gotchiSvg/svgs";
import { renderToStaticMarkup } from "react-dom/server";
import { GotchiMetadata } from "@/lib/types";

interface NftCardProps {
  id: string;
  onSelect: (tokenId: string) => void;
  isMobile?: boolean;
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

export const NftCard = ({ id, onSelect, isMobile }: NftCardProps) => {
  const { wearableIndices, isLoading } = useSvgLayers(id);
  const [metadata, setMetadata] = useState<GotchiMetadata | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`/api/gotchi-metadata?token_id=${id}`);
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          setMetadata(result.data[0]);
        }
      } catch (error) {
        console.error(`Error fetching metadata for token ${id}:`, error);
      }
    };

    fetchMetadata();
  }, [id]);

  const backgroundComponent = backgrounds(wearableIndices.backgroundIndex);
  const backgroundSvg = backgroundComponent
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${renderToStaticMarkup(backgroundComponent)}</svg>`
    : null;

  const backgroundStyle = backgroundSvg
    ? { backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(backgroundSvg)}")` }
    : {};

  const handleClick = () => {
    onSelect(id.toString());
  };

  const isSummoned = metadata?.status !== 0;
  const currentExp = metadata?.leveling_data?.current_exp || 0;
  const calculatedLevel = Math.floor(Number(currentExp) / 100);

  const rarity = metadata?.dna_data?.rarity ?? 0;
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
        {isSummoned && metadata ? (
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
            {metadata ? "PHAROS" : "GOTCHI"}
          </span>
        )}
      </div>

      <div
        className="relative w-full aspect-square mb-2 bg-white/30 border-2 border-[#808080] shadow-win98-inner p-2 bg-cover bg-center"
        style={isSummoned ? backgroundStyle : {}}
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-xs">...</div>
          </div>
        ) : (
          <EnhancedGotchiSvg
            wearableIndices={wearableIndices}
            className="w-full h-full"
          />
        )}
      </div>

      <div className="text-center text-xs font-bold text-[#000080] px-1 py-0.5 bg-white/30 border border-[#808080] shadow-win98-inner w-full truncate">
        {metadata?.name || `Gotchipus #${id}`}
      </div>
    </motion.div>
  );
};