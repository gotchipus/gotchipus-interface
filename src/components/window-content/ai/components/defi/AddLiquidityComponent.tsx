import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import GotchiGrid from "../game/GotchiGrid";
import Image from "next/image";
import { ethers } from "ethers";
import { useERC20Read, useContractWrite } from "@/hooks/useContract";
import { useToast } from '@/hooks/use-toast';
import { Token } from "@/lib/types";
import { Plus, Settings, ChevronDown, Info } from "lucide-react";

interface GotchiItem {
  id: string;
  image?: string;
}

interface AddLiquidityComponentProps {
  onSuccess?: (tokenId: string, txHash: string) => void;
}

const LIQUIDITY_TOKENS: Token[] = [
  { name: "Pharos", symbol: "PHRS", icon: "/tokens/pharos.png", contract: "0x0000000000000000000000000000000000000000", balance: "0", decimals: 18, popular: true },
  { name: "USD Coin", symbol: "USDC", icon: "/tokens/usdc.png", contract: "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED", balance: "0", decimals: 6, popular: true },
  { name: "Wrapped Ether", symbol: "WETH", icon: "/tokens/eth.png", contract: "0x4E28826d32F1C398DED160DC16Ac6873357d048f", balance: "0", decimals: 18, popular: true },
  { name: "Tether USD", symbol: "USDT", icon: "/tokens/usdt.png", contract: "0xD4071393f8716661958F766DF660033b3d35fD29", balance: "0", decimals: 6, popular: true },
  { name: "Wrapped BTC", symbol: "WBTC", icon: "/tokens/wbtc.png", contract: "0x8275c526d1bCEc59a31d673929d3cE8d108fF5c7", balance: "0", decimals: 8, popular: false },
];

const POPULAR_PAIRS = [
  { token0: "PHRS", token1: "USDC" },
  { token0: "PHRS", token1: "WETH" },
  { token0: "USDC", token1: "WETH" },
  { token0: "WETH", token1: "WBTC" },
];

