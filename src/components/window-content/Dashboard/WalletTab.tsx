'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { getPharosNativeBalance } from "@/src/utils/contractHepler"
import { ethers } from "ethers"

interface WalletTabProps {
  activeWalletTab: "tokens" | "nfts"
  setActiveWalletTab: (tab: "tokens" | "nfts") => void
  ids: string[]
  selectedTokenId: string | null
  handleTokenSelect: (tokenId: string) => void,
  tbaAddress: string
}

const WalletTab = ({
  activeWalletTab,
  setActiveWalletTab,
  ids,
  selectedTokenId,
  handleTokenSelect,
  tbaAddress
}: WalletTabProps) => {
  const [pharosBalance, setPharosBalance] = useState("");

  useEffect(() => {
    const fetchPharosBalance = async () => {
      if (tbaAddress) {
        const balance = await getPharosNativeBalance(tbaAddress);
        const formattedBalance = ethers.formatEther(balance);
        setPharosBalance(formattedBalance);
      }
    };
    fetchPharosBalance();
  }, [tbaAddress]);

  return (
    <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-4">
      <div className="text-lg font-bold mb-3 flex items-center border-b border-[#808080] pb-2">
        <Image src="/icons/wallet.png" alt="Wallet" width={18} height={18} className="mr-2" />
        Wallet
      </div>

      {/* Wallet Tabs */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setActiveWalletTab("tokens")}
          className={`px-4 py-2 border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] ${
            activeWalletTab === "tokens" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          }`}
        >
          Tokens
        </button>
        <button 
          onClick={() => setActiveWalletTab("nfts")}
          className={`px-4 py-2 border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] ${
            activeWalletTab === "nfts" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          }`}
        >
          NFTs
        </button>
      </div>

      {/* Token List */}
      {activeWalletTab === "tokens" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-[#c0c0c0] border border-[#808080] shadow-win98-inner">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <Image src="/tokens/pharos.png" alt="PTT" width={24} height={24} />
              </div>
              
              <div>
                <div className="font-medium">PHRS</div>
                <div className="text-xs text-[#000080]">Pharos Token</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">{pharosBalance}</div>
              <div className="text-xs text-[#000080]">$0.00</div>
            </div>
          </div>
        </div>
      )}

      {/* NFT Grid */}
      {activeWalletTab === "nfts" && (
        <div className="grid grid-cols-3 gap-3">
          {/* {ids.map((id) => (
            <div 
              key={id} 
              className={`aspect-square bg-[#c0c0c0] border border-[#808080] shadow-win98-inner overflow-hidden cursor-pointer ${selectedTokenId === id.toString() ? 'border-[#000080]' : ''}`}
              onClick={() => handleTokenSelect(id.toString())}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Image src={`https://app.gotchipus.com/metadata/gotchipus/${id}.png`} alt="Gotchipus" width={64} height={64} />
              </div>
            </div>
          ))} */}
          No NFTs in wallet yet
        </div>
      )}
    </div>
  )
}

export default WalletTab 