import { useState, useEffect } from 'react';
import { useContractRead } from '@/hooks/useContract';
import { ALL_WEARABLE_SVG } from '@/components/gotchiSvg/svgs';
import { KEY_TO_CONFIG_MAP, WearableCategoryKey } from '@/components/gotchiSvg/config'; 
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32 } from '@/lib/constant';
import { EquipWearableType } from "@/lib/types";


const EQUIPMENT_SLOTS = [
  { name: "Background", type: BG_BYTES32, canEquip: false },
  { name: "Body", type: BODY_BYTES32, canEquip: false },
  { name: "Eye", type: EYE_BYTES32, canEquip: false },
  { name: "Hand", type: HAND_BYTES32, canEquip: true },
  { name: "Head", type: HEAD_BYTES32, canEquip: true },
  { name: "Clothes", type: CLOTHES_BYTES32, canEquip: true },
];

export interface EquippedItem {
  name: string;
  canEquip: boolean;
  svgString: string | null;
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

        let svgString: string | null = null;

        if (wearableInfo) {
          const config = KEY_TO_CONFIG_MAP[wearableInfo.wearableType as WearableCategoryKey];
          if (config) {
            const localIndex = Number(wearableInfo.wearableId) - config.offset;
            const ITEMS_PER_CATEGORY = 9;
            if (localIndex >= 0 && localIndex < ITEMS_PER_CATEGORY) {
              const svgObjectArray = ALL_WEARABLE_SVG[config.key as WearableCategoryKey];
              svgString = svgObjectArray?.[localIndex]?.svg || null;
            }
          }
        }
        
        return {
          ...slot,
          svgString: svgString,
        };
      });
      setEquippedItems(slotsWithIcons);
    }
  }, [wearableTypeInfos]);

  return { equippedItems, isLoading, error };
}