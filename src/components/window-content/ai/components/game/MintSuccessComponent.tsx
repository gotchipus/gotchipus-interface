'use client'

import { useEffect } from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface MintSuccessComponentProps {
  txHash: string;
  onDataReady?: () => void;
}

const MintSuccessComponent = ({ 
  txHash, 
  onDataReady 
}: MintSuccessComponentProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDataReady?.();
    }, 500);
    return () => clearTimeout(timer);
  }, [onDataReady]);

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const handleViewTx = () => {
    window.open(`https://testnet.pharosscan.xyz/tx/${txHash}`, '_blank');
  };

  return (
    <div className="bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-win98-outer p-4 max-w-md">
      <div className="flex items-center mb-4">
        <CheckCircle className="text-green-600 mr-2" size={20} />
        <h3 className="text-sm font-bold">Mint Successful!</h3>
      </div>
      
      <div className="bg-white border-2 border-[#808080] shadow-win98-inner p-3">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-[#dfdfdf]">
              <td className="py-2 font-bold text-[#000080]">Transaction:</td>
              <td className="py-2 flex items-center justify-between">
                <span className="font-mono">{formatTxHash(txHash)}</span>
                <button
                  onClick={handleViewTx}
                  className="ml-2 text-[#000080] hover:text-[#0000ff] flex items-center"
                  title="View on Explorer"
                >
                  <ExternalLink size={12} />
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2 font-bold text-[#000080]">Status:</td>
              <td className="py-2 text-green-600 font-bold">Confirmed</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 text-xs text-[#808080] text-center">
        Your Pharos NFT has been successfully minted!
      </div>
    </div>
  );
};

export default MintSuccessComponent;