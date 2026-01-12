"use client"

import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { useContractRead, useContractWrite } from "@/hooks/useContract"
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32, FACE_BYTES32, MOUTH_BYTES32 } from "@/lib/constant"
import { useToast } from '@/hooks/use-toast'
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { KEY_TO_CONFIG_MAP, WearableCategoryKey, TOKEN_ID_TO_LOCAL_INDEX, TOKEN_ID_TO_IMAGE } from '@/components/gotchiSvg/config';
import SvgIcon from "@/components/gotchiSvg/SvgIcon"; 
import { WearableDefinition } from "@/lib/types";
import { normalizeWearableId } from "@/lib/utils";
import { getWearableName, WearableType } from "@/src/utils/wearableMapping";

interface EquipSelectWindowProps {
  onClose: () => void
  wearableBalances: string[]
  selectedType?: string
  selectedTokenId?: string
  isMobile?: boolean
  onSuccess?: (tokenId: string, txHash: string) => void
}

const EquipSelectWindow = observer(({ onClose, onSuccess, wearableBalances, selectedType, selectedTokenId, isMobile = false }: EquipSelectWindowProps) => {
  const getTypeFromIndex = (type?: string) => {
    if (type === undefined) return HAND_BYTES32;
    return type;
  };

  const [activeTab, setActiveTab] = useState(getTypeFromIndex(selectedType));

  useEffect(() => {
    setActiveTab(getTypeFromIndex(selectedType));
  }, [selectedType]);

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

  const getAvailableEquipments = (type: string): WearableDefinition[] => {
    const config = KEY_TO_CONFIG_MAP[type as WearableCategoryKey];
    if (!config) return [];

    const categoryMapping = TOKEN_ID_TO_LOCAL_INDEX[config.name];
    if (!categoryMapping) return [];

    const availableEquipments: WearableDefinition[] = [];
    const wearableType = mapCategoryNameToWearableType(config.name);
    
    Object.keys(categoryMapping).forEach(tokenIdStr => {
      const tokenId = parseInt(tokenIdStr);
      const balance = parseInt(wearableBalances[tokenId] || "0");
      
      if (balance > 0) {
        const imagePath = TOKEN_ID_TO_IMAGE[tokenId];
        if (imagePath && wearableType) {
          const index = tokenId - config.offset;
          const name = getWearableName(wearableType, index);
          
          availableEquipments.push({
            id: tokenId,
            name: name,
            svg: "" 
          });
        }
      }
    });

    return availableEquipments;
  };


  const availableEquipments = getAvailableEquipments(activeTab);
    
  const {contractWrite, hash, isConfirmed, error} = useContractWrite();
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
    contractWrite("equipWearable", [selectedTokenId, wearableId, selectedType]);

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
            { index: 1, type: BODY_BYTES32, offset: 16 },      
            { index: 2, type: EYE_BYTES32, offset: 24 },      
            { index: 3, type: HAND_BYTES32, offset: 27 },     
            { index: 4, type: HEAD_BYTES32, offset: 46 },     
            { index: 5, type: CLOTHES_BYTES32, offset: 63 },
            { index: 6, type: FACE_BYTES32, offset: 72 },
            { index: 7, type: MOUTH_BYTES32, offset: 79 }
          ];
          
          if (Array.isArray(wearableTypeInfos)) {
            wearableTypeInfos.forEach((info) => {
              if (!info || !info.wearableType || typeof info.wearableId === 'undefined') {
                return; 
              }

              const matchedSlot = slotMapping.find(slot => slot.type === info.wearableType);
              
              if (matchedSlot && info.equiped) {
                pick_layers[matchedSlot.index] = 1; 
                
                const wearableIdAsNumber = normalizeWearableId(Number(info.wearableId));
                const calculatedIndex = wearableIdAsNumber - matchedSlot.offset;
                
                file_indexs[matchedSlot.index] = calculatedIndex;
              }
            });
          }
                    
          // const data = {
          //   token_id: selectedTokenId,
          //   pick_layers,
          //   file_indexs
          // };

          // const backendResponse = await fetch("/api/images/update", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(data),
          // });
          
          // if (!backendResponse.ok) {
          //   throw new Error(`API CALL ERROR: ${backendResponse.status}`);
          // }
          
          wearableStore.setImageVersion(wearableStore.imageVersion + 1);
          setTimeout(onClose, 500);
          
        } catch (error) {
          setTimeout(onClose, 500);
        }
      };
    
      if (onSuccess) {
        onSuccess(selectedTokenId || "", hash as `0x${string}`);
      }

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
      <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] flex flex-col ${
        isMobile 
          ? 'w-[95vw] h-[80vh] max-w-[400px] max-h-[600px]' 
          : 'w-[700px] h-[500px]'
      }`}>
        <div className="bg-[#000080] px-2 py-1 flex items-center justify-between text-white">
          <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Select Equipment</span>
          <button onClick={onClose} className={`bg-[#d4d0c8] shadow-win98-outer border-2 border-[#808080] p-0.5 ${
            isMobile ? 'w-5 h-5' : ''
          }`}>
            <X size={isMobile ? 12 : 14} className={`text-black ${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
          </button>
        </div>

        <div className={`p-4 overflow-y-auto flex-1 ${
          isMobile 
            ? 'grid grid-cols-2 gap-2 p-3' 
            : 'grid grid-cols-4 gap-4'
        }`}>
          {availableEquipments.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-full">
              <div className="text-center">
                <div className={`text-gray-500 font-medium ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  No Equipments
                </div>
                <div className={`text-gray-400 mt-1 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  You don't have any equipments of this type
                </div>
              </div>
            </div>
          ) : (
            availableEquipments.map((equip) => {
              const isSelected = equip.id === equipIndex;
              const isDisabled = isEquiping && !isSelected;
              
              return (
                <div
                  key={equip.id}
                  onClick={() => !isDisabled && handleEquipWearable(equip.id)}
                  className={`flex flex-col transition-all duration-200 transform hover:scale-105 ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${isSelected && isEquiping ? 'scale-105' : ''}`}
                >
                  <div className={`border-2 border-[#808080] shadow-win98-outer bg-gradient-to-br from-white to-[#f5f5f5] rounded-t-sm aspect-square flex items-center justify-center p-1 ${
                    isMobile ? 'w-full' : 'w-full'
                  }`}>
                    <SvgIcon
                      imagePath={TOKEN_ID_TO_IMAGE[equip.id]}
                      alt={equip.name}
                      width={isMobile ? 40 : 64}
                      height={isMobile ? 40 : 64}
                      className={`w-full h-full object-cover ${isDisabled ? 'grayscale' : ''}`}
                    />
                  </div>
                  <div className={`border-2 border-t-0 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-b-sm p-2 ${
                    isMobile ? 'p-1.5' : ''
                  }`}>
                    <div className={`font-medium text-center ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}>{equip.name}</div>
                    <div className={`text-center text-gray-600 ${
                      isMobile ? 'text-xs' : 'text-xs'
                    }`}>
                      Balance: {parseInt(wearableBalances[equip.id]) || 0}
                    </div>
                    {isSelected && isEquiping && (
                      <div className={`text-center text-blue-600 mt-1 font-medium ${
                        isMobile ? 'text-xs' : 'text-xs'
                      }`}>
                        Equipping...
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
});

export default EquipSelectWindow;