"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import {
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { useContractWrite } from "@/hooks/useContract"
import { ethers } from "ethers"
import { ZERO_ADDRESS } from "@/lib/constant"
import { useToast } from "@/hooks/use-toast"
import { useStores } from "@stores/context"
import { observer } from "mobx-react-lite"
import { motion, AnimatePresence } from "framer-motion"
import Win98WarningDialog from "@/components/ui/win98-warning-dialog"
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import { Win98Loading } from "@/components/ui/win98-loading"
import useResponsive from "@/hooks/useResponsive"
import { CompactCardSelector, WearableSlot, TabButton } from "./components"
import { getStableAether } from "./utils"
import type { PharosGenesisPageProps } from "./types"

const PharosGenesisPage = observer(({
  tokenId,
  gotchipusPreviews,
  selectedPreviewIndex,
  onPreviewSelect,
  onClose,
  tokenBoundAccount,
  dna
}: PharosGenesisPageProps) => {
  const currentPreview = gotchipusPreviews[selectedPreviewIndex];
  const previewImage = currentPreview?.image;
  const currentTraitsIndex = currentPreview?.traitsIndex || [0, 0, 0];

  const { storyStore } = useStores();
  const [pusName, setPusName] = useState(storyStore.gotchiName || "Unnamed Gotchipus")

  useEffect(() => {
    if (storyStore.gotchiName) {
      setPusName(storyStore.gotchiName);
    }
  }, [storyStore.gotchiName]);

  const [stakeAmount, setStakeAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState<number | null>(0)
  const [isSummoning, setIsSummoning] = useState(false)
  const [stakeToken, setStakeToken] = useState("PHRS")
  const [selectedTimezone, setSelectedTimezone] = useState(0)
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false)
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false)
  const [showBalanceWarning, setShowBalanceWarning] = useState(false)
  const [activeTab, setActiveTab] = useState("attributes")

  const { toast } = useToast()
  const { walletStore } = useStores()
  const isMobile = useResponsive()

  const { contractWrite, isConfirmed, error, receipt } = useContractWrite()

  const handleSummon = () => {
    if (!pusName || !stakeAmount || selectedToken === null) return
    setIsSummoning(true)

    const newTimezone = selectedTimezone + 12
    const args = [
      Number(tokenId),
      pusName,
      ZERO_ADDRESS,
      ethers.parseEther(stakeAmount),
      newTimezone,
      ethers.hexlify(ethers.toUtf8Bytes(storyStore.gotchiStory || "")),
      selectedPreviewIndex
    ]

    const value = ethers.parseEther(stakeAmount)

    console.log('args', args);

    contractWrite("summonGotchipus", [args], value)
    toast({
      title: "Transaction Submitted",
      description: "Transaction submitted successfully",
    })
  }

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })
      setIsSummoning(false)
      // const sendDataToBackend = async () => {
      //   try {
      //     const data = {
      //       base64_img: previewImage,
      //       token_id: tokenId,
      //       name: pusName,
      //       description: storyStore.gotchiStory || "",
      //     }
      //     console.log('data', data);

      //     const response = await fetch("/api/images/upload", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(data),
      //     })
      //     if (!response.ok) {
      //       throw new Error(`API call failed with status: ${response.status}`)
      //     }
      //     await response.json()
      //   } catch (error) {
      //     console.error("Error sending data to backend:", error)
      //   }
      // }
      // sendDataToBackend()
      if (onClose) {
        setTimeout(() => {
          onClose()
        }, 500)
      }
    }
  }, [isConfirmed, onClose, receipt, previewImage, pusName, storyStore.gotchiStory])

  useEffect(() => {
    if (error) {
      setIsSummoning(false)
      toast({
        title: "Transaction Cancelled",
        description: "Transaction was cancelled or failed",
        variant: "destructive",
      })
    }
  }, [error, toast])

  const attributes = {
    dna: {
      name: "Genes",
      displayValue: dna,
    },
    traits: [
      {
        name: "Faction",
        displayValue: "Combat",
        icon: <Image src="/icons/faction.png" alt="Faction" width={18} height={18} />,
        bgColor: "bg-[#c0c0c0]",
      },
      {
        name: "STR",
        displayValue: "50",
        icon: <Image src="/icons/strength.png" alt="Strength" width={18} height={18} />,
        bgColor: "bg-[#c0c0c0]",
      },
      {
        name: "DEF",
        displayValue: "0",
        icon: <Image src="/icons/defense.png" alt="Defense" width={18} height={18} />,
        bgColor: "bg-[#c0c0c0]",
      },
      {
        name: "INT",
        displayValue: "0",
        icon: <Image src="/icons/mind.png" alt="Mind" width={18} height={18} />,
        bgColor: "bg-[#c0c0c0]",
      },
      {
        name: "VIT",
        displayValue: getStableAether(Number(stakeAmount)),
        icon: <Image src="/icons/vitality.png" alt="Vitality" width={18} height={18} />,
        bgColor: "bg-[#c0c0c0]",
      },
      {
        name: "AGI",
        displayValue: getStableAether(Number(stakeAmount)),
        icon: <Image src="/icons/agility.png" alt="Agility" width={18} height={18} />,
        bgColor: "bg-[#c0c0c0]",
      },
      {
        name: "LUK",
        displayValue: getStableAether(Number(stakeAmount)),
        icon: <Image src="/icons/luck.png" alt="Luck" width={18} height={18} />,
        bgColor: "bg-[#c0c0c0]",
      },
    ],
  }

  const tokens = {
    token: ["PHRS"],
  }

  const handleLpTokenChange = (version: string, index: number) => {
    setSelectedToken(index)
    setStakeToken(tokens[version as keyof typeof tokens][index])
  }

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

    if (isMobile) {
      return (
        <div className={`bg-[#c0c0c0] w-full h-full ${isMobile ? "p-2" : "p-4"} space-y-4`}>
          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
            <h2 className="text-lg font-bold text-[#000080] text-center">Summon Gotchipus</h2>
            <p className="text-sm text-center mt-1">Pharos #{tokenId}</p>
          </div>

          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
            <div className="relative w-full h-64 overflow-hidden">
              {typeof previewImage === 'string' ? (
                <Image src={previewImage} alt="Gotchipus" fill className="object-contain" />
              ) : (
                <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:scale-125 flex items-center justify-center">
                  {previewImage}
                </div>
              )}
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-bold mb-2 text-center">Equipment</h4>
              <div className="flex justify-center gap-3">
                <WearableSlot
                  type="background"
                  wearableIndex={currentTraitsIndex[0]}
                />
                <WearableSlot
                  type="body"
                  wearableIndex={currentTraitsIndex[1]}
                />
                <WearableSlot
                  type="eye"
                  wearableIndex={currentTraitsIndex[2]}
                />
              </div>
            </div>

            <CompactCardSelector
              gotchipusPreviews={gotchipusPreviews}
              selectedIndex={selectedPreviewIndex}
              onSelect={onPreviewSelect}
            />
          </div>

          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3 space-y-3">
            <div>
              <label className="text-sm font-bold mb-1 block">Name</label>
              <input
                type="text"
                placeholder="Enter gotchipus name"
                className="w-full border-2 border-[#808080] shadow-win98-inner bg-white p-2 text-sm"
                value={pusName}
                onChange={(e) => setPusName(e.target.value)}
                disabled={isSummoning}
              />
            </div>

            <div>
              <label className="text-sm font-bold mb-1 block">Stake Amount</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="0.0"
                  className={`flex-1 border-2 ${
                    isInsufficientBalance ? "border-red-500" : "border-[#808080]"
                  } shadow-win98-inner bg-white p-2 text-sm`}
                  value={stakeAmount}
                  onChange={(e) => handleStakeAmountChange(e.target.value)}
                  disabled={isSummoning}
                />
                <button
                  className="px-3 py-1 bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-outer text-xs font-bold hover:bg-[#c0c0c0]"
                  onClick={() => {
                    const maxAmount = walletStore.formattedPharos(18)
                    setStakeAmount(maxAmount)
                    setIsInsufficientBalance(false)
                  }}
                >
                  MAX
                </button>
              </div>
              <p className="text-xs mt-1 opacity-70">
                Balance: {walletStore.formattedPharos()} PHRS
              </p>
            </div>

            <div>
              <label className="text-sm font-bold mb-1 block">Timezone</label>
              <select
                className="w-full border-2 border-[#808080] shadow-win98-inner bg-white p-2 text-sm"
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(Number(e.target.value))}
                disabled={isSummoning}
              >
                {Array.from({ length: 25 }, (_, i) => i - 12).map((offset) => (
                  <option key={offset} value={offset}>
                    UTC{offset >= 0 ? "+" : ""}{offset}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {walletStore.isConnected ? (
            <button
              className={`w-full py-3 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c0] font-bold flex items-center justify-center gap-2 transition-all hover:bg-[#c0c0c0]
                ${
                  !pusName || !stakeAmount || isSummoning || isInsufficientBalance
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              onClick={handleSummon}
              disabled={!pusName || !stakeAmount || isSummoning || isInsufficientBalance}
            >
              {isSummoning ? (
                <Win98Loading text="Summoning..." />
              ) : (
                <>
                  <Sparkles size={20} />
                  Summon Gotchipus
                </>
              )}
            </button>
          ) : (
            <div className="w-full py-3 bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-outer flex justify-center">
              <CustomConnectButton />
            </div>
          )}
        </div>
      )
    }

    return (
      <div className={`bg-[#c0c0c0] w-full h-full ${isMobile ? "p-2" : ""} flex gap-4`}>
        <div className="w-2/5 flex flex-col gap-4">
          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer flex flex-col">
            <div className="bg-[#000080] text-white p-2 flex flex-row items-center justify-between">
              <h3 className="text-lg font-bold">Pharos #{tokenId}</h3>
              <div className="text-lg opacity-90">
                {storyStore.isFetching && !pusName ? (
                  <div className="h-4 bg-gray-300 animate-pulse rounded w-24"></div>
                ) : (
                  <p>{pusName || "Unnamed Gotchipus"}</p>
                )}
              </div>
            </div>
            <div className="p-4 relative">
              <div className="relative w-full h-96 overflow-hidden">
                {typeof previewImage === 'string' ? (
                  <Image
                    src={previewImage}
                    alt="Gotchipus"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:scale-100 flex items-center justify-center">
                    {previewImage}
                  </div>
                )}
              </div>

              <div className="mt-2 bg-[#c0c0c0] border border-[#808080] shadow-win98-inner p-2">
                <div className="flex justify-between">
                  <WearableSlot
                    type="background"
                    wearableIndex={currentTraitsIndex[0]}
                  />
                  <WearableSlot
                    type="body"
                    wearableIndex={currentTraitsIndex[1]}
                  />
                  <WearableSlot
                    type="eye"
                    wearableIndex={currentTraitsIndex[2]}
                  />
                </div>
              </div>

              <CompactCardSelector
                gotchipusPreviews={gotchipusPreviews}
                selectedIndex={selectedPreviewIndex}
                onSelect={onPreviewSelect}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer">
            <div className="bg-[#000080] text-white p-2">
              <h3 className="text-lg font-bold">Summon Configuration</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-bold mb-2 flex items-center gap-2">
                  Gotchipus Name
                </label>
                <input
                  type="text"
                  placeholder="Enter a unique name for your Gotchipus"
                  className="w-full border-2 border-[#808080] shadow-win98-inner bg-white p-2"
                  value={pusName}
                  onChange={(e) => setPusName(e.target.value)}
                  disabled={isSummoning}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Stake Amount</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0.0"
                      className={`w-full border-2 ${
                        isInsufficientBalance ? "border-red-500 bg-red-50" : "border-[#808080]"
                      } shadow-win98-inner bg-white p-2 pr-16`}
                      value={stakeAmount}
                      onChange={(e) => handleStakeAmountChange(e.target.value)}
                      disabled={isSummoning}
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#000080] text-white px-3 py-1 text-xs font-bold hover:bg-[#4169E1]"
                      onClick={() => {
                        const maxAmount = walletStore.formattedPharos(18)
                        setStakeAmount(maxAmount)
                        setIsInsufficientBalance(false)
                      }}
                    >
                      MAX
                    </button>
                  </div>
                  <p className="text-xs mt-1 text-gray-600">
                    Balance: <span className="font-bold">{walletStore.formattedPharos()} PHRS</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Timezone</label>
                  <div className="relative">
                    <div
                      className="border-2 border-[#808080] shadow-win98-outer bg-white p-2 flex justify-between items-center cursor-pointer hover:bg-[#f0f0f0]"
                      onClick={() =>
                        !isSummoning && setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)
                      }
                    >
                      <span>
                        UTC{selectedTimezone >= 0 ? "+" : ""}{selectedTimezone}
                      </span>
                      <ChevronDown size={16} />
                    </div>
                    {isTimezoneDropdownOpen && (
                      <div className="absolute z-20 w-full mt-1 bg-white border-2 border-[#808080] shadow-win98-outer max-h-48 overflow-y-auto">
                        {Array.from({ length: 25 }, (_, i) => i - 12).map((offset) => (
                          <div
                            key={offset}
                            className="p-2 hover:bg-[#000080] hover:text-white cursor-pointer"
                            onClick={() => {
                              setSelectedTimezone(offset)
                              setIsTimezoneDropdownOpen(false)
                            }}
                          >
                            UTC{offset >= 0 ? "+" : ""}{offset}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Select Stake Token</label>
                <div className="grid grid-cols-5 gap-2">
                  {tokens["token"].map((token, index) => (
                    <div
                      key={index}
                      className={`border-2 shadow-win98-outer p-1 cursor-pointer transition-all flex flex-row items-center justify-center
                        ${
                          selectedToken === index
                            ? "border-[#000080] bg-[#c0c0c0]"
                            : "border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0]"
                        }`}
                      onClick={() => !isSummoning && handleLpTokenChange("token", index)}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/tokens/${token.toLowerCase()}.png`}
                          alt={token}
                          width={16}
                          height={16}
                        />
                        <span className="text-lg font-bold">{token}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer flex-1 flex flex-col">
            <div className="flex gap-1 p-2 bg-[#d4d0c8] border-b-2 border-[#808080]">
              <TabButton
                active={activeTab === "attributes"}
                onClick={() => setActiveTab("attributes")}
                icon={<Image src="/icons/attribute.png" alt="Attributes" width={16} height={16} />}
              >
                Attributes
              </TabButton>
              <TabButton
                active={activeTab === "story"}
                onClick={() => setActiveTab("story")}
                icon={<Image src="/icons/story.png" alt="Story" width={16} height={16} />}
              >
                Story
              </TabButton>
              <TabButton
                active={activeTab === "Account"}
                onClick={() => setActiveTab("Account")}
                icon={<Image src="/icons/account.png" alt="Account" width={16} height={16} />}
              >
                Account
              </TabButton>
            </div>
            <div className="p-4 h-[240px] overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "attributes" && (
                  <motion.div
                    key="attributes"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-4 gap-3"
                  >
                    {attributes.traits.map((attr, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`${attr.bgColor} border border-[#808080] shadow-win98-inner p-3
                                          hover:shadow-win98-outer transition-shadow cursor-pointer`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-win98-inner">
                            {attr.icon}
                          </div>
                          <span className="font-bold text-sm">{attr.name}</span>
                        </div>
                        <div className="text-2xl font-bold text-center">{attr.displayValue}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                {activeTab === "story" && (
                  <motion.div
                    key="story"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="prose prose-sm max-w-none"
                  >
                    <div className="bg-[#d4d0c8] border border-[#808080] shadow-win98-inner p-4">
                      <div className="text-sm leading-relaxed">
                        {storyStore.isFetching ? (
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-300 animate-pulse rounded w-full"></div>
                            <div className="h-3 bg-gray-300 animate-pulse rounded w-3/4"></div>
                            <div className="h-3 bg-gray-300 animate-pulse rounded w-5/6"></div>
                            <div className="h-3 bg-gray-300 animate-pulse rounded w-2/3"></div>
                          </div>
                        ) : (
                          <p>{storyStore.gotchiStory || "No story available"}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === "Account" && (
                  <motion.div
                    key="Account"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="bg-[#d4d0c8] border border-[#808080] shadow-win98-inner p-3">
                      <p className="text-xs font-bold mb-1">DNA</p>
                      <p className="font-mono text-xs bg-white p-2 border border-[#808080] shadow-win98-inner break-all">
                        {attributes.dna.displayValue}
                      </p>
                    </div>
                    <div className="bg-[#d4d0c8] border border-[#808080] shadow-win98-inner p-3">
                      <p className="text-xs font-bold mb-1">Token Bound Account</p>
                      <p className="font-mono text-xs bg-white p-2 border border-[#808080] shadow-win98-inner break-all">
                        {tokenBoundAccount}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {walletStore.isConnected ? (
            <button
              className={`py-4 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] font-bold flex items-center justify-center gap-3 transition-all hover:bg-[#c0c0c0]
                ${
                  !pusName ||
                  !stakeAmount ||
                  selectedToken === null ||
                  isSummoning ||
                  isInsufficientBalance
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              onClick={handleSummon}
              disabled={
                !pusName ||
                !stakeAmount ||
                selectedToken === null ||
                isSummoning ||
                isInsufficientBalance
              }
            >
              {isSummoning ? (
                <Win98Loading text="Summoning in progress..." />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span className="text-lg">Summon Gotchipus</span>
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <div className="py-4 bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-outer flex justify-center">
              <CustomConnectButton />
            </div>
          )}
        </div>

        <Win98WarningDialog
          isOpen={showBalanceWarning}
          onClose={() => setShowBalanceWarning(false)}
          title="Insufficient Balance"
          icon={<span className="text-2xl">⚠️</span>}
          iconBgColor="#ffff80"
        >
          <p className="text-sm font-bold mb-2">You don't have enough {stakeToken} tokens</p>
          <p className="text-xs">Required: {stakeAmount} {stakeToken}</p>
          <p className="text-xs">Available: {walletStore.formattedPharos()} {stakeToken}</p>
        </Win98WarningDialog>
      </div>
    )
  }
)

export default PharosGenesisPage