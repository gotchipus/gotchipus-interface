'use client'

import { useState, useEffect, useMemo } from 'react';
import Image from "next/image";
import { ethers } from "ethers";
import { useERC20Read, useContractWrite, useContractRead } from "@/hooks/useContract";
import { useToast } from '@/hooks/use-toast';
import { Token } from "@/lib/types";
import { GotchiItem } from '@/lib/types';
import GotchiGrid from './GotchiGrid';
import { getPharosNativeBalance } from "@/src/utils/contractHepler"
import { SelectToken } from "@/components/window-content/Dashboard/WalletTabContent/SelectToken"
import { Tokens } from "@/lib/constant"
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { ChevronDown } from 'lucide-react';


interface CallComponentProps {
  onCallSuccess?: (tokenId: string, txHash: string) => void;
}


type CallType = 'transfer' | 'erc721' | 'contract';

const CallComponent = observer(({ onCallSuccess }: CallComponentProps) => {
  const { walletStore } = useStores();
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [selectedGotchi, setSelectedGotchi] = useState<GotchiItem | null>(null);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [callType, setCallType] = useState<CallType>('transfer');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const [selectedToken, setSelectedToken] = useState<Token>(Tokens[0]);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isRecipientValid, setIsRecipientValid] = useState(true);
  
  const [contractAddress, setContractAddress] = useState("");
  const [payableValue, setPayableValue] = useState("0");
  const [functionSignature, setFunctionSignature] = useState("");
  const [functionArgs, setFunctionArgs] = useState<string[]>([]);
  const [parsedFunction, setParsedFunction] = useState<{ name: string; inputs: { type: string }[] } | null>(null);
  
  const [tokenId, setTokenId] = useState("");
  const [erc721Contract, setErc721Contract] = useState("");
  const [tbaAddress, setTbaAddress] = useState<`0x${string}`>("0x0000000000000000000000000000000000000000");

  const { toast } = useToast();
  const { contractWrite, hash, isConfirmed, error } = useContractWrite();

  
  const [nativeBalance, setNativeBalance] = useState("0");
  const [showTokenSelector, setShowTokenSelector] = useState(false);

  const { data: erc20Balance } = useERC20Read(
    selectedToken.contract,
    "balanceOf",
    [tbaAddress],
    { enabled: !!selectedToken.contract && selectedToken.contract !== "0x0000000000000000000000000000000000000000" && !!tbaAddress }
  );

  const { data: tbaAddressData } = useContractRead("account", [selectedGotchi?.id], { enabled: !!selectedGotchi?.id });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const formattedBalance = useMemo(() => {
    if (selectedToken.contract === "0x0000000000000000000000000000000000000000") {
      return nativeBalance || "0";
    }
    if (erc20Balance) {
      return ethers.formatUnits(erc20Balance as bigint, selectedToken.decimals);
    }
    return "0";
  }, [selectedToken, nativeBalance, erc20Balance]);

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
    if (!functionSignature) {
      setParsedFunction(null);
      return;
    }

    const match = functionSignature.match(/^\s*(\w+)\s*\((.*)\)\s*$/);
    if (match) {
      const name = match[1];
      const params = match[2].trim();
      const inputs = params ? params.split(',').map(p => ({ type: p.trim() })) : [];
      setParsedFunction({ name, inputs });
      setFunctionArgs(new Array(inputs.length).fill(""));
    } else {
      setParsedFunction(null);
    }
  }, [functionSignature]);


  const handleGotchiSelect = (gotchi: GotchiItem) => {
    setSelectedGotchi(gotchi);
    setShowCallInterface(true);
  };

  const handleBackToList = () => {
    setShowCallInterface(false);
    setSelectedGotchi(null);
    resetForm();
  };

  const resetForm = () => {
    setAmount("");
    setRecipient("");
    setContractAddress("");
    setPayableValue("0");
    setFunctionSignature("");
    setFunctionArgs([]);
    setTokenId("");
    setErc721Contract("");
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRecipient = e.target.value;
    setRecipient(newRecipient);
    setIsRecipientValid(newRecipient === "" || ethers.isAddress(newRecipient));
  };

  const handleTransfer = async () => {
    if (!selectedGotchi || !recipient || !amount) return;
    
    setIsLoading(true);
    try {
      if (selectedToken.contract === "0x0000000000000000000000000000000000000000") {
        contractWrite("executeAccount", [
          tbaAddress,
          selectedGotchi.id,
          recipient,
          ethers.parseUnits(amount, selectedToken.decimals),
          ""
        ]);
      } else {
        const selector = new ethers.Interface(['function transfer(address,uint256)']);
        const calldata = selector.encodeFunctionData("transfer", [
          recipient,
          ethers.parseUnits(amount, selectedToken.decimals)
        ]);
        contractWrite("executeAccount", [
          tbaAddress,
          selectedGotchi.id,
          selectedToken.contract,
          0,
          calldata
        ]);
      }
      
      toast({
        title: "Transaction Submitted",
        description: `${callType === 'transfer' ? 'Transfer' : 'Transaction'} submitted successfully`,
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      setIsLoading(false);
    }
  };

  const handleErc721Transfer = async () => {
    if (!selectedGotchi || !recipient || !tokenId || !erc721Contract) return;
    
    setIsLoading(true);
    try {
      const selector = new ethers.Interface(['function transferFrom(address,address,uint256)']);
      const calldata = selector.encodeFunctionData("transferFrom", [
        tbaAddress,
        recipient,
        tokenId
      ]);
      
      contractWrite("executeAccount", [
        tbaAddress,
        selectedGotchi.id,
        erc721Contract,
        0,
        calldata
      ]);
      
      toast({
        title: "Transaction Submitted",
        description: "ERC721 transfer submitted successfully",
      });
    } catch (error) {
      console.error('ERC721 transfer failed:', error);
      setIsLoading(false);
    }
  };

  const handleContractCall = async () => {
    if (!selectedGotchi || !contractAddress || !parsedFunction) return;
    
    setIsLoading(true);
    try {
      const iface = new ethers.Interface([
        `function ${parsedFunction.name}(${parsedFunction.inputs.map(i => i.type).join(',')})`
      ]);
      const calldata = iface.encodeFunctionData(parsedFunction.name, functionArgs);
      
      contractWrite("executeAccount", [
        tbaAddress,
        selectedGotchi.id,
        contractAddress,
        ethers.parseEther(payableValue || "0"),
        calldata
      ]);
      
      toast({
        title: "Transaction Submitted",
        description: "Contract call submitted successfully",
      });
    } catch (error) {
      console.error('Contract call failed:', error);
      setIsLoading(false);
    }
  };

  const handleExecute = () => {
    switch (callType) {
      case 'transfer':
        handleTransfer();
        break;
      case 'erc721':
        handleErc721Transfer();
        break;
      case 'contract':
        handleContractCall();
        break;
    }
  };

  const handleTokenSelect = (token: Token | null) => {
    if (token) {
      setSelectedToken(token);
    }
    setShowTokenSelector(false);
  };
  
  const handleSelectTokenModalClose = () => {
    setShowTokenSelector(false);
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsLoading(false);
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      });
      resetForm();
      if (onCallSuccess && selectedGotchi) {
        onCallSuccess(selectedGotchi.id, hash as `0x${string}`);
      }
    }
  }, [isConfirmed, onCallSuccess, selectedGotchi, toast]);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      toast({
        title: "Transaction Failed",
        description: "Transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (loadingGotchis) {
    return (
      <div 
        className={`bg-[#c0c0c0] border-2 shadow-win98-outer p-6 text-center transition-all duration-800 ease-out origin-top-left ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0'
        }`}
        style={{
          clipPath: isVisible 
            ? 'circle(150% at 0% 0%)' 
            : 'circle(0% at 0% 0%)',
          transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
        }}
      >
        <p className="text-sm text-[#404040]">Loading your Gotchis...</p>
      </div>
    );
  }

  if (gotchiList.length === 0) {
    return (
      <div 
        className={`bg-[#c0c0c0] border-2 shadow-win98-outer p-6 text-center transition-all duration-800 ease-out origin-top-left ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0'
        }`}
        style={{
          clipPath: isVisible 
            ? 'circle(150% at 0% 0%)' 
            : 'circle(0% at 0% 0%)',
          transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
        }}
      >
        <p className="text-sm text-[#404040]">You don't have any Gotchis yet!</p>
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to make calls.</p>
      </div>
    );
  }

  if (showCallInterface && selectedGotchi) {
    return (
      <div 
        className={`w-full transition-all duration-800 ease-out origin-top-left ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0'
        }`}
        style={{
          clipPath: isVisible 
            ? 'circle(150% at 0% 0%)' 
            : 'circle(0% at 0% 0%)',
          transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-win98-outer hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]"
          >
            ← Back to List
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

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'transfer', label: 'Transfer Token', icon: '💰' },
              { type: 'erc721', label: 'Transfer NFT', icon: '🖼️' },
              { type: 'contract', label: 'Contract Call', icon: '⚙️' }
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => setCallType(type as CallType)}
                className={`px-3 py-2 border-2 font-bold text-sm ${
                  callType === type 
                    ? 'bg-[#000080] text-white border-[#000080]' 
                    : 'bg-[#c0c0c0] border-[#dfdfdf] text-black hover:bg-[#d0d0d0]'
                } shadow-win98-outer transition-colors`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#c0c0c0] border-2 shadow-win98-outer p-4 space-y-2 w-1/2">
          {callType === 'transfer' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">Token</label>
                <button
                  onClick={() => setShowTokenSelector(true)}
                  className="w-1/2 px-2 py-1 border-2 border-[#808080] bg-white text-sm shadow-win98-inner focus:outline-none focus:border-[#000080] text-left flex items-center justify-between hover:bg-[#f0f0f0] transition-colors"
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
                  <ChevronDown className="text-[#000080] font-bold text-xs w-4 h-4" />
                </button>
                <p className="text-xs text-[#000080] mt-1">Balance: {formattedBalance} {selectedToken.symbol}</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Amount</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 border-2 border-[#808080] shadow-win98-outer bg-white px-2 py-1"
                  />
                  <button
                    onClick={() => setAmount(formattedBalance)}
                    className="px-3 py-2 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-win98-outer text-sm font-bold"
                  >
                    Max
                  </button>
                </div>
              </div>
            </>
          )}

          {callType === 'erc721' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">NFT Contract Address</label>
                <input
                  type="text"
                  value={erc721Contract}
                  onChange={(e) => setErc721Contract(e.target.value)}
                  placeholder="0x..."
                  className="w-full border-2 border-[#808080] shadow-win98-outer bg-white px-2 py-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Token ID</label>
                <input
                  type="text"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="Token ID"
                  className="w-full border-2 border-[#808080] shadow-win98-outer bg-white px-2 py-1"
                />
              </div>
            </>
          )}

          {callType === 'contract' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">Contract Address</label>
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full border-2 border-[#808080] shadow-win98-outer bg-white px-2 py-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Value (PHRS)</label>
                <input
                  type="text"
                  value={payableValue}
                  onChange={(e) => setPayableValue(e.target.value)}
                  placeholder="0.0"
                  className="w-full border-2 border-[#808080] shadow-win98-outer bg-white px-2 py-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Function Signature</label>
                <input
                  type="text"
                  value={functionSignature}
                  onChange={(e) => setFunctionSignature(e.target.value)}
                  placeholder="e.g. transfer(address,uint256)"
                  className="w-full border-2 border-[#808080] shadow-win98-outer bg-white p-2 font-mono text-xs"
                />
              </div>
              
              {parsedFunction && parsedFunction.inputs.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold mb-1">Parameters</label>
                  {parsedFunction.inputs.map((input, index) => (
                    <div key={index}>
                      <label className="block text-xs text-[#808080] mb-1">
                        Parameter {index + 1} ({input.type})
                      </label>
                      <input
                        type="text"
                        value={functionArgs[index] || ""}
                        onChange={(e) => {
                          const newArgs = [...functionArgs];
                          newArgs[index] = e.target.value;
                          setFunctionArgs(newArgs);
                        }}
                        className="w-full border-2 border-[#808080] shadow-win98-outer bg-white px-2 py-1 font-mono"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-bold mb-1">Recipient</label>
            <input
              type="text"
              value={recipient}
              onChange={handleRecipientChange}
              placeholder="Enter recipient address"
              className={`w-full border-2 ${isRecipientValid ? 'border-[#808080]' : 'border-red-500'} shadow-win98-outer bg-white px-2 py-1`}
            />
            {!isRecipientValid && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid address</p>
            )}
          </div>

          <button
            onClick={handleExecute}
            disabled={isLoading || !recipient || !isRecipientValid}
            className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] p-3 font-bold text-sm hover:bg-[#c0c0c0] transition-colors ${
              isLoading || !recipient || !isRecipientValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Execute Transaction'}
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
    <div 
      className={`transition-all duration-800 ease-out origin-top-left ${
        isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-0'
      }`}
      style={{
        clipPath: isVisible 
          ? 'circle(150% at 0% 0%)' 
          : 'circle(0% at 0% 0%)',
        transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
      }}
    >
      <GotchiGrid
        gotchiList={gotchiList}
        onGotchiAction={handleGotchiSelect}
        isLoading={loadingGotchis}
        emptyMessage="You don't have any Gotchis yet!"
        emptySubMessage="Mint some Gotchis first to make calls."
      />
    </div>
  );
});

export default CallComponent;