const AddLiquidityComponent = ({ onSuccess }: AddLiquidityComponentProps) => {
  console.log('AddLiquidityComponent rendered!');
  
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [selectedGotchi, setSelectedGotchi] = useState<GotchiItem | null>(null);
  const [showLiquidityInterface, setShowLiquidityInterface] = useState(false);
  
  const [tokenA, setTokenA] = useState<Token>(LIQUIDITY_TOKENS[0]);
  const [tokenB, setTokenB] = useState<Token>(LIQUIDITY_TOKENS[1]);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [showTokenASelector, setShowTokenASelector] = useState(false);
  const [showTokenBSelector, setShowTokenBSelector] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [poolExists, setPoolExists] = useState(true);
  const [shareOfPool, setShareOfPool] = useState("0.001");
  
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { toast } = useToast();
  const { contractWrite, isConfirmed, error } = useContractWrite();

  const tbaAddress = selectedGotchi ? `0x${selectedGotchi.id.padStart(40, '0')}` : "";
  
  const [nativeBalance, setNativeBalance] = useState("0");
  
  const { data: tokenABalance } = useERC20Read(
    tokenA.contract,
    "balanceOf",
    [tbaAddress],
    { enabled: !!tokenA.contract && tokenA.contract !== "0x0000000000000000000000000000000000000000" && !!tbaAddress }
  );

  const { data: tokenBBalance } = useERC20Read(
    tokenB.contract,
    "balanceOf",
    [tbaAddress],
    { enabled: !!tokenB.contract && tokenB.contract !== "0x0000000000000000000000000000000000000000" && !!tbaAddress }
  );

  const formattedTokenABalance = useMemo(() => {
    if (tokenA.contract === "0x0000000000000000000000000000000000000000") {
      return nativeBalance || "0";
    }
    if (tokenABalance) {
      return ethers.formatUnits(tokenABalance as bigint, tokenA.decimals);
    }
    return "0";
  }, [tokenA, nativeBalance, tokenABalance]);

  const formattedTokenBBalance = useMemo(() => {
    if (tokenB.contract === "0x0000000000000000000000000000000000000000") {
      return nativeBalance || "0";
    }
    if (tokenBBalance) {
      return ethers.formatUnits(tokenBBalance as bigint, tokenB.decimals);
    }
    return "0";
  }, [tokenB, nativeBalance, tokenBBalance]);

  useEffect(() => {
    if (!isConnected || !address) {
      setGotchiList([]);
      setLoadingGotchis(false);
      return;
    }

    const fetchGotchis = async () => {
      try {
        setLoadingGotchis(true);
        const response = await fetch(`/api/tokens/gotchipus?owner=${address}&includeGotchipusInfo=false`);
        if (response.ok) {
          const data = await response.json();
          const gotchis = data.ids.map((id: string) => ({
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
    if (amountA && parseFloat(amountA) > 0 && poolExists) {
      const mockRatio = 1.5;
      let calculatedAmountB;
      
      if (tokenA.symbol === 'PHRS' && tokenB.symbol === 'USDC') {
        calculatedAmountB = (parseFloat(amountA) * mockRatio).toFixed(6);
      } else if (tokenA.symbol === 'USDC' && tokenB.symbol === 'PHRS') {
        calculatedAmountB = (parseFloat(amountA) / mockRatio).toFixed(6);
      } else {
        calculatedAmountB = parseFloat(amountA).toFixed(6);
      }
      
      setAmountB(calculatedAmountB);
      
      const mockTotalLiquidity = 1000000;
      const userLiquidity = parseFloat(amountA) * 2;
      const share = (userLiquidity / mockTotalLiquidity * 100).toFixed(3);
      setShareOfPool(share);
    } else if (amountA && parseFloat(amountA) > 0 && !poolExists) {
      setShareOfPool("100");
    } else {
      setAmountB("");
      setShareOfPool("0");
    }
  }, [amountA, tokenA, tokenB, poolExists]);

  const handleGotchiSelect = (gotchi: GotchiItem) => {
    setSelectedGotchi(gotchi);
    setShowLiquidityInterface(true);
  };

  const handleBackToList = () => {
    setShowLiquidityInterface(false);
    setSelectedGotchi(null);
    setAmountA("");
    setAmountB("");
  };

  const handleTokenASelect = (token: Token) => {
    if (token.symbol !== tokenB.symbol) {
      setTokenA(token);
      setAmountA("");
      setAmountB("");
    }
    setShowTokenASelector(false);
  };

  const handleTokenBSelect = (token: Token) => {
    if (token.symbol !== tokenA.symbol) {
      setTokenB(token);
      setAmountA("");
      setAmountB("");
    }
    setShowTokenBSelector(false);
  };

  const handleSelectPair = (pair: { token0: string; token1: string }) => {
    const token0 = LIQUIDITY_TOKENS.find(t => t.symbol === pair.token0);
    const token1 = LIQUIDITY_TOKENS.find(t => t.symbol === pair.token1);
    if (token0 && token1) {
      setTokenA(token0);
      setTokenB(token1);
      setAmountA("");
      setAmountB("");
    }
  };

  const handleAddLiquidity = async () => {
    if (!selectedGotchi || !amountA || !amountB) return;
    
    setIsLoading(true);
    setIsProcessing(true);
    
    try {
      const mockAddLiquidityCalldata = "0x";
      
      const ethValue = tokenA.contract === "0x0000000000000000000000000000000000000000" 
        ? ethers.parseEther(amountA)
        : tokenB.contract === "0x0000000000000000000000000000000000000000" 
          ? ethers.parseEther(amountB)
          : 0;
      
      contractWrite("executeAccount", [
        tbaAddress,
        selectedGotchi.id,
        "0x0000000000000000000000000000000000000000",
        ethValue,
        mockAddLiquidityCalldata
      ]);
      
      toast({
        title: "Add Liquidity Submitted",
        description: `Adding ${amountA} ${tokenA.symbol} + ${amountB} ${tokenB.symbol} to liquidity pool`,
      });
    } catch (error) {
      console.error('Add liquidity failed:', error);
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsLoading(false);
      setIsProcessing(false);
      toast({
        title: "Liquidity Added Successfully",
        description: `Successfully added ${amountA} ${tokenA.symbol} + ${amountB} ${tokenB.symbol} to the pool`,
      });
      setAmountA("");
      setAmountB("");
      if (onSuccess && selectedGotchi) {
        onSuccess(selectedGotchi.id, "transaction_hash");
      }
    }
  }, [isConfirmed, onSuccess, selectedGotchi, amountA, tokenA.symbol, amountB, tokenB.symbol, toast]);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      setIsProcessing(false);
      toast({
        title: "Add Liquidity Failed",
        description: "Add liquidity transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (!isConnected) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-win98-innerp-6 text-center">
        <div className="bg-[#0078d4] text-white px-3 py-1 mb-4 flex items-center">
          <div className="mr-2 font-bold">⚠️</div>
          <div className="text-sm font-bold">Connect Required</div>
        </div>
        <p className="text-sm text-[#404040] mb-4">Please connect your wallet to add liquidity</p>
        <button
          className="px-6 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-win98-innerhover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]"
          onClick={() => openConnectModal?.()}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

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
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to add liquidity.</p>
      </div>
    );
  }

  if (showLiquidityInterface && selectedGotchi) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-win98-innerhover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]"
          >
            ← Back to List
          </button>
          <h2 className="text-lg font-bold">Add Liquidity</h2>
        </div>

        <div className="bg-[#c0c0c0] border-2 shadow-win98-innerp-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Add Liquidity</h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-win98-innerrounded-sm"
            >
              <Settings size={16} />
            </button>
          </div>

          {showSettings && (
            <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-innerp-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold">Slippage Tolerance</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-16 px-2 py-1 border-2 border-[#808080] shadow-win98-innerbg-white text-sm"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold">Popular Pairs</label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_PAIRS.map((pair, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectPair(pair)}
                  className="px-3 py-1 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-win98-innertext-sm rounded-sm"
                >
                  {pair.token0}/{pair.token1}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">Token A</label>
              <span className="text-xs text-[#808080]">Balance: {formattedTokenABalance}</span>
            </div>
            <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-innerp-3 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={amountA}
                  onChange={(e) => setAmountA(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-lg font-bold focus:outline-none"
                />
                <button
                  onClick={() => setShowTokenASelector(true)}
                  className="flex items-center space-x-2 px-3 py-2 border-2 border-[#808080] bg-[#c0c0c0] hover:bg-[#b0b0b0] shadow-win98-innerrounded-sm"
                >
                  <Image src={tokenA.icon} alt={tokenA.symbol} width={20} height={20} />
                  <span className="font-bold">{tokenA.symbol}</span>
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#808080]">~$0.00</span>
                <button
                  onClick={() => setAmountA(formattedTokenABalance)}
                  className="text-xs font-bold text-[#000080] hover:underline"
                >
                  Max
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="p-2 border-2 border-[#808080] bg-[#d4d0c8] shadow-win98-innerrounded-full">
              <Plus size={20} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">Token B</label>
              <span className="text-xs text-[#808080]">Balance: {formattedTokenBBalance}</span>
            </div>
            <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-innerp-3 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={amountB}
                  onChange={(e) => !poolExists && setAmountB(e.target.value)}
                  placeholder="0.0"
                  readOnly={poolExists}
                  className="flex-1 bg-transparent text-lg font-bold focus:outline-none"
                />
                <button
                  onClick={() => setShowTokenBSelector(true)}
                  className="flex items-center space-x-2 px-3 py-2 border-2 border-[#808080] bg-[#c0c0c0] hover:bg-[#b0b0b0] shadow-win98-innerrounded-sm"
                >
                  <Image src={tokenB.icon} alt={tokenB.symbol} width={20} height={20} />
                  <span className="font-bold">{tokenB.symbol}</span>
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#808080]">~$0.00</span>
                {!poolExists && (
                  <button
                    onClick={() => setAmountB(formattedTokenBBalance)}
                    className="text-xs font-bold text-[#000080] hover:underline"
                  >
                    Max
                  </button>
                )}
              </div>
            </div>
          </div>

          {amountA && amountB && (
            <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-innerp-3 space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <Info size={16} />
                <span className="text-sm font-bold">Pool Information</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Share of Pool</span>
                <span>{shareOfPool}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pool Rate</span>
                <span>1 {tokenA.symbol} = {(parseFloat(amountB) / parseFloat(amountA)).toFixed(4)} {tokenB.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pool Status</span>
                <span className={poolExists ? "text-green-600" : "text-blue-600"}>
                  {poolExists ? "Existing Pool" : "New Pool"}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleAddLiquidity}
            disabled={!amountA || !amountB || isLoading || 
              parseFloat(amountA) > parseFloat(formattedTokenABalance) || 
              parseFloat(amountB) > parseFloat(formattedTokenBBalance)}
            className={`w-full border-2 border-[#808080] shadow-win98-innerp-4 font-bold text-lg transition-colors ${
              !amountA || !amountB || isLoading || 
              parseFloat(amountA) > parseFloat(formattedTokenABalance) || 
              parseFloat(amountB) > parseFloat(formattedTokenBBalance)
                ? 'bg-[#a0a0a0] text-[#606060] cursor-not-allowed'
                : 'bg-[#000080] text-white hover:bg-[#000060]'
            }`}
          >
            {isLoading ? (
              'Adding Liquidity...'
            ) : !amountA || !amountB ? (
              'Enter amounts'
            ) : parseFloat(amountA) > parseFloat(formattedTokenABalance) ? (
              `Insufficient ${tokenA.symbol} balance`
            ) : parseFloat(amountB) > parseFloat(formattedTokenBBalance) ? (
              `Insufficient ${tokenB.symbol} balance`
            ) : (
              'Add Liquidity'
            )}
          </button>
        </div>

        {showTokenASelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-innerp-4 w-80 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Select Token A</h3>
                <button
                  onClick={() => setShowTokenASelector(false)}
                  className="text-lg font-bold hover:text-red-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {LIQUIDITY_TOKENS.filter(token => token.symbol !== tokenB.symbol).map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => handleTokenASelect(token)}
                    className="w-full flex items-center space-x-3 p-3 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-win98-innertext-left"
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

        {showTokenBSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-innerp-4 w-80 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Select Token B</h3>
                <button
                  onClick={() => setShowTokenBSelector(false)}
                  className="text-lg font-bold hover:text-red-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {LIQUIDITY_TOKENS.filter(token => token.symbol !== tokenA.symbol).map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => handleTokenBSelect(token)}
                    className="w-full flex items-center space-x-3 p-3 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-win98-innertext-left"
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
    <GotchiGrid
      gotchiList={gotchiList}
      onGotchiAction={handleGotchiSelect}
      onGotchiSelect={handleGotchiSelect}
      getButtonText={() => "Add Liquidity"}
      isLoading={loadingGotchis}
      emptyMessage="No Gotchis available for liquidity"
      emptySubMessage="Mint some Gotchis first to add liquidity to pools."
      headerComponent={
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Select a Gotchi to Add Liquidity</h2>
          <p className="text-sm text-[#404040]">Choose one of your Gotchis to add liquidity to pools.</p>
        </div>
      }
    />
  );
};

export default AddLiquidityComponent;