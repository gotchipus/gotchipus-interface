'use client'

import { useState } from "react"
import Image from "next/image"
import { useTranslation, Trans } from "react-i18next"

export default function MintContent() {
  const { t } = useTranslation()
  const [mintAmount, setMintAmount] = useState(1)
  
  const handleMint = () => {
    // Minting logic will be implemented here
    console.log(`Minting ${mintAmount} items`)
  }
  
  const incrementAmount = () => {
    setMintAmount(prev => Math.min(prev + 1, 10))
  }
  
  const decrementAmount = () => {
    setMintAmount(prev => Math.max(prev - 1, 1))
  }
  
  return (
    <div className="p-4 bg-[#c0c0c0] border-2 border-[#dfdfdf] border-t-[#000000] border-l-[#000000] border-r-[#808080] border-b-[#808080]">      
      <div className="bg-[#c0c0c0] p-4 border-2 border-[#dfdfdf] border-t-[#808080] border-l-[#808080] border-r-[#000000] border-b-[#000000]">
        <div className="flex flex-col items-center">
          <div className="mb-4 border-2 border-[#dfdfdf] border-t-[#000000] border-l-[#000000] border-r-[#808080] border-b-[#808080] p-2">
            <Image 
              src="/pharos.png" 
              alt="Mint Preview" 
              width={300} 
              height={300} 
              className="border border-[#808080]"
            />
          </div>
          
          <div className="w-full max-w-md mb-4">
            <div className="bg-[#c0c0c0] p-2 border-2 border-[#dfdfdf] border-t-[#808080] border-l-[#808080] border-r-[#000000] border-b-[#000000] mb-2">
              <p className="text-center font-bold text-[#000080]">
                <Trans i18nKey="mint.free">{t("mint.free")}</Trans>
              </p>
              <p className="text-center text-sm">
                <Trans i18nKey="mint.noCost">{t("mint.noCost")}</Trans>
              </p>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={decrementAmount}
                className="w-8 h-8 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm flex items-center justify-center font-bold hover:bg-[#c0c0c0]"
              >
                -
              </button>
              
              <span className="text-xl font-bold">{mintAmount}</span>
              
              <button 
                onClick={incrementAmount}
                className="w-8 h-8 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm flex items-center justify-center font-bold hover:bg-[#c0c0c0]"
              >
                +
              </button>
            </div>
            
            <button 
              onClick={handleMint}
              className="w-full py-2 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-sm font-bold hover:bg-[#c0c0c0] flex items-center justify-center"
            >
              <span className="mr-2">🎨</span> 
              <Trans i18nKey="mint.button">{t("mint.button")}</Trans>
            </button>
          </div>
          
          <div className="text-center text-sm">
            <p>
              <Trans i18nKey="mint.description">{t("mint.description")}</Trans>
            </p>
            <p className="text-[#000080] font-bold mt-1">
              <Trans i18nKey="mint.limited">{t("mint.limited")}</Trans>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
