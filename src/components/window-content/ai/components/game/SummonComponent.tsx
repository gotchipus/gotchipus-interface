import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

interface GotchiItem {
  id: string;
  image?: string;
}

interface SummonComponentProps {
  onSummonSuccess?: (tokenId: string, txHash: string) => void;
}

export const SummonComponent = ({ onSummonSuccess }: SummonComponentProps) => {
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

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
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to start summoning them.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Select a Gotchi to Summon</h2>
        <p className="text-sm text-[#404040]">Choose one of your Gotchis to begin the summoning process.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
        {gotchiList.map((gotchi) => (
          <div
            key={gotchi.id}
            className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-4 text-center hover:bg-[#d0d0d0] cursor-pointer"
            onClick={() => console.log('Clicked gotchi:', gotchi.id)}
          >
            <div className="text-sm font-bold">Gotchi #{gotchi.id}</div>
            <div className="text-xs text-[#808080] mt-1">Click to summon</div>
          </div>
        ))}
      </div>
    </div>
  );
};