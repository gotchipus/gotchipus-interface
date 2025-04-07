"use client"

import Image from "next/image"
import { useState } from "react"
import { Zap, Heart, Sparkles, BookOpen, Check, ChevronDown, Atom, Dna, ChevronUp, Menu } from "lucide-react"
import DualTokenIcon from "@/components/window-content/pharos/DualTokenIcon"


export default function PharosGenesisPage() {
  const [pusName, setPusName] = useState("")
  const [stakeAmount, setStakeAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState<number | null>(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingProgress, setGeneratingProgress] = useState(0)
  const [positionVersion, setPositionVersion] = useState("token")
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false)
  const [stakeToken, setStakeToken] = useState("USDC")
  const [traitsExpanded, setTraitsExpanded] = useState(true)
  

  const attributes = {
    dna: {
      name: "Genes",
      displayValue: "626780225951962839803452825943235677688715375300503457486982648987859403",
      icon: <Dna size={18} className="text-purple-500" />,
      description: "DNA Sequence",
      bgColor: "bg-purple-50"
    },
    traits: [
      { 
        name: "Elemented", 
        displayValue: "Water", 
        icon: <Atom size={18} className="text-blue-500" />,
        bgColor: "bg-blue-50"
      },
      { 
        name: "Bonding", 
        displayValue: "82", 
        icon: <Heart size={18} className="text-red-500" />,
        bgColor: "bg-red-50"
      },
      { 
        name: "Growth", 
        displayValue: "68", 
        icon: <Sparkles size={18} className="text-amber-500" />,
        bgColor: "bg-amber-50"
      },
      { 
        name: "Wisdom", 
        displayValue: "65", 
        icon: <BookOpen size={18} className="text-emerald-500" />,
        bgColor: "bg-emerald-50"
      },
      { 
        name: "Aether", 
        displayValue: "78", 
        icon: <Zap size={18} className="text-cyan-500" />,
        bgColor: "bg-cyan-50"
      }
    ]
  }

  const tokens = {
    "token": ["USDC", "USDT", "DAI", "WBTC", "PHAROS"],
    "lp": ["USDC/ETH", "USDT/ETH", "DAI/ETH", "WBTC/ETH", "UNI/ETH", "LINK/ETH"],
    "lend": ["gUSDC", "gUSDT", "gDAI", "gWBTC", "gPHAROS"]
  }
  const positionVersions = ["token", "lp", "lend"]

  const handleGenerate = () => {
    if (!pusName || !stakeAmount || selectedToken === null) return

    setIsGenerating(true)

    // Simulate hatching progress
    const interval = setInterval(() => {
      setGeneratingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const handlePositionVersionChange = (version: string) => {
    setPositionVersion(version)
    setIsVersionDropdownOpen(false)
  }

  const handleLpTokenChange = (version: string, index: number) => {
    setSelectedToken(index)
    setStakeToken(tokens[version as keyof typeof tokens][index])
  }


  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 scrollbar-none">
        {/* Left Side - Gotchipus Preview */}
        <div className="w-full md:w-2/5 flex flex-col gap-4 scrollbar-none">
          <div className="border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-white rounded-lg p-4 h-80 flex items-center justify-center relative">
            <Image src="/preview-nft.jpeg" alt="Gotchipus" fill className="object-cover" />
          </div>

          {/* Attributes List */}
          <div>
            <h3 className="text-lg font-bold mb-2">Gotchipus Attributes</h3>
            
            {/* DNA ID Section */}
            <div className="border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-white rounded-sm p-3 mb-2">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${attributes.dna.bgColor}`}>
                  {attributes.dna.icon}
                </div>
                <div>
                  <div className="font-bold text-sm">{attributes.dna.name}</div>
                  <div className="text-xs text-gray-600">{attributes.dna.description}</div>
                </div>
              </div>
              <div className="font-mono text-xs bg-[#d4d0c8] p-2 border border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] overflow-x-auto whitespace-nowrap scrollbar-none">
                {attributes.dna.displayValue}
              </div>
            </div>

            {/* Traits Section */}
            <div className="border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-white rounded-sm">
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => setTraitsExpanded(!traitsExpanded)}
              >
                <div className="flex items-center">
                  <Menu size={18} className="mr-2" />
                  <span className="font-bold">Attributes</span>
                </div>
                {traitsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {traitsExpanded && (
                <div className="p-3 border-t border-[#ddd] grid grid-cols-2 gap-3">
                  {attributes.traits.map((attr, index) => (
                    <div key={index} className="border border-[#808080] shadow-win98-outer bg-white p-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${attr.bgColor}`}>
                          {attr.icon}
                        </div>
                        <div className="font-bold text-sm">{attr.name}</div>
                      </div>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <div className="text-sm font-medium">{attr.displayValue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Input and Staking */}
        <div className="w-full md:w-3/5 flex flex-col gap-4">
          {/* Name Input */}
          <div>
            <h3 className="text-lg font-bold mb-2">Name Your Gotchipus</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter gotchipus name"
                className="w-full border-2 border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] bg-white rounded-lg p-3"
                value={pusName}
                onChange={(e) => setPusName(e.target.value)}
                disabled={isGenerating}
              />
              {pusName && !isGenerating && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#d4d0c8] border border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] px-2 py-1 text-xs"
                  onClick={() => setPusName("")}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Staking Section */}
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Stake {stakeToken} Token </h3>
              <span className="text-sm bg-[#d4d0c8] border border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] px-2 py-1">
                Balance: 1.25 {stakeToken}
              </span>
            </div>

            <div className="relative mt-2">
              <input
                type="text"
                placeholder="0.0"
                className="w-full border-2 border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] bg-white rounded-lg p-3"
                value={stakeAmount}
                onChange={(e) => {
                  // Only allow numbers and decimal point
                  const value = e.target.value
                  if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                    setStakeAmount(value)
                  }
                }}
                disabled={isGenerating}
              />
              {!isGenerating && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#d4d0c8] border border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] px-2 py-1 text-xs"
                  onClick={() => setStakeAmount("1.25")}
                >
                  Max
                </button>
              )}
            </div>

            {/* Position Version Dropdown */}
            <div className="mt-4">
              <h4 className="font-bold mb-2">Select Stake Position:</h4>
              <div className="relative">
                <div 
                  className={`border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-white rounded-lg p-3 flex justify-between items-center cursor-pointer ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isGenerating && setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                >
                  <span>{positionVersion} position</span>
                  <ChevronDown size={16} />
                </div>
                
                {isVersionDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] rounded-lg">
                    {positionVersions.map((version, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-[#d4d0c8] cursor-pointer"
                        onClick={() => handlePositionVersionChange(version)}
                      >
                        {version} position
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stake Token Selection */}
            <div className="mt-4">
              <h4 className="font-bold mb-2">Select Stake Token Type:</h4>
              <div className="grid grid-cols-2 gap-2">
                {tokens[positionVersion as keyof typeof tokens].map((token, index) => (
                  <div
                    key={index}
                    className={`border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-white rounded-lg p-2 flex items-center cursor-pointer ${
                      selectedToken === index ? "bg-[#d4d0c8]" : ""
                    } ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !isGenerating && handleLpTokenChange(positionVersion, index)}
                  >
                    <div
                      className={`w-5 h-5 border-2 border-[#808080] rounded-full mr-2 flex items-center justify-center ${
                        selectedToken === index ? "bg-[#000080]" : ""
                      }`}
                    >
                      {selectedToken === index && <Check size={12} className="text-white" />}
                    </div>
                    <span className="flex items-center">
                      {positionVersion !== "lp" ? (
                        <Image src={`/tokens/${token.toLowerCase()}.png`} alt={token} width={20} height={20} className="mr-2" />
                      ) : (
                        <DualTokenIcon token1={token.split("/")[0]} token2={token.split("/")[1]} size={20} className="mr-2" />
                      )}
                      {token}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <button
              className={`w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-lg p-3 mt-6 hover:bg-[#c0c0c0] transition-colors flex items-center justify-center ${
                !pusName || !stakeAmount || selectedToken === null || isGenerating
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleGenerate}
              disabled={!pusName || !stakeAmount || selectedToken === null || isGenerating}
            >
              <Sparkles size={16} className="mr-2" />
              {isGenerating ? "Generating..." : "Confirm Genesis"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}