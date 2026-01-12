'use client'

import Image from "next/image"
import { motion } from "framer-motion"
import { GotchipusInfo } from "@/lib/types"
import { observer } from "mobx-react-lite"
import EnhancedGotchiSvg from "@/components/gotchiSvg/EnhancedGotchiSvg"
import { backgrounds } from "@/components/gotchiSvg/svgs"
import { renderToStaticMarkup } from "react-dom/server"
import { useContractRead } from "@/hooks/useContract"
import { useEffect, useState, useMemo } from "react"
import { EquipWearableType } from "@/lib/types"
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32, FACE_BYTES32, MOUTH_BYTES32 } from "@/lib/constant"
import { KEY_TO_CONFIG_MAP, WearableCategoryKey, TOKEN_ID_TO_LOCAL_INDEX } from '@/components/gotchiSvg/config'
import { WearableIndices } from "@/hooks/useSvgLayers"
import { normalizeWearableId } from "@/lib/utils"

interface DashboardTabProps {
  selectedTokenId: string
  tokenInfo: GotchipusInfo
  pusName: string
  newName: string
  setNewName: (name: string) => void
  isRenaming: boolean
  setIsRenaming: (isRenaming: boolean) => void
  handleRename: () => void
  handlePet: () => void
  isPetWriting: boolean
  isMobile?: boolean
  petSuccessTimestamp?: number
  wearableTypeInfos?: EquipWearableType[]
  isLoadingWearables?: boolean
  wearablesError?: Error | null
}

const AttributeValueSkeleton = () => (
  <div className="w-full h-6 bg-[#d4d0c8] rounded animate-pulse"></div>
)

const DnaValueSkeleton = () => (
  <div className="w-full h-4 bg-[#d4d0c8] rounded animate-pulse"></div>
)

const calculateWearableIndices = (wearableTypeInfos: EquipWearableType[] | undefined): WearableIndices => {
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

  if (!wearableTypeInfos || !Array.isArray(wearableTypeInfos)) {
    return defaultIndices;
  }

  const newIndices = { ...defaultIndices };

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

  return newIndices;
};

