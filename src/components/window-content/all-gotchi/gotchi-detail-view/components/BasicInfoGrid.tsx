"use client";

import React from "react";
import { GotchiMetadata } from "@/lib/types";

interface BasicInfoGridProps {
  rarityName: string;
  rarityColor: string;
  factionName: string;
  calculatedLevel: number;
  age: number;
  metadata: GotchiMetadata;
}

export const BasicInfoGrid: React.FC<BasicInfoGridProps> = ({
  rarityName,
  rarityColor,
  factionName,
  calculatedLevel,
  age,
  metadata
}) => {
  return (
    <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
      <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner rounded-sm p-2">
        <div className="text-[10px] text-[#808080] uppercase mb-1">Rarity</div>
        <div className={`text-xs font-bold px-2 py-0.5 inline-block ${rarityColor} rounded-sm`}>
          {rarityName}
        </div>
      </div>
      <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner rounded-sm p-2">
        <div className="text-[10px] text-[#808080] uppercase mb-1">Faction</div>
        <div className="text-xs font-bold text-[#000080]">{factionName}</div>
      </div>
      <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner rounded-sm p-2">
        <div className="text-[10px] text-[#808080] uppercase mb-1">Level</div>
        <div className="text-xs font-bold text-[#000080]">
          {calculatedLevel} {metadata.is_evolved && <span className="text-[#ffd700]">★{metadata.core_evolution}</span>}
        </div>
      </div>
      <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner rounded-sm p-2">
        <div className="text-[10px] text-[#808080] uppercase mb-1">Age</div>
        <div className="text-xs font-bold text-[#000080]">{age} days</div>
      </div>
    </div>
  );
};
