"use client";

import { useState, useEffect } from 'react';
import { useContractRead } from '@/hooks/useContract';
import { ALL_WEARABLE_SVG } from './svgs';
import { BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32, BG_BYTES32 } from '@/lib/constant';
import { EquipWearableType } from '@/lib/types';

const WEARABLE_CONFIG = {
  background: { key: BG_BYTES32, zIndex: 0, offset: 0, name: "background" },
  body: { key: BODY_BYTES32, zIndex: 1, offset: 9, name: "body" },
  eye: { key: EYE_BYTES32, zIndex: 2, offset: 18, name: "eye" },
  hand: { key: HAND_BYTES32, zIndex: 3, offset: 27, name: "hand" },
  head: { key: HEAD_BYTES32, zIndex: 4, offset: 36, name: "head" },
  clothes: { key: CLOTHES_BYTES32, zIndex: 5, offset: 45, name: "clothes" },
};

type WearableCategoryKey = keyof typeof ALL_WEARABLE_SVG;
const KEY_TO_CONFIG_MAP = Object.values(WEARABLE_CONFIG).reduce((acc, config) => {
    acc[config.key as WearableCategoryKey] = config;
    return acc;
}, {} as Record<WearableCategoryKey, typeof WEARABLE_CONFIG[keyof typeof WEARABLE_CONFIG]>);

interface SvgComposerProps {
  tokenId: string;
  width?: number;
  height?: number;
}

interface SvgLayer {
  svgString: string;
  zIndex: number;
  svgName: string;
}

export const SvgComposer = ({ tokenId, width = 150, height = 150 }: SvgComposerProps) => {
  const [layers, setLayers] = useState<SvgLayer[]>([]);

  const { data: wearableTypeInfos, isLoading, error } = useContractRead(
    "getAllEquipWearableType",
    [tokenId]
  );

  useEffect(() => {
    if (wearableTypeInfos && Array.isArray(wearableTypeInfos)) {
      
      const activeLayers = wearableTypeInfos
        .filter((info: EquipWearableType) => info.equiped) 
        .map((info: EquipWearableType) => {
          const config = KEY_TO_CONFIG_MAP[info.wearableType as WearableCategoryKey];
          if (!config) {
            console.warn(`[Configuration Warning] Unknown wearableType encountered: ${info.wearableType}`);
            return null;
          }

          const localIndex = Number(info.wearableId) - config.offset;

          const ITEMS_PER_CATEGORY = 9; 
          if (localIndex < 0 || localIndex >= ITEMS_PER_CATEGORY) {
            console.error(
              `[On-Chain Data Error] Invalid localIndex calculated for tokenId: ${tokenId}.
               - Global ID: ${info.wearableId}, Type: ${info.wearableType}
               - Calculated Index: ${localIndex} (Not in valid range 0-${ITEMS_PER_CATEGORY - 1})
               - Root Cause: On-chain data is inconsistent. Skipping this layer.`
            );
            return null; 
          }

          const svgArray = ALL_WEARABLE_SVG[config.key as WearableCategoryKey];
          const svgString = svgArray?.[localIndex];
          
          if (!svgString) {
            console.warn(`[Asset Warning] SVG asset not found for a valid index.
             - Global ID: ${info.wearableId}, Local Index: ${localIndex}`);
            return null;
          }

          return {
            svgString: svgString,
            zIndex: config.zIndex,
            svgName: config.name,
          };
        })
        .filter((layer): layer is SvgLayer => layer !== null)
        .sort((a, b) => a.zIndex - b.zIndex);

      setLayers(activeLayers);
    } else {
      setLayers([]);
    }
  }, [wearableTypeInfos, tokenId]); 

  const viewBox = "0 0 80 80"; 

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {isLoading && <div className="text-sm">Loading...</div>}
      {error && <div className="text-sm text-red-500">Error fetching on-chain data.</div>}
      
      {!isLoading && !error && (
        <svg
          width="100%"
          height="100%"
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
        >
          {layers.map((layer) => (
            <g
              key={layer.zIndex}
              className={`gotchi-${layer.svgName}`}
              dangerouslySetInnerHTML={{ __html: layer.svgString }}
            />
          ))}
        </svg>
      )}
    </div>
  );
};