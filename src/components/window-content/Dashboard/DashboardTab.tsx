'use client'

import Image from "next/image"
import { motion } from "framer-motion"
import { TokenInfo } from "@/lib/types"
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"

interface DashboardTabProps {
  selectedTokenId: string | null
  pusName: string
  isRenaming: boolean
  newName: string
  setNewName: (name: string) => void
  setIsRenaming: (isRenaming: boolean) => void
  handleRename: () => void
  handlePet: () => void
  tokenInfoMap: Record<string, TokenInfo>
  floatAnimation: any
}

const DashboardTab = observer(({
  selectedTokenId,
  pusName,
  isRenaming,
  newName,
  setNewName,
  setIsRenaming,
  handleRename,
  handlePet,
  tokenInfoMap,
  floatAnimation
}: DashboardTabProps) => {
  const tokenId = selectedTokenId || "";
  const tokenInfo = tokenInfoMap[tokenId] || {} as TokenInfo;
  const { wearableStore } = useStores()

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Pet Display */}
      <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-4">
        <div className="text-center mb-4 flex justify-center items-center">
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border-2 border-[#808080] shadow-win98-inner bg-white p-1 text-center w-full max-w-xs"
              autoFocus
            />
          ) : (
            <div className="font-bold text-lg flex items-center">
              <span className="mr-2">🐙</span>
              {pusName}
            </div>
          )}
        </div>

        <div className="flex justify-center items-center h-64 relative">
          <div className="absolute w-48 h-48 bg-[#d4d0c8] rounded-full opacity-30"></div>
          <motion.div
            className="w-48 h-48 relative flex items-center justify-center"
            animate={floatAnimation}
          >
            <Image
              src={`https://app.gotchipus.com/metadata/gotchipus/${selectedTokenId}.png?v=${wearableStore.imageVersion}`}
              alt="Colorful pixelated gotchipus"
              width={192}
              height={192}
              key={`${selectedTokenId}-${wearableStore.imageVersion}`}
            />
          </motion.div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          {!isRenaming ? (
            <>
              <button
                onClick={() => setIsRenaming(true)}
                className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm px-6 py-2 hover:bg-[#c0c0c0] flex items-center"
              >
                <Image src="/icons/rename.png" alt="Rename" width={18} height={18} className="mr-2" />
                Rename
              </button>
              <button
                onClick={handlePet}
                className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm px-6 py-2 hover:bg-[#c0c0c0] flex items-center"
              >
                <Image src="/icons/pet.png" alt="Pet" width={18} height={18} className="mr-2" />
                Pet
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRename}
                className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm px-6 py-2 hover:bg-[#c0c0c0] flex items-center"
              >
                <span className="mr-1">✅</span> Confirm Rename
              </button>
              <button
                onClick={() => setIsRenaming(false)}
                className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm px-6 py-2 hover:bg-[#c0c0c0] flex items-center"
              >
                <span className="mr-1">❌</span> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Column - Attributes */}
      <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-4">
        <div className="text-lg font-bold mb-3 flex items-center border-b border-[#808080] pb-2">
          <Image src="/icons/attribute.png" alt="Attributes" width={18} height={18} className="mr-2"/>
          Attributes
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {attributes.map((attr, index) => (
            <div key={index} className="bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-3 rounded-sm">
              <div className="flex items-center mb-1">
                <Image src={`/icons/${attr.name}.png`} alt={attr.name} width={18} height={18} className="mr-2"/>
                <span className="font-medium text-sm">{attr.name}</span>
              </div>
              <div className="text-xl font-bold">{attr.value}</div>
            </div>
          ))}
        </div>

        {/* DNA ID Section */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Image src={`/icons/${dnaData.icon}.png`} alt={dnaData.name} width={18} height={18} className="mr-2"/>
            <span className="font-medium">{dnaData.name}</span>
          </div>
          <div className="border-t border-[#808080] my-2"></div>
          <div className="font-mono text-xs bg-[#c0c0c0] p-2 border border-[#808080] shadow-win98-inner overflow-x-auto whitespace-nowrap scrollbar-none">
            {dnaData.value}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#808080]">
          <div className="text-sm text-[#000080] mb-2">Gotchipus Level: 1</div>
          <div className="w-full bg-[#c0c0c0] border border-[#808080] h-4">
            <div className="bg-[#000080] h-full" style={{ width: `${Number(tokenInfo.growth)}%` }}></div>
          </div>
          <div className="text-xs text-right mt-1">XP: {tokenInfo.growth}/100</div>
        </div>
      </div>
    </div>
  )
})

export default DashboardTab
