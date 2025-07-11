import { useState } from 'react';
import { ActionButton } from '../ui/AIActionButton';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';

interface MintGotchiComponentProps {
  onMintSuccess?: (txHash: string) => void;
}

export function MintGotchiComponent({ onMintSuccess }: MintGotchiComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { writeContract } = useWriteContract();
  const [txHash, setTxHash] = useState<string | null>(null);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  const handleMint = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    try {
      setIsLoading(true);
      const result = await writeContract({
        address: PUS_ADDRESS,
        abi: PUS_ABI,
        functionName: 'mint',
        args: [address],
      });
      
      setTxHash(result as unknown as `0x${string}`);
      if (onMintSuccess) {
        onMintSuccess(result as unknown as `0x${string}`);
        console.log('Minted Gotchi:', result as unknown as `0x${string}`);
      }
    } catch (error) {
      console.error('Mint failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (isLoading) return 'Minting...';
    if (isConfirming) return 'Confirming...';
    if (isConfirmed) return 'Minted!';
    return 'Mint Gotchi';
  };

  return (
    <div className="bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-6 max-w-sm mx-auto">
      <div className="flex justify-center mb-6">
        <div className="border-2 border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] p-2 bg-white">
          <img 
            src="/pharos-mint.png" 
            alt="Pharos Mint" 
            className="w-32 h-32 object-contain pixelated"
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          className={`
            px-8 py-3 border-2 font-bold text-sm min-w-[140px]
            ${isLoading || isConfirming || isConfirmed 
              ? 'bg-[#dfdfdf] border-[#808080] text-[#808080] cursor-not-allowed shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]'
              : 'bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]'
            }
          `}
          onClick={handleMint}
          disabled={isLoading || isConfirming || isConfirmed}
        >
          {getButtonText()}
        </button>
      </div>
      
      {txHash && (
        <div className="mt-4 text-center">
          <div className="text-xs text-[#404040] break-all">
            <div className="mb-1">Tx: {txHash.slice(0, 8)}...{txHash.slice(-6)}</div>
            <div className="text-[#008000]">
              {isConfirming ? '⏳ Confirming...' : isConfirmed ? '✅ Success!' : '📤 Pending'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}