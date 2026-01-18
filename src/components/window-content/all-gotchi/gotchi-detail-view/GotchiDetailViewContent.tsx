"use client";

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { GotchiMetadata } from "@/lib/types";
import { useAllEquipLayers } from "@/hooks/useAllEquipLayers";
import {
  useGotchiNavigation,
  useBackgroundSvg,
  useStoryDecoder,
  useEquippedWearables,
  useGotchiComputedData,
} from "./hooks";
import {
  CollapsibleSection,
  EquippedWearableItem,
  DetailHeader,
  GotchiDisplay,
  NavigationBar,
  BasicInfoGrid,
  AttributesSection,
  UnsummonedView,
} from "./components";
import { formatBirthTime } from "./utils";

interface GotchiDetailViewContentProps {
  metadata: GotchiMetadata;
  allMetadata: GotchiMetadata[];
  onClose: () => void;
  onNavigate?: (tokenId: number) => void;
}

export const GotchiDetailViewContent: React.FC<GotchiDetailViewContentProps> = ({
  metadata,
  allMetadata,
  onClose,
  onNavigate,
}) => {
  const isSummoned = metadata.status !== 0;
  const wearableIndices = useAllEquipLayers(metadata.all_equip);

  const { backgroundStyle } = useBackgroundSvg(wearableIndices.backgroundIndex);
  const decodedStory = useStoryDecoder(metadata.story);
  const equippedWearables = useEquippedWearables(metadata.all_equip);
  const {
    currentExp,
    calculatedLevel,
    rarityName,
    rarityColor,
    factionName,
    age,
    attributes,
  } = useGotchiComputedData(metadata);

  const {
    hasPrev,
    hasNext,
    handlePrev,
    handleNext,
    visibleThumbnails,
  } = useGotchiNavigation({ metadata, allMetadata, onNavigate });

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer w-full max-w-6xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#c0c0c0] px-4 py-1 border-b-2 border-[#808080]">
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="w-6 h-6 border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] flex items-center justify-center hover:bg-[#d4d0c8] active:shadow-win98-inner"
            >
              <X size={14} className="text-black" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {!isSummoned ? (
            <UnsummonedView tokenId={metadata.token_id} />
          ) : (
            <>
              <div className="w-2/5 border-r-2 border-[#808080] bg-[#c0c0c0] p-6 flex flex-col">
                <NavigationBar
                  hasPrev={hasPrev}
                  hasNext={hasNext}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  visibleThumbnails={visibleThumbnails}
                  metadata={metadata}
                  onNavigate={onNavigate}
                />
                <GotchiDisplay
                  wearableIndices={wearableIndices}
                  backgroundStyle={backgroundStyle}
                />
              </div>

              <div className="w-3/5 overflow-auto scrollbar-none p-6 bg-[#c0c0c0]">
                <DetailHeader
                  metadata={metadata}
                  calculatedLevel={calculatedLevel}
                  currentExp={currentExp}
                />

                <BasicInfoGrid
                  rarityName={rarityName}
                  rarityColor={rarityColor}
                  factionName={factionName}
                  calculatedLevel={calculatedLevel}
                  age={age}
                  metadata={metadata}
                />

                {metadata.story && (
                  <CollapsibleSection title="Story" icon="/icons/story.png" defaultOpen={true}>
                    <div className="bg-[#d4d0c8] border border-[#808080] shadow-win98-inner p-3 text-sm max-h-32 overflow-y-auto scrollbar-none whitespace-pre-wrap">
                      {decodedStory || 'No story available'}
                    </div>
                  </CollapsibleSection>
                )}

                <AttributesSection attributes={attributes} />

                <CollapsibleSection title="Genetics" icon="/icons/dna.png" defaultOpen={false}>
                  <div className="bg-[#d4d0c8] border border-[#808080] shadow-win98-inner rounded-sm p-3">
                    <div className="mb-2">
                      <span className="text-xs text-[#808080] uppercase block mb-1">DNA Gene Seed</span>
                      <div className="font-mono bg-white p-2 border border-[#808080] overflow-x-auto whitespace-nowrap scrollbar-none text-xs text-[#000080]">
                        {metadata.dna_data?.gene_seed?.toString() || "N/A"}
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                {metadata.birth_time && (
                  <CollapsibleSection title="Gotchi Info" icon="/icons/tba.png" defaultOpen={false}>
                    <div className="bg-[#d4d0c8] border border-[#808080] shadow-win98-inner rounded-sm p-3">
                      <span className="text-xs text-[#808080] uppercase block mb-1">Birth Time</span>
                      <div className="text-xs text-[#000080]">
                        {formatBirthTime(metadata.birth_time)}
                      </div>
                    </div>
                  </CollapsibleSection>
                )}

                {equippedWearables.length > 0 && (
                  <CollapsibleSection title="Equipped Wearables" icon="/icons/equip.png" defaultOpen={false}>
                    <div className="grid grid-cols-4 gap-2">
                      {equippedWearables.map((item, index) => (
                        <EquippedWearableItem
                          key={index}
                          type={item.type}
                          name={item.name}
                          wearableType={item.wearableType}
                          index={item.index}
                          itemIndex={index}
                        />
                      ))}
                    </div>
                  </CollapsibleSection>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
