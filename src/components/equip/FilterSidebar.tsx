'use client'

import useResponsive from "@/hooks/useResponsive"
import { CustomDropdown } from "./CustomDropdown"
import { CategoryOption, RarityOption, RARITY_COLORS } from "./types"

interface FilterSidebarProps {
  selectedCategory: string;
  selectedRarity: string;
  resultCount: number;
  onCategoryChange: (value: string) => void;
  onRarityChange: (value: string) => void;
  onResetFilters: () => void;
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

export const FilterSidebar = ({
  selectedCategory,
  selectedRarity,
  resultCount,
  onCategoryChange,
  onRarityChange,
  onResetFilters
}: FilterSidebarProps) => {
  const isMobile = useResponsive();

  return (
    <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] ${isMobile ? 'p-3' : 'p-4'}`}>
      <div className="mb-4 pb-3 border-b-2 border-[#808080]">
        <h2 className={`font-bold text-[#000080] ${isMobile ? 'text-base' : 'text-lg'}`}>
          🔍 Filters
        </h2>
      </div>

      <CustomDropdown
        label="Category"
        options={CATEGORY_OPTIONS}
        selectedValue={selectedCategory}
        onChange={onCategoryChange}
      />

      <CustomDropdown
        label="Rarity"
        options={RARITY_OPTIONS}
        selectedValue={selectedRarity}
        onChange={onRarityChange}
        showColorIndicator
      />

      <div className={`py-3 border-t-2 border-b-2 border-[#808080] ${isMobile ? 'text-xs' : 'text-sm'} bg-white`}>
        <div className="text-center">
          <span className="font-bold">Results: </span>
          <span className="text-[#000080] font-bold text-lg">{resultCount}</span>
          <span className="font-bold"> items</span>
        </div>
      </div>

      {(selectedCategory !== 'all' || selectedRarity !== 'all') && (
        <button
          onClick={onResetFilters}
          className={`w-full mt-4 border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] font-bold hover:bg-[#b0b0b0] active:shadow-win98-inner
            ${isMobile ? 'py-2 text-sm' : 'py-2.5 text-base'}`}
        >
          🔄 Reset Filters
        </button>
      )}
    </div>
  );
};
