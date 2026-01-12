'use client'

import SvgIcon from "@/components/gotchiSvg/SvgIcon"
import useResponsive from "@/hooks/useResponsive"
import { WearableItem, RARITY_COLORS } from "./types"

interface EquipCardProps {
  item: WearableItem;
  isInCart: boolean;
  onItemClick: (item: WearableItem) => void;
  onAddToCart: (item: WearableItem) => void;
}

export const EquipCard = ({ item, isInCart, onItemClick, onAddToCart }: EquipCardProps) => {
  const isMobile = useResponsive();

  return (
    <div
      className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:border-[#000080] transition-all ${isMobile ? 'p-2' : 'p-3'}`}
    >
      <div
        onClick={() => onItemClick(item)}
        className="cursor-pointer mb-3 relative aspect-square border-2 border-[#808080] overflow-hidden"
      >
        <div
          className={`absolute top-1 left-1 px-2 py-0.5 text-white font-bold uppercase shadow-md z-10 ${isMobile ? 'text-[10px]' : 'text-xs'}`}
          style={{ backgroundColor: RARITY_COLORS[item.rarity] }}
        >
          {item.rarity}
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <SvgIcon
            imagePath={item.imagePath}
            alt={item.name}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className={`flex items-center justify-between ${isMobile ? 'text-xs' : 'text-sm'}`}>
          <span className="font-bold capitalize">{item.category}</span>
          <span className="text-[#808080] font-mono">#{item.id}</span>
        </div>

        <div className="border-t-2 border-[#808080]"></div>

        <p className={`font-bold truncate ${isMobile ? 'text-sm' : 'text-base'}`} title={item.name}>
          {item.name}
        </p>

        <div className="flex items-center gap-2">
          <span className={`font-bold text-[#000080] flex-shrink-0 ${isMobile ? 'text-sm' : 'text-base'}`}>
            {item.price} PHRS
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            disabled={isInCart}
            className={`flex-1 border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] font-bold
              ${isMobile ? 'py-1 text-xs' : 'py-1.5 text-sm'}
              ${isInCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#b0b0b0] active:shadow-win98-inner'}`}
          >
            {isInCart ? '✓ In Cart' : 'Buy'}
          </button>
        </div>
      </div>
    </div>
  );
};
