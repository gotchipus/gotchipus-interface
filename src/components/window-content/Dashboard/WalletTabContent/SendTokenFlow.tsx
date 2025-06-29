'use client'

import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import TransactionPreview from "./TransactionPreview"
import { SelectToken } from "./SelectToken"
import { Token } from "@/lib/types"
import { ethers } from "ethers"
import { useERC20Read, useContractWrite } from "@/src/hooks/useContract"
import { useToast } from '@/hooks/use-toast'
import { checkAndCompleteTask } from "@/src/utils/taskUtils"
import { useStores } from "@stores/context"

const Tokens: Token[] = [
  { name: "Pharos", symbol: "PHRS", icon: "/tokens/pharos.png", contract: "0x0000000000000000000000000000000000000000", balance: "0", decimals: 18, popular: false },
  { name: "USD Coin", symbol: "USDC", icon: "/tokens/usdc.png", contract: "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED", balance: "0", decimals: 6, popular: false },
  { name: "Wrapped Ether", symbol: "WETH", icon: "/tokens/eth.png", contract: "0x4E28826d32F1C398DED160DC16Ac6873357d048f", balance: "0", decimals: 18, popular: false },
  { name: "Tether USD", symbol: "USDT", icon: "/tokens/usdt.png", contract: "0xD4071393f8716661958F766DF660033b3d35fD29", balance: "0", decimals: 6, popular: false },
  { name: "Wrapped BTC", symbol: "WBTC", icon: "/tokens/wbtc.png", contract: "0x8275c526d1bCEc59a31d673929d3cE8d108fF5c7", balance: "0", decimals: 8, popular: false },
  { name: "Wrapped PHRS", symbol: "WPHRS", icon: "/tokens/pharos.png", contract: "0x3019B247381c850ab53Dc0EE53bCe7A07Ea9155f", balance: "0", decimals: 8, popular: false },
];

const popularTokens = ["PHRS", "USDC", "USDT"];

interface SendTokenFlowProps {
  onBack: () => void;
  onComplete: (result: string) => void;
  tbaAddress: string;
  nativeBalance: string;
  tokenId: string;
}

