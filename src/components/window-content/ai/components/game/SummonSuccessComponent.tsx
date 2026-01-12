'use client'

import { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface SummonSuccessComponentProps {
  tokenId: string;
  txHash: string;
  pusName: string;
  pusStory: string;
  onDataReady?: () => void;
}

const SummonSuccessComponent = ({ 
  tokenId, 
  txHash, 
  pusName, 
  pusStory, 
  onDataReady 
}: SummonSuccessComponentProps) => {
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
    window.open(`https://atlantic.pharosscan.xyz/tx/${txHash}`, '_blank');
  };

  return (
    <div className="bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-win98-outer p-4 max-w-md">
      <div className="flex items-center mb-4">
        <CheckCircle className="text-green-600 mr-2" size={20} />
        <h3 className="text-sm font-bold">Summon Successful!</h3>
      </div>
      
      <div className="bg-white border-2 border-[#808080] shadow-win98-inner p-3">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-[#dfdfdf]">
              <td className="py-2 font-bold text-[#000080]">Token ID:</td>
              <td className="py-2">#{tokenId}</td>
            </tr>
            <tr className="border-b border-[#dfdfdf]">
              <td className="py-2 font-bold text-[#000080]">Name:</td>
              <td className="py-2">{pusName}</td>
            </tr>
            <tr className="border-b border-[#dfdfdf]">
              <td className="py-2 font-bold text-[#000080]">Story:</td>
              <td className="py-2 text-xs leading-relaxed">{pusStory}</td>
            </tr>
            <tr>
              <td className="py-2 font-bold text-[#000080]">Transaction:</td>
              <td className="py-2">
                <button 
                  onClick={handleViewTx}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-xs"
                >
                  {formatTxHash(txHash)}
                  <ExternalLink size={12} className="ml-1" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummonSuccessComponent;