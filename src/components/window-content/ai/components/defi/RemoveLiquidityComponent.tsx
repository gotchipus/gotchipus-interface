"use client"

import { useState, useEffect, useMemo } from 'react';
import GotchiGrid from "../game/GotchiGrid";
import Image from "next/image";
import { ethers } from "ethers";
import { useERC20Read, useContractWrite } from "@/hooks/useContract";
import { useToast } from '@/hooks/use-toast';
import { Token } from "@/lib/types";
import { Minus, Settings, Info, Percent } from "lucide-react";
import { GotchiItem } from "@/lib/types";
import { SelectToken } from "@/components/window-content/Dashboard/WalletTabContent/SelectToken"
import { Tokens } from "@/lib/constant"
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";

interface RemoveLiquidityComponentProps {
  onSuccess?: (tokenId: string, txHash: string) => void;
}

interface LiquidityPosition {
  pairAddress: string;
  token0: Token;
  token1: Token;
  lpBalance: string;
  token0Amount: string;
  token1Amount: string;
  shareOfPool: string;
}

const LIQUIDITY_TOKENS: Token[] = [
  { name: "Pharos", symbol: "PHRS", icon: "/tokens/pharos.png", contract: "0x0000000000000000000000000000000000000000", balance: "0", decimals: 18, popular: true },
  { name: "USD Coin", symbol: "USDC", icon: "/tokens/usdc.png", contract: "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED", balance: "0", decimals: 6, popular: true },
  { name: "Wrapped Ether", symbol: "WETH", icon: "/tokens/eth.png", contract: "0x4E28826d32F1C398DED160DC16Ac6873357d048f", balance: "0", decimals: 18, popular: true },
  { name: "Tether USD", symbol: "USDT", icon: "/tokens/usdt.png", contract: "0xD4071393f8716661958F766DF660033b3d35fD29", balance: "0", decimals: 6, popular: true },
  { name: "Wrapped BTC", symbol: "WBTC", icon: "/tokens/wbtc.png", contract: "0x8275c526d1bCEc59a31d673929d3cE8d108fF5c7", balance: "0", decimals: 8, popular: false },
];

