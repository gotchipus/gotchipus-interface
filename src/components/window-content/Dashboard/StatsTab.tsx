import Image from "next/image"
import { GotchipusInfo } from "@/lib/types"

interface StatsTabProps {
  tokenInfo: GotchipusInfo
  isMobile?: boolean
}

const StatsTab = ({
  tokenInfo,
  isMobile
}: StatsTabProps) => {
  const dnaData = {
    name: "Genes",
    value: tokenInfo.dna?.geneSeed.toString() || "",
    icon: "dna"
  };

  const attributes = [
    { name: "STR", value: tokenInfo.bonding || 0, icon: "bonding" },
    { name: "DEF", value: tokenInfo.growth || 0, icon: "growth" },
    { name: "INT", value: tokenInfo.element || 0, icon: "element" },
    { name: "VIT", value: tokenInfo.wisdom || 0, icon: "wisdom" },
    { name: "AGI", value: tokenInfo.wisdom || 0, icon: "wisdom" },
    { name: "LUK", value: tokenInfo.wisdom || 0, icon: "wisdom" },
  ];

  return (
    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
      <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm ${isMobile ? 'p-3' : 'p-4'}`}>
        <div className={`font-bold mb-3 flex items-center border-b border-[#808080] pb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
          <Image src="/icons/attribute.png" alt="Attributes" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
          Attributes
        </div>

        <div className={`grid gap-3 mb-4 ${isMobile ? 'grid-cols-2 gap-2' : ''}`}>
          {attributes.map((attr, index) => (
            <div key={index} className={`bg-[#c0c0c0] border border-[#808080] shadow-win98-inner rounded-sm ${isMobile ? 'p-2' : 'p-3'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image src={`/icons/${attr.icon}.png`} alt={attr.name} width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`}/>
                  <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{attr.name}</span>
                </div>
                <div className={`font-bold ${isMobile ? 'text-sm' : ''}`}>{attr.value}</div>
              </div>
              <div className="w-full bg-[#d4d0c8] h-2 mt-2 rounded-sm">
                <div 
                  className="h-full rounded-sm bg-[#000080]" 
                  style={{ width: `${attr.value % 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm ${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Image src={`/icons/${dnaData.icon}.png`} alt={dnaData.name} width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`}/>
            <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{dnaData.name}</span>
          </div>
          <div className="border-t border-[#808080] my-2"></div>
          <div className={`font-mono bg-[#c0c0c0] p-2 border border-[#808080] shadow-win98-inner overflow-x-auto whitespace-nowrap scrollbar-none ${isMobile ? 'text-xs' : 'text-xs'}`}>
            {dnaData.value}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Image src="/icons/tba.png" alt="TBA" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
            <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Tokenbound Account</span>
          </div>
          <div className="border-t border-[#808080] my-2"></div>
          <div className={`font-mono bg-[#c0c0c0] p-2 border border-[#808080] shadow-win98-inner overflow-x-auto whitespace-nowrap scrollbar-none ${isMobile ? 'text-xs' : 'text-xs'}`}>
            {tokenInfo.owner || 'Not available'}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#808080]">
          <div className={`text-[#000080] mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>Gotchipus Level: 1</div>
          <div className="w-full bg-[#c0c0c0] border border-[#808080] h-4">
            <div className="bg-[#000080] h-full" style={{ width: `${Number(tokenInfo.growth) % 100}%` }}></div>
          </div>
          <div className={`text-right mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>XP: {tokenInfo.growth}/100</div>
        </div>
      </div>
    </div>
  )
}

export default StatsTab 