"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import EnhancedGotchiSvg from "@/components/gotchiSvg/EnhancedGotchiSvg";
import { backgrounds } from "@/components/gotchiSvg/svgs";
import { renderToStaticMarkup } from "react-dom/server";
import { GotchiMetadata } from "@/lib/types";
import { useAllEquipLayers } from "@/hooks/useAllEquipLayers";
import { getWearableName, getWearableImagePath, WearableType } from "@/src/utils/wearableMapping";
import { ethers } from "ethers";
import {
  KEY_TO_CONFIG_MAP,
  WearableCategoryKey,
  TOKEN_ID_TO_LOCAL_INDEX
} from '@/components/gotchiSvg/config';
import { normalizeWearableId } from "@/lib/utils";

interface GotchiDetailViewProps {
  metadata: GotchiMetadata;
  allMetadata: GotchiMetadata[];
  onClose: () => void;
  onNavigate?: (tokenId: number) => void;
}

const RARITY_NAMES: Record<number, string> = {
  0: "Common",
  1: "Rare",
  2: "Epic",
  3: "Legendary",
};

const RARITY_COLORS: Record<number, string> = {
  0: "bg-[#808080] text-white",
  1: "bg-[#0066cc] text-white",
  2: "bg-[#9933cc] text-white",
  3: "bg-[#ff9900] text-white",
};

const FACTION_NAMES: Record<number, string> = {
  0: "COMBAT",
  1: "DEFENSE",
  2: "TECHNOLOGY",
};


