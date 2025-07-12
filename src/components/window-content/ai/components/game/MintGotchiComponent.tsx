'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { useContractWrite } from "@/src/hooks/useContract"
import { useToast } from '@/hooks/use-toast'
import { checkAndCompleteTask } from "@/src/utils/taskUtils"


interface MintGotchiComponentProps {
  onMintSuccess?: (txHash: string) => void;
}

const MintGotchiComponent = observer(({ onMintSuccess }: MintGotchiComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { walletStore } = useStores();
  const { openConnectModal } = useConnectModal();
  const { toast } = useToast()

  const {contractWrite, hash, isConfirmed, error} = useContractWrite();


  const handleMint = async () => {
    if (!walletStore.isConnected) {
      openConnectModal?.();
      return;
    }

    try {
      setIsLoading(true);
      contractWrite("freeMint", []);
      
      toast({
        title: "Submited Transaction",
        description: "Transaction submitted successfully",
      });

    } catch (error) {
      console.error('Mint failed:', error);
    } 
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsLoading(false);
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })

      const upsertData = async () => {
        await checkAndCompleteTask(walletStore.address!, 4);
      }

      upsertData();
      walletStore.setIsTaskRefreshing(true);
      if (onMintSuccess) {
        onMintSuccess(hash as `0x${string}`);
      }
    }
  }, [isConfirmed])

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      toast({
        title: "Transaction Cancelled",
        description: "Transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);


  const getButtonText = () => {
    if (!walletStore.isConnected) return 'Connect Wallet';
    if (isLoading) return 'Minting...';
    return 'Free Mint';
  };

  return (
    <div className="bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-win98-outer p-4 w-48">
      <div className="flex justify-center mb-6">
        <div className="border-2 border-[#808080] shadow-win98-inner p-2 bg-white">
          <Image 
            src="/pharos-mint.png" 
            alt="Pharos Mint" 
            className="w-32 h-32 object-contain pixelated"
            width={128}
            height={128}
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          className={`
            px-8 py-3 border-2 font-bold text-sm min-w-[140px]
            ${isLoading 
              ? 'bg-[#dfdfdf] border-[#808080] text-[#808080] cursor-not-allowed shadow-win98-inner'
              : 'bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-win98-outer hover:bg-[#d0d0d0] active:shadow-win98-inner'
            }
          `}
          onClick={handleMint}
          disabled={isLoading}
        >
          {getButtonText()}
        </button>
      </div>
      
    </div>
  );
});

export default MintGotchiComponent;