import { useMemo } from 'react';
import { getWearableName, WearableType } from '@/src/utils/wearableMapping';
import {
  KEY_TO_CONFIG_MAP,
  WearableCategoryKey,
  TOKEN_ID_TO_LOCAL_INDEX
} from '@/components/gotchiSvg/config';
import { normalizeWearableId } from '@/lib/utils';

interface EquippedWearable {
  type: string;
  name: string;
  tokenId: number;
  wearableType: WearableType;
  index: number;
}

export const useEquippedWearables = (allEquip: any[] | undefined): EquippedWearable[] => {
  return useMemo(() => {
    if (!allEquip || !Array.isArray(allEquip)) return [];

    return allEquip
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
      .filter(Boolean) as EquippedWearable[];
  }, [allEquip]);
};
