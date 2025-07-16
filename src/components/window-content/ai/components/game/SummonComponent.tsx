'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { useContractWrite } from "@/src/hooks/useContract"
import { useToast } from '@/hooks/use-toast'
import { Sparkles, ArrowLeft, ChevronDown } from "lucide-react"
import { ethers } from "ethers"
import { ZERO_ADDRESS } from "@/lib/constant"
import { motion } from "framer-motion";
import Win98WarningDialog from "@/components/ui/win98-warning-dialog";
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import { Win98Loading } from "@/components/ui/win98-loading"
import { GotchiItem } from '@/lib/types';


interface SummonComponentProps {
  onSummonSuccess?: (
    tokenId: string,
    txHash: string,
    pusName: string,
    pusStory: string
  ) => void;
}


const SummonComponent = observer(({ onSummonSuccess }: SummonComponentProps) => {
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [selectedGotchi, setSelectedGotchi] = useState<GotchiItem | null>(null);
  const [pusName, setPusName] = useState("")
  const [stakeAmount, setStakeAmount] = useState("")
  const [isSummoning, setIsSummoning] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState(0)
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false)
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false)
  const [showBalanceWarning, setShowBalanceWarning] = useState(false)
  const [pusStory, setPusStory] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  const { walletStore } = useStores();
  const { toast } = useToast();

  const {contractWrite, hash, isConfirmed, error, receipt} = useContractWrite();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!walletStore.isConnected || !walletStore.address) {
      setGotchiList([]);
      setLoadingGotchis(false);
      return;
    }

    const fetchGotchis = async () => {
      try {
        setLoadingGotchis(true);
        const response = await fetch(`/api/tokens/pharos?owner=${walletStore.address}&format=simple`);

        if (response.ok) {
          const data = await response.json();
          console.log('data', data);

          const gotchis = data.map((id: string) => ({
            id
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
    if (selectedGotchi) {
      const fetchStory = async () => {
        const response = await fetch('/api/story');
        if (response.ok) {
          const data = await response.json();
          console.log('data', data);
          setPusName(data.data.name);
          setPusStory(data.data.story);
        }
      };

      fetchStory();
    }
  }, [selectedGotchi])


  const handleSummon = () => {
    if (!pusName || !stakeAmount || !selectedGotchi) return;
    setIsSummoning(true);

    const newTimezone = selectedTimezone + 12;
    const args = [
      Number(selectedGotchi.id),
      pusName,
      ZERO_ADDRESS,
      ethers.parseEther(stakeAmount),
      newTimezone,
      ethers.hexlify(ethers.toUtf8Bytes(pusStory))
    ];

    const value = ethers.parseEther(stakeAmount);
    contractWrite("summonGotchipus", [args], value);
    
    toast({
      title: "Transaction Submitted",
      description: "Transaction submitted successfully",
    })
  };

  useEffect(() => {
    if (isConfirmed && selectedGotchi) {
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })
      setIsSummoning(false);
      
      onSummonSuccess?.(selectedGotchi.id, hash as `0x${string}`, pusName, pusStory);
      
      setSelectedGotchi(null);
      setPusName("");
      setStakeAmount("");
      setPusStory("");
    }
  }, [isConfirmed, selectedGotchi, receipt, onSummonSuccess]);

  useEffect(() => {
    if (error) {
      setIsSummoning(false);
      toast({
        title: "Transaction Cancelled",
        description: "Transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);


  const handleStakeAmountChange = (value: string) => {
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setStakeAmount(value)
      
      const userBalance = Number(walletStore.formattedPharos(18))
      const inputAmount = Number(value)
      
      if (inputAmount > userBalance) {
        setIsInsufficientBalance(true)
        setShowBalanceWarning(true)
      } else {
        setIsInsufficientBalance(false)
        setShowBalanceWarning(false)
      }
    }
  }

  const floatAnimation = {
    y: [0, -3, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

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
        <p className="text-sm text-[#404040]">Loading your Pharos...</p>
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
        <p className="text-sm text-[#404040]">You don't have any Pharos yet!</p>
        <p className="text-xs text-[#808080] mt-2">Mint some Pharos first to start summoning them.</p>
      </div>
    );
  }

  if (selectedGotchi) {
    return (
      <div 
        className={`flex flex-col gap-4 p-1 max-w-2xl mx-auto transition-all duration-800 ease-out origin-top-left ${
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
        <div className="bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-outer py-1 px-2 flex items-center">
          <button
            onClick={() => setSelectedGotchi(null)}
            className="mr-3 bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-2 hover:bg-[#d0d0d0]"
          >
            <ArrowLeft size={10} />
          </button>
          <div>
            <h2 className="text-sm font-bold">Summon Your Gotchipus</h2>
            <p className="text-sm">Pharos #{selectedGotchi.id}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <div className="border-2 border-[#808080] shadow-win98-outer bg-white rounded-none p-3">
              <motion.div animate={floatAnimation} className="relative w-full h-64">
                <Image src="/pharos.png" alt="Pharos" fill className="object-cover"/>
              </motion.div>
            </div>
          </div>

          <div className="w-1/2 space-y-2">
            <div>
              <h3 className="text-sm font-bold mb-2">Name Your Gotchipus</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter gotchipus name"
                  className="w-full border-2 border-[#808080] shadow-win98-inner bg-white rounded-none p-2 text-base"
                  value={pusName}
                  onChange={(e) => setPusName(e.target.value)}
                  disabled={isSummoning}
                />
                {pusName && !isSummoning && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#d4d0c8] border border-[#808080] shadow-win98-innerpx-2 py-1 text-xs"
                    onClick={() => setPusName("")}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-2">Select Timezone</h3>
              <div className="relative">
                <div 
                  className={`border-2 border-[#808080] shadow-win98-outer bg-white rounded-none p-2 flex justify-between items-center cursor-pointer ${isSummoning ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isSummoning && setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)}
                >
                  <span className="text-base">UTC{selectedTimezone >= 0 ? '+' : ''}{selectedTimezone}</span>
                  <ChevronDown size={14} />
                </div>
                
                {isTimezoneDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#808080] shadow-win98-outer rounded-none max-h-40 overflow-y-auto">
                    {Array.from({ length: 27 }, (_, i) => {
                      const offset = i - 12;
                      return (
                        <div
                          key={offset}
                          className="p-3 hover:bg-[#d4d0c8] cursor-pointer text-base"
                          onClick={() => {
                            setSelectedTimezone(offset);
                            setIsTimezoneDropdownOpen(false);
                          }}
                        >
                          UTC{offset >= 0 ? '+' : ''}{offset}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold">Stake PHRS Token</h3>
                <span className="text-sm bg-[#d4d0c8] border border-[#808080] shadow-win98-inner px-2 py-1">
                  Balance: {walletStore.formattedPharos()} PHRS
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="0.0"
                  className={`w-full border-2 ${isInsufficientBalance ? 'border-[#ff0000]' : 'border-[#808080]'} shadow-win98-inner bg-white rounded-none p-2 text-base`}
                  value={stakeAmount}
                  onChange={(e) => handleStakeAmountChange(e.target.value)}
                  disabled={isSummoning}
                />
                {!isSummoning && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#d4d0c8] border border-[#808080] shadow-win98-innerpx-2 py-1 text-xs"
                    onClick={() => {
                      const maxAmount = walletStore.formattedPharos(18)
                      setStakeAmount(maxAmount)
                      setIsInsufficientBalance(false)
                      setShowBalanceWarning(false)
                    }}
                  >
                    Max
                  </button>
                )}
              </div>
            </div>

            {walletStore.isConnected ? (
              <button
                className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-none p-2 mt-4 hover:bg-[#c0c0c0] transition-colors flex items-center justify-center text-base font-bold ${
                  !pusName || !stakeAmount || !selectedGotchi || isSummoning || isInsufficientBalance
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleSummon}
                disabled={!pusName || !stakeAmount || !selectedGotchi || isSummoning || isInsufficientBalance}
              >
                {isSummoning ? (
                  <Win98Loading text="Summoning..." />
                ) : (
                  <>
                    <Sparkles size={20} className="mr-2" />
                    Confirm Summon
                  </>
                )}
              </button>
            ) : (
              <div className="w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-none p-4 mt-4 hover:bg-[#c0c0c0] transition-colors flex items-center justify-center">
                <CustomConnectButton />
              </div>
            )}
          </div>
        </div>

        <Win98WarningDialog
          isOpen={showBalanceWarning}
          onClose={() => setShowBalanceWarning(false)}
          title="⚠️ Warning"
          icon={<span className="text-2xl">⚠️</span>}
          iconBgColor="#ffff80"
        >
          <p className="text-sm font-bold mb-1">Insufficient Balance</p>
          <p className="text-xs">You don't have enough PHRS to stake this amount.</p>
          <p className="text-xs mt-1">Your balance: {walletStore.formattedPharos()} PHRS</p>
        </Win98WarningDialog>
      </div>
    );
  }

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
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Select a Pharos to Summon</h2>
        <p className="text-sm text-[#404040]">Choose one of your Pharos to begin the summoning process.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
        {gotchiList.map((gotchi, index) => (
          <div
            key={gotchi.id}
            className={`bg-[#c0c0c0] border-2 shadow-win98-outer p-4 text-center hover:bg-[#d0d0d0] cursor-pointer flex flex-col items-center justify-center transition-all duration-600 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionDelay: `${300 + index * 100}ms`
            }}
            onClick={() => setSelectedGotchi(gotchi)}
          >
            <Image src="/pharos.png" alt="Pharos" width={100} height={100} />
            <div className="text-sm font-bold">Pharos #{gotchi.id}</div>
            <div className="text-xs text-[#808080] mt-1">Click to summon</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default SummonComponent;