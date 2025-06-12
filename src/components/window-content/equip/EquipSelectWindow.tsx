"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { useContractRead, useContractWrite } from "@/hooks/useContract"
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32 } from "@/lib/constant"
import { useToast } from '@/hooks/use-toast'
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"

interface EquipSelectWindowProps {
  onClose: () => void
  wearableBalances: string[]
  selectedType?: string
  selectedTokenId?: string
}

const EQUIPMENT_DATA = {
  [HAND_BYTES32]: [
    { id: 27, name: "Boxing Gloves", icon: "/gotchi/Hands/Boxing Gloves.png" },
    { id: 28, name: "Crab Claws", icon: "/gotchi/Hands/Crab Claws.png" },
    { id: 29, name: "Crystal Magic Hands", icon: "/gotchi/Hands/Crystal Magic Hands.png" },
    { id: 30, name: "Electric Claws", icon: "/gotchi/Hands/Electric Claws.png" },
    { id: 31, name: "Fire Fist", icon: "/gotchi/Hands/Fire Fist.png" },
    { id: 32, name: "Harpoon Trident", icon: "/gotchi/Hands/Harpoon Trident.png" },
    { id: 33, name: "Ice Shards", icon: "/gotchi/Hands/Ice Shards.png" },
    { id: 34, name: "Starfish Gloves", icon: "/gotchi/Hands/Starfish Gloves.png" },
    { id: 35, name: "Water Bubbles", icon: "/gotchi/Hands/Water Bubbles.png" },
  ],
  [HEAD_BYTES32]: [
    { id: 36, name: "Diver Helmet", icon: "/gotchi/Head/Diver Helmet.png" },
    { id: 37, name: "Lightthouse Hat", icon: "/gotchi/Head/Lightthouse Hat Pharos Network.png" },
    { id: 38, name: "Logo Hat", icon: "/gotchi/Head/Logo Hat.png" },
    { id: 39, name: "Pirate Hat", icon: "/gotchi/Head/Pirate Hat.png" },
    { id: 40, name: "Rocket Booster Helmet", icon: "/gotchi/Head/Rocket Booster Helmet.png" },
    { id: 41, name: "Royal Crown", icon: "/gotchi/Head/Royal Crown Gem Encrusted.png" },
    { id: 42, name: "Shark Hoodie", icon: "/gotchi/Head/Shark Hoodie.png" },
    { id: 43, name: "Space Helmet", icon: "/gotchi/Head/Space Helmet.png" },
    { id: 44, name: "Transparent Brain Dome", icon: "/gotchi/Head/Transparent Brain Dome Mini Lighthouse.png" },
  ],
  [CLOTHES_BYTES32]: [
    { id: 45, name: "Energy Backpack", icon: "/gotchi/Clothes/Energy Backpack.png" },
    { id: 46, name: "Explorer Harness", icon: "/gotchi/Clothes/Explorer Harness.png" },
    { id: 47, name: "Futuristic Chest Armor", icon: "/gotchi/Clothes/Futuristic Chest Armor.png" },
    { id: 48, name: "Jellyfish Cape", icon: "/gotchi/Clothes/Jellyfish Cape.png" },
    { id: 49, name: "Lighthouse Mini Backpack", icon: "/gotchi/Clothes/Lighthouse Mini Backpack.png" },
    { id: 50, name: "Sailor Uniform", icon: "/gotchi/Clothes/Sailor Uniform.png" },
    { id: 51, name: "Seaweed Scarf", icon: "/gotchi/Clothes/Seaweed Scarf.png" },
    { id: 52, name: "Swimmer Outfit", icon: "/gotchi/Clothes/Swimmer Outfit.png" },
    { id: 53, name: "Traveller", icon: "/gotchi/Clothes/Traveller.png" },
  ]
};

