"use client"

import { useState, useEffect, useMemo } from 'react';
import GotchiGrid from "../game/GotchiGrid";
import Image from "next/image";
import { ethers } from "ethers";
import { useERC20Read, useContractWrite, useContractRead } from "@/hooks/useContract";
import { useToast } from '@/hooks/use-toast';
import { Token } from "@/lib/types";
import { ArrowUpDown, Settings, ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { GotchiItem } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import { getPharosNativeBalance } from "@/src/utils/contractHepler"
import { SelectToken } from "@/components/window-content/Dashboard/WalletTabContent/SelectToken"
import { Tokens } from "@/lib/constant"

interface SwapComponentProps {
  onSwapSuccess?: (tokenId: string, txHash: string) => void;
}


const SwapComponent = observer(({ onSwapSuccess }: SwapComponentProps) => {
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [selectedGotchi, setSelectedGotchi] = useState<GotchiItem | null>(null);
  const [showSwapInterface, setShowSwapInterface] = useState(false);
  
  const [fromToken, setFromToken] = useState<Token>(Tokens[0]);
  const [toToken, setToToken] = useState<Token>(Tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tbaAddress, setTbaAddress] = useState<`0x${string}`>("0x0000000000000000000000000000000000000000");
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [selectorType, setSelectorType] = useState<'from' | 'to'>('from');

  const { walletStore } = useStores();
  const { toast } = useToast();
  const { contractWrite, isConfirmed, error } = useContractWrite();
  
  const [nativeBalance, setNativeBalance] = useState("0");
  
  const { data: fromTokenBalance } = useERC20Read(
    fromToken.contract,
    "balanceOf",
    [tbaAddress],
    { enabled: !!fromToken.contract && fromToken.contract !== "0x0000000000000000000000000000000000000000" && !!tbaAddress }
  );

  const { data: toTokenBalance } = useERC20Read(
    toToken.contract,
    "balanceOf",
    [tbaAddress],
    { enabled: !!toToken.contract && toToken.contract !== "0x0000000000000000000000000000000000000000" && !!tbaAddress }
  );

  const { data: tbaAddressData } = useContractRead("account", [selectedGotchi?.id], { enabled: !!selectedGotchi?.id });

  useEffect(() => {
    const fetchPharosBalance = async () => {
      if (tbaAddressData) {
        const balance = await getPharosNativeBalance(tbaAddressData as `0x${string}`);
        const formattedBalance = ethers.formatEther(balance);
        setNativeBalance((Number(formattedBalance)).toFixed(4));
        setTbaAddress(tbaAddressData as `0x${string}`);
      }
    };
    fetchPharosBalance();
  }, [tbaAddressData]);

  const formattedFromBalance = useMemo(() => {
    if (fromToken.contract === "0x0000000000000000000000000000000000000000") {
      return nativeBalance || "0";
    }
    if (fromTokenBalance) {
      return ethers.formatUnits(fromTokenBalance as bigint, fromToken.decimals);
    }
    return "0";
  }, [fromToken, nativeBalance, fromTokenBalance]);

  const formattedToBalance = useMemo(() => {
    if (toToken.contract === "0x0000000000000000000000000000000000000000") {
      return nativeBalance || "0";
    }
    if (toTokenBalance) {
      return ethers.formatUnits(toTokenBalance as bigint, toToken.decimals);
    }
    return "0";
  }, [toToken, nativeBalance, toTokenBalance]);

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

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      const mockRates: { [key: string]: number } = {
        'PHRS': 1.5,
        'USDC': 1,
        'WETH': 2500,
        'USDT': 1,
        'WBTC': 45000,
        'WPHRS': 1.5
      };
      
      const fromRate = mockRates[fromToken.symbol] || 1;
      const toRate = mockRates[toToken.symbol] || 1;
      const calculatedAmount = (parseFloat(fromAmount) * fromRate / toRate).toFixed(6);
      setToAmount(calculatedAmount);
      
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken]);

  const handleGotchiSelect = (gotchi: GotchiItem) => {
    setSelectedGotchi(gotchi);
    setShowSwapInterface(true);
  };

  const handleBackToList = () => {
    setShowSwapInterface(false);
    setSelectedGotchi(null);
    setFromAmount("");
    setToAmount("");
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleTokenSelect = (token: Token | null) => {
    if (!token) {
      setShowTokenSelector(false);
      return;
    }

    if (selectorType === 'from') {
      if (token.symbol !== toToken.symbol) {
        setFromToken(token);
        setFromAmount("");
        setToAmount("");
      }
    } else {
      if (token.symbol !== fromToken.symbol) {
        setToToken(token);
        setFromAmount("");
        setToAmount("");
      }
    }
    setShowTokenSelector(false);
  };

  const handleSelectTokenModalClose = () => {
    setShowTokenSelector(false);
  };

    
  const handleSwap = async () => {
    if (!selectedGotchi || !fromAmount || !toAmount) return;
    
    setIsLoading(true);
    
    try {
      const mockSwapCalldata = "0x";
      
      contractWrite("executeAccount", [
        tbaAddress,
        selectedGotchi.id,
        "0x0000000000000000000000000000000000000000",
        ethers.parseEther(fromToken.contract === "0x0000000000000000000000000000000000000000" ? fromAmount : "0"),
        mockSwapCalldata
      ]);
      
      toast({
        title: "Swap Submitted",
        description: `Swapping ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
      });
    } catch (error) {
      console.error('Swap failed:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsLoading(false);
      toast({
        title: "Swap Successful",
        description: `Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
      });
      setFromAmount("");
      setToAmount("");
      if (onSwapSuccess && selectedGotchi) {
        onSwapSuccess(selectedGotchi.id, "transaction_hash");
      }
    }
  }, [isConfirmed, onSwapSuccess, selectedGotchi, fromAmount, fromToken.symbol, toAmount, toToken.symbol, toast]);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      toast({
        title: "Swap Failed",
        description: "Swap transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);


  if (loadingGotchis) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-win98-innerp-6 text-center">
        <p className="text-sm text-[#404040]">Loading your Gotchis...</p>
      </div>
    );
  }

  if (gotchiList.length === 0) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-win98-innerp-6 text-center">
        <p className="text-sm text-[#404040]">You don't have any Gotchis yet!</p>
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to start swapping.</p>
      </div>
    );
  }

  if (showSwapInterface && selectedGotchi) {
    return (
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-win98-outer hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff] flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to List
          </button>
          <div className="flex flex-col items-end">
            <div className="text-sm font-bold flex items-center gap-2">
              Call from
              <div className="text-base text-[#000080]">
                [{selectedGotchi.info?.name || `Gotchi #${selectedGotchi.id}`}]
              </div>
            </div>
            <div className="text-sm text-[#000080]">
              Balance: {nativeBalance} PHRS
            </div>
          </div>
        </div>

        <div className="bg-[#c0c0c0] border-2 shadow-win98-innerp-4">
          <div className="relative">
            {/* From Token Section */}
            <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-innerp-2 space-y-2 mb-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-lg font-bold focus:outline-none"
                />
                <button
                  onClick={() => {
                    setSelectorType('from');
                    setShowTokenSelector(true);
                  }}
                  className="flex items-center space-x-2 px-3 py-1 border-2 border-[#808080] bg-[#c0c0c0] hover:bg-[#b0b0b0] shadow-win98-innerrounded-sm"
                >
                  <Image src={fromToken.icon} alt={fromToken.symbol} width={20} height={20} />
                  <span className="font-bold">{fromToken.symbol}</span>
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#808080]">~$0.00</span>
                <button
                  onClick={() => setFromAmount(formattedFromBalance)}
                  className="text-xs font-bold text-[#000080] hover:underline"
                >
                  <span className="text-xs text-[#000080]">Balance: {formattedFromBalance}</span>
                </button>
              </div>
            </div>

            {/* To Token Section */}
            <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-innerp-2 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-lg font-bold focus:outline-none"
                />
                <button
                  onClick={() => {
                    setSelectorType('to');
                    setShowTokenSelector(true);
                  }}
                  className="flex items-center space-x-2 px-3 py-1 border-2 border-[#808080] bg-[#c0c0c0] hover:bg-[#b0b0b0] shadow-win98-innerrounded-sm"
                >
                  <Image src={toToken.icon} alt={toToken.symbol} width={20} height={20} />
                  <span className="font-bold">{toToken.symbol}</span>
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#808080]">~$0.00</span>
                <span className="text-xs text-[#000080]">Balance: {formattedToBalance}</span>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <button
                onClick={handleSwapTokens}
                className="p-3 border-4 border-[#c0c0c0] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-win98-outer rounded-full transition-colors"
              >
                <ArrowUpDown size={20} />
              </button>
            </div>
          </div>

          <button
            onClick={handleSwap}
            disabled={!fromAmount || !toAmount || isLoading || parseFloat(fromAmount) > parseFloat(formattedFromBalance)}
            className={`w-full border-2 border-[#808080] shadow-win98-innerp-2 mt-2 font-bold text-lg transition-colors ${
              !fromAmount || !toAmount || isLoading || parseFloat(fromAmount) > parseFloat(formattedFromBalance)
                ? 'bg-[#a0a0a0] text-[#606060] cursor-not-allowed'
                : 'bg-[#000080] text-white hover:bg-[#000060]'
            }`}
          >
            {isLoading ? (
              'Swapping...'
            ) : !fromAmount || !toAmount ? (
              'Enter an amount'
            ) : parseFloat(fromAmount) > parseFloat(formattedFromBalance) ? (
              `Insufficient ${fromToken.symbol} balance`
            ) : (
              `Swap ${fromToken.symbol} for ${toToken.symbol}`
            )}
          </button>
        </div>

        {showTokenSelector && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleSelectTokenModalClose}
          >
            <div 
              className="w-96 h-[600px] bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer"
              onClick={(e) => e.stopPropagation()}
            >
              <SelectToken 
                onAction={handleTokenSelect}
                tokens={Tokens}
                popularTokens={["PHRS", "USDC", "USDT"]}
                nativeBalance={nativeBalance}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <GotchiGrid
      gotchiList={gotchiList}
      onGotchiAction={handleGotchiSelect}
      getButtonText={() => "Swap"}
      isLoading={loadingGotchis}
      emptyMessage="No Gotchis available for swapping"
      emptySubMessage="Mint some Gotchis first to start swapping tokens."
      headerComponent={
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Select a Gotchi to Swap</h2>
          <p className="text-sm text-[#404040]">Choose one of your Gotchis to start swapping tokens.</p>
        </div>
      }
    />
  );
});

export default SwapComponent;