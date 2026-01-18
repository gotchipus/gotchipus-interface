"use client";

import React from "react";
import { GotchiMetadata } from "@/lib/types";
import { calculateExpProgress, calculateExpPercentage } from "../utils";

interface DetailHeaderProps {
  metadata: GotchiMetadata;
  calculatedLevel: number;
  currentExp: number;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  metadata,
  calculatedLevel,
  currentExp
}) => {
  const expProgress = calculateExpProgress(currentExp);
  const expPercentage = calculateExpPercentage(currentExp);

  return (
    <div className="mb-4">
      <div className="flex items-end justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-xl font-bold text-[#000080] uppercase">
              {metadata.name || `Gotchipus #${metadata.token_id}`}
            </h4>
            <span className="text-sm text-[#808080]">#{metadata.token_id}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[#808080]">Owner:</span>
              {metadata.owner ? (
                <a
                  href={`https://atlantic.pharosscan.xyz/address/${metadata.owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000080] font-mono text-xs hover:underline hover:text-[#0000ff] cursor-pointer"
                >
                  {metadata.owner.slice(0, 6)}...{metadata.owner.slice(-4)}
                </a>
              ) : (
                <span className="text-[#000080] font-mono text-xs">Unknown</span>
              )}
            </div>
            {metadata.singer && (
              <div className="flex items-center gap-2">
                <span className="text-[#808080]">Account:</span>
                <a
                  href={`https://atlantic.pharosscan.xyz/address/${metadata.singer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000080] font-mono text-xs hover:underline hover:text-[#0000ff] cursor-pointer"
                >
                  {metadata.singer.slice(0, 6)}...{metadata.singer.slice(-4)}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="w-40">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[#000080] font-bold">
              Level {calculatedLevel}
              {metadata.is_evolved && <span className="text-[#ffd700] ml-1">★{metadata.core_evolution}</span>}
            </div>
            <div className="text-xs text-[#808080]">
              {expProgress}/100 XP
            </div>
          </div>
          <div className="w-full bg-white border border-[#808080] h-3">
            <div
              className="bg-[#000080] h-full"
              style={{ width: `${expPercentage}%` }}
            />
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-[#808080]"></div>
    </div>
  );
};
