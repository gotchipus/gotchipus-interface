"use client";

import { useState, useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import GotchiGrid from "./GotchiGrid";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { useContractWrite } from "@/src/hooks/useContract"
import { useToast } from '@/hooks/use-toast'
import { checkAndCompleteTask } from "@/src/utils/taskUtils"
import { GotchiItem } from '@/lib/types';


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
  const { toast } = useToast()

  const {contractWrite, hash, isConfirmed, error} = useContractWrite();


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
          const gotchis = data.ids.map((id: string, index: number) => ({
            id,
            info: data.gotchipusInfo[index]
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
        await checkAndCompleteTask(walletStore.address!, 5);
      }

      upsertData();
      walletStore.setIsTaskRefreshing(true);
      onPetSuccess?.(pettingTokenId!, hash as `0x${string}`);
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
    return 'Pet';
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
      
    </>
  );
});

export default PetGotchiComponent;