const RemoveLiquidityComponent = observer(({ onSuccess }: RemoveLiquidityComponentProps) => {
  const { walletStore } = useStores();
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [selectedGotchi, setSelectedGotchi] = useState<GotchiItem | null>(null);
  const [showLiquidityInterface, setShowLiquidityInterface] = useState(false);
  
  const [liquidityPositions, setLiquidityPositions] = useState<LiquidityPosition[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<LiquidityPosition | null>(null);
  const [removePercentage, setRemovePercentage] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  

  const { toast } = useToast();
  const { contractWrite, isConfirmed, error } = useContractWrite();

  const tbaAddress = selectedGotchi ? `0x${selectedGotchi.id.padStart(40, '0')}` : "";
  
  const removalAmounts = useMemo(() => {
    if (!selectedPosition) return { token0: "0", token1: "0", lpTokens: "0" };
    
    const percentage = removePercentage / 100;
    const token0Amount = (parseFloat(selectedPosition.token0Amount) * percentage).toFixed(6);
    const token1Amount = (parseFloat(selectedPosition.token1Amount) * percentage).toFixed(6);
    const lpTokens = (parseFloat(selectedPosition.lpBalance) * percentage).toFixed(6);
    
    return { token0: token0Amount, token1: token1Amount, lpTokens };
  }, [selectedPosition, removePercentage]);

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

  useEffect(() => {
    if (!selectedGotchi) return;

    const fetchLiquidityPositions = async () => {
      try {
        const mockPositions: LiquidityPosition[] = [
          {
            pairAddress: "0x1234567890123456789012345678901234567890",
            token0: LIQUIDITY_TOKENS[0], // PHRS
            token1: LIQUIDITY_TOKENS[1], // USDC
            lpBalance: "1000.0",
            token0Amount: "500.0",
            token1Amount: "750.0",
            shareOfPool: "0.5"
          },
          {
            pairAddress: "0x2345678901234567890123456789012345678901",
            token0: LIQUIDITY_TOKENS[0], // PHRS
            token1: LIQUIDITY_TOKENS[2], // WETH
            lpBalance: "250.0",
            token0Amount: "125.0",
            token1Amount: "0.05",
            shareOfPool: "0.1"
          }
        ];
        
        setLiquidityPositions(mockPositions);
      } catch (error) {
        console.error('Failed to fetch liquidity positions:', error);
      }
    };

    fetchLiquidityPositions();
  }, [selectedGotchi]);

  const handleGotchiSelect = (gotchi: GotchiItem) => {
    setSelectedGotchi(gotchi);
    setShowLiquidityInterface(true);
  };

  const handleBackToList = () => {
    setShowLiquidityInterface(false);
    setSelectedGotchi(null);
    setSelectedPosition(null);
    setRemovePercentage(25);
  };

  const handleBackToPositions = () => {
    setSelectedPosition(null);
    setRemovePercentage(25);
  };

  const handlePositionSelect = (position: LiquidityPosition) => {
    setSelectedPosition(position);
  };

  const handleRemoveLiquidity = async () => {
    if (!selectedGotchi || !selectedPosition || removePercentage === 0) return;
    
    setIsLoading(true);
    setIsProcessing(true);
    
    try {
      const mockRemoveLiquidityCalldata = "0x";
      
      contractWrite("executeAccount", [
        tbaAddress,
        selectedGotchi.id,
        "0x0000000000000000000000000000000000000000",
        0,
        mockRemoveLiquidityCalldata
      ]);
      
      toast({
        title: "Remove Liquidity Submitted",
        description: `Removing ${removePercentage}% of ${selectedPosition.token0.symbol}/${selectedPosition.token1.symbol} liquidity`,
      });
    } catch (error) {
      console.error('Remove liquidity failed:', error);
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsLoading(false);
      setIsProcessing(false);
      toast({
        title: "Liquidity Removed Successfully",
        description: `Successfully removed ${removePercentage}% of your liquidity position`,
      });
      setRemovePercentage(25);
      setSelectedPosition(null);
      if (onSuccess && selectedGotchi) {
        onSuccess(selectedGotchi.id, "transaction_hash");
      }
    }
  }, [isConfirmed, onSuccess, selectedGotchi, removePercentage, toast]);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      setIsProcessing(false);
      toast({
        title: "Remove Liquidity Failed",
        description: "Remove liquidity transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);

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
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to remove liquidity.</p>
      </div>
    );
  }

  if (showLiquidityInterface && selectedGotchi && selectedPosition) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBackToPositions}
            className="px-4 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]"
          >
            ← Back
          </button>
          <h2 className="text-lg font-bold">Remove Liquidity</h2>
        </div>

        <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Remove Liquidity</h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] rounded-sm"
            >
              <Settings size={16} />
            </button>
          </div>

          {showSettings && (
            <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold">Slippage Tolerance</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-16 px-2 py-1 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-white text-sm"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Image src={selectedPosition.token0.icon} alt={selectedPosition.token0.symbol} width={24} height={24} />
                <Image src={selectedPosition.token1.icon} alt={selectedPosition.token1.symbol} width={24} height={24} />
                <span className="font-bold">{selectedPosition.token0.symbol}/{selectedPosition.token1.symbol}</span>
              </div>
              <span className="text-sm text-[#808080]">LP Balance: {selectedPosition.lpBalance}</span>
            </div>
            <div className="text-sm text-[#808080]">
              Pool Share: {selectedPosition.shareOfPool}%
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold">Amount to Remove</label>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Percentage</span>
                <span className="text-lg font-bold">{removePercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={removePercentage}
                onChange={(e) => setRemovePercentage(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="flex space-x-2">
              {[25, 50, 75, 100].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setRemovePercentage(percent)}
                  className={`flex-1 px-3 py-2 border-2 font-bold text-sm rounded-sm shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] transition-colors ${
                    removePercentage === percent
                      ? 'bg-[#000080] text-white border-[#000080]'
                      : 'bg-[#d4d0c8] border-[#808080] text-black hover:bg-[#c0c0c0]'
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-3 space-y-3">
            <div className="flex items-center space-x-2 mb-2">
              <Info size={16} />
              <span className="text-sm font-bold">You will receive</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Image src={selectedPosition.token0.icon} alt={selectedPosition.token0.symbol} width={20} height={20} />
                  <span className="font-bold">{selectedPosition.token0.symbol}</span>
                </div>
                <span className="font-bold">{removalAmounts.token0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Image src={selectedPosition.token1.icon} alt={selectedPosition.token1.symbol} width={20} height={20} />
                  <span className="font-bold">{selectedPosition.token1.symbol}</span>
                </div>
                <span className="font-bold">{removalAmounts.token1}</span>
              </div>
            </div>
            
            <div className="pt-2 border-t-2 border-[#808080]">
              <div className="flex justify-between text-sm">
                <span>LP Tokens to burn</span>
                <span>{removalAmounts.lpTokens}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining LP balance</span>
                <span>{(parseFloat(selectedPosition.lpBalance) - parseFloat(removalAmounts.lpTokens)).toFixed(6)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRemoveLiquidity}
            disabled={removePercentage === 0 || isLoading}
            className={`w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-4 font-bold text-lg transition-colors ${
              removePercentage === 0 || isLoading
                ? 'bg-[#a0a0a0] text-[#606060] cursor-not-allowed'
                : 'bg-[#dc2626] text-white hover:bg-[#b91c1c] border-[#dc2626]'
            }`}
          >
            {isLoading ? (
              'Removing Liquidity...'
            ) : removePercentage === 0 ? (
              'Select amount to remove'
            ) : (
              `Remove ${removePercentage}% Liquidity`
            )}
          </button>
        </div>
      </div>
    );
  }

  if (showLiquidityInterface && selectedGotchi) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]"
          >
            ← Back to List
          </button>
          <h2 className="text-lg font-bold">Your Liquidity Positions</h2>
        </div>

        <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-4 space-y-4">
          {liquidityPositions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💧</div>
              <p className="text-sm text-[#404040] font-bold">No liquidity positions</p>
              <p className="text-xs text-[#808080] mt-2">Add liquidity to pools to see your positions here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-bold mb-3">Select a position to remove liquidity</h3>
              {liquidityPositions.map((position, index) => (
                <button
                  key={index}
                  onClick={() => handlePositionSelect(position)}
                  className="w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-[#d4d0c8] hover:bg-[#c0c0c0] p-4 text-left transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Image src={position.token0.icon} alt={position.token0.symbol} width={24} height={24} />
                      <Image src={position.token1.icon} alt={position.token1.symbol} width={24} height={24} />
                      <span className="font-bold">{position.token0.symbol}/{position.token1.symbol}</span>
                    </div>
                    <span className="text-sm text-[#808080]">Pool Share: {position.shareOfPool}%</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#808080]">LP Balance:</span>
                      <div className="font-bold">{position.lpBalance}</div>
                    </div>
                    <div>
                      <span className="text-[#808080]">Underlying:</span>
                      <div className="font-bold">
                        {position.token0Amount} {position.token0.symbol}
                      </div>
                      <div className="font-bold">
                        {position.token1Amount} {position.token1.symbol}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <GotchiGrid
      gotchiList={gotchiList}
      onGotchiAction={handleGotchiSelect}
      onGotchiSelect={handleGotchiSelect}
      getButtonText={() => "Remove Liquidity"}
      isLoading={loadingGotchis}
      emptyMessage="No Gotchis available for liquidity removal"
      emptySubMessage="Mint some Gotchis first to remove liquidity from pools."
      headerComponent={
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Select a Gotchi to Remove Liquidity</h2>
          <p className="text-sm text-[#404040]">Choose one of your Gotchis to remove liquidity from pools.</p>
        </div>
      }
    />
  );
});

export default RemoveLiquidityComponent;