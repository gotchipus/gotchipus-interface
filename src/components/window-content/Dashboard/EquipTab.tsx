"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useContractRead, useContractWrite } from "@/hooks/useContract"
import { useStores } from "@stores/context"
import { observer } from "mobx-react-lite"
import { motion, AnimatePresence } from "framer-motion"
import SvgIcon from "@/components/gotchiSvg/SvgIcon"
import { EquippedItem } from "@/hooks/useEquippedItems"
import { EquipWearableType } from "@/lib/types"
import { TOKEN_ID_TO_IMAGE, KEY_TO_CONFIG_MAP, WearableCategoryKey, TOKEN_ID_TO_LOCAL_INDEX } from "@/components/gotchiSvg/config"
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, FACE_BYTES32, MOUTH_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32 } from "@/lib/constant"
import { normalizeWearableId } from "@/lib/utils"
import { getWearableName, WearableType } from "@/src/utils/wearableMapping"
import { useToast } from '@/hooks/use-toast'

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

interface EquipTabProps {
  tokenId: number;
  selectedEquipSlot: number | null
  handleEquipSlotClick: (index: number) => void
  handleEquipWearable: (ids: string[]) => void
  isMobile?: boolean
  wearableTypeInfos?: EquipWearableType[]
  isLoadingWearables?: boolean
  wearablesError?: Error | null
}

interface EquipSlotProps {
  slot: EquippedItem & { wearableName?: string | null; wearableId?: number | null; type?: string }
  index: number
  selectedEquipSlot: number | null
  onSlotClick: (index: number) => void
  onUnequip?: (index: number, wearableId: number, wearableType: string) => void
  onEquip?: (index: number) => void
  isMobile?: boolean
  isUnequipping?: boolean
}

