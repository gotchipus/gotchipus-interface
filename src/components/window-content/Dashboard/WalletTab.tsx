'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { getPharosNativeBalance } from "@/src/utils/contractHepler"
import { ethers } from "ethers"
import CallHome from "./WalletTabContent/CallHome"
import SendTokenFlow from "./WalletTabContent/SendTokenFlow"
import CustomInteractionFlow from "./WalletTabContent/CustomInteractionFlow"


interface WalletTabProps {
  tokenId: string;
  tbaAddress: string;
  activeWalletTab: "tokens" | "nfts" | "call";
  setActiveWalletTab: (tab: "tokens" | "nfts" | "call") => void;
  isMobile?: boolean;
}

const WalletTab = ({ tokenId, tbaAddress, activeWalletTab, setActiveWalletTab, isMobile }: WalletTabProps) => {
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
        <div className={`flex flex-col items-center justify-center h-full ${isMobile ? 'p-3' : 'p-4'}`}>
            <div className={`${isMobile ? 'text-base' : 'text-lg'}`}>✅</div>
            <div className={`font-bold mb-4 ${isMobile ? 'text-sm' : ''}`}>Call Receipt</div>
            <div className={`bg-white border border-[#808080] shadow-win98-inner text-center ${isMobile ? 'p-2 text-xs' : 'p-3 text-xs'}`}>{callResult}</div>
            <button onClick={() => setCallResult(null)} className={`mt-4 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] ${isMobile ? 'px-3 py-1 text-sm' : 'px-4 py-2'}`}>
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
          tokenId={tokenId}
        />;
      case 'sendNft':
        return <div className={`${isMobile ? 'p-3' : 'p-4'}`}><button onClick={() => setActiveFlow('home')}>←</button> NFT Flow is under construction.</div>;
      case 'custom':
        return <CustomInteractionFlow onBack={() => setActiveFlow('home')} tbaAddress={tbaAddress} tokenId={tokenId} />;
      case 'home':
      default:
        return <CallHome setActiveFlow={setActiveFlow} />;
    }
  };

  return (
    <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm ${isMobile ? 'p-3' : 'p-4'}`}>
      <div className={`font-bold mb-3 flex items-center border-b border-[#808080] pb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
        <Image src="/icons/wallet.png" alt="Wallet" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
        Wallet
      </div>

      {/* Wallet Tabs */}
      <div className={`flex gap-2 mb-4 ${isMobile ? 'flex-wrap' : ''}`}>
        <button onClick={() => setActiveWalletTab("tokens")} className={`border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] ${activeWalletTab === "tokens" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"} ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}>Tokens</button>
        <button onClick={() => setActiveWalletTab("nfts")} className={`border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] ${activeWalletTab === "nfts" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"} ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}>NFTs</button>
        <button onClick={() => setActiveWalletTab("call")} className={`border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] ${activeWalletTab === "call" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"} ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}>Call</button>
      </div>

      <div className={`${isMobile ? 'min-h-[400px]' : 'min-h-[500px]'}`}>
        {activeWalletTab === "tokens" && (
          <div className="space-y-2">
            <div className={`flex items-center justify-between bg-[#c0c0c0] border border-[#808080] shadow-win98-inner ${isMobile ? 'p-2' : 'p-3'}`}>
              <div className="flex items-center">
                <div className={`flex items-center justify-center mr-3 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}><Image src="/tokens/pharos.png" alt="PTT" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} /></div>
                <div><div className={`font-medium ${isMobile ? 'text-sm' : ''}`}>PHRS</div><div className={`text-[#000080] ${isMobile ? 'text-xs' : 'text-xs'}`}>Pharos Token</div></div>
              </div>
              <div className="text-right"><div className={`font-bold ${isMobile ? 'text-sm' : ''}`}>{pharosBalance}</div><div className={`text-[#000080] ${isMobile ? 'text-xs' : 'text-xs'}`}>$0.00</div></div>
            </div>
          </div>
        )}

        {activeWalletTab === "nfts" && (
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
            <div className={`${isMobile ? 'text-sm' : ''}`}>No NFTs in wallet yet</div>
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