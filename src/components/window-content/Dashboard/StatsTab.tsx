import Image from "next/image"
import { GotchipusInfo } from "@/lib/types"

interface StatsTabProps {
  selectedTokenId: string
  tokenInfoMap: GotchipusInfo
  tbaAddress: string
}

const StatsTab = ({
  selectedTokenId,
  tokenInfoMap,
  tbaAddress
}: StatsTabProps) => {
  const tokenId = selectedTokenId || "";
  const tokenInfo = tokenInfoMap;

  const dnaData = {
    name: "Genes",
    value: tokenInfo.dna?.geneSeed.toString() || "",
    icon: "dna"
  };

  const attributes = [
    { name: "Aether", value: tokenInfo.aether || 0, icon: "aether" },
    { name: "Bonding", value: tokenInfo.bonding || 0, icon: "bonding" },
    { name: "Growth", value: tokenInfo.growth || 0, icon: "growth" },
    { name: "Element", value: tokenInfo.element || 0, icon: "element" },
    { name: "Wisdom", value: tokenInfo.wisdom || 0, icon: "wisdom" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Attributes */}
      <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-4">
        <div className="text-lg font-bold mb-3 flex items-center border-b border-[#808080] pb-2">
          <Image src="/icons/attribute.png" alt="Attributes" width={18} height={18} className="mr-2" />
          Attributes
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {attributes.map((attr, index) => (
            <div key={index} className="bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-3 rounded-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image src={`/icons/${attr.name}.png`} alt={attr.name} width={18} height={18} className="mr-2"/>
                  <span className="font-medium">{attr.name}</span>
                </div>
                <div className="font-bold">{attr.value}</div>
              </div>
              <div className="w-full bg-[#d4d0c8] h-2 mt-2 rounded-sm">
                <div 
                  className="h-full rounded-sm bg-[#000080]" 
                  style={{ width: `${attr.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - DNA & Account */}
      <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-4">
        {/* DNA ID Section */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Image src={`/icons/${dnaData.icon}.png`} alt={dnaData.name} width={18} height={18} className="mr-2"/>
            <span className="font-medium">{dnaData.name}</span>
          </div>
          <div className="border-t border-[#808080] my-2"></div>
          <div className="font-mono text-xs bg-[#c0c0c0] p-2 border border-[#808080] shadow-win98-inner overflow-x-auto whitespace-nowrap scrollbar-none">
            {dnaData.value}
          </div>
        </div>

        {/* Tokenbound Account Section */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Image src="/icons/tba.png" alt="TBA" width={18} height={18} className="mr-2" />
            <span className="font-medium">Tokenbound Account</span>
          </div>
          <div className="border-t border-[#808080] my-2"></div>
          <div className="font-mono text-xs bg-[#c0c0c0] p-2 border border-[#808080] shadow-win98-inner overflow-x-auto whitespace-nowrap scrollbar-none">
            {tbaAddress}
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-6 pt-4 border-t border-[#808080]">
          <div className="text-sm text-[#000080] mb-2">Gotchipus Level: 1</div>
          <div className="w-full bg-[#c0c0c0] border border-[#808080] h-4">
            <div className="bg-[#000080] h-full" style={{ width: `${Number(tokenInfo.growth)}%` }}></div>
          </div>
          <div className="text-xs text-right mt-1">XP: {tokenInfo.growth}/100</div>
        </div>
      </div>
    </div>
  )
}

export default StatsTab 