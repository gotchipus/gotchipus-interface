'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { getPharosNativeBalance } from "@/src/utils/contractHepler"
import { ethers } from "ethers"
import CallHome from "./WalletTabContent/CallHome"
import SendTokenFlow from "./WalletTabContent/SendTokenFlow"
import CustomInteractionFlow from "./WalletTabContent/CustomInteractionFlow"


interface WalletTabProps {
  activeWalletTab: "tokens" | "nfts" | "call";
  setActiveWalletTab: (tab: "tokens" | "nfts" | "call") => void;
  tbaAddress: string;
  ids: string[]
  selectedTokenId: string
  handleTokenSelect: (tokenId: string) => void,
}

const WalletTab = ({ activeWalletTab, setActiveWalletTab, tbaAddress, ids, selectedTokenId, handleTokenSelect }: WalletTabProps) => {
  const [pharosBalance, setPharosBalance] = useState("");
  const [callResult, setCallResult] = useState<string | null>(null);

  const [activeFlow, setActiveFlow] = useState<'home' | 'sendToken' | 'sendNft' | 'custom'>('home');

  useEffect(() => {
    if (activeWalletTab === 'call') {
      setActiveFlow('home');
      setCallResult(null);
    }
  }, [activeWalletTab]);
  
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

  const handleFlowComplete = (result: string) => {
    setCallResult(result);
    setActiveFlow('home');
  };
  
  const renderCallContent = () => {
    if (callResult) {
      return (
        <div className="p-4 flex flex-col items-center justify-center h-full">
            <div className="text-lg">✅</div>
            <div className="font-bold mb-4">Call Receipt</div>
            <div className="p-3 bg-white border border-[#808080] shadow-win98-inner text-xs text-center">{callResult}</div>
            <button onClick={() => setCallResult(null)} className="mt-4 px-4 py-2 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0]">
              Back
            </button>
        </div>
      );
    }

    switch (activeFlow) {
      case 'sendToken':
        return <SendTokenFlow 
          onBack={() => setActiveFlow('home')} 
          onComplete={handleFlowComplete} 
          tbaAddress={tbaAddress} 
          nativeBalance={pharosBalance} 
          tokenId={selectedTokenId}
        />;
      case 'sendNft':
        return <div className="p-4"><button onClick={() => setActiveFlow('home')}>←</button> NFT Flow is under construction.</div>;
      case 'custom':
        return <CustomInteractionFlow onBack={() => setActiveFlow('home')} onComplete={handleFlowComplete} />;
      case 'home':
      default:
        return <CallHome setActiveFlow={setActiveFlow} />;
    }
  };

  return (
    <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-4">
      <div className="text-lg font-bold mb-3 flex items-center border-b border-[#808080] pb-2">
        <Image src="/icons/wallet.png" alt="Wallet" width={18} height={18} className="mr-2" />
        Wallet
      </div>

      {/* Wallet Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveWalletTab("tokens")} className={`px-4 py-2 border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] ${activeWalletTab === "tokens" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"}`}>Tokens</button>
        <button onClick={() => setActiveWalletTab("nfts")} className={`px-4 py-2 border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] ${activeWalletTab === "nfts" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"}`}>NFTs</button>
        <button onClick={() => setActiveWalletTab("call")} className={`px-4 py-2 border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] ${activeWalletTab === "call" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"}`}>Call</button>
      </div>

      <div className="min-h-[500px]">
        {activeWalletTab === "tokens" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-[#c0c0c0] border border-[#808080] shadow-win98-inner">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center mr-3"><Image src="/tokens/pharos.png" alt="PTT" width={24} height={24} /></div>
                <div><div className="font-medium">PHRS</div><div className="text-xs text-[#000080]">Pharos Token</div></div>
              </div>
              <div className="text-right"><div className="font-bold">{pharosBalance}</div><div className="text-xs text-[#000080]">$0.00</div></div>
            </div>
          </div>
        )}

        {activeWalletTab === "nfts" && (
          <div className="grid grid-cols-3 gap-3">
            No NFTs in wallet yet
          </div>
        )}
        
        {activeWalletTab === "call" && (
          renderCallContent()
        )}
      </div>
    </div>
  )
}

export default WalletTab;