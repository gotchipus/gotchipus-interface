"use client";

import { useState, useEffect, ReactNode } from 'react';
import GotchiCard from "./GotchiCard";
import GotchiCompactCard from "./GotchiCompactCard";
import GotchiPreviewCard from "./GotchiPreviewCard";
import { GotchiItem } from '@/lib/types';


interface GotchiGridProps {
  gotchiList: GotchiItem[];
  onGotchiAction?: (gotchi: GotchiItem) => void;
  onGotchiSelect?: (gotchi: GotchiItem) => void;
  getButtonText?: (gotchi: GotchiItem) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  className?: string;
  compactThreshold?: number; 
  headerComponent?: ReactNode;
  selectedGotchiId?: string | null; 
  onSelectedGotchiChange?: (gotchi: GotchiItem | null) => void; 
}

const GotchiGrid = ({
  gotchiList,
  onGotchiAction,
  onGotchiSelect,
  getButtonText = () => "Action",
  isLoading = false,
  emptyMessage = "You don't have any Gotchis yet!",
  emptySubMessage = "Mint some Gotchis first to start using them.",
  className = "",
  compactThreshold = 3,
  headerComponent,
  selectedGotchiId: externalSelectedGotchiId,
  onSelectedGotchiChange,
}: GotchiGridProps) => {
  const [internalSelectedGotchiId, setInternalSelectedGotchiId] = useState<string | null>(null);
  
  const selectedGotchiId = externalSelectedGotchiId !== undefined ? externalSelectedGotchiId : internalSelectedGotchiId;

  useEffect(() => {
    if (gotchiList.length > 0 && !selectedGotchiId) {
      const firstGotchi = gotchiList[0];
      if (externalSelectedGotchiId === undefined) {
        setInternalSelectedGotchiId(firstGotchi.id);
      }
      onSelectedGotchiChange?.(firstGotchi);
    }
  }, [gotchiList, selectedGotchiId, externalSelectedGotchiId, onSelectedGotchiChange]);

  const selectedGotchi = gotchiList.find(g => g.id === selectedGotchiId);

  const handleGotchiSelect = (gotchi: GotchiItem) => {
    if (externalSelectedGotchiId === undefined) {
      setInternalSelectedGotchiId(gotchi.id);
    }
    onSelectedGotchiChange?.(gotchi);
    onGotchiSelect?.(gotchi);
  };

  const handleGotchiAction = (gotchi: GotchiItem) => {
    onGotchiAction?.(gotchi);
  };

  if (isLoading) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-win98-innerp-6 text-center">
        <p className="text-sm text-[#404040]">Loading your Gotchis...</p>
      </div>
    );
  }

  if (gotchiList.length === 0) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-win98-innerp-6 text-center">
        <p className="text-sm text-[#404040]">{emptyMessage}</p>
        <p className="text-xs text-[#808080] mt-2">{emptySubMessage}</p>
      </div>
    );
  }

  const useCompactLayout = gotchiList.length > compactThreshold;

  return (
    <div className={`w-full ${className}`}>
      {headerComponent}
      
      {useCompactLayout ? (
        <div className="flex gap-4">
          <div className="w-60">
            {selectedGotchi && (
              <GotchiPreviewCard
                name={selectedGotchi.info?.name || `Gotchi #${selectedGotchi.id}`}
                id={selectedGotchi.id}
                buttonText={getButtonText(selectedGotchi)}
                onAction={() => handleGotchiAction(selectedGotchi)}
              />
            )}
          </div>
          
          <div className="w-1/2">
            <h4 className="text-sm font-bold text-[#000080] mb-2">
              Your Gotchis ({gotchiList.length})
            </h4>
            <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="grid grid-cols-2 gap-1">
                {gotchiList.map((gotchi) => (
                  <GotchiCompactCard
                    key={gotchi.id}
                    name={gotchi.info?.name || `Gotchi #${gotchi.id}`}
                    id={gotchi.id}
                    isSelected={selectedGotchiId === gotchi.id}
                    onClick={() => handleGotchiSelect(gotchi)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {gotchiList.map((gotchi) => (
            <GotchiCard
              key={gotchi.id}
              name={gotchi.info?.name || `Gotchi #${gotchi.id}`}
              id={gotchi.id}
              className="cursor-pointer"
              buttonName={getButtonText(gotchi)}
              buttonAction={() => handleGotchiAction(gotchi)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GotchiGrid;