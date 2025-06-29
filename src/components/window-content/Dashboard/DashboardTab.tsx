'use client'

import Image from "next/image"
import { motion } from "framer-motion"
import { GotchipusInfo } from "@/lib/types"
import { observer } from "mobx-react-lite"
import { SvgComposer } from "@/components/gotchiSvg/SvgComposer"
import { useSvgLayers } from "@/hooks/useSvgLayers"

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
}

const AttributeValueSkeleton = () => (
  <div className="w-full h-6 bg-[#d4d0c8] rounded animate-pulse"></div>
)

const DnaValueSkeleton = () => (
  <div className="w-full h-4 bg-[#d4d0c8] rounded animate-pulse"></div>
)

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
  isMobile
}: DashboardTabProps) => {
  const tokenId = selectedTokenId;
  const { layers, backgroundSvg, isLoading, error } = useSvgLayers(tokenId);

  const isDataLoading = !tokenInfo || 
    (tokenInfo.aether === undefined && 
     tokenInfo.bonding === undefined && 
     tokenInfo.growth === undefined && 
     tokenInfo.element === undefined && 
     tokenInfo.wisdom === undefined);

  const viewBox = "0 0 80 80"; 

  const completeBackgroundSvg = backgroundSvg 
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${backgroundSvg}</svg>`
    : null;

  const backgroundStyle = completeBackgroundSvg
    ? { backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(completeBackgroundSvg)}")` } 
    : {};

  const attributes = [
    { name: "Aether", value: tokenInfo.aether || 0, icon: "aether" },
    { name: "Bonding", value: tokenInfo.bonding || 0, icon: "bonding" },
    { name: "Growth", value: tokenInfo.growth || 0, icon: "growth" },
    { name: "Element", value: tokenInfo.element || 0, icon: "element" },
    { name: "Wisdom", value: tokenInfo.wisdom || 0, icon: "wisdom" },
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
                  <SvgComposer layers={layers} width={isMobile ? 200 : 300} height={isMobile ? 200 : 300} />
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
                disabled={isPetWriting}
                className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm hover:bg-[#c0c0c0] flex items-center ${isMobile ? 'px-3 py-1 text-sm' : 'px-6 py-2'} ${isPetWriting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Image src="/icons/pet.png" alt="Pet" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
                {isPetWriting ? 'Petting...' : 'Pet'}
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

        <div className={`grid gap-4 mb-4 ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2'}`}>
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
          <div className={`text-[#000080] mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>Gotchipus Level: 1</div>
          <div className="w-full bg-[#c0c0c0] border border-[#808080] h-4">
            <div className="bg-[#000080] h-full" style={{ width: `${Number(tokenInfo.growth)}%` }}></div>
          </div>
          <div className={`text-right mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>XP: {tokenInfo.growth}/100</div>
        </div>
      </div>
    </div>
  )
})

export default DashboardTab
