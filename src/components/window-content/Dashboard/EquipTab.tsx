"use client"

import Image from "next/image"
import { useEffect } from "react"
import { useContractRead } from "@/hooks/useContract"
import { useStores } from "@stores/context"
import { observer } from "mobx-react-lite"
import SvgIcon from "@/components/gotchiSvg/SvgIcon"
import { useEquippedItems } from "@/hooks/useEquippedItems"

interface EquipTabProps {
  tokenId: number;
  selectedEquipSlot: number | null
  handleEquipSlotClick: (index: number) => void
  handleEquipWearable: (ids: string[]) => void
}

const EquipTab = observer(({ tokenId, selectedEquipSlot, handleEquipSlotClick, handleEquipWearable }: EquipTabProps) => {
  const { walletStore, wearableStore } = useStores();

  const { equippedItems, isLoading, error } = useEquippedItems(tokenId);

  const owners = new Array(54).fill(walletStore.address);
  const tokenIds = Array.from({ length: 54 }, (_, i) => i);
  const {data: balances} = useContractRead("wearableBalanceOfBatch", [owners, tokenIds]);

  useEffect(() => {
    if (balances) {
      handleEquipWearable(balances as string[]);
    }
  }, [balances, handleEquipWearable]);

  const handleSlotClick = (index: number) => {
    if (equippedItems[index]?.canEquip) { 
      handleEquipSlotClick(index);
    }
  };

  return (
    <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-6">
      <div className="text-lg font-bold mb-4 flex items-center border-b border-[#808080] pb-2">
        <Image src="/icons/equip.png" alt="Equip" width={18} height={18} className="mr-2" />
        Equip Your Gotchipus
      </div>

      {isLoading && <div className="text-center p-4">Loading equipped items...</div>}
      {error && <div className="text-center p-4 text-red-500">Failed to load items.</div>}
      
      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {equippedItems.map((slot, index) => (
            <div
              key={index}
              className={`flex flex-col ${slot.canEquip ? "cursor-pointer" : ""} ${selectedEquipSlot === index ? "scale-105" : ""}`}
              onClick={() => handleSlotClick(index)}
            >
              <div
                className={`aspect-square border-2 ${selectedEquipSlot === index ? "border-[#000080]" : "border-[#808080]"} shadow-win98-inner bg-[#c0c0c0] rounded-t-sm flex items-center justify-center p-4`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <SvgIcon
                    svgString={slot.svgString}
                    alt={slot.name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
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
      )}
    </div>
  )
});

export default EquipTab;