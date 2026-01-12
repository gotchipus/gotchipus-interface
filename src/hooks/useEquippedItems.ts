import { useState, useEffect } from 'react';
import { useContractRead } from '@/hooks/useContract';
import { TOKEN_ID_TO_IMAGE } from '@/components/gotchiSvg/config';
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, FACE_BYTES32, MOUTH_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32 } from '@/lib/constant';
import { EquipWearableType } from "@/lib/types";
import { normalizeWearableId } from '@/lib/utils';


const EQUIPMENT_SLOTS = [
  { name: "Background", type: BG_BYTES32, canEquip: false },
  { name: "Body", type: BODY_BYTES32, canEquip: false },
  { name: "Eye", type: EYE_BYTES32, canEquip: false },
  { name: "Hand", type: HAND_BYTES32, canEquip: true },
  { name: "Head", type: HEAD_BYTES32, canEquip: true },
  { name: "Clothes", type: CLOTHES_BYTES32, canEquip: true },
  { name: "Face", type: FACE_BYTES32, canEquip: true },
  { name: "Mouth", type: MOUTH_BYTES32, canEquip: true },
];

export interface EquippedItem {
  name: string;
  canEquip: boolean;
  svgString: string | null;
  imagePath: string | null;
}

export const useEquippedItems = (tokenId: number) => {
  const [equippedItems, setEquippedItems] = useState<EquippedItem[]>([]);
  const { data: wearableTypeInfos, isLoading, error } = useContractRead("getAllEquipWearableType", [tokenId]);
  
  useEffect(() => {
    if (wearableTypeInfos && Array.isArray(wearableTypeInfos)) {
      const slotsWithIcons = EQUIPMENT_SLOTS.map(slot => {
        const wearableInfo = wearableTypeInfos.find(
          (info: EquipWearableType) => info.equiped && info.wearableType === slot.type
        );

        let imagePath: string | null = null;

        if (wearableInfo) {
          const tokenId = normalizeWearableId(Number(wearableInfo.wearableId));
          imagePath = TOKEN_ID_TO_IMAGE[tokenId] || null;
        }

        return {
          ...slot,
          svgString: null,
          imagePath: imagePath,
        };
      });
      setEquippedItems(slotsWithIcons);
    }
  }, [wearableTypeInfos]);

  return { equippedItems, isLoading, error };
}