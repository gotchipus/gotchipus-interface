"use client"

import { useState, useCallback, useEffect } from "react"
import { Fish, Anchor } from "lucide-react"
import Image from "next/image"
import HookManager from "./farm/hooks"
import { useContractRead, useContractWrite } from "@/hooks/useContract"
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { useToast } from "@/hooks/use-toast"


const FarmContent = observer(() => {
  const { walletStore } = useStores()
  const { toast } = useToast()
  const [showHarvestModal, setShowHarvestModal] = useState(false)
  const [selectedFish, setSelectedFish] = useState(false)
  const [fishCount, setFishCount] = useState("")

  const {data: fishData} = useContractRead("getFishs", [walletStore.address])
  const {contractWrite, isConfirmed, isConfirming, isPending, error, receipt} = useContractWrite();

  useEffect(() => {
    setFishCount(fishData as string)
  }, [fishData])

  const handleRelease = useCallback(() => {
    if (!selectedFish) return
    contractWrite("breed", [20])
    toast({
      title: "Submited Transaction",
      description: "Transaction submitted successfully",
    })
  }, [selectedFish])

  const handleSelectFish = useCallback(() => {
    setSelectedFish(!selectedFish)
  }, [selectedFish])

  const handleHarvest = useCallback(() => {
    setShowHarvestModal(true)
  }, [])

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })
    }
  }, [isConfirmed])

  return (
    <div className="p-4 bg-[#c0c0c0] h-full relative">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Anchor size={20} className="mr-2" />
        Fish Farm
      </h2>

      <div className="flex h-[calc(100%-80px)]">
        <div className="w-3/4 border-2 border-[#808080] shadow-win98-outer bg-[#0066cc] rounded-sm p-4 mr-4 relative overflow-hidden">
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Image
              src="/farmBackground.png"
              alt="Ocean Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/30" />
          </div>
        </div>

        <div className="w-1/4 flex flex-col">
          <div className="flex-1 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-3 mb-4 overflow-auto">
            <h3 className="font-bold mb-3 text-center pixel-text">Your Fish</h3>

            <div className="space-y-3">
              <div
                className={`border-2 cursor-pointer ${selectedFish ? "border-[#000080] bg-[#d0d0ff]" : "border-[#808080] bg-[#c0c0c0]"} shadow-win98-outer rounded-sm p-2 flex items-center justify-between}`}
                onClick={handleSelectFish}
              >
                <div className="flex items-center">
                  <div className="relative w-12 h-12 mr-2">
                    <Image
                      src="/farm.png"
                      alt="Fish"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="pixel-text">Fish</span>
                </div>
                <div className="font-bold pixel-text">x{fishCount}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRelease}
              disabled={!selectedFish}
              className={`flex-1 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm py-2 hover:bg-[#c0c0c0] flex items-center justify-center ${!selectedFish ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Fish size={16} className="mr-1" />
              <span className="pixel-text">Release</span>
            </button>
            <button
              onClick={handleHarvest}
              className="flex-1 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm py-2 hover:bg-[#c0c0c0] flex items-center justify-center"
            >
              <Anchor size={16} className="mr-1" />
              <span className="pixel-text">Harvest</span>
            </button>
          </div>
        </div>
      </div>

      {showHarvestModal && <HookManager isOpen={setShowHarvestModal} />}
    </div>
  )
})

export default FarmContent