const EquipSelectWindow = observer(({ onClose, wearableBalances, selectedType, selectedTokenId }: EquipSelectWindowProps) => {
  const getTypeFromIndex = (type?: string) => {
    if (type === undefined) return HAND_BYTES32;
    return type;
  };

  const [activeTab, setActiveTab] = useState(getTypeFromIndex(selectedType));

  useEffect(() => {
    setActiveTab(getTypeFromIndex(selectedType));
  }, [selectedType]);

  const getAvailableEquipments = (type: string) => {
    const equipments = EQUIPMENT_DATA[type as keyof typeof EQUIPMENT_DATA] || [];
    return equipments.filter((equip: { id: number }) => {
      const balance = parseInt(wearableBalances[equip.id] || "0");
      return balance > 0;
    });
  };

  const availableEquipments = getAvailableEquipments(activeTab);
    
  const {contractWrite, isConfirmed, isConfirming, isPending, error, receipt} = useContractWrite();
  const [equipIndex, setEquipIndex] = useState<number>(0);
  const [isEquiping, setIsEquiping] = useState<boolean>(false);
  const { toast } = useToast()
  const { wearableStore } = useStores();
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState<boolean>(false);

  const {data: wearableTypeInfos} = useContractRead("getAllEquipWearableType", [selectedTokenId], { 
    enabled: isConfirmed && wearableStore.isRefreshing 
  });

  const handleEquipWearable = (wearableId: number) => {
    setEquipIndex(wearableId);
    setIsEquiping(true);
    contractWrite("simpleEquipWearable", [selectedTokenId, wearableId, selectedType]);

    toast({
      title: "Transaction Submitted",
      description: "Your claim request has been submitted",
    });
  };

  useEffect(() => {
    if (isConfirmed && !hasShownSuccessToast) {
      setIsEquiping(false);
      setHasShownSuccessToast(true);
      
      wearableStore.setIsRefreshing(true);
      
      toast({
        title: "Equip Successful",
        description: "You have successfully equipped the wearable",
      });
    }
  }, [isConfirmed, toast, wearableStore, hasShownSuccessToast]);

  useEffect(() => {
    if (wearableTypeInfos && isConfirmed && hasShownSuccessToast) {

      const sendDataToBackend = async () => {
        try {
          const pick_layers = [0, 0, 0, 0, 0, 0];
          const file_indexs = [0, 0, 0, 0, 0, 0];
          
          const slotMapping = [
            { index: 0, type: BG_BYTES32, offset: 0 },       
            { index: 1, type: BODY_BYTES32, offset: 9 },      
            { index: 2, type: EYE_BYTES32, offset: 18 },      
            { index: 3, type: HAND_BYTES32, offset: 27 },     
            { index: 4, type: HEAD_BYTES32, offset: 36 },     
            { index: 5, type: CLOTHES_BYTES32, offset: 45 }  
          ];
          
          if (Array.isArray(wearableTypeInfos)) {
            wearableTypeInfos.forEach((info) => {
              if (!info || !info.wearableType || typeof info.wearableId === 'undefined') {
                return; 
              }

              const matchedSlot = slotMapping.find(slot => slot.type === info.wearableType);
              
              if (matchedSlot && info.equiped) {
                pick_layers[matchedSlot.index] = 1; 
                
                const wearableIdAsNumber = Number(info.wearableId);
                const calculatedIndex = wearableIdAsNumber - matchedSlot.offset;
                
                file_indexs[matchedSlot.index] = calculatedIndex;
              }
            });
          }
                    
          const data = {
            token_id: selectedTokenId,
            pick_layers,
            file_indexs
          };

          const backendResponse = await fetch("/api/images/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          
          if (!backendResponse.ok) {
            throw new Error(`API CALL ERROR: ${backendResponse.status}`);
          }
          
          const result = await backendResponse.json();
          
          wearableStore.setImageVersion(wearableStore.imageVersion + 1);
          setTimeout(onClose, 500);
          
        } catch (error) {
          setTimeout(onClose, 500);
        }
      };
      
      const timer = setTimeout(sendDataToBackend, 1000);
      return () => clearTimeout(timer); 
    }
  }, [wearableTypeInfos, isConfirmed, hasShownSuccessToast, selectedTokenId, onClose]);

  useEffect(() => {
    if (error) {
      setIsEquiping(false);
      toast({
        title: "Equip Failed",
        description: "Your equip request was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="w-[700px] h-[500px] border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] flex flex-col">
        {/* Window Header */}
        <div className="bg-[#000080] px-2 py-1 flex items-center justify-between text-white">
          <span className="text-sm">Select Equipment</span>
          <button onClick={onClose} className="bg-[#d4d0c8] shadow-win98-outer border-2 border-[#808080] p-0.5">
            <X size={14} className="w-3 h-3 text-black" />
          </button>
        </div>

        {/* Equipment Grid */}
        <div className="p-4 grid grid-cols-4 gap-4 overflow-y-auto flex-1">
          {availableEquipments.map((equip) => {
            const isSelected = equip.id === equipIndex;
            const isDisabled = isEquiping && !isSelected;
            
            return (
              <div
                key={equip.id}
                onClick={() => !isDisabled && handleEquipWearable(equip.id)}
                className={`flex flex-col transition-all duration-200 transform hover:scale-105 ${
                  isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                } ${isSelected && isEquiping ? 'scale-105' : ''}`}
              >
                <div className={`h-24 border-2 border-[#808080] shadow-win98-outer bg-gradient-to-br from-white to-[#f5f5f5] rounded-t-sm flex items-center justify-center ${
                  isSelected && isEquiping ? 'bg-blue-50' : ''
                }`}>
                  <Image 
                    src={equip.icon} 
                    alt={equip.name} 
                    width={64} 
                    height={64} 
                    className={isDisabled ? 'grayscale' : ''}
                  />
                </div>
                <div className={`border-2 border-t-0 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-b-sm p-2 ${
                  isSelected && isEquiping ? 'bg-blue-50' : ''
                }`}>
                  <div className="text-sm font-medium text-center">{equip.name}</div>
                  <div className="text-xs text-center text-gray-600">
                    Balance: {parseInt(wearableBalances[equip.id]) || 0}
                  </div>
                  {isSelected && isEquiping && (
                    <div className="text-xs text-center text-blue-600 mt-1 font-medium">
                      Equipping...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
});

export default EquipSelectWindow;