"use client"

import { useState, useCallback } from "react"
import { Fish, Anchor } from "lucide-react"
import Image from "next/image"
import HookManager from "./farm/hooks"


interface FishSeed {
  id: string
  name: string
  count: number
  image: string
}

interface HarvestHook {
  id: string
  address: string
  name: string
  description: string
  icon: JSX.Element
}

// Constants
const FISH_SEEDS: FishSeed[] = [
  { id: "fish1", name: "Fish", count: 5, image: "/farm.png" },
]



// Components
const OceanBackground = () => {
  return (
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
  )
}



const FarmContent = () => {
  const [showHarvestModal, setShowHarvestModal] = useState(false)
  const [selectedFish, setSelectedFish] = useState<string | null>(null)

  const handleRelease = useCallback(() => {
    if (!selectedFish) return

    const fish = FISH_SEEDS.find((f) => f.id === selectedFish)
    if (fish && fish.count > 0) {
      console.log("ok!")
    }
  }, [selectedFish])

  const handleHarvest = useCallback(() => {
    setShowHarvestModal(true)
  }, [])


  const handleSelectFish = useCallback((fishId: string) => {
    const fish = FISH_SEEDS.find((f) => f.id === fishId)
    if (fish && fish.count > 0) {
      setSelectedFish(fishId)
    }
  }, [])

  return (
    <div className="p-4 bg-[#c0c0c0] h-full relative">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Anchor size={20} className="mr-2" />
        Fish Farm
      </h2>

      <div className="flex h-[calc(100%-80px)]">
        <div className="w-3/4 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#0066cc] rounded-sm p-4 mr-4 relative overflow-hidden">
          <OceanBackground />
          
        </div>

        <div className="w-1/4 flex flex-col">
          <div className="flex-1 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm p-3 mb-4 overflow-auto">
            <h3 className="font-bold mb-3 text-center pixel-text">Your Fish</h3>

            <div className="space-y-3">
              {FISH_SEEDS.map((fish) => (
                <div
                  key={fish.id}
                  className={`border-2 ${selectedFish === fish.id ? "border-[#000080] bg-[#d0d0ff]" : "border-[#808080] bg-[#c0c0c0]"} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] rounded-sm p-2 flex items-center justify-between ${fish.count === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#d4d0c8]"}`}
                  onClick={() => fish.count > 0 && handleSelectFish(fish.id)}
                >
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 mr-2">
                      <Image
                        src={fish.image}
                        alt={fish.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="pixel-text">{fish.name}</span>
                  </div>
                  <div className="font-bold pixel-text">x{fish.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRelease}
              disabled={!selectedFish}
              className={`flex-1 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm py-2 hover:bg-[#c0c0c0] flex items-center justify-center ${!selectedFish ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Fish size={16} className="mr-1" />
              <span className="pixel-text">Release</span>
            </button>
            <button
              onClick={handleHarvest}
              className="flex-1 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm py-2 hover:bg-[#c0c0c0] flex items-center justify-center"
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
}

export default FarmContent
