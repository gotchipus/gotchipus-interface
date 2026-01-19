'use client'

import { useState } from "react"
import { CustomDropdown } from "./CustomDropdown"
import { CategoryOption, RarityOption, RARITY_COLORS } from "./types"

interface MobileFilterMenuProps {
  isOpen: boolean;
  selectedCategory: string;
  selectedRarity: string;
  resultCount: number;
  onCategoryChange: (value: string) => void;
  onRarityChange: (value: string) => void;
  onResetFilters: () => void;
  onClose: () => void;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'all', label: 'All Categories', icon: '📦' },
  { value: 'head', label: 'Head', icon: '👤' },
  { value: 'hand', label: 'Hand', icon: '✋' },
  { value: 'clothes', label: 'Clothes', icon: '👕' },
  { value: 'face', label: 'Face', icon: '😀' },
  { value: 'mouth', label: 'Mouth', icon: '👄' }
];

const RARITY_OPTIONS: RarityOption[] = [
  { value: 'all', label: 'All Rarities', color: '#808080' },
  { value: 'common', label: 'Common', color: RARITY_COLORS.common },
  { value: 'rare', label: 'Rare', color: RARITY_COLORS.rare },
  { value: 'epic', label: 'Epic', color: RARITY_COLORS.epic },
  { value: 'legendary', label: 'Legendary', color: RARITY_COLORS.legendary }
];

export const MobileFilterMenu = ({
  isOpen,
  selectedCategory,
  selectedRarity,
  resultCount,
  onCategoryChange,
  onRarityChange,
  onResetFilters,
  onClose
}: MobileFilterMenuProps) => {
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localRarity, setLocalRarity] = useState(selectedRarity);

  if (!isOpen) return null;

  const handleApply = () => {
    onCategoryChange(localCategory);
    onRarityChange(localRarity);
    onClose();
  };

  const handleReset = () => {
    setLocalCategory('all');
    setLocalRarity('all');
    onResetFilters();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-[101] bg-[#c0c0c0] border-t-4 border-[#808080] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] animate-slide-up max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#000080] text-white px-4 py-3 flex items-center justify-between z-10">
          <h2 className="font-bold text-lg flex items-center gap-2">
            🔍 Filters
          </h2>
          <button
            onClick={onClose}
            className="border-2 border-white bg-[#000060] hover:bg-[#000040] px-3 py-1 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Current Results */}
          <div className="border-2 border-[#808080] shadow-win98-inner bg-white p-3 text-center">
            <span className="font-bold text-sm">Results: </span>
            <span className="text-[#000080] font-bold text-xl">{resultCount}</span>
            <span className="font-bold text-sm"> items</span>
          </div>

          {/* Category Filter */}
          <CustomDropdown
            label="Category"
            options={CATEGORY_OPTIONS}
            selectedValue={localCategory}
            onChange={setLocalCategory}
          />

          {/* Rarity Filter */}
          <CustomDropdown
            label="Rarity"
            options={RARITY_OPTIONS}
            selectedValue={localRarity}
            onChange={setLocalRarity}
            showColorIndicator
          />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleReset}
              className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] font-bold py-3 text-sm hover:bg-[#b0b0b0] active:shadow-win98-inner"
            >
              🔄 Reset
            </button>
            <button
              onClick={handleApply}
              className="border-2 border-[#808080] shadow-win98-outer bg-[#008000] text-white font-bold py-3 text-sm hover:bg-[#006000] active:shadow-win98-inner"
            >
              ✓ Apply Filters
            </button>
          </div>

          {/* Active Filters Display */}
          {(localCategory !== 'all' || localRarity !== 'all') && (
            <div className="border-2 border-[#808080] shadow-win98-inner bg-[#d4d0c8] p-3">
              <p className="text-xs font-bold text-[#808080] mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {localCategory !== 'all' && (
                  <span className="bg-[#000080] text-white px-2 py-1 text-xs rounded">
                    {CATEGORY_OPTIONS.find(c => c.value === localCategory)?.icon} {CATEGORY_OPTIONS.find(c => c.value === localCategory)?.label}
                  </span>
                )}
                {localRarity !== 'all' && (
                  <span
                    className="text-white px-2 py-1 text-xs rounded"
                    style={{ backgroundColor: RARITY_OPTIONS.find(r => r.value === localRarity)?.color }}
                  >
                    {RARITY_OPTIONS.find(r => r.value === localRarity)?.label}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Safe Area Padding for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </>
  );
};
