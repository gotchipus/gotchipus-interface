"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GotchiMetadata } from "@/lib/types";
import { ThumbnailItem } from "./ThumbnailItem";

interface NavigationBarProps {
  hasPrev: boolean;
  hasNext: boolean;
  handlePrev: () => void;
  handleNext: () => void;
  visibleThumbnails: GotchiMetadata[];
  metadata: GotchiMetadata;
  onNavigate?: (tokenId: number) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  hasPrev,
  hasNext,
  handlePrev,
  handleNext,
  visibleThumbnails,
  metadata,
  onNavigate
}) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <button
        onClick={handlePrev}
        disabled={!hasPrev}
        className={`w-8 h-8 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] flex items-center justify-center flex-shrink-0 ${
          hasPrev ? 'hover:bg-white active:shadow-win98-inner' : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <ChevronLeft size={16} className="text-black" />
      </button>

      <div className="flex-1 overflow-hidden">
        <div className="flex gap-1 justify-center">
          {visibleThumbnails.map((item) => (
            <ThumbnailItem
              key={item.token_id}
              item={item}
              isActive={item.token_id === metadata.token_id}
              onClick={() => onNavigate && onNavigate(item.token_id)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!hasNext}
        className={`w-8 h-8 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] flex items-center justify-center flex-shrink-0 ${
          hasNext ? 'hover:bg-white active:shadow-win98-inner' : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <ChevronRight size={16} className="text-black" />
      </button>
    </div>
  );
};