const SendTokenFlow = ({ onBack, onComplete, tbaAddress, nativeBalance, tokenId }: SendTokenFlowProps) => {
  const [step, setStep] = useState(1);
  const [selectedToken, setSelectedToken] = useState<Token>(Tokens[0]);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isRecipientValid, setIsRecipientValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);
  const { toast } = useToast()
  const { walletStore } = useStores()

  const { data: erc20Balance, isLoading: isBalanceLoading } = useERC20Read(
    selectedToken.contract, 
    "balanceOf", 
    [tbaAddress], 
    { enabled: !!selectedToken.contract && selectedToken.contract !== "0x0000000000000000000000000000000000000000" }
  );

  const formattedBalance = useMemo(() => {
    if (selectedToken.contract === "0x0000000000000000000000000000000000000000") {
      return nativeBalance || "0";
    }

    if (isBalanceLoading) {
      return "Loading...";
    }
    if (erc20Balance) {
      return ethers.formatUnits(erc20Balance as bigint, selectedToken.decimals);
    }
    
    return "0";
  }, [selectedToken, nativeBalance, erc20Balance, isBalanceLoading]);

  const { data: erc20Decimals } = useERC20Read(
    selectedToken.contract,
    "decimals",
    [],
    { enabled: !!selectedToken.contract && selectedToken.contract !== "0x0000000000000000000000000000000000000000" }
  );

  useEffect(() => {
    if (erc20Decimals) {
      setSelectedToken(prev => ({ ...prev, decimals: erc20Decimals as number }));
    }
  }, [erc20Decimals]);
  
  const handlePrev = () => setStep(s => s - 1);
  const handleNext = () => setStep(s => s + 1);

  const handleTokenSelect = (token: Token | null) => {
    if (token) {
      setSelectedToken(token);
      setAmount("");
    }
    setShowTokenSelector(false);
  };

  const handleModalClose = () => {
    setShowTokenSelector(false);
  };
  
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRecipient = e.target.value;
    setRecipient(newRecipient);
    setIsRecipientValid(newRecipient === "" || ethers.isAddress(newRecipient));
  };

  const {contractWrite, isConfirmed, error} = useContractWrite();

  const handleConfirm = async () => {
    setLoading(true);
    if (selectedToken.contract === "0x0000000000000000000000000000000000000000") {
      contractWrite("executeAccount", [tbaAddress, tokenId, recipient, ethers.parseUnits(amount, selectedToken.decimals), ""]);
    } else {
      const selector = new ethers.Interface(['function transfer(address,uint256)']);
      const calldata = selector.encodeFunctionData("transfer", [recipient, ethers.parseUnits(amount, selectedToken.decimals)]);
      contractWrite("executeAccount", [tbaAddress, tokenId, selectedToken.contract, 0, calldata]);
    }
    setIsTransfering(true);
    toast({
      title: "Transaction Submitted",
      description: "Transaction submitted successfully",
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      setLoading(false);
      setStep(1);

      if (isTransfering) {
        console.log("isTransfering", isTransfering);
        setIsTransfering(false);
        const updateTask = async () => {
          await checkAndCompleteTask(walletStore.address!, 7);
        }
        updateTask();
        walletStore.setIsTaskRefreshing(true);
      }

      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })
    }
  }, [isConfirmed])

  useEffect(() => {
    if (error) {
      setLoading(false);
      console.log("error", error);
      toast({
        title: "Transaction Cancelled",
        description: "Transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const previewSummary = {
    title: "Transaction Details: Send Token",
    details: {
      "Operation": "Send Token",
      "Token": `${selectedToken.name} (${selectedToken.symbol})`,
      "Amount": amount,
      "To": recipient,
    }
  };

  return (
    <div className="p-4 bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-inner h-full relative">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-2xl font-bold hover:text-blue-600 transition-colors">←</button>
        <div className="flex items-center">
          <Image src="/icons/transfer-token.png" alt="transfer-token" className="w-6 h-6 mr-2" width={24} height={24} />
          <h2 className="text-xl font-bold text-[#000080]">Send Token</h2>
        </div>
      </div>

      <div className="h-[calc(100%-60px)]">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#000080]">Token</label>
              <button
                onClick={() => setShowTokenSelector(true)}
                className="w-full px-2 py-1 border-2 border-[#808080] bg-white text-sm shadow-win98-inner focus:outline-none focus:border-[#000080] text-left flex items-center justify-between hover:bg-[#f0f0f0] transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 bg-white flex items-center justify-center">
                    {selectedToken.icon ? (
                      <Image src={selectedToken.icon} alt={selectedToken.symbol} className="w-4 h-4" width={16} height={16} />
                    ) : (
                      <div className="w-4 h-4 bg-[#000080] text-white text-xs flex items-center justify-center font-bold">
                        {selectedToken.symbol.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <span>{selectedToken.symbol}</span>
                </div>
                <span className="text-[#000080] font-bold text-xs">▼</span>
              </button>
              <div className="text-sm text-[#000080] mt-2 font-medium">Balance: {formattedBalance} {selectedToken.symbol}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#000080]">Amount</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-2 py-1 border-2 border-[#808080] bg-white text-sm shadow-win98-inner focus:outline-none focus:border-[#000080]"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.0"
                />
                <button 
                  onClick={() => setAmount(formattedBalance)}
                  className="px-4 py-1 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-win98-outer text-sm font-medium transition-colors"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#000080]">Recipient</label>
                <div className={`border-2 ${isRecipientValid ? 'border-[#808080]' : 'border-red-500'}`}>
                    <input
                      type="text"
                      className="w-full px-2 py-1 bg-white text-sm shadow-win98-inner focus:outline-none"
                      value={recipient}
                      onChange={handleRecipientChange}
                      placeholder="Enter recipient address"
                    />
                </div>
                {!isRecipientValid && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid Ethereum address.</p>
                )}
              </div>
              <div className="flex justify-between gap-3 pt-4">
                <button 
                  onClick={handleNext} 
                  disabled={!recipient || !isRecipientValid || !amount || parseFloat(amount) <= 0}
                  className="px-6 py-3 border-2 border-[#808080] shadow-win98-outer w-full bg-[#d4d0c8] hover:bg-[#c0c0c0] font-bold text-base disabled:opacity-50 transition-colors"
                >
                  Preview Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <TransactionPreview 
            summary={previewSummary}
            onConfirm={handleConfirm}
            onCancel={handlePrev}
            loading={loading}
          />
        )}
      </div>

      {showTokenSelector && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div 
            className="w-96 h-[600px] bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectToken 
              onAction={handleTokenSelect}
              tokens={Tokens} 
              popularTokens={popularTokens}
              nativeBalance={nativeBalance}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SendTokenFlow;