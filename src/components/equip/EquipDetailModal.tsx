'use client'

import SvgIcon from "@/components/gotchiSvg/SvgIcon"
import useResponsive from "@/hooks/useResponsive"
import { WearableItem, RARITY_COLORS } from "./types"
import { X } from "lucide-react"

interface EquipDetailModalProps {
  item: WearableItem | null;
  onClose: () => void;
  onAddToCart: (item: WearableItem) => void;
}

export const EquipDetailModal = ({ item, onClose, onAddToCart }: EquipDetailModalProps) => {
  const isMobile = useResponsive();

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-[#c0c0c0] border-4 border-[#dfdfdf] border-t-white border-l-white border-r-[#808080] border-b-[#808080]
          shadow-2xl ${isMobile ? 'w-full max-w-sm p-3' : 'max-w-lg p-6'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b-2 border-[#808080] pb-2">
          <h3 className={`font-bold text-[#000080] ${isMobile ? 'text-base' : 'text-xl'}`}>
            {item.name}
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 bg-[#c0c0c0] border border-[#808080] shadow-win98-outer flex items-center justify-center hover:bg-[#d4d0c8]"
          >
            <X size={16} className="text-black" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className={`bg-white border-2 border-[#808080] flex items-center justify-center mb-4 ${isMobile ? 'p-1' : 'p-1'}`}>
            <SvgIcon
              imagePath={item.imagePath}
              alt={item.name}
              width={isMobile ? 120 : 160}
              height={isMobile ? 120 : 160}
              className="object-contain"
            />
          </div>

          <div className="w-full mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className={`font-bold ${isMobile ? 'text-sm' : ''}`}>Category:</span>
              <span className={`capitalize ${isMobile ? 'text-sm' : ''}`}>{item.category}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className={`font-bold ${isMobile ? 'text-sm' : ''}`}>Rarity:</span>
              <span
                className={`px-3 py-1 rounded text-white font-bold uppercase ${isMobile ? 'text-xs' : 'text-sm'}`}
                style={{ backgroundColor: RARITY_COLORS[item.rarity] }}
              >
                {item.rarity}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className={`font-bold ${isMobile ? 'text-sm' : ''}`}>Price:</span>
              <span className={`font-bold text-[#000080] ${isMobile ? 'text-base' : 'text-lg'}`}>
                {item.price} PHRS
              </span>
            </div>
            <p className={`border-t-2 border-[#808080] pt-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {item.description}
            </p>
          </div>

          <button
            onClick={() => {
              onAddToCart(item);
              onClose();
            }}
            className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] font-bold
              hover:bg-[#b0b0b0] active:shadow-win98-inner ${isMobile ? 'py-2 text-sm' : 'py-2.5 text-base'}`}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
