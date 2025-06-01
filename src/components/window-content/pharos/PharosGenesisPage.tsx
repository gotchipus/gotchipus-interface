"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Sparkles, Check, ChevronDown, ChevronUp } from "lucide-react"
import DualTokenIcon from "@/components/window-content/pharos/DualTokenIcon"
import { useContractRead, useContractWrite, useERC6551Read } from "@/hooks/useContract"
import { PUS_ADDRESS } from "@/src/app/blockchain"
import { ethers } from "ethers"
import { CHAIN_ID, ZERO_ADDRESS } from "@/lib/constant"
import { useToast } from '@/hooks/use-toast'
import { useStores } from "@stores/context"
import { observer } from "mobx-react-lite"
import { getERC6551AccountSalt } from "@/src/utils/contractHepler";
import { motion } from "framer-motion";
import Win98WarningDialog from "@/components/ui/win98-warning-dialog";
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import { Win98Loading } from "@/components/ui/win98-loading"

interface PharosGenesisPageProps {
  tokenId: string,
  story: string,
  previewImage: any,
  onClose?: () => void
}

function getStableAether(amount: number = 0) {
  if (amount >= 1000) {
    return 100;
  } else if (amount >= 500) {
    return 75;
  } else if (amount >= 250) {
    return 50;
  } else if (amount >= 100) {
    return 25;
  } else {
    return 10;
  }
}

