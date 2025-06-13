import { useState, useEffect } from 'react';
import { useContractRead } from '@/hooks/useContract';
import { ALL_WEARABLE_SVG } from '@/components/gotchiSvg/svgs';
import { BG_BYTES32 } from '@/lib/constant';
import { EquipWearableType } from '@/lib/types';
import { KEY_TO_CONFIG_MAP, WearableCategoryKey } from '@/components/gotchiSvg/config';

export interface SvgLayer {
  svgString: string;
  zIndex: number;
  svgName: string;
}

export const useSvgLayers = (tokenId: string) => {
  const [layers, setLayers] = useState<SvgLayer[]>([]);
  const [backgroundSvg, setBackgroundSvg] = useState<string | null>(null);

  const { data: wearableTypeInfos, isLoading, error } = useContractRead(
    "getAllEquipWearableType",
    [tokenId]
  );

  useEffect(() => {
    if (wearableTypeInfos && Array.isArray(wearableTypeInfos)) {
      const foregroundLayers: SvgLayer[] = [];
      let foundBackground: string | null = null;

      wearableTypeInfos
        .filter((info: EquipWearableType) => info.equiped)
        .forEach((info: EquipWearableType) => {
          const config = KEY_TO_CONFIG_MAP[info.wearableType as WearableCategoryKey];
          if (!config) return;

          const localIndex = Number(info.wearableId) - config.offset;
          const ITEMS_PER_CATEGORY = 9;
          if (localIndex < 0 || localIndex >= ITEMS_PER_CATEGORY) return;

          const svgObjectArray = ALL_WEARABLE_SVG[config.key as WearableCategoryKey];
          const wearableDef = svgObjectArray?.[localIndex];

          if (!wearableDef || !wearableDef.svg) return;
          const svgString = wearableDef.svg;

          if (config.key === BG_BYTES32) {
            foundBackground = svgString;
          } else {
            foregroundLayers.push({
              svgString: svgString,
              zIndex: config.zIndex,
              svgName: config.name,
            });
          }
        });

      foregroundLayers.sort((a, b) => a.zIndex - b.zIndex);
      setLayers(foregroundLayers);
      
      setBackgroundSvg(foundBackground);

    } else {
      setLayers([]);
      setBackgroundSvg(null);
    }
  }, [wearableTypeInfos]);

  return { layers, backgroundSvg, isLoading, error };
};