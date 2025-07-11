import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { GotchiCard } from "../game/GotchiCard";
import Image from "next/image";
import { ethers } from "ethers";
import { useERC20Read, useContractWrite } from "@/hooks/useContract";
import { useToast } from '@/hooks/use-toast';
import { Token } from "@/lib/types";
import { ArrowUpDown, Settings, ChevronDown } from "lucide-react";

interface GotchiItem {
  id: string;
  image?: string;
}

interface SwapComponentProps {
  onSwapSuccess?: (tokenId: string, txHash: string) => void;
}

const SWAP_TOKENS: Token[] = [
  { name: "Pharos", symbol: "PHRS", icon: "/tokens/pharos.png", contract: "0x0000000000000000000000000000000000000000", balance: "0", decimals: 18, popular: true },
  { name: "USD Coin", symbol: "USDC", icon: "/tokens/usdc.png", contract: "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED", balance: "0", decimals: 6, popular: true },
  { name: "Wrapped Ether", symbol: "WETH", icon: "/tokens/eth.png", contract: "0x4E28826d32F1C398DED160DC16Ac6873357d048f", balance: "0", decimals: 18, popular: true },
  { name: "Tether USD", symbol: "USDT", icon: "/tokens/usdt.png", contract: "0xD4071393f8716661958F766DF660033b3d35fD29", balance: "0", decimals: 6, popular: true },
  { name: "Wrapped BTC", symbol: "WBTC", icon: "/tokens/wbtc.png", contract: "0x8275c526d1bCEc59a31d673929d3cE8d108fF5c7", balance: "0", decimals: 8, popular: false },
  { name: "Wrapped PHRS", symbol: "WPHRS", icon: "/tokens/pharos.png", contract: "0x3019B247381c850ab53Dc0EE53bCe7A07Ea9155f", balance: "0", decimals: 8, popular: false },
];

export const SwapComponent = ({ onSwapSuccess }: SwapComponentProps) => {
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [selectedGotchi, setSelectedGotchi] = useState<GotchiItem | null>(null);
  const [showSwapInterface, setShowSwapInterface] = useState(false);
  
  const [fromToken, setFromToken] = useState<Token>(SWAP_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(SWAP_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false);
  const [showToTokenSelector, setShowToTokenSelector] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [priceImpact, setPriceImpact] = useState("0.01");
  
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { toast } = useToast();
  const { contractWrite, isConfirmed, error } = useContractWrite();

  const tbaAddress = selectedGotchi ? `0x${selectedGotchi.id.padStart(40, '0')}` : "";
  
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
      
      const impact = Math.min(parseFloat(fromAmount) * 0.001, 3);
      setPriceImpact(impact.toFixed(2));
    } else {
      setToAmount("");
      setPriceImpact("0.01");
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

  const handleFromTokenSelect = (token: Token) => {
    if (token.symbol !== toToken.symbol) {
      setFromToken(token);
      setFromAmount("");
      setToAmount("");
    }
    setShowFromTokenSelector(false);
  };

  const handleToTokenSelect = (token: Token) => {
    if (token.symbol !== fromToken.symbol) {
      setToToken(token);
      setFromAmount("");
      setToAmount("");
    }
    setShowToTokenSelector(false);
  };

  const handleSwap = async () => {
    if (!selectedGotchi || !fromAmount || !toAmount) return;
    
    setIsLoading(true);
    setIsSwapping(true);
    
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
      setIsSwapping(false);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsLoading(false);
      setIsSwapping(false);
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
      setIsSwapping(false);
      toast({
        title: "Swap Failed",
        description: "Swap transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (!isConnected) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-6 text-center">
        <div className="bg-[#0078d4] text-white px-3 py-1 mb-4 flex items-center">
          <div className="mr-2 font-bold">⚠️</div>
          <div className="text-sm font-bold">Connect Required</div>
        </div>
        <p className="text-sm text-[#404040] mb-4">Please connect your wallet to swap tokens</p>
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
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to start swapping.</p>
      </div>
    );
  }

  if (showSwapInterface && selectedGotchi) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]"
          >
            ← Back to List
          </button>
          <h2 className="text-lg font-bold">Swap with Gotchi #{selectedGotchi.id}</h2>
        </div>

        <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Swap</h3>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">From</label>
              <span className="text-xs text-[#808080]">Balance: {formattedFromBalance}</span>
            </div>
            <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-lg font-bold focus:outline-none"
                />
                <button
                  onClick={() => setShowFromTokenSelector(true)}
                  className="flex items-center space-x-2 px-3 py-2 border-2 border-[#808080] bg-[#c0c0c0] hover:bg-[#b0b0b0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] rounded-sm"
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
                  Max
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSwapTokens}
              className="p-2 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] rounded-full"
            >
              <ArrowUpDown size={20} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">To</label>
              <span className="text-xs text-[#808080]">Balance: {formattedToBalance}</span>
            </div>
            <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-lg font-bold focus:outline-none"
                />
                <button
                  onClick={() => setShowToTokenSelector(true)}
                  className="flex items-center space-x-2 px-3 py-2 border-2 border-[#808080] bg-[#c0c0c0] hover:bg-[#b0b0b0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] rounded-sm"
                >
                  <Image src={toToken.icon} alt={toToken.symbol} width={20} height={20} />
                  <span className="font-bold">{toToken.symbol}</span>
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="text-xs text-[#808080]">~$0.00</div>
            </div>
          </div>

          {fromAmount && toAmount && (
            <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rate</span>
                <span>1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)} {toToken.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Price Impact</span>
                <span className={parseFloat(priceImpact) > 1 ? "text-red-600" : "text-green-600"}>
                  {priceImpact}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Minimum received</span>
                <span>{(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toToken.symbol}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleSwap}
            disabled={!fromAmount || !toAmount || isLoading || parseFloat(fromAmount) > parseFloat(formattedFromBalance)}
            className={`w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-4 font-bold text-lg transition-colors ${
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

        {showFromTokenSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-4 w-80 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Select Token</h3>
                <button
                  onClick={() => setShowFromTokenSelector(false)}
                  className="text-lg font-bold hover:text-red-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {SWAP_TOKENS.filter(token => token.symbol !== toToken.symbol).map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => handleFromTokenSelect(token)}
                    className="w-full flex items-center space-x-3 p-3 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] text-left"
                  >
                    <Image src={token.icon} alt={token.symbol} width={24} height={24} />
                    <div>
                      <div className="font-bold">{token.symbol}</div>
                      <div className="text-xs text-[#808080]">{token.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showToTokenSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-4 w-80 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Select Token</h3>
                <button
                  onClick={() => setShowToTokenSelector(false)}
                  className="text-lg font-bold hover:text-red-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {SWAP_TOKENS.filter(token => token.symbol !== fromToken.symbol).map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => handleToTokenSelect(token)}
                    className="w-full flex items-center space-x-3 p-3 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] text-left"
                  >
                    <Image src={token.icon} alt={token.symbol} width={24} height={24} />
                    <div>
                      <div className="font-bold">{token.symbol}</div>
                      <div className="text-xs text-[#808080]">{token.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Select a Gotchi to Swap</h2>
        <p className="text-sm text-[#404040]">Choose one of your Gotchis to start swapping tokens.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
        {gotchiList.map((gotchi) => (
          <div
            key={gotchi.id}
            onClick={() => handleGotchiSelect(gotchi)}
            className="cursor-pointer"
          >
            <GotchiCard
              name={`Gotchi #${gotchi.id}`}
              image={gotchi.image || ''}
              className="hover:shadow-lg transition-shadow"
            />
          </div>
        ))}
      </div>
    </div>
  );
};