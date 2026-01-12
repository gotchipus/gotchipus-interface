import { useMemo } from 'react';
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32, FACE_BYTES32, MOUTH_BYTES32 } from '@/lib/constant';
import { KEY_TO_CONFIG_MAP, WearableCategoryKey, TOKEN_ID_TO_LOCAL_INDEX } from '@/components/gotchiSvg/config';
import { normalizeWearableId } from '@/lib/utils';

export interface WearableIndices {
  backgroundIndex: number;
  bodyIndex: number;
  eyeIndex: number;
  handIndex: number;
  headIndex: number;
  clothesIndex: number;
  faceIndex: number;
  mouthIndex: number;
}

interface EquipItem {
  equipped: boolean;
  wearable_id: string;
  wearable_type: string;
}

const decodeHexToString = (hex: string): string => {
  if (!hex || hex === '0x0000000000000000000000000000000000000000000000000000000000000000') {
    return '';
  }

  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;

  let result = '';
  for (let i = 0; i < cleanHex.length; i += 2) {
    const byte = parseInt(cleanHex.substr(i, 2), 16);
    if (byte === 0) break;
    result += String.fromCharCode(byte);
  }

  return result;
};

export const useAllEquipLayers = (allEquipData: EquipItem[] | string | null | undefined) => {
  const wearableIndices = useMemo<WearableIndices>(() => {
    const defaultIndices: WearableIndices = {
      backgroundIndex: 0,
      bodyIndex: 0,
      eyeIndex: 0,
      handIndex: 0,
      headIndex: 0,
      clothesIndex: 0,
      faceIndex: 0,
      mouthIndex: 0,
    };

    if (!allEquipData) {
      return defaultIndices;
    }

    try {
      const equipItems: EquipItem[] = typeof allEquipData === 'string'
        ? JSON.parse(allEquipData)
        : allEquipData;

      if (!Array.isArray(equipItems)) {
        console.warn('all_equip is not an array:', allEquipData);
        return defaultIndices;
      }

      const newIndices = { ...defaultIndices };

      const equippedItems = equipItems.filter((item: EquipItem) => item.equipped);

      equippedItems.forEach((item: EquipItem) => {
          const wearableTypeString = decodeHexToString(item.wearable_type);
          if (!wearableTypeString) return;

          const config = KEY_TO_CONFIG_MAP[item.wearable_type as WearableCategoryKey];
          if (!config) return;

          const categoryMapping = TOKEN_ID_TO_LOCAL_INDEX[config.name];
          if (!categoryMapping) return;

          const tokenId = normalizeWearableId(Number(item.wearable_id));
          const localIndex = categoryMapping[tokenId];
          if (localIndex === undefined) return;

          switch (config.key) {
            case BG_BYTES32:
              newIndices.backgroundIndex = localIndex;
              break;
            case BODY_BYTES32:
              newIndices.bodyIndex = localIndex;
              break;
            case EYE_BYTES32:
              newIndices.eyeIndex = localIndex;
              break;
            case HAND_BYTES32:
              newIndices.handIndex = localIndex;
              break;
            case HEAD_BYTES32:
              newIndices.headIndex = localIndex;
              break;
            case CLOTHES_BYTES32:
              newIndices.clothesIndex = localIndex;
              break;
            case FACE_BYTES32:
              newIndices.faceIndex = localIndex;
              break;
            case MOUTH_BYTES32:
              newIndices.mouthIndex = localIndex;
              break;
          }
        });

      return newIndices;
    } catch (error) {
      console.error('Error parsing all_equip data:', error);
      return defaultIndices;
    }
  }, [allEquipData]);

  return wearableIndices;
};
