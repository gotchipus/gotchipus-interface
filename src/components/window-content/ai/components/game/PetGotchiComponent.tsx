"use client";

import { useState, useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import GotchiGrid from "./GotchiGrid";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { useContractWrite } from "@/src/hooks/useContract"
import { useToast } from '@/hooks/use-toast'
import { checkAndCompleteTask } from "@/src/utils/taskUtils"


interface GotchiItem {
  id: string;
}

interface PetGotchiComponentProps {
  onPetSuccess?: (tokenId: string, txHash: string) => void;
}

const PetGotchiComponent = observer(({ onPetSuccess }: PetGotchiComponentProps) => {
  const { walletStore } = useStores();
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [pettingTokenId, setPettingTokenId] = useState<string | null>(null);
  const { openConnectModal } = useConnectModal();
  const [txHash, setTxHash] = useState<string | null>(null);
  const { toast } = useToast()

  const {contractWrite, isConfirmed, error} = useContractWrite();


  useEffect(() => {
    if (!walletStore.isConnected || !walletStore.address) {
      setGotchiList([]);
      setLoadingGotchis(false);
      return;
    }

    const fetchGotchis = async () => {
      try {
        setLoadingGotchis(true);
        const response = await fetch(`/api/tokens/gotchipus?owner=${walletStore.address}`);
        if (response.ok) {
          const data = await response.json();
          const gotchis = data.filteredIds.map((id: string) => ({
            id,
          }));
          setGotchiList(gotchis);
        }
      } catch (error) {
        console.error('Failed to fetch gotchis:', error);
      } finally {
        setLoadingGotchis(false);
      }
    };

    fetchGotchis();
  }, [walletStore.address, walletStore.isConnected]);

  const handlePet = async (gotchi: GotchiItem) => {
    if (!walletStore.isConnected) {
      openConnectModal?.();
      return;
    }

    try {
      setIsLoading(true);
      setPettingTokenId(gotchi.id);
      contractWrite("pet", [BigInt(gotchi.id)]);

      toast({
        title: "Submited Transaction",
        description: "Transaction submitted successfully",
      });
    } catch (error) {
      console.error('Pet failed:', error);
    } finally {
      setIsLoading(false);
      setPettingTokenId(null);
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


  const getButtonText = (gotchi: GotchiItem) => {
    if (pettingTokenId === gotchi.id && isLoading) return 'Petting...';
    if (txHash && isLoading && pettingTokenId === gotchi.id) return 'Confirming...';
    if (txHash && isConfirmed && pettingTokenId === gotchi.id) return 'Petted!';
    return 'Pet';
  };

  if (!walletStore.isConnected) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-6 text-center">
        <div className="bg-[#0078d4] text-white px-3 py-1 mb-4 flex items-center">
          <div className="mr-2 font-bold">⚠️</div>
          <div className="text-sm font-bold">Connect Required</div>
        </div>
        <p className="text-sm text-[#404040] mb-4">Please connect your wallet to view your Gotchis</p>
        <button
          className="px-6 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]"
          onClick={() => openConnectModal?.()}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loadingGotchis) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-6 text-center">
        <p className="text-sm text-[#404040]">Loading your Gotchis...</p>
      </div>
    );
  }

  if (gotchiList.length === 0) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-6 text-center">
        <p className="text-sm text-[#404040]">You don't have any Gotchis yet!</p>
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to start petting them.</p>
      </div>
    );
  }

  return (
    <>
      <GotchiGrid
        gotchiList={gotchiList}
        onGotchiAction={handlePet}
        getButtonText={getButtonText}
        isLoading={loadingGotchis}
        emptyMessage="You don't have any Gotchis yet!"
        emptySubMessage="Mint some Gotchis first to start petting them."
      />
      
      {txHash && (
        <div className="mt-4 bg-[#23232b] border border-blue-300 px-6 py-4 rounded-xl shadow-lg z-50">
          <div className="text-white text-sm flex items-center gap-4">
            <span className="font-bold">Tx:</span>
            <span className="font-mono text-xs">{txHash.slice(0, 8)}...{txHash.slice(-6)}</span>
            <span className={`font-bold px-2 py-1 rounded ${isLoading ? 'text-yellow-300' : isConfirmed ? 'text-green-400' : 'text-gray-400'}`}>{isLoading ? '确认中...' : isConfirmed ? '成功!' : '处理中'}</span>
          </div>
        </div>
      )}
    </>
  );
});

export default PetGotchiComponent;