const DashboardTab = observer(({
  selectedTokenId,
  tokenInfo,
  pusName,
  newName,
  setNewName,
  isRenaming,
  setIsRenaming,
  handleRename,
  handlePet,
  isPetWriting,
  isMobile,
  petSuccessTimestamp,
  wearableTypeInfos,
  isLoadingWearables = false,
  wearablesError
}: DashboardTabProps) => {
  // console.log("tokenInfo", tokenInfo);

  const tokenId = selectedTokenId;
  
  const wearableIndices = useMemo(() => calculateWearableIndices(wearableTypeInfos), [wearableTypeInfos]);
  const isLoading = isLoadingWearables;
  const error = wearablesError;
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [canPet, setCanPet] = useState<boolean>(true);
  
  const { data: lastPetTime, refetch: refetchLastPetTime } = useContractRead(
    'getLastPetTime',
    [tokenId],
    { enabled: !!tokenId }
  );
  
  useEffect(() => {
    if (petSuccessTimestamp) {
      refetchLastPetTime();
    }
  }, [petSuccessTimestamp, refetchLastPetTime]);

  const isDataLoading = !tokenInfo ||
    (tokenInfo.strength === undefined &&
     tokenInfo.defense === undefined &&
     tokenInfo.mind === undefined &&
     tokenInfo.vitality === undefined &&
     tokenInfo.agility === undefined &&
     tokenInfo.luck === undefined);

  const backgroundComponent = backgrounds(wearableIndices.backgroundIndex);
  const backgroundSvg = backgroundComponent
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${renderToStaticMarkup(backgroundComponent)}</svg>`
    : null;

  const backgroundStyle = backgroundSvg
    ? { backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(backgroundSvg)}")` }
    : {};

  const getFactionName = (primaryFaction: number | undefined): string => {
    switch (primaryFaction) {
      case 0:
        return "COMBAT";
      case 1:
        return "DEFENSE";
      case 2:
        return "TECHNOLOGY";
      default:
        return "COMBAT";
    }
  };

  const attributes = [
    { name: "Faction", value: getFactionName(tokenInfo.primaryFaction), icon: "faction" },
    { name: "STR", value: tokenInfo.strength / 100 || 0, icon: "strength" },
    { name: "DEF", value: tokenInfo.defense / 100 || 0, icon: "defense" },
    { name: "INT", value: tokenInfo.mind / 100 || 0, icon: "mind" },
    { name: "VIT", value: tokenInfo.vitality / 100 || 0, icon: "vitality" },
    { name: "AGI", value: tokenInfo.agility / 100 || 0, icon: "agility" },
    { name: "LUK", value: tokenInfo.luck / 100 || 0, icon: "luck" },
  ];

  const dnaData = {
    name: "Genes",
    value: tokenInfo.dna?.geneSeed.toString() || "",
    icon: "dna"
  };

  const floatAnimation = {
    y: [0, -3, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  useEffect(() => {
    if (!lastPetTime) return;
    
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const lastPetTimestamp = Number(lastPetTime);
      const cooldownEnd = lastPetTimestamp + (24 * 60 * 60);
      const remainingTime = cooldownEnd - now;
      
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setCanPet(false);
      } else {
        setTimeLeft(0);
        setCanPet(true);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [lastPetTime]);
  
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
      <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm ${isMobile ? 'p-3' : 'p-4'}`} style={backgroundStyle}>
        <div className="text-center mb-4 flex justify-center items-center">
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={`border-2 border-[#808080] shadow-win98-inner bg-white p-1 text-center w-full max-w-xs ${isMobile ? 'text-sm' : ''}`}
              autoFocus
            />
          ) : (
            <div className={`font-bold flex items-center text-white ${isMobile ? 'text-base' : 'text-lg'}`}>
              <span className={`mr-2 ${isMobile ? 'mr-1' : ''}`}>🐙</span>
              {pusName}
            </div>
          )}
        </div>

        <div className={`flex justify-center items-center relative mt-12 ${isMobile ? 'h-48' : 'h-64'}`}>
          {isLoading && <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Loading Character...</div>}
            {error && <div className={`text-red-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>Could not load character</div>}
            
            {!isLoading && !error && (
              <>
                <div className={`absolute bg-[#d4d0c8] rounded-full opacity-30 ${isMobile ? 'w-32 h-32' : 'w-48 h-48'}`}></div>
                <motion.div
                  className="w-full h-full relative flex items-center justify-center"
                  animate={floatAnimation}
                >
                  <EnhancedGotchiSvg
                    wearableIndices={wearableIndices}
                    width={isMobile ? 200 : 300}
                    height={isMobile ? 200 : 300}
                  />
                </motion.div>
              </>
            )}
        </div>

        <div className={`flex justify-center gap-4 mt-10 ${isMobile ? 'mt-6 gap-2' : ''}`}>
          {!isRenaming ? (
            <>
              <button
                onClick={() => setIsRenaming(true)}
                className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm hover:bg-[#c0c0c0] flex items-center ${isMobile ? 'px-3 py-1 text-sm' : 'px-6 py-2'}`}
              >
                <Image src="/icons/rename.png" alt="Rename" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
                Rename
              </button>
              <button
                onClick={handlePet}
                disabled={isPetWriting || !canPet}
                className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm hover:bg-[#c0c0c0] flex items-center ${isMobile ? 'px-3 py-1 text-sm' : 'px-6 py-2'} ${(isPetWriting || !canPet) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Image src="/icons/pet.png" alt="Pet" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
                {isPetWriting ? 'Petting...' : !canPet ? formatCountdown(timeLeft) : 'Pet'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRename}
                className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm hover:bg-[#c0c0c0] flex items-center ${isMobile ? 'px-3 py-1 text-sm' : 'px-6 py-2'}`}
              >
                <span className={`mr-1 ${isMobile ? 'mr-0.5' : ''}`}>✅</span> Confirm Rename
              </button>
              <button
                onClick={() => setIsRenaming(false)}
                className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm hover:bg-[#c0c0c0] flex items-center ${isMobile ? 'px-3 py-1 text-sm' : 'px-6 py-2'}`}
              >
                <span className={`mr-1 ${isMobile ? 'mr-0.5' : ''}`}>❌</span> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm ${isMobile ? 'p-3' : 'p-4'}`}>
        <div className={`font-bold mb-3 flex items-center border-b border-[#808080] pb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
          <Image src="/icons/attribute.png" alt="Attributes" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`}/>
          Attributes
        </div>

        <div className={`grid gap-4 mb-4 ${isMobile ? 'grid-cols-3 gap-2' : 'grid-cols-3'}`}>
          {attributes.map((attr, index) => (
            <div key={index} className={`bg-[#c0c0c0] border border-[#808080] shadow-win98-inner rounded-sm ${isMobile ? 'p-2' : 'p-3'}`}>
              <div className="flex items-center mb-1">
                <Image src={`/icons/${attr.icon}.png`} alt={attr.name} width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`}/>
                <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{attr.name}</span>
              </div>
              <div className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>
                {isDataLoading ? (
                  <AttributeValueSkeleton />
                ) : (
                  attr.value
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Image src={`/icons/${dnaData.icon}.png`} alt={dnaData.name} width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`}/>
            <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{dnaData.name}</span>
          </div>
          <div className="border-t border-[#808080] my-2"></div>
          <div className={`font-mono bg-[#c0c0c0] p-2 border border-[#808080] shadow-win98-inner overflow-x-auto whitespace-nowrap scrollbar-none ${isMobile ? 'text-xs' : 'text-xs'}`}>
            {isDataLoading ? (
              <DnaValueSkeleton />
            ) : (
              dnaData.value
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#808080]">
          <div className={`text-[#000080] mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>Gotchipus Level: {Math.floor(Number(tokenInfo.currentExp) / 100)}</div>
          <div className="w-full bg-[#c0c0c0] border border-[#808080] h-4">
            <div className="bg-[#000080] h-full" style={{ width: `${((Number(tokenInfo.currentExp) / 100) % 1) * 100}%` }}></div>
          </div>
          <div className={`text-right mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>XP: {Math.floor(((Number(tokenInfo.currentExp) / 100) % 1) * 100)}/100</div>
        </div>
      </div>
    </div>
  )
})

export default DashboardTab
