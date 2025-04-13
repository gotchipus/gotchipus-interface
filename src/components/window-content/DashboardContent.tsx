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
  const { walletStore } = useStores()
  const { toast } = useToast()

  useEffect(() => {
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const encodeData = abiCoder.encode(
      ["uint256", "uint256", "address"],
      [CHAIN_ID, 0, PUS_ADDRESS]
    );
    const salt = ethers.keccak256(encodeData);
    setDna(BigInt(salt).toString());
  }, [])

  const tokenGrowth = useContractRead("growth", [0]);
  const tokenName = useContractRead("getTokenName", [0]);

  useEffect(() => {
    setGrowth(tokenGrowth as string);
    setPusName(tokenName as string);
  }, [tokenGrowth, tokenName])

  const {contractWrite, isConfirmed, isConfirming, isPending, error, receipt} = useContractWrite();

  const handlePet = () => {
    contractWrite("pet", [0]);
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
    { name: "Background", icon: "🦄", color: "bg-gradient-to-br from-purple-200 to-purple-100" },
    { name: "Head", icon: "👁️", color: "bg-gradient-to-br from-blue-200 to-blue-100" },
    { name: "Face", icon: "👄", color: "bg-gradient-to-br from-pink-200 to-pink-100" },
    { name: "Ears", icon: "👂", color: "bg-gradient-to-br from-yellow-200 to-yellow-100" },
    { name: "Left Hand", icon: "🎨", color: "bg-gradient-to-br from-green-200 to-green-100" },
    { name: "Right Hand", icon: "🖼️", color: "bg-gradient-to-br from-indigo-200 to-indigo-100" },
    { name: "Body", icon: "🐎", color: "bg-gradient-to-br from-orange-200 to-orange-100" },
    { name: "Companion", icon: "🧬", color: "bg-gradient-to-br from-red-200 to-red-100" },
  ]

  const availableEquipments = [
    { name: "Crown", icon: "👑" },
    { name: "Glasses", icon: "👓" },
    { name: "Hat", icon: "🎩" },
    { name: "Sword", icon: "⚔️" },
    { name: "Shield", icon: "🛡️" },
    { name: "Wand", icon: "🪄" },
    { name: "Book", icon: "📚" },
    { name: "Potion", icon: "⚗️" },
    { name: "Ring", icon: "💍" },
    { name: "Amulet", icon: "📿" },
    { name: "Cape", icon: "🧥" },
    { name: "Boots", icon: "👢" },
  ]

  const handleRename = () => {
    if (isRenaming) {
      if (newName.trim()) {
        setPusName(newName.trim())
        contractWrite("setName", [newName.trim(), 0]);
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

  return (
    <div className="p-6 bg-[#ececec] h-full overflow-auto">
      <div className="flex mb-6 gap-4">
        <div className="w-3/5 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-gradient-to-br from-white to-[#f5f5f5] rounded-sm p-4">
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
              src="/pus.png"
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

        <div className="w-2/5 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-gradient-to-br from-white to-[#f5f5f5] rounded-sm p-4">
          <div className="text-lg font-bold mb-3 flex items-center border-b border-[#c0c0c0] pb-2">
            <Award size={18} className="mr-2 text-blue-600" />
            Attributes
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
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

          <div className="mt-4 pt-4 border-t border-[#c0c0c0]">
            <div className="text-sm text-gray-600 mb-2">Gotchipus Level: 1</div>
            <div className="w-full bg-[#d4d0c8] border border-[#808080] h-4">
              <div className="bg-[#000080] h-full" style={{ width: `${Number(growth)}%` }}></div>
            </div>
            <div className="text-xs text-right mt-1">XP: {growth}/100</div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-lg font-bold mb-3 flex items-center">
          <Gift size={18} className="mr-2 text-purple-600" />
          Equip
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {equipSlots.slice(0, 4).map((slot, index) => (
            <div
              key={index}
              className={`flex flex-col cursor-pointer transition-all duration-200 transform ${selectedEquipSlot === index ? "scale-105" : "hover:scale-105"}`}
              onClick={() => handleEquipSlotClick(index)}
            >
              <div
                className={`h-48 border-2 ${selectedEquipSlot === index ? "border-[#000080]" : "border-[#808080]"} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] ${slot.color} rounded-t-sm h-24 flex items-center justify-center`}
              >
                <span className="text-3xl opacity-40">{slot.icon}</span>
              </div>
              <div
                className={`border-2 border-t-0 ${selectedEquipSlot === index ? "border-[#000080] bg-[#e0e0ff]" : "border-[#808080] bg-[#d4d0c8]"} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] rounded-b-sm p-1 text-center font-medium`}
              >
                {slot.name}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {equipSlots.slice(4, 8).map((slot, index) => (
            <div
              key={index + 4}
              className={`flex flex-col cursor-pointer transition-all duration-200 transform ${selectedEquipSlot === index + 4 ? "scale-105" : "hover:scale-105"}`}
              onClick={() => {
                handleEquipSlotClick(index + 4)
                setShowEquipSelect(true)
              }}
            >
              <div
                className={`h-48 border-2 ${selectedEquipSlot === index + 4 ? "border-[#000080]" : "border-[#808080]"} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] ${slot.color} rounded-t-sm h-24 flex items-center justify-center`}
              >
                <span className="text-3xl opacity-40">{slot.icon}</span>
              </div>
              <div
                className={`border-2 border-t-0 ${selectedEquipSlot === index + 4 ? "border-[#000080] bg-[#e0e0ff]" : "border-[#808080] bg-[#d4d0c8]"} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] rounded-b-sm p-1 text-center font-medium`}
              >
                {slot.name}
              </div>
            </div>
          ))}
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