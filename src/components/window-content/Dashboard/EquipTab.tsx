"use client"

import Image from "next/image"
import { useEffect } from "react"
import { useContractRead, useContractWrite } from "@/hooks/useContract"
import { useStores } from "@stores/context"
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32 } from "@/lib/constant"
import { observer } from "mobx-react-lite"

interface EquipTabProps {
  tokenId: number;
  selectedEquipSlot: number | null
  handleEquipSlotClick: (index: number) => void
  handleEquipWearable: (ids: string[]) => void
}

interface EquipWearableType {
  wearableType: string;
  wearableId: number;
  equiped: boolean;
}

const WEARABLE_ICON_MAP = {
  // Background
  0: "/gotchi/Backgrounds/Pastel Blue.png",
  1: "/gotchi/Backgrounds/Pastel Green.png",
  2: "/gotchi/Backgrounds/Pastel Orange.png",
  3: "/gotchi/Backgrounds/Pastel Purple.png",
  4: "/gotchi/Backgrounds/Pastel Red.png",
  5: "/gotchi/Backgrounds/Pastel Yellow.png",
  6: "/gotchi/Backgrounds/Space.png",
  7: "/gotchi/Backgrounds/Underwater.png",
  8: "/gotchi/Backgrounds/Valley.png",
  
  // Body
  9: "/gotchi/Body/Deep Ocean Blue.png",
  10: "/gotchi/Body/Ghost.png",
  11: "/gotchi/Body/Glowing Neon.png",
  12: "/gotchi/Body/Holographic Circuit Skin  Matrix.png",
  13: "/gotchi/Body/Lava Texture.png",
  14: "/gotchi/Body/Metallic Gold.png",
  15: "/gotchi/Body/Orange Alien.png",
  16: "/gotchi/Body/SemiTransparent Jellyfish.png",
  17: "/gotchi/Body/Starry Night.png",
  
  // Eye
  18: "/gotchi/Eyes/Black Shades.png",
  19: "/gotchi/Eyes/Digital Matrix Eyes Binary Code.png",
  20: "/gotchi/Eyes/Dollar Sign Eyes.png",
  21: "/gotchi/Eyes/Heart-Shaped  Eyes.png",
  22: "/gotchi/Eyes/Hypnotic Swirl Eyes.png",
  23: "/gotchi/Eyes/Mirror Visor Eyes.png",
  24: "/gotchi/Eyes/Oval Eyes.png",
  25: "/gotchi/Eyes/Pharos Network Logo Pupils.png",
  26: "/gotchi/Eyes/Sparkling Anime-Style Eyes.png",
  
  // Hands
  27: "/gotchi/Hands/Boxing Gloves.png",
  28: "/gotchi/Hands/Crab Claws.png",
  29: "/gotchi/Hands/Crystal Magic Hands.png",
  30: "/gotchi/Hands/Electric Claws.png",
  31: "/gotchi/Hands/Fire Fist.png",
  32: "/gotchi/Hands/Harpoon Trident.png",
  33: "/gotchi/Hands/Ice Shards.png",
  34: "/gotchi/Hands/Starfish Gloves.png",
  35: "/gotchi/Hands/Water Bubbles.png",
  
  // Head
  36: "/gotchi/Head/Diver Helmet.png",
  37: "/gotchi/Head/Lightthouse Hat Pharos Network.png",
  38: "/gotchi/Head/Logo Hat.png",
  39: "/gotchi/Head/Pirate Hat.png",
  40: "/gotchi/Head/Rocket Booster Helmet.png",
  41: "/gotchi/Head/Royal Crown Gem Encrusted.png",
  42: "/gotchi/Head/Shark Hoodie.png",
  43: "/gotchi/Head/Space Helmet.png",
  44: "/gotchi/Head/Transparent Brain Dome Mini Lighthouse.png",
  
  // Clothes
  45: "/gotchi/Clothes/Energy Backpack.png",
  46: "/gotchi/Clothes/Explorer Harness.png",
  47: "/gotchi/Clothes/Futuristic Chest Armor.png",
  48: "/gotchi/Clothes/Jellyfish Cape.png",
  49: "/gotchi/Clothes/Lighthouse Mini Backpack.png",
  50: "/gotchi/Clothes/Sailor Uniform.png",
  51: "/gotchi/Clothes/Seaweed Scarf.png",
  52: "/gotchi/Clothes/Swimmer Outfit.png",
  53: "/gotchi/Clothes/Traveller.png",
};

