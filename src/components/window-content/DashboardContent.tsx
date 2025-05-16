"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import {Award, Gift, Sparkles, BookOpen, Atom, Heart, Dna} from "lucide-react"
import EquipSelectWindow from "./equip/EquipSelectWindow"
import { useContractRead, useContractWrite } from "@/hooks/useContract"
import { CHAIN_ID, ZERO_ADDRESS } from "@/lib/constant"
import { ethers } from "ethers"
import { PUS_ADDRESS } from "@/src/app/blockchain"
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { useToast } from "@/hooks/use-toast"

const DashboardContent = observer(() => {
  const [pusName, setPusName] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState("")
  const [selectedEquipSlot, setSelectedEquipSlot] = useState<number | null>(null)
  const [showEquipSelect, setShowEquipSelect] = useState(false)
  const [dna, setDna] = useState("")
  const [growth, setGrowth] = useState("")
  const [activeWalletTab, setActiveWalletTab] = useState<"tokens" | "nfts">("tokens")
  const [balances, setBalances] = useState<number>(0)
  const [ids, setIds] = useState<string[]>([])
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { walletStore } = useStores()
  const { toast } = useToast()

  const balance = useContractRead("balanceOf", [walletStore.address]);
  const allIds = useContractRead("allTokensOfOwner", [walletStore.address], { enabled: !!balance });

  useEffect(() => {
    if (balance !== undefined) {
      setBalances(balance as number);
    }
  }, [balance]);

  useEffect(() => {
    if (allIds) {
      setIds(allIds as string[]);
      setIsLoading(false);
    }
  }, [allIds]);

  useEffect(() => {
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const encodeData = abiCoder.encode(
      ["uint256", "uint256", "address"],
      [CHAIN_ID, 0, PUS_ADDRESS]
    );
    const salt = ethers.keccak256(encodeData);
    setDna(BigInt(salt).toString());
  }, [])

  const tokenGrowth = useContractRead("growth", [selectedTokenId || 0]);
  const tokenName = useContractRead("getTokenName", [selectedTokenId || 0]);

  useEffect(() => {
    if (tokenGrowth !== undefined) {
      setGrowth(tokenGrowth as string);
    }
  }, [tokenGrowth]);

  useEffect(() => {
    if (tokenName !== undefined) {
      setPusName(tokenName as string);
    }
  }, [tokenName]);

  const {contractWrite, isConfirmed, isConfirming, isPending, error, receipt} = useContractWrite();

  const handlePet = () => {
    if (!selectedTokenId) return;
    contractWrite("pet", [selectedTokenId]);
    toast({
      title: "Submited Transaction",
      description: "Transaction submitted successfully",
    })
  }

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })
    }
  }, [isConfirmed])

  const dnaData = {
    name: "Genes",
    value: dna,
    icon: <Dna size={14} className="text-purple-500" />
  }

  const attributes = [
    { name: "Aether", value: 88, icon: <Atom size={14} className="text-cyan-500" /> },
    { name: "Bonding", value: 88, icon: <Heart size={14} className="text-red-600" /> },
    { name: "Growth", value: 88, icon: <Sparkles size={14} className="text-amber-500" /> },
    { name: "Elemented", value: 88, icon: <Atom size={14} className="text-blue-500" /> },
    { name: "Wisdom", value: 88, icon: <BookOpen size={14} className="text-emerald-500" /> },
  ]

  const equipSlots = [
    { name: "Background", icon: "/gotchi/e1.png", color: "bg-gradient-to-br from-purple-200 to-purple-100" },
    { name: "Head", icon: "/gotchi/e2.png", color: "bg-gradient-to-br from-blue-200 to-blue-100" },
    { name: "Face", icon: "/gotchi/e3.png", color: "bg-gradient-to-br from-pink-200 to-pink-100" },
    { name: "Ears", icon: "/gotchi/e4.png", color: "bg-gradient-to-br from-yellow-200 to-yellow-100" },
    { name: "Left Hand", icon: "/gotchi/e5.png", color: "bg-gradient-to-br from-green-200 to-green-100" },
    { name: "Right Hand", icon: "/gotchi/e1.png", color: "bg-gradient-to-br from-indigo-200 to-indigo-100" },
    { name: "Body", icon: "/gotchi/e2.png", color: "bg-gradient-to-br from-orange-200 to-orange-100" },
    { name: "Companion", icon: "/gotchi/e3.png", color: "bg-gradient-to-br from-red-200 to-red-100" },
  ]

  const availableEquipments = [
    { name: "Crown", icon: "/gotchi/e1.png" },
    { name: "Glasses", icon: "/gotchi/e2.png" },
    { name: "Hat", icon: "/gotchi/e3.png" },
    { name: "Sword", icon: "/gotchi/e4.png" },
    { name: "Shield", icon: "/gotchi/e5.png" },
    { name: "Wand", icon: "/gotchi/e1.png" },
    { name: "Book", icon: "/gotchi/e2.png" },
    { name: "Potion", icon: "/gotchi/e3.png" },
    { name: "Ring", icon: "/gotchi/e4.png" },
    { name: "Amulet", icon: "/gotchi/e5.png" },
    { name: "Cape", icon: "/gotchi/e1.png" },
    { name: "Boots", icon: "/gotchi/e2.png" },
  ]

  const handleRename = () => {
    if (!selectedTokenId) return;
    
    if (isRenaming) {
      if (newName.trim()) {
        setPusName(newName.trim())
        contractWrite("setName", [newName.trim(), selectedTokenId]);
        toast({
          title: "Submited Transaction",
          description: "Transaction submitted successfully",
        })
      }
      setIsRenaming(false)
    } else {
      setIsRenaming(true)
    }
  }

  const handleEquipSlotClick = (index: number) => {
    setSelectedEquipSlot(index === selectedEquipSlot ? null : index)
    setShowEquipSelect(true)
  }

  const handleEquipSelect = (equipment: { name: string; icon: string }) => {
    console.log("Selected equipment:", equipment)
    setShowEquipSelect(false)
  }

  const handleTokenSelect = (tokenId: string) => {
    setSelectedTokenId(tokenId);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-[#ececec] h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your NFTs...</p>
        </div>
      </div>
    );
  }

  // No NFTs state
  if (balances === 0) {
    return (
      <div className="p-6 bg-[#ececec] h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Image src="/gotchi/preview.png" alt="No NFTs" width={120} height={120} />
          </div>
          <h3 className="text-xl font-bold mb-2">No NFTs Found</h3>
          <p className="text-gray-600 mb-4">You don't have any Gotchipus NFTs yet.</p>
          <button
            className="border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm px-6 py-2 hover:bg-[#c0c0c0]"
          >
            Mint a Gotchipus
          </button>
        </div>
      </div>
    );
  }

  // NFT selection view
  if (!selectedTokenId) {
    return (
      <div className="p-6 bg-[#ececec] h-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">Select a Gotchipus</h2>
        <div className="grid grid-cols-4 gap-4">
          {ids.map((id) => (
            <div
              key={id}
              className="bg-white flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md"
              onClick={() => handleTokenSelect(id.toString())}
            >
              <div className="w-48 h-48 relative flex items-center justify-center">
                <Image src="/gotchi/preview.png" alt="Gotchipus" width={150} height={150} />
              </div>
              <div className="text-center mt-4 text-sm">#{id.toString()}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Detailed view for selected NFT
  return (
    <div className="p-6 bg-[#ececec] h-full overflow-auto">
      {/* First Row */}
      <div className="flex mb-6 gap-4">
        {/* Left Column - Pet Display */}
        <div className="w-1/2 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-gradient-to-br from-white to-[#f5f5f5] rounded-sm p-4">
          <div className="text-center mb-4 flex justify-center items-center">
            {isRenaming ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border-2 border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] bg-white p-1 text-center w-full max-w-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename()
                  if (e.key === "Escape") {
                    setIsRenaming(false)
                    setNewName("")
                  }
                }}
              />
            ) : (
              <div className="font-bold text-lg flex items-center">
                <span className="mr-2">🐙</span>
                {pusName}
              </div>
            )}
          </div>

          <div className="flex justify-center items-center h-64 relative">
            <div className="absolute w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30 animate-pulse"></div>
            <Image
              src="/gotchi/preview.png"
              alt="Colorful pixelated gotchipus"
              width={192}
              height={192}
            />
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleRename}
              className="border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm px-6 py-2 hover:bg-[#c0c0c0] flex items-center"
            >
              <span className="mr-1">✏️</span> Rename
            </button>
            <button
              onClick={handlePet}
              className="border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm px-6 py-2 hover:bg-[#c0c0c0] flex items-center"
            >
              <span className="mr-1">👋</span> Pet
            </button>
          </div>
        </div>

        {/* Right Column - Equip */}
        <div className="w-1/2 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-gradient-to-br from-white to-[#f5f5f5] rounded-sm p-4">
          <div className="text-lg font-bold mb-3 flex items-center border-b border-[#c0c0c0] pb-2">
            <Gift size={18} className="mr-2 text-purple-600" />
            Equip
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {equipSlots.map((slot, index) => (
              <div
                key={index}
                className={`flex flex-col cursor-pointer transition-all duration-200 transform ${selectedEquipSlot === index ? "scale-105" : "hover:scale-105"}`}
                onClick={() => handleEquipSlotClick(index)}
              >
                <div
                  className={`h-28 border-2 ${selectedEquipSlot === index ? "border-[#000080]" : "border-[#808080]"} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] ${slot.color} rounded-t-sm flex items-center justify-center`}
                >
                  <Image src={slot.icon} alt={slot.name} width={64} height={64} />
                </div>
                <div
                  className={`border-2 border-t-0 ${selectedEquipSlot === index ? "border-[#000080] bg-[#e0e0ff]" : "border-[#808080] bg-[#d4d0c8]"} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] rounded-b-sm p-1 text-center font-medium text-sm`}
                >
                  {slot.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex gap-4">
        {/* Left Column - Attributes */}
        <div className="w-1/2 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-gradient-to-br from-white to-[#f5f5f5] rounded-sm p-4">
          <div className="text-lg font-bold mb-3 flex items-center border-b border-[#c0c0c0] pb-2">
            <Award size={18} className="mr-2 text-blue-600" />
            Attributes
          </div>

          <div className="grid grid-cols-1 gap-3 mb-4">
            {attributes.map((attr, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center">
                  <span className="mr-1">{attr.icon}</span>
                  <span className="font-medium">
                    {attr.name} <span className="font-bold">{attr.value}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* DNA ID Section */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="mr-1">{dnaData.icon}</span>
              <span className="font-medium">{dnaData.name}</span>
            </div>
            <div className="border-t border-[#c0c0c0] my-2"></div>
            <div className="font-mono text-xs bg-[#d4d0c8] p-2 border border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] overflow-x-auto whitespace-nowrap scrollbar-none">
              {dnaData.value}
            </div>
          </div>

          {/* Tokenbound Account Section */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="mr-1">🔑</span>
              <span className="font-medium">Tokenbound Account</span>
            </div>
            <div className="border-t border-[#c0c0c0] my-2"></div>
            <div className="font-mono text-xs bg-[#d4d0c8] p-2 border border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] overflow-x-auto whitespace-nowrap scrollbar-none">
              0x26BcC72fee9a8566b63EE8969FE8b251ED2aEE6e
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#c0c0c0]">
            <div className="text-sm text-gray-600 mb-2">Gotchipus Level: 1</div>
            <div className="w-full bg-[#d4d0c8] border border-[#808080] h-4">
              <div className="bg-[#000080] h-full" style={{ width: `${Number(growth)}%` }}></div>
            </div>
            <div className="text-xs text-right mt-1">XP: {growth}/100</div>
          </div>
        </div>

        {/* Right Column - Wallet */}
        <div className="w-1/2 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-gradient-to-br from-white to-[#f5f5f5] rounded-sm p-4">
          <div className="text-lg font-bold mb-3 flex items-center border-b border-[#c0c0c0] pb-2">
            <Gift size={18} className="mr-2 text-purple-600" />
            Wallet
          </div>

          {/* Wallet Tabs */}
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setActiveWalletTab("tokens")}
              className={`px-4 py-2 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] rounded-sm font-medium hover:bg-[#c0c0c0] ${
                activeWalletTab === "tokens" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
              }`}
            >
              Tokens
            </button>
            <button 
              onClick={() => setActiveWalletTab("nfts")}
              className={`px-4 py-2 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] rounded-sm font-medium hover:bg-[#c0c0c0] ${
                activeWalletTab === "nfts" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
              }`}
            >
              NFTs
            </button>
          </div>

          {/* Token List */}
          {activeWalletTab === "tokens" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[#d4d0c8] border border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center mr-3">
                    <Image src="/tokens/pharos.png" alt="PTT" width={24} height={24} />
                  </div>
                  
                  <div>
                    <div className="font-medium">PUS Token</div>
                    <div className="text-xs text-gray-600">Pharos Test Token</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">0.00</div>
                  <div className="text-xs text-gray-600">$0.00</div>
                </div>
              </div>
            </div>
          )}

          {/* NFT Grid */}
          {activeWalletTab === "nfts" && (
            <div className="grid grid-cols-3 gap-3">
              {ids.map((id) => (
                <div 
                  key={id} 
                  className={`aspect-square bg-[#d4d0c8] border border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] overflow-hidden cursor-pointer ${selectedTokenId === id.toString() ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => handleTokenSelect(id.toString())}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Image src="/gotchi/preview.png" alt="Gotchipus" width={64} height={64} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showEquipSelect && (
        <EquipSelectWindow
          onClose={() => setShowEquipSelect(false)}
          equipments={availableEquipments}
          onSelect={handleEquipSelect}
        />
      )}
    </div>
  )
})

export default DashboardContent;