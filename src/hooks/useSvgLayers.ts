import { useState, useEffect } from 'react';
import { useContractRead } from '@/hooks/useContract';
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32, FACE_BYTES32, MOUTH_BYTES32 } from '@/lib/constant';
import { EquipWearableType } from '@/lib/types';
import { KEY_TO_CONFIG_MAP, WearableCategoryKey, TOKEN_ID_TO_LOCAL_INDEX } from '@/components/gotchiSvg/config';
import { normalizeWearableId } from '@/lib/utils';

export interface SvgLayer {
  svgString: string;
  zIndex: number;
  svgName: string;
}

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

export const useSvgLayers = (tokenId: string) => {
  const [wearableIndices, setWearableIndices] = useState<WearableIndices>({
    backgroundIndex: 0,
    bodyIndex: 0,
    eyeIndex: 0,
    handIndex: 0,
    headIndex: 0,
    clothesIndex: 0,
    faceIndex: 0,
    mouthIndex: 0,
  });

  const { data: wearableTypeInfos, isLoading, error } = useContractRead(
    "getAllEquipWearableType",
    [tokenId]
  );

  useEffect(() => {
    if (wearableTypeInfos && Array.isArray(wearableTypeInfos)) {
      const newIndices: WearableIndices = {
        backgroundIndex: 0,
        bodyIndex: 0,
        eyeIndex: 0,
        handIndex: 0,
        headIndex: 0,
        clothesIndex: 0,
        faceIndex: 0,
        mouthIndex: 0,
      };

      wearableTypeInfos
        .filter((info: EquipWearableType) => info.equiped)
        .forEach((info: EquipWearableType) => {
          const config = KEY_TO_CONFIG_MAP[info.wearableType as WearableCategoryKey];
          if (!config) return;

          const categoryMapping = TOKEN_ID_TO_LOCAL_INDEX[config.name];
          if (!categoryMapping) return;

          const tokenId = normalizeWearableId(Number(info.wearableId));
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
            default:
              break;
          }
        });

      setWearableIndices(newIndices);

    } else {
      setWearableIndices({
        backgroundIndex: 0,
        bodyIndex: 0,
        eyeIndex: 0,
        handIndex: 0,
        headIndex: 0,
        clothesIndex: 0,
        faceIndex: 0,
        mouthIndex: 0,
      });
    }
  }, [wearableTypeInfos]);

  return {
    wearableIndices,
    isLoading,
    error
  };
};