const SLOT_ORDER = [
  { name: "Background", type: BG_BYTES32, canEquip: false },
  { name: "Body", type: BODY_BYTES32, canEquip: false },
  { name: "Eye", type: EYE_BYTES32, canEquip: false },
  { name: "Hand", type: HAND_BYTES32, canEquip: true },
  { name: "Head", type: HEAD_BYTES32, canEquip: true },
  { name: "Clothes", type: CLOTHES_BYTES32, canEquip: true },
];

const EquipTab = observer(({ tokenId, selectedEquipSlot, handleEquipSlotClick, handleEquipWearable }: EquipTabProps) => {
  const { walletStore, wearableStore } = useStores();

  const owners = new Array(54).fill(walletStore.address);
  const tokenIds = Array.from({ length: 54 }, (_, i) => i);
  const balances = useContractRead("wearableBalanceOfBatch", [owners, tokenIds], { enabled: wearableStore.isRefreshing });
  const wearableTypeInfos = useContractRead("getAllEquipWearableType", [tokenId], { enabled: wearableStore.isRefreshing });

  useEffect(() => {
    if (!wearableStore.isRefreshing) {
      wearableStore.setIsRefreshing(true);
    }
  }, []);

  useEffect(() => {
    if (balances) {
      handleEquipWearable(balances as string[]);
    }
  }, [balances, handleEquipWearable]);

  useEffect(() => {
    if (wearableStore.isRefreshing && balances && wearableTypeInfos) {
      const timer = setTimeout(() => {
        wearableStore.setIsRefreshing(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [balances, wearableTypeInfos, wearableStore]);

  const equipSlots = SLOT_ORDER.map(slot => {
    const wearableInfo = wearableTypeInfos && Array.isArray(wearableTypeInfos) 
      ? wearableTypeInfos.find((info: EquipWearableType) => info.wearableType === slot.type)
      : undefined;

    let iconPath = "";
    
    if (wearableInfo && wearableInfo.wearableId !== undefined && wearableInfo.wearableId !== null) {
      const wearableId = wearableInfo.wearableId;
      
      if (WEARABLE_ICON_MAP[wearableId as keyof typeof WEARABLE_ICON_MAP]) {
        iconPath = WEARABLE_ICON_MAP[wearableId as keyof typeof WEARABLE_ICON_MAP];
      } else {
        iconPath = "";
      }
    } else {
      iconPath = "";
    }

    return {
      ...slot,
      wearableId: wearableInfo?.wearableId || null,
      equiped: wearableInfo?.equiped || false,
      icon: iconPath 
    };
  });

  const handleSlotClick = (index: number) => {
    if (equipSlots[index].canEquip) {
      handleEquipSlotClick(index);
    }
  };

  return (
    <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-6">
      <div className="text-lg font-bold mb-4 flex items-center border-b border-[#808080] pb-2">
        <Image src="/icons/equip.png" alt="Equip" width={18} height={18} className="mr-2" />
        Equip Your Gotchipus
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {equipSlots.map((slot, index) => (
          <div
            key={index}
            className={`flex flex-col ${slot.canEquip ? "cursor-pointer" : ""} ${selectedEquipSlot === index ? "scale-105" : ""}`}
            onClick={() => handleSlotClick(index)}
          >
            <div
              className={`aspect-square border-2 ${selectedEquipSlot === index ? "border-[#000080]" : "border-[#808080]"} shadow-win98-inner bg-[#c0c0c0] rounded-t-sm flex items-center justify-center p-4`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {slot.icon && (
                  <Image 
                    src={slot.icon} 
                    alt={slot.name} 
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </div>
            </div>
            <div
              className={`border-2 border-t-0 ${selectedEquipSlot === index ? "border-[#000080] bg-[#c0c0c0]" : "border-[#808080] bg-[#d4d0c8]"} shadow-win98-outer rounded-b-sm p-3 text-center font-medium text-base`}
            >
              {slot.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
});

export default EquipTab;