const PharosGenesisPage = observer(({ tokenId, story, previewImage, onClose }: PharosGenesisPageProps) => {
  const [pusName, setPusName] = useState("")
  const [stakeAmount, setStakeAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState<number | null>(0)
  const [isSummoning, setIsSummoning] = useState(false)
  const [positionVersion, setPositionVersion] = useState("token")
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false)
  const [stakeToken, setStakeToken] = useState("USDC")
  const [traitsExpanded, setTraitsExpanded] = useState(false)
  const [storyExpanded, setStoryExpanded] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState(0)
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false)
  const [tokenBoundAccount, setTokenBoundAccount] = useState(ZERO_ADDRESS)
  const [dna, setDna] = useState("0")
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false)
  const [showBalanceWarning, setShowBalanceWarning] = useState(false)
  const { toast } = useToast()
  const { walletStore } = useStores()

  const salt = getERC6551AccountSalt(CHAIN_ID, parseInt(tokenId));

  const accountData = useERC6551Read("account", [PUS_ADDRESS, salt, CHAIN_ID, PUS_ADDRESS, tokenId]);

  useEffect(() => {
    if (accountData) {
      setTokenBoundAccount(accountData as string);
      setDna(BigInt(salt).toString());
    }
  }, [accountData, salt]);

  const {contractWrite, isConfirmed, isConfirming, isPending, error, receipt} = useContractWrite();

  const handleSummon = () => {
    if (!pusName || !stakeAmount || selectedToken === null) return;
    setIsSummoning(true);

    const args = [
      BigInt(tokenId),
      pusName,
      ZERO_ADDRESS,
      ethers.parseEther(stakeAmount).toString(),
      selectedTimezone.toString(),
      ethers.hexlify(ethers.toUtf8Bytes(story))
    ];

    const value = ethers.parseEther(stakeAmount);
    
    contractWrite("summonGotchipus", [args], value);
    
    toast({
      title: "Submited Transaction",
      description: "Transaction submitted successfully",
    })
  };

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })
      setIsSummoning(false);
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    }
  }, [isConfirmed, onClose])

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

  const attributes = {
    dna: {
      name: "Genes",
      displayValue: dna,
    },
    traits: [
      { 
        name: "Elemented", 
        displayValue: "Water", 
        icon: <Image src="/icons/element.png" alt="Water" width={18} height={18} />,
        bgColor: "bg-blue-50"
      },
      { 
        name: "Bonding", 
        displayValue: "50", 
        icon: <Image src="/icons/bonding.png" alt="Bonding" width={18} height={18} />,
        bgColor: "bg-red-50"
      },
      { 
        name: "Growth", 
        displayValue: "0", 
        icon: <Image src="/icons/growth.png" alt="Growth" width={18} height={18} />,
        bgColor: "bg-amber-50"
      },
      { 
        name: "Wisdom", 
        displayValue: "0", 
        icon: <Image src="/icons/wisdom.png" alt="Wisdom" width={18} height={18} />,
        bgColor: "bg-emerald-50"
      },
      { 
        name: "Aether", 
        displayValue: getStableAether(Number(stakeAmount)), 
        icon: <Image src="/icons/aether.png" alt="Aether" width={18} height={18} />,
        bgColor: "bg-cyan-50"
      }
    ]
  }

  const tokens = {
    "token": ["PHAROS"]
  };

  const positionVersions = ["token"];

  const handlePositionVersionChange = (version: string) => {
    setPositionVersion(version)
    setIsVersionDropdownOpen(false)
  };

  const handleLpTokenChange = (version: string, index: number) => {
    setSelectedToken(index)
    setStakeToken(tokens[version as keyof typeof tokens][index])
  };

  const handleStakeAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setStakeAmount(value)
      
      // Check if amount exceeds balance
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

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 scrollbar-none">
        {/* Left Side - Gotchipus Preview */}
        <div className="w-full md:w-2/5 flex flex-col gap-4 scrollbar-none">
          <div className="border-2 border-[#808080] shadow-win98-outer bg-white rounded-lg p-4 h-80 flex items-center justify-center relative">
            <motion.div animate={floatAnimation} className="relative w-full h-full">
              <Image src={previewImage} alt="Gotchipus" fill className="object-cover" />
            </motion.div>
          </div>

          {/* Attributes List */}
          <div>
            <h3 className="text-lg font-bold mb-2">Gotchipus Attributes</h3>
            
            {/* DNA ID Section */}
            <div className="win98-group-box">
              <div className="win98-group-title">{attributes.dna.name}</div>
              <div className="font-mono text-xs bg-[#d4d0c8] p-2 border border-[#808080] shadow-win98-inner overflow-x-auto whitespace-nowrap scrollbar-none">
                {attributes.dna.displayValue}
              </div>
            </div>

            {/* Token Bound Account Section */}
            <div className="win98-group-box">
              <div className="win98-group-title">Token Bound Account</div>
              <div className="font-mono text-xs bg-[#d4d0c8] p-2 border border-[#808080] shadow-win98-inner overflow-x-auto whitespace-nowrap scrollbar-none">
                {tokenBoundAccount}
              </div>
            </div>

            {/* Story Section */}
            <div className="win98-group-box mb-2">
              <div className="win98-group-title">Story</div>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setStoryExpanded(!storyExpanded)}
              >
                <div className="flex items-center">
                  <Image src="/icons/story.png" alt="Story" width={18} height={18} className="mr-2" />
                  <span className="text-xs text-gray-600">Click to {storyExpanded ? 'collapse' : 'expand'} story</span>
                </div>
                {storyExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {storyExpanded && (
                <div className="mt-2 p-2 bg-[#d4d0c8] border border-[#808080] shadow-win98-inner text-sm max-h-40 overflow-y-auto">
                  {story}
                </div>
              )}
            </div>

            {/* Attributes Section */}
            <div className="win98-group-box">
              <div className="win98-group-title">Attributes</div>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setTraitsExpanded(!traitsExpanded)}
              >
                <div className="flex items-center">
                  <Image src="/icons/attribute.png" alt="Attributes" width={18} height={18} className="mr-2" />
                  <span className="text-xs text-gray-600">Click to {traitsExpanded ? 'collapse' : 'expand'} attributes</span>
                </div>
                {traitsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {traitsExpanded && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {attributes.traits.map((attr, index) => (
                    <div key={index} className="bg-[#d4d0c8] border border-[#808080] shadow-win98-inner p-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${attr.bgColor}`}>
                          {attr.icon}
                        </div>
                        <div className="font-bold text-xs">{attr.name}</div>
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <div className="text-xs font-medium">{attr.displayValue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Input and Staking */}
        <div className="w-full md:w-3/5 flex flex-col gap-4">
          {/* Name Input */}
          <div>
            <h3 className="text-lg font-bold mb-2">Name Your Gotchipus</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter gotchipus name"
                className="w-full border-2 border-[#808080] shadow-win98-inner bg-white rounded-lg p-3"
                value={pusName}
                onChange={(e) => setPusName(e.target.value)}
                disabled={isSummoning}
              />
              {pusName && !isSummoning && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#d4d0c8] border border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] px-2 py-1 text-xs"
                  onClick={() => setPusName("")}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Timezone Selection */}
          <div className="mt-2">
            <h3 className="text-lg font-bold mb-2">Select Timezone</h3>
            <div className="relative">
              <div 
                className={`border-2 border-[#808080] shadow-win98-outer bg-white rounded-lg p-3 flex justify-between items-center cursor-pointer ${isSummoning ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !isSummoning && setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)}
              >
                <span>UTC{selectedTimezone >= 0 ? '+' : ''}{selectedTimezone}</span>
                <ChevronDown size={16} />
              </div>
              
              {isTimezoneDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#808080] shadow-win98-outer rounded-lg max-h-60 overflow-y-auto">
                  {Array.from({ length: 27 }, (_, i) => {
                    const offset = i - 12;
                    return (
                      <div
                        key={offset}
                        className="p-2 hover:bg-[#d4d0c8] cursor-pointer"
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

          {/* Staking Section */}
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Stake {stakeToken} Token </h3>
              <span className="text-sm bg-[#d4d0c8] border border-[#808080] shadow-win98-inner px-2 py-1">
                Balance: {walletStore.formattedPharos()} {stakeToken}
              </span>
            </div>

            <div className="relative mt-2">
              <input
                type="text"
                placeholder="0.0"
                className={`w-full border-2 ${isInsufficientBalance ? 'border-[#ff0000]' : 'border-[#808080]'} shadow-win98-inner bg-white rounded-lg p-3`}
                value={stakeAmount}
                onChange={(e) => handleStakeAmountChange(e.target.value)}
                disabled={isSummoning}
              />
              {!isSummoning && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#d4d0c8] border border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] px-2 py-1 text-xs"
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

            <Win98WarningDialog
              isOpen={showBalanceWarning}
              onClose={() => setShowBalanceWarning(false)}
              title="⚠️ Warning"
              icon={<span className="text-2xl">⚠️</span>}
              iconBgColor="#ffff80"
            >
              <p className="text-sm font-bold mb-1">Insufficient Balance</p>
              <p className="text-xs">You don't have enough {stakeToken} to stake this amount.</p>
              <p className="text-xs mt-1">Your balance: {walletStore.formattedPharos()} {stakeToken}</p>
            </Win98WarningDialog>

            {/* Position Version Dropdown */}
            <div className="mt-4">
              <h4 className="font-bold mb-2">Select Stake Position:</h4>
              <div className="relative">
                <div 
                  className={`border-2 border-[#808080] shadow-win98-outer bg-white rounded-lg p-3 flex justify-between items-center cursor-pointer ${isSummoning ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isSummoning && setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                >
                  <span>{positionVersion} position</span>
                  <ChevronDown size={16} />
                </div>
                
                {isVersionDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#808080] shadow-win98-outer rounded-lg">
                    {positionVersions.map((version, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-[#d4d0c8] cursor-pointer"
                        onClick={() => handlePositionVersionChange(version)}
                      >
                        {version} position
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stake Token Selection */}
            <div className="mt-4">
              <h4 className="font-bold mb-2">Select Stake Token Type:</h4>
              <div className="grid grid-cols-2 gap-2">
                {tokens[positionVersion as keyof typeof tokens].map((token, index) => (
                  <div
                    key={index}
                    className={`border-2 border-[#808080] shadow-win98-outer bg-white rounded-lg p-2 flex items-center cursor-pointer ${
                      selectedToken === index ? "bg-[#d4d0c8]" : ""
                    } ${isSummoning ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !isSummoning && handleLpTokenChange(positionVersion, index)}
                  >
                    <div
                      className={`w-5 h-5 border-2 border-[#808080] rounded-full mr-2 flex items-center justify-center ${
                        selectedToken === index ? "bg-[#000080]" : ""
                      }`}
                    >
                      {selectedToken === index && <Check size={12} className="text-white" />}
                    </div>
                    <span className="flex items-center">
                      {positionVersion !== "lp" ? (
                        <Image src={`/tokens/${token.toLowerCase()}.png`} alt={token} width={20} height={20} className="mr-2" />
                      ) : (
                        <DualTokenIcon token1={token.split("/")[0]} token2={token.split("/")[1]} size={20} className="mr-2" />
                      )}
                      {token}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            {walletStore.isConnected ? (
              <button
                className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-lg p-3 mt-6 hover:bg-[#c0c0c0] transition-colors flex items-center justify-center ${
                  !pusName || !stakeAmount || selectedToken === null || isSummoning || isInsufficientBalance
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleSummon}
                disabled={!pusName || !stakeAmount || selectedToken === null || isSummoning || isInsufficientBalance}
              >
                {isSummoning ? (
                  <Win98Loading text="Summoning in progress..." />
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    Confirm Summon
                  </>
                )}
              </button>
            ) : (
              <div className="w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-lg p-3 mt-6 hover:bg-[#c0c0c0] transition-colors flex items-center justify-center">
                <CustomConnectButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
});

export default PharosGenesisPage