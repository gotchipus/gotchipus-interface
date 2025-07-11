import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { GotchiCard } from "./GotchiCard";

interface GotchiItem {
  id: string;
  image?: string;
}

interface PetGotchiComponentProps {
  onPetSuccess?: (tokenId: string, txHash: string) => void;
}

export function PetGotchiComponent({ onPetSuccess }: PetGotchiComponentProps) {
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [pettingTokenId, setPettingTokenId] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { writeContract } = useWriteContract();
  const [txHash, setTxHash] = useState<string | null>(null);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  useEffect(() => {
    if (!isConnected || !address) {
      setGotchiList([]);
      setLoadingGotchis(false);
      return;
    }

    const fetchGotchis = async () => {
      try {
        setLoadingGotchis(true);
        const response = await fetch(`/api/tokens/gotchipus?owner=${address}`);
        if (response.ok) {
          const data = await response.json();
          const gotchis = data.filteredIds.map((id: string) => ({
            id,
            image: `/pus.png`
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
  }, [address, isConnected]);

  const handlePet = async (tokenId: string) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    try {
      setIsLoading(true);
      setPettingTokenId(tokenId);
      const result = await writeContract({
        address: PUS_ADDRESS,
        abi: PUS_ABI,
        functionName: 'pet',
        args: [BigInt(tokenId)],
      });
      setTxHash(result as unknown as `0x${string}`);
      if (onPetSuccess) {
        onPetSuccess(tokenId, result as unknown as `0x${string}`);
      }
    } catch (error) {
      console.error('Pet failed:', error);
    } finally {
      setIsLoading(false);
      setPettingTokenId(null);
    }
  };

  const getButtonText = (tokenId: string) => {
    if (pettingTokenId === tokenId && isLoading) return 'Petting...';
    if (txHash && isConfirming && pettingTokenId === tokenId) return 'Confirming...';
    if (txHash && isConfirmed && pettingTokenId === tokenId) return 'Petted!';
    return 'Pet';
  };

  if (!isConnected) {
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
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
        {gotchiList.map((gotchi) => (
          <GotchiCard
            key={gotchi.id}
            name={`Gotchi #${gotchi.id}`}
            image={gotchi.image || ''}
            className="cursor-pointer"
          />
        ))}
      </div>
      {txHash && (
        <div className="mt-4 bg-[#23232b] border border-blue-300 px-6 py-4 rounded-xl shadow-lg z-50">
          <div className="text-white text-sm flex items-center gap-4">
            <span className="font-bold">Tx:</span>
            <span className="font-mono text-xs">{txHash.slice(0, 8)}...{txHash.slice(-6)}</span>
            <span className={`font-bold px-2 py-1 rounded ${isConfirming ? 'text-yellow-300' : isConfirmed ? 'text-green-400' : 'text-gray-400'}`}>{isConfirming ? '确认中...' : isConfirmed ? '成功!' : '处理中'}</span>
          </div>
        </div>
      )}
    </div>
  );
}