const EquipSlot = ({ slot, index, selectedEquipSlot, onSlotClick, onUnequip, onEquip, isMobile, isUnequipping }: EquipSlotProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const hasWearable = !!slot.wearableName && slot.wearableId !== null && slot.wearableId !== undefined
  const displayName = slot.wearableName || `No ${slot.name}`

  const handleEquipClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEquip && slot.canEquip) {
      onEquip(index)
    }
  }

  const handleUnequipClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onUnequip && slot.wearableId !== null && slot.wearableId !== undefined && slot.type) {
      onUnequip(index, slot.wearableId, slot.type)
    }
  }

  const handleChangeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (slot.canEquip) {
      onSlotClick(index)
    }
  }

  return (
    <div
      className={`relative flex flex-col ${selectedEquipSlot === index ? "scale-105" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slot Name and Wearable Name */}
      <div className={`mb-1 text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
        <div className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{slot.name}</div>
      </div>

      {/* Equipment Display Area */}
      <div
        className={`aspect-square border-2 ${selectedEquipSlot === index ? "border-[#000080]" : "border-[#808080]"} shadow-win98-inner bg-[#c0c0c0] rounded-t-sm flex items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <SvgIcon
            svgString={slot.svgString}
            imagePath={slot.imagePath}
            alt={slot.name}
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Button Area */}
      {slot.canEquip && (
        <div className={`border-2 border-t-0 ${selectedEquipSlot === index ? "border-[#000080] bg-[#c0c0c0]" : "border-[#808080] bg-[#d4d0c8]"} shadow-win98-outer rounded-b-sm ${isMobile ? 'p-1.5' : 'p-2'}`}>
          {!hasWearable ? (
            <button
              onClick={handleEquipClick}
              className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] active:shadow-win98-inner rounded-sm font-medium ${isMobile ? 'py-1 text-xs' : 'py-1.5 text-sm'}`}
            >
              Equip Wearable
            </button>
          ) : (
            <div className={`flex gap-1 ${isMobile ? 'gap-0.5' : ''}`}>
              <button
                onClick={handleUnequipClick}
                disabled={isUnequipping}
                className={`flex-1 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] active:shadow-win98-inner rounded-sm font-medium ${isMobile ? 'py-1 text-xs' : 'py-1.5 text-xs'} ${isUnequipping ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUnequipping ? '...' : 'Unequip'}
              </button>
              <button
                onClick={handleChangeClick}
                className={`flex-1 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] active:shadow-win98-inner rounded-sm font-medium ${isMobile ? 'py-1 text-xs' : 'py-1.5 text-xs'}`}
              >
                Change
              </button>
            </div>
          )}
        </div>
      )}

      {/* Non-equippable slots show name only */}
      {!slot.canEquip && (
        <div className={`border-2 border-t-0 ${selectedEquipSlot === index ? "border-[#000080] bg-[#c0c0c0]" : "border-[#808080] bg-[#d4d0c8]"} shadow-win98-outer rounded-b-sm text-center font-medium ${isMobile ? 'p-2 text-sm' : 'p-3 text-base'}`}>
          {slot.name}
        </div>
      )}

      {/* Hover Tooltip */}
      <AnimatePresence>
        {isHovered && hasWearable && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-20 bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                       bg-[#FFFFCC] border-2 border-[#000000] p-2 rounded whitespace-nowrap text-xs shadow-win98-outer"
          >
            {displayName}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="border-4 border-transparent border-t-[#000000]"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const mapCategoryNameToWearableType = (categoryName: string): WearableType | null => {
  const mapping: Record<string, WearableType> = {
    'head': 'heads',
    'hand': 'hands',
    'clothes': 'clothes',
    'face': 'faces',
    'mouth': 'mouths',
    'background': 'backgrounds',
    'body': 'bodys',
    'eye': 'eyes',
  };
  return mapping[categoryName] || null;
};

const getWearableNameFromTokenId = (tokenId: number, config: { name: string; offset: number }): string | null => {
  const wearableType = mapCategoryNameToWearableType(config.name);
  if (!wearableType) return null;
  
  const index = tokenId - config.offset;
  return getWearableName(wearableType, index);
};

const calculateEquippedItems = (wearableTypeInfos: EquipWearableType[] | undefined): (EquippedItem & { wearableName?: string | null; wearableId?: number | null; type?: string })[] => {
  if (!wearableTypeInfos || !Array.isArray(wearableTypeInfos)) {
    return EQUIPMENT_SLOTS.map(slot => ({
      ...slot,
      svgString: null,
      imagePath: null,
      wearableName: null,
      wearableId: null,
    }));
  }

  return EQUIPMENT_SLOTS.map(slot => {
    const wearableInfo = wearableTypeInfos.find(
      (info: EquipWearableType) => info.equiped && info.wearableType === slot.type
    );

    let imagePath: string | null = null;
    let wearableName: string | null = null;
    let wearableId: number | null = null;

    if (wearableInfo) {
      const config = KEY_TO_CONFIG_MAP[wearableInfo.wearableType as WearableCategoryKey];
      if (config) {
        const categoryMapping = TOKEN_ID_TO_LOCAL_INDEX[config.name];
        if (categoryMapping) {
          const tokenId = normalizeWearableId(Number(wearableInfo.wearableId));
          imagePath = TOKEN_ID_TO_IMAGE[tokenId] || null;
          wearableName = getWearableNameFromTokenId(tokenId, config);
          wearableId = tokenId;
        }
      }
    }

    return {
      ...slot,
      svgString: null,
      imagePath: imagePath,
      wearableName: wearableName,
      wearableId: wearableId,
    };
  });
};

const EquipTab = observer(({ 
  tokenId, 
  selectedEquipSlot, 
  handleEquipSlotClick, 
  handleEquipWearable, 
  isMobile,
  wearableTypeInfos,
  isLoadingWearables = false,
  wearablesError
}: EquipTabProps) => {
  const { walletStore, wearableStore } = useStores();
  const { toast } = useToast()
  const [isUnequipping, setIsUnequipping] = useState(false)
  const [unequippingSlotIndex, setUnequippingSlotIndex] = useState<number | null>(null)

  const equippedItems = useMemo(() => calculateEquippedItems(wearableTypeInfos), [wearableTypeInfos]);
  const isLoading = isLoadingWearables;
  const error = wearablesError;

  const owners = new Array(85).fill(walletStore.address);
  const tokenIds = Array.from({ length: 85 }, (_, i) => i);
  const {data: balances} = useContractRead("wearableBalanceOfBatch", [owners, tokenIds]);
  
  const {contractWrite, hash, isConfirmed, error: writeError} = useContractWrite();

  useEffect(() => {
    if (balances) {
      handleEquipWearable(balances as string[]);
    }
  }, [balances]);

  useEffect(() => {
    if (isConfirmed && isUnequipping) {
      setIsUnequipping(false);
      setUnequippingSlotIndex(null);
      
      // Trigger refresh after a short delay to ensure transaction is fully confirmed
      setTimeout(() => {
        wearableStore.setIsRefreshing(true);
      }, 500);
      
      toast({
        title: "Unequip Successful",
        description: "You have successfully unequipped the wearable",
      });
    }
  }, [isConfirmed, isUnequipping, wearableStore, toast]);

  useEffect(() => {
    if (writeError && isUnequipping) {
      setIsUnequipping(false);
      setUnequippingSlotIndex(null);
      toast({
        title: "Unequip Failed",
        description: "Your unequip request was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [writeError, isUnequipping, toast]);

  const handleSlotClick = (index: number) => {
    if (equippedItems[index]?.canEquip) { 
      handleEquipSlotClick(index);
    }
  };

  const handleEquip = (index: number) => {
    if (equippedItems[index]?.canEquip) {
      handleEquipSlotClick(index);
    }
  };

  const handleUnequip = (index: number, wearableId: number, wearableType: string) => {
    setIsUnequipping(true);
    setUnequippingSlotIndex(index);
    contractWrite("unequipWearable", [tokenId, wearableId, wearableType]);

    toast({
      title: "Transaction Submitted",
      description: "Your unequip request has been submitted",
    });
  };

  return (
    <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm ${isMobile ? 'p-3' : 'p-6'}`}>
      <div className={`font-bold mb-4 flex items-center border-b border-[#808080] pb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
        <Image src="/icons/equip.png" alt="Equip" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
        Equip Your Gotchipus
      </div>

      {isLoading && <div className={`text-center p-4 ${isMobile ? 'text-sm' : ''}`}>Loading equipped items...</div>}
      {error && <div className={`text-center p-4 text-red-500 ${isMobile ? 'text-sm' : ''}`}>Failed to load items.</div>}
      
      {!isLoading && !error && (
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 sm:grid-cols-5'}`}>
          {equippedItems.map((slot, index) => (
            <EquipSlot
              key={index}
              slot={slot}
              index={index}
              selectedEquipSlot={selectedEquipSlot}
              onSlotClick={handleSlotClick}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
              isMobile={isMobile}
              isUnequipping={isUnequipping && unequippingSlotIndex === index}
            />
          ))}
        </div>
      )}
    </div>
  )
});

export default EquipTab;