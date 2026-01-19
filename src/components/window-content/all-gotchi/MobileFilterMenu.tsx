'use client'

import { useState } from "react"
import { Win98Select } from "@/components/ui/win98-select"
import { Win98Checkbox } from "@/components/ui/win98-checkbox"

interface MobileFilterMenuProps {
  isOpen: boolean;
  searchId: string;
  isSearching: boolean;
  selectedRarity: string;
  levelRange: { min: string; max: string };
  selectedCommunityFeatures: Set<string>;
  sortBy: string;
  onSearchIdChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  onRarityChange: (value: string) => void;
  onLevelRangeChange: (range: { min: string; max: string }) => void;
  onToggleCommunityFeature: (feature: string) => void;
  onSortByChange: (value: string) => void;
  onResetFilters: () => void;
  onClose: () => void;
  resultCount: number;
}

export const MobileFilterMenu = ({
  isOpen,
  searchId,
  isSearching,
  selectedRarity,
  levelRange,
  selectedCommunityFeatures,
  sortBy,
  onSearchIdChange,
  onSearch,
  onClearSearch,
  onRarityChange,
  onLevelRangeChange,
  onToggleCommunityFeature,
  onSortByChange,
  onResetFilters,
  onClose,
  resultCount
}: MobileFilterMenuProps) => {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <>
      <div
        className="absolute inset-0 bg-black/50 z-[100] transition-opacity"
        onClick={onClose}
      />

      <div className="absolute bottom-0 left-0 right-0 z-[101] bg-[#c0c0c0] border-t-4 border-[#808080] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] animate-slide-up max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#000080] text-white px-4 py-3 flex items-center justify-between z-10">
          <h2 className="font-bold text-lg flex items-center gap-2">
            🔍 Filters & Search
          </h2>
          <button
            onClick={onClose}
            className="border-2 border-white bg-[#000060] hover:bg-[#000040] px-3 py-1 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="border-2 border-[#808080] shadow-win98-inner bg-white p-3 text-center">
            <span className="font-bold text-sm">Results: </span>
            <span className="text-[#000080] font-bold text-xl">{resultCount}</span>
            <span className="font-bold text-sm"> items</span>
          </div>

          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
            <label className="text-xs font-bold block mb-2 text-[#000080]">Search by ID</label>
            <input
              type="text"
              value={searchId}
              onChange={(e) => onSearchIdChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter Token ID (0-19999)"
              disabled={isSearching}
              className="w-full bg-white border-2 border-[#808080] shadow-win98-inner px-2 py-2 text-xs outline-none disabled:opacity-50"
            />
            {isSearching && (
              <div className="mt-2 text-xs text-[#000080] text-center">
                Searching...
              </div>
            )}
            {searchId && !isSearching && (
              <button
                onClick={onClearSearch}
                className="mt-2 w-full px-3 py-2 border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#b0b0b0] active:shadow-win98-inner font-bold text-xs"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
            <label className="text-xs font-bold block mb-2 text-[#000080]">Rarity</label>
            <Win98Select
              options={[
                { value: "", label: "All Rarities" },
                { value: "0", label: "Common" },
                { value: "1", label: "Rare" },
                { value: "2", label: "Epic" },
                { value: "3", label: "Legendary" },
              ]}
              value={selectedRarity}
              onChange={onRarityChange}
            />
          </div>

          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
            <label className="text-xs font-bold block mb-2 text-[#000080]">Level Range</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={levelRange.min}
                onChange={(e) => onLevelRangeChange({ ...levelRange, min: e.target.value })}
                placeholder="Min"
                min="1"
                max="100"
                className="flex-1 bg-white border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-xs"
              />
              <span className="text-xs text-[#808080]">-</span>
              <input
                type="number"
                value={levelRange.max}
                onChange={(e) => onLevelRangeChange({ ...levelRange, max: e.target.value })}
                placeholder="Max"
                min="1"
                max="100"
                className="flex-1 bg-white border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-xs"
              />
            </div>
          </div>

          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
            <label className="text-xs font-bold block mb-2 text-[#000080]">Community Features</label>
            <div className="space-y-1">
              <Win98Checkbox
                checked={selectedCommunityFeatures.has('pet')}
                onChange={() => onToggleCommunityFeature('pet')}
                label="Public Pet Enabled"
              />
            </div>
          </div>

          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
            <label className="text-xs font-bold block mb-2 text-[#000080]">Sort By</label>
            <Win98Select
              options={[
                { value: "token_id", label: "Token ID" },
                { value: "core_level", label: "Level (High to Low)" },
                { value: "leveling_total_exp", label: "Total EXP (High to Low)" },
              ]}
              value={sortBy}
              onChange={onSortByChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onResetFilters}
              className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] font-bold py-3 text-sm hover:bg-[#b0b0b0] active:shadow-win98-inner"
            >
              🔄 Reset All
            </button>
            <button
              onClick={onClose}
              className="border-2 border-[#808080] shadow-win98-outer bg-[#008000] text-white font-bold py-3 text-sm hover:bg-[#006000] active:shadow-win98-inner"
            >
              ✓ Apply
            </button>
          </div>
        </div>

        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </>
  );
};