const CollapsibleSection: React.FC<{
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-4 flex flex-col rounded-lg bg-[#d4d0c8]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full flex-row justify-between px-4 py-2 border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d0c8] active:shadow-win98-inner"
      >
        <div className="flex items-center">
          {icon && (
            <Image src={icon} alt={title} width={18} height={18} className="mr-2" />
          )}
          <h5 className="text-sm font-bold text-[#000080] uppercase">{title}</h5>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-[#000080]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-2 border-t-0 border-[#808080] shadow-win98-inner bg-[#c0c0c0]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ThumbnailItem: React.FC<{
  item: GotchiMetadata;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  const itemWearableIndices = useAllEquipLayers(item.all_equip);

  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex-shrink-0 border-2 overflow-hidden bg-white transition-all ${
        isActive
          ? 'border-[#000080] shadow-win98-outer scale-110'
          : 'border-[#808080] shadow-win98-inner opacity-70 hover:opacity-100 hover:border-[#000080]'
      }`}
    >
      {item.status !== 0 ? (
        <EnhancedGotchiSvg
          wearableIndices={itemWearableIndices}
          width={40}
          height={40}
        />
      ) : (
        <Image
          src="/pharos-summon.gif"
          alt="Unsummoned"
          width={40}
          height={40}
          className="object-cover"
          unoptimized
        />
      )}
    </button>
  );
};

const EquippedWearableItem: React.FC<{
  type: string;
  name: string;
  wearableType: WearableType;
  index: number;
  itemIndex: number;
}> = ({ type, name, wearableType, index, itemIndex }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isFirstRow = itemIndex < 4;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full aspect-square border-2 border-[#808080] shadow-win98-inner bg-[#d4d0c8] rounded-sm flex items-center justify-center cursor-pointer hover:bg-[#c0c0c0] overflow-hidden">
        <div className="w-full h-full relative p-2">
          <Image
            src={getWearableImagePath(wearableType, index)}
            alt={name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: isFirstRow ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isFirstRow ? -10 : 10 }}
            className={`absolute z-30 ${
              isFirstRow
                ? 'top-full mt-2'
                : 'bottom-full mb-2'
            } left-1/2 transform -translate-x-1/2 bg-[#FFFFCC] border-2 border-[#000000] p-2 rounded whitespace-nowrap text-xs shadow-win98-outer`}
          >
            {name}
            <div className={`absolute left-1/2 transform -translate-x-1/2 ${
              isFirstRow
                ? 'top-0 -translate-y-full'
                : 'bottom-0 translate-y-full'
            }`}>
              <div className={`border-4 border-transparent ${
                isFirstRow
                  ? 'border-b-[#000000]'
                  : 'border-t-[#000000]'
              }`}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GotchiDetailView: React.FC<GotchiDetailViewProps> = ({
  metadata,
  allMetadata,
  onClose,
  onNavigate
}) => {
  const isSummoned = metadata.status !== 0;
  const wearableIndices = useAllEquipLayers(metadata.all_equip);

  const backgroundComponent = backgrounds(wearableIndices.backgroundIndex);
  const backgroundSvg = backgroundComponent
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${renderToStaticMarkup(backgroundComponent)}</svg>`
    : null;

  const backgroundStyle = backgroundSvg
    ? { backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(backgroundSvg)}")` }
    : {};

  const currentExp = metadata.leveling_data?.current_exp || 0;
  const calculatedLevel = Math.floor(Number(currentExp) / 100);
  const rarity = metadata.dna_data?.rarity ?? 0;
  const rarityName = RARITY_NAMES[rarity] || "Common";
  const rarityColor = RARITY_COLORS[rarity] || "bg-[#808080] text-white";
  const primaryFaction = metadata.faction_primary ?? 0;
  const factionName = FACTION_NAMES[primaryFaction] || "COMBAT";

  const age = metadata.birth_time
    ? Math.floor((Date.now() / 1000 - metadata.birth_time) / 86400)
    : 0;

  const decodedStory = useMemo(() => {
    if (!metadata.story) return '';

    try {
      if (typeof metadata.story === 'string') {
        const story = metadata.story.trim();

        if (story.startsWith('\\x')) {
          const hexWithPrefix = '0x' + story.slice(2);
          const decoded = ethers.toUtf8String(hexWithPrefix);
          return decoded;
        }

        if (story.startsWith('0x')) {
          const decoded = ethers.toUtf8String(story);
          return decoded;
        }

        return story;
      }

      return '';
    } catch (error) {
      console.error('Failed to decode story:', error, 'Original:', metadata.story);
      return typeof metadata.story === 'string' ? metadata.story : '';
    }
  }, [metadata.story]);

  const equippedWearables = useMemo(() => {
    if (!metadata.all_equip || !Array.isArray(metadata.all_equip)) return [];

    return metadata.all_equip
      .filter(item => item.equipped)
      .map(item => {
        const config = KEY_TO_CONFIG_MAP[item.wearable_type as WearableCategoryKey];
        if (!config) return null;

        const tokenId = normalizeWearableId(Number(item.wearable_id));

        const categoryMapping = TOKEN_ID_TO_LOCAL_INDEX[config.name];
        if (!categoryMapping) return null;

        const localIndex = categoryMapping[tokenId];
        if (localIndex === undefined) return null;

        const arrayIndex = localIndex - 1;

        const wearableTypeMapping: Record<string, WearableType> = {
          'head': 'heads',
          'hand': 'hands',
          'clothes': 'clothes',
          'face': 'faces',
          'mouth': 'mouths',
          'background': 'backgrounds',
          'body': 'bodys',
          'eye': 'eyes',
        };

        const wearableType = wearableTypeMapping[config.name] as WearableType;
        const wearableName = getWearableName(wearableType, arrayIndex);

        return {
          type: config.name,
          name: wearableName || `${config.name} #${tokenId}`,
          tokenId: tokenId,
          wearableType: wearableType,
          index: arrayIndex
        };
      })
      .filter(Boolean);
  }, [metadata.all_equip]);

  const currentIndex = allMetadata.findIndex(m => m.token_id === metadata.token_id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allMetadata.length - 1;

  const handlePrev = () => {
    if (hasPrev && onNavigate) {
      onNavigate(allMetadata[currentIndex - 1].token_id);
    }
  };

  const handleNext = () => {
    if (hasNext && onNavigate) {
      onNavigate(allMetadata[currentIndex + 1].token_id);
    }
  };

  const visibleThumbnails = useMemo(() => {
    const maxVisible = 8;
    const halfVisible = Math.floor(maxVisible / 2);

    let startIndex = Math.max(0, currentIndex - halfVisible);
    let endIndex = Math.min(allMetadata.length, startIndex + maxVisible);

    if (endIndex - startIndex < maxVisible) {
      startIndex = Math.max(0, endIndex - maxVisible);
    }

    return allMetadata.slice(startIndex, endIndex);
  }, [allMetadata, currentIndex]);

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const attributes = [
    { name: "STR", value: metadata.core_strength / 100 || 0, icon: "strength" },
    { name: "DEF", value: metadata.core_defense / 100 || 0, icon: "defense" },
    { name: "INT", value: metadata.core_mind / 100 || 0, icon: "mind" },
    { name: "VIT", value: metadata.core_vitality / 100 || 0, icon: "vitality" },
    { name: "AGI", value: metadata.core_agility / 100 || 0, icon: "agility" },
    { name: "LUK", value: metadata.core_luck / 100 || 0, icon: "luck" },
  ];

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
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-center">
                <div className="mb-4">
                  <Image
                    src="/pharos-summon.gif"
                    alt="Unsummoned"
                    width={200}
                    height={200}
                    className="mx-auto"
                    unoptimized
                  />
                </div>
                <h2 className="text-2xl font-bold text-[#808080] mb-2">Not Summoned</h2>
                <p className="text-sm text-[#808080]">This Gotchipus has not been summoned yet.</p>
                <div className="mt-4 bg-white border-2 border-[#808080] shadow-win98-inner p-3 inline-block">
                  <div className="text-xs font-bold text-[#000080]">Token ID: #{metadata.token_id}</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="w-2/5 border-r-2 border-[#808080] bg-[#c0c0c0] p-6 flex flex-col">
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

                <div
                  className="border-2 border-[#808080] shadow-win98-outer rounded-sm p-8 bg-cover bg-center"
                  style={{
                    ...backgroundStyle,
                    width: '400px',
                    height: '400px',
                    backgroundColor: backgroundStyle.backgroundImage ? 'transparent' : '#ffffff'
                  }}
                >
                  <motion.div
                    className="w-full h-full flex items-center justify-center"
                    animate={floatAnimation}
                  >
                    <EnhancedGotchiSvg
                      wearableIndices={wearableIndices}
                      width={320}
                      height={320}
                    />
                  </motion.div>
                </div>
              </div>

              <div className="w-3/5 overflow-auto scrollbar-none p-6 bg-[#c0c0c0]">
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
                          {Math.floor(((Number(currentExp) / 100) % 1) * 100)}/100 XP
                        </div>
                      </div>
                      <div className="w-full bg-white border border-[#808080] h-3">
                        <div
                          className="bg-[#000080] h-full"
                          style={{ width: `${((Number(currentExp) / 100) % 1) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-[#808080]"></div>
                </div>

                <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner rounded-sm p-2">
                    <div className="text-[10px] text-[#808080] uppercase mb-1">Rarity</div>
                    <div className={`text-xs font-bold px-2 py-0.5 inline-block ${rarityColor} rounded-sm`}>
                      {rarityName}
                    </div>
                  </div>
                  <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner rounded-sm p-2">
                    <div className="text-[10px] text-[#808080] uppercase mb-1">Faction</div>
                    <div className="text-xs font-bold text-[#000080]">{factionName}</div>
                  </div>
                  <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner rounded-sm p-2">
                    <div className="text-[10px] text-[#808080] uppercase mb-1">Level</div>
                    <div className="text-xs font-bold text-[#000080]">
                      {calculatedLevel} {metadata.is_evolved && <span className="text-[#ffd700]">★{metadata.core_evolution}</span>}
                    </div>
                  </div>
                  <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner rounded-sm p-2">
                    <div className="text-[10px] text-[#808080] uppercase mb-1">Age</div>
                    <div className="text-xs font-bold text-[#000080]">{age} days</div>
                  </div>
                </div>

                {metadata.story && (
                  <CollapsibleSection title="Story" icon="/icons/story.png" defaultOpen={true}>
                    <div className="bg-[#d4d0c8] border border-[#808080] shadow-win98-inner p-3 text-sm max-h-32 overflow-y-auto scrollbar-none whitespace-pre-wrap">
                      {decodedStory || 'No story available'}
                    </div>
                  </CollapsibleSection>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Image src="/icons/attribute.png" alt="Attributes" width={18} height={18} />
                    <h5 className="text-sm font-bold text-[#000080] uppercase">Attributes</h5>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {attributes.map((attr, index) => (
                      <div key={index} className="bg-[#d4d0c8] border border-[#808080] shadow-win98-inner rounded-sm p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Image src={`/icons/${attr.icon}.png`} alt={attr.name} width={14} height={14} />
                          <span className="text-xs text-[#808080] uppercase">{attr.name}</span>
                        </div>
                        <div className="text-lg font-bold text-[#000080]">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

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
                        {new Date(metadata.birth_time * 1000).toLocaleString()}
                      </div>
                    </div>
                  </CollapsibleSection>
                )}

                {equippedWearables.length > 0 && (
                  <CollapsibleSection title="Equipped Wearables" icon="/icons/equip.png" defaultOpen={false}>
                    <div className="grid grid-cols-4 gap-2">
                      {equippedWearables.map((item: any, index: number) => (
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

export default GotchiDetailView;
