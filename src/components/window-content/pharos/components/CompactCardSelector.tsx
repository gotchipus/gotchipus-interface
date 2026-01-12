"use client"

import Image from "next/image"
import { useStores } from "@stores/context"
import type { GotchipusPreview } from "../types"

interface CompactCardSelectorProps {
  gotchipusPreviews: GotchipusPreview[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export const CompactCardSelector = ({
  gotchipusPreviews,
  selectedIndex,
  onSelect
}: CompactCardSelectorProps) => {
  const { storyStore } = useStores();
  return (
    <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
      <h4 className="text-sm font-bold mb-2 text-center">Choose Your Gotchipus</h4>
      <div className="grid grid-cols-5 gap-2">
        {gotchipusPreviews.map((preview, index) => (
          <div
            key={preview.id}
            className={`
              relative cursor-pointer border-2 rounded-sm overflow-hidden
              ${selectedIndex === index
                ? 'border-[#FAC428] shadow-lg'
                : 'border-[#808080] hover:border-[#b8b8b8]'
              }
              transition-all duration-200
            `}
            onClick={() => onSelect(index)}
          >
            <div className="w-full h-16 bg-black overflow-hidden">
              {typeof preview.image === 'string' ? (
                <Image
                  src={preview.image}
                  alt={`Gotchipus #${index + 1}`}
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:scale-125 flex items-center justify-center">
                  {preview.image}
                </div>
              )}
            </div>
            {selectedIndex === index && (
              <div className="absolute inset-0 bg-[#FAC428] bg-opacity-20 pointer-events-none" />
            )}
            {selectedIndex === index && storyStore.isFetching && (
              <div className="absolute top-1 right-1">
                <div className="w-3 h-3 border border-[#FAC428] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

