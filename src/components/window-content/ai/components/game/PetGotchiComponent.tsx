"use client";

import { useState, useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import GotchiGrid from "./GotchiGrid";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { useContractWrite, useContractRead } from "@/src/hooks/useContract"
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
  const [isVisible, setIsVisible] = useState(false);
  const [selectedGotchi, setSelectedGotchi] = useState<GotchiItem | null>(null);
  const [petSuccessTimestamp, setPetSuccessTimestamp] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const { openConnectModal } = useConnectModal();
  const { toast } = useToast()

  const {contractWrite, hash, isConfirmed, error} = useContractWrite();
  
  const { data: lastPetTime, refetch: refetchLastPetTime } = useContractRead(
    'getLastPetTime',
    selectedGotchi ? [selectedGotchi.id] : [],
    { enabled: !!selectedGotchi }
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!walletStore.isConnected || !walletStore.address) {
      setGotchiList([]);
      setLoadingGotchis(false);
      return;
    }

    const fetchGotchis = async () => {
      try {
        setLoadingGotchis(true);
        const response = await fetch(`/api/tokens/gotchipus?owner=${walletStore.address}&includeGotchipusInfo=true`);
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
    
    if (gotchi.id !== selectedGotchi?.id) {
      setSelectedGotchi(gotchi);
    }
    
    if (gotchi.id === selectedGotchi?.id && !canPetSelectedGotchi()) {
      toast({
        title: "Cannot Pet Yet",
        description: "Please wait for the cooldown to end",
        variant: "destructive"
      });
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
      setPetSuccessTimestamp(Date.now());
      refetchLastPetTime();
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
  }, [isConfirmed, refetchLastPetTime])

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


  useEffect(() => {
    if (gotchiList.length > 0 && !selectedGotchi) {
      setSelectedGotchi(gotchiList[0]);
    }
  }, [gotchiList, selectedGotchi]);
  
  const canPetSelectedGotchi = () => {
    if (!selectedGotchi || !lastPetTime) return true;
    
    const lastPetTimestamp = Number(lastPetTime);
    const cooldownEnd = lastPetTimestamp + (24 * 60 * 60); // 24 hours
    return currentTime >= cooldownEnd;
  };
  
  const getTimeLeftForSelected = () => {
    if (!selectedGotchi || !lastPetTime) return 0;
    
    const lastPetTimestamp = Number(lastPetTime);
    const cooldownEnd = lastPetTimestamp + (24 * 60 * 60); // 24 hours
    const remainingTime = cooldownEnd - currentTime;
    return Math.max(0, remainingTime);
  };
  
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getButtonText = (gotchi: GotchiItem) => {
    if (pettingTokenId === gotchi.id && isLoading) return 'Petting...';
    
    if (gotchi.id === selectedGotchi?.id && !canPetSelectedGotchi()) {
      return formatCountdown(getTimeLeftForSelected());
    }
    
    return 'Pet';
  };

  if (loadingGotchis) {
    return (
      <div 
        className={`bg-[#c0c0c0] border-2 shadow-win98-innerp-6 text-center transition-all duration-800 ease-out origin-top-left ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0'
        }`}
        style={{
          clipPath: isVisible 
            ? 'circle(150% at 0% 0%)' 
            : 'circle(0% at 0% 0%)',
          transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
        }}
      >
        <p className="text-sm text-[#404040]">Loading your Gotchis...</p>
      </div>
    );
  }

  if (gotchiList.length === 0) {
    return (
      <div 
        className={`bg-[#c0c0c0] border-2 shadow-win98-innerp-6 text-center transition-all duration-800 ease-out origin-top-left ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0'
        }`}
        style={{
          clipPath: isVisible 
            ? 'circle(150% at 0% 0%)' 
            : 'circle(0% at 0% 0%)',
          transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
        }}
      >
        <p className="text-sm text-[#404040]">You don't have any Gotchis yet!</p>
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to start petting them.</p>
      </div>
    );
  }

  return (
    <div 
      className={`transition-all duration-800 ease-out origin-top-left ${
        isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-0'
      }`}
      style={{
        clipPath: isVisible 
          ? 'circle(150% at 0% 0%)' 
          : 'circle(0% at 0% 0%)',
        transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
      }}
    >
      <GotchiGrid
        gotchiList={gotchiList.map(gotchi => ({
          ...gotchi,
          canPet: gotchi.id === selectedGotchi?.id ? canPetSelectedGotchi() : true
        }))}
        onGotchiSelect={setSelectedGotchi}
        selectedGotchiId={selectedGotchi?.id || null}
        onGotchiAction={handlePet}
        getButtonText={getButtonText}
        isLoading={loadingGotchis}
        emptyMessage="You don't have any Gotchis yet!"
        emptySubMessage="Mint some Gotchis first to start petting them."
      />
    </div>
  );
});

export default PetGotchiComponent;