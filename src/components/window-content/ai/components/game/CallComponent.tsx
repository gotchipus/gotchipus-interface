import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import GotchiCard from "./GotchiCard";
import Image from "next/image";
import { ethers } from "ethers";
import { useERC20Read, useContractWrite } from "@/hooks/useContract";
import { useToast } from '@/hooks/use-toast';
import { Token } from "@/lib/types";

interface GotchiItem {
  id: string;
  image?: string;
}

interface CallComponentProps {
  onCallSuccess?: (tokenId: string, txHash: string) => void;
}

const TOKENS: Token[] = [
  { name: "Pharos", symbol: "PHRS", icon: "/tokens/pharos.png", contract: "0x0000000000000000000000000000000000000000", balance: "0", decimals: 18, popular: false },
  { name: "USD Coin", symbol: "USDC", icon: "/tokens/usdc.png", contract: "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED", balance: "0", decimals: 6, popular: false },
  { name: "Wrapped Ether", symbol: "WETH", icon: "/tokens/eth.png", contract: "0x4E28826d32F1C398DED160DC16Ac6873357d048f", balance: "0", decimals: 18, popular: false },
  { name: "Tether USD", symbol: "USDT", icon: "/tokens/usdt.png", contract: "0xD4071393f8716661958F766DF660033b3d35fD29", balance: "0", decimals: 6, popular: false },
];

type CallType = 'transfer' | 'erc20' | 'erc721' | 'contract';

export const CallComponent = ({ onCallSuccess }: CallComponentProps) => {
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [selectedGotchi, setSelectedGotchi] = useState<GotchiItem | null>(null);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [callType, setCallType] = useState<CallType>('transfer');
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]);
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
  
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { toast } = useToast();
  const { contractWrite, isConfirmed, error } = useContractWrite();

  const tbaAddress = selectedGotchi ? `0x${selectedGotchi.id.padStart(40, '0')}` : "";
  
  const [nativeBalance, setNativeBalance] = useState("0");
  
  const { data: erc20Balance } = useERC20Read(
    selectedToken.contract,
    "balanceOf",
    [tbaAddress],
    { enabled: !!selectedToken.contract && selectedToken.contract !== "0x0000000000000000000000000000000000000000" && !!tbaAddress }
  );

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
      case 'erc20':
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

  useEffect(() => {
    if (isConfirmed) {
      setIsLoading(false);
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      });
      resetForm();
      if (onCallSuccess && selectedGotchi) {
        onCallSuccess(selectedGotchi.id, "transaction_hash");
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

  if (!isConnected) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-6 text-center">
        <div className="bg-[#0078d4] text-white px-3 py-1 mb-4 flex items-center">
          <div className="mr-2 font-bold">⚠️</div>
          <div className="text-sm font-bold">Connect Required</div>
        </div>
        <p className="text-sm text-[#404040] mb-4">Please connect your wallet to make calls</p>
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
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to make calls.</p>
      </div>
    );
  }

  if (showCallInterface && selectedGotchi) {
    return (
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]"
          >
            ← Back to List
          </button>
          <h2 className="text-lg font-bold">Call from Gotchi #{selectedGotchi.id}</h2>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'transfer', label: 'Transfer Native', icon: '💰' },
              { type: 'erc20', label: 'Transfer ERC20', icon: '🪙' },
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
                } shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] transition-colors`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-4 space-y-4">
          {(callType === 'transfer' || callType === 'erc20') && (
            <>
              <div>
                <label className="block text-sm font-bold mb-2">Token</label>
                <select
                  value={selectedToken.symbol}
                  onChange={(e) => {
                    const token = TOKENS.find(t => t.symbol === e.target.value);
                    if (token) setSelectedToken(token);
                  }}
                  className="w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-white p-2"
                >
                  {TOKENS.map(token => (
                    <option key={token.symbol} value={token.symbol}>{token.name} ({token.symbol})</option>
                  ))}
                </select>
                <p className="text-xs text-[#808080] mt-1">Balance: {formattedBalance} {selectedToken.symbol}</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Amount</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-white p-2"
                  />
                  <button
                    onClick={() => setAmount(formattedBalance)}
                    className="px-3 py-2 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] text-sm font-bold"
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
                <label className="block text-sm font-bold mb-2">NFT Contract Address</label>
                <input
                  type="text"
                  value={erc721Contract}
                  onChange={(e) => setErc721Contract(e.target.value)}
                  placeholder="0x..."
                  className="w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-white p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Token ID</label>
                <input
                  type="text"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="Token ID"
                  className="w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-white p-2"
                />
              </div>
            </>
          )}

          {callType === 'contract' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-2">Contract Address</label>
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-white p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Value (PHRS)</label>
                <input
                  type="text"
                  value={payableValue}
                  onChange={(e) => setPayableValue(e.target.value)}
                  placeholder="0.0"
                  className="w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-white p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Function Signature</label>
                <input
                  type="text"
                  value={functionSignature}
                  onChange={(e) => setFunctionSignature(e.target.value)}
                  placeholder="e.g. transfer(address,uint256)"
                  className="w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-white p-2 font-mono"
                />
              </div>
              
              {parsedFunction && parsedFunction.inputs.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold">Parameters</label>
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
                        className="w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-white p-2 font-mono"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-bold mb-2">Recipient</label>
            <input
              type="text"
              value={recipient}
              onChange={handleRecipientChange}
              placeholder="Enter recipient address"
              className={`w-full border-2 ${isRecipientValid ? 'border-[#808080]' : 'border-red-500'} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-white p-2`}
            />
            {!isRecipientValid && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid address</p>
            )}
          </div>

          <button
            onClick={handleExecute}
            disabled={isLoading || !recipient || !isRecipientValid}
            className={`w-full border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-[#d4d0c8] p-3 font-bold text-sm hover:bg-[#c0c0c0] transition-colors ${
              isLoading || !recipient || !isRecipientValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Execute Transaction'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Select a Gotchi for Calls</h2>
        <p className="text-sm text-[#404040]">Choose one of your Gotchis to make transactions and contract calls.</p>
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
              id={gotchi.id}
              className="hover:shadow-lg transition-shadow"
            />
          </div>
        ))}
      </div>
    </div>
  );
};