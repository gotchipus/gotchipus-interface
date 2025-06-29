"use client"

import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { useContractRead, useContractWrite } from "@/hooks/useContract"
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32 } from "@/lib/constant"
import { useToast } from '@/hooks/use-toast'
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { ALL_WEARABLE_SVG } from "@/components/gotchiSvg/svgs";
import SvgIcon from "@/components/gotchiSvg/SvgIcon"; 
import { WearableDefinition } from "@/lib/types";

interface EquipSelectWindowProps {
  onClose: () => void
  wearableBalances: string[]
  selectedType?: string
  selectedTokenId?: string
  isMobile?: boolean
}

const EquipSelectWindow = observer(({ onClose, wearableBalances, selectedType, selectedTokenId, isMobile = false }: EquipSelectWindowProps) => {
  const getTypeFromIndex = (type?: string) => {
    if (type === undefined) return HAND_BYTES32;
    return type;
  };

  const [activeTab, setActiveTab] = useState(getTypeFromIndex(selectedType));

  useEffect(() => {
    setActiveTab(getTypeFromIndex(selectedType));
  }, [selectedType]);

  const getAvailableEquipments = (type: string) => {
    const equipments = (ALL_WEARABLE_SVG[type as keyof typeof ALL_WEARABLE_SVG] || []) as (WearableDefinition | null)[];
    
    return equipments.filter((equip): equip is WearableDefinition => {
      if (!equip) return false;
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
          {availableEquipments.map((equip) => {
              const isSelected = equip.id === equipIndex;
              const isDisabled = isEquiping && !isSelected;
              
              return (
                <div
                  key={equip.id}
                  onClick={() => !isDisabled && handleEquipWearable(equip.id)}
                  className={`flex flex-col transition-all duration-200 transform hover:scale-105 ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${isSelected && isEquiping ? 'scale-105' : ''}`}
                >
                  <div className={`border-2 border-[#808080] shadow-win98-outer bg-gradient-to-br from-white to-[#f5f5f5] rounded-t-sm flex items-center justify-center p-2 ${
                    isMobile ? 'h-24' : 'h-24'
                  }`}>
                    <SvgIcon
                      svgString={equip.svg}
                      alt={equip.name}
                      width={isMobile ? 40 : 64}
                      height={isMobile ? 40 : 64}
                      className={isDisabled ? 'grayscale' : ''}
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
            })}
        </div>
      </div>
    </div>
  )
});

export default EquipSelectWindow;