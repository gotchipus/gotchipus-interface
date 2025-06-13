"use client"

import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"
import {ChevronLeft, RefreshCw} from "lucide-react"
import EquipSelectWindow from "./equip/EquipSelectWindow"
import { useContractRead, useContractWrite, useContractReads } from "@/hooks/useContract"
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { useToast } from "@/hooks/use-toast"
import { Win98Loading } from "@/components/ui/win98-loading";
import { parseGotchipusInfo, TokenInfo } from "@/lib/types";
import { DashboardTab, EquipTab, StatsTab, WalletTab } from "./Dashboard";
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32 } from "@/lib/constant";
import { NftCard } from "@/components/gotchiSvg/NftCard";

const EQUIPMENT_TYPES = {
  0: BG_BYTES32,
  1: BODY_BYTES32,
  2: EYE_BYTES32,
  3: HAND_BYTES32,
  4: HEAD_BYTES32,
  5: CLOTHES_BYTES32,
};

const DashboardContent = observer(() => {
  const [pusName, setPusName] = useState("")
  const [oldName, setOldName] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState("")
  const [selectedEquipSlot, setSelectedEquipSlot] = useState<number | null>(null)
  const [showEquipSelect, setShowEquipSelect] = useState(false)
  const [activeWalletTab, setActiveWalletTab] = useState<"tokens" | "nfts">("tokens")
  const [balances, setBalances] = useState<number>(0)
  const [ids, setIds] = useState<string[]>([])
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"dashboard" | "equip" | "stats" | "wallet">("dashboard")
  const [tokenInfoMap, setTokenInfoMap] = useState<Record<string, TokenInfo>>({})
  const [tbaAddress, setTbaAddress] = useState("")
  const [queryIds, setQueryIds] = useState<string[]>([])
  const [accValidIds, setAccValidIds] = useState<string[]>([])
  const [oneCheckInfo, setOneCheckInfo] = useState<boolean>(false)
  
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage] = useState<number>(12)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const [wearableBalances, setWearableBalances] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>("")

  const { walletStore, wearableStore } = useStores()
  const { toast } = useToast()

  const {data: balance} = useContractRead("balanceOf", [walletStore.address]);
  const {data: allIds} = useContractRead("allTokensOfOwner", [walletStore.address], { enabled: !!balance });
  const {data: tokenBoundAccount} = useContractRead("account", [selectedTokenId || 0], { enabled: !!selectedTokenId });

  const tokenInfos = useContractReads(
    "ownedTokenInfo",
    queryIds.map(id => [walletStore.address, id]),
    { enabled: queryIds.length > 0 && !oneCheckInfo }
  );
  
  useEffect(() => {
    if (balance !== undefined) {
      setBalances(balance as number);
    }
  }, [balance]);

  useEffect(() => {
    if (allIds) {
      const fetchedIds = allIds as string[];
      setIds(fetchedIds);
      setQueryIds(fetchedIds);

      setAccValidIds([]);
      setOneCheckInfo(false);
      setIsLoading(false);
    }
  }, [allIds]);

  useEffect(() => {
    if (!oneCheckInfo && tokenInfos) {

      const failedIds: string[] = [];
      const updatedAcc: string[] = [...accValidIds];
      const newTokenInfoMap: Record<string, TokenInfo> = {};

      for (let idx = 0; idx < tokenInfos.length; idx++) {
        const raw = tokenInfos[idx];
        const thisId = queryIds[idx];

        if (!raw || raw.result === undefined) {
          failedIds.push(thisId);
          continue;
        }

        let parsed;
        try {
          parsed = parseGotchipusInfo(raw);
        } catch (err) {
          failedIds.push(thisId);
          continue;
        }

        if (!parsed) {
          failedIds.push(thisId);
          continue;
        }

        if (parsed.status === 1) {
          if (!updatedAcc.includes(thisId)) {
            updatedAcc.push(thisId);
            newTokenInfoMap[thisId] = parsed;
          }
        }
      }

      setAccValidIds(updatedAcc);
      setTokenInfoMap(newTokenInfoMap);

      if (failedIds.length > 0) {
        setQueryIds(failedIds);
        return;
      }

      setIds(updatedAcc);
      setOneCheckInfo(true);
    }
  }, [tokenInfos, queryIds, oneCheckInfo, accValidIds]);

  useEffect(() => {
    if (tokenBoundAccount !== undefined) {
      setTbaAddress(tokenBoundAccount as string);
    }
  }, [tokenBoundAccount]);

  const {data: tokenName} = useContractRead("getTokenName", [selectedTokenId || 0]);

  useEffect(() => {
    if (tokenName !== undefined) {
      setPusName(tokenName as string);
    }
  }, [tokenName]);

  const {contractWrite, isConfirmed, isConfirming, isPending, error, receipt} = useContractWrite();

  const handlePet = () => {
    if (!selectedTokenId) return;
    contractWrite("pet", [selectedTokenId]);
    toast({
      title: "Submited Transaction",
      description: "Transaction submitted successfully",
    })
  }

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })
    }
  }, [isConfirmed]);


  const handleRename = () => {
    if (!selectedTokenId) return;
    
    if (newName.trim()) {
      setOldName(pusName)
      setPusName(newName.trim())
      contractWrite("setName", [newName.trim(), selectedTokenId]);
      toast({
        title: "Submited Transaction",
        description: "Transaction submitted successfully",
      })
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsRenaming(false);
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (error && isRenaming) {
      setIsRenaming(false);
      setPusName(oldName)
      toast({
        title: "Transaction Cancelled",
        description: "Transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, isRenaming]);

  const handleEquipSlotClick = (index: number) => {
    setSelectedEquipSlot(index === selectedEquipSlot ? null : index)
    setSelectedType(EQUIPMENT_TYPES[index as keyof typeof EQUIPMENT_TYPES])
    setShowEquipSelect(true)
  };
  
  const handleEquipSelectClose = () => {
    setShowEquipSelect(false);
    setSelectedEquipSlot(null);
  };

  const handleEquipWearable = (ids: string[]) => {
    setWearableBalances(ids);
  };

  const handleTokenSelect = (tokenId: string) => {
    setSelectedTokenId(tokenId);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const floatAnimation = {
    y: [0, -3, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const getCurrentPageItems = useCallback(() => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    return ids.slice(startIndex, endIndex);
  }, [ids, currentPage, itemsPerPage]);

  const loadMoreItems = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const totalPages = Math.ceil(ids.length / itemsPerPage);
      
      setCurrentPage(nextPage);
      setHasMore(nextPage < totalPages);
      setIsLoadingMore(false);
    }, 500);
  }, [currentPage, hasMore, ids.length, itemsPerPage, isLoadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoadingMore, loadMoreItems]);

  useEffect(() => {
    if (ids.length > 0) {
      setCurrentPage(1);
      setHasMore(ids.length > itemsPerPage);
    }
  }, [ids, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="p-6 bg-[#d4d0c8] h-full flex items-center justify-center">
        <div className="text-center">
          <Win98Loading />
          <p className="mt-4 text-sm">Loading Gotchipus...</p>
        </div>
      </div>
    );
  }

  if (balances === 0) {
    return (
      <div className="p-6 bg-[#d4d0c8] h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Image src="not-any.png" alt="No NFTs" width={120} height={120} />
          </div>
          <h3 className="text-xl font-bold mb-2">No NFTs Found</h3>
          <p className="text-[#000080] mb-4">You don't have any Gotchipus NFTs yet.</p>
          <button
            className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm px-6 py-2 hover:bg-[#c0c0c0]"
          >
            Mint a Gotchipus
          </button>
        </div>
      </div>
    );
  }

  // NFT selection view
  if (!selectedTokenId) {
    return (
      <div className="p-6 bg-[#c0c0c0] h-full overflow-auto">
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {getCurrentPageItems().map((id) => (
              <NftCard 
                key={id} 
                id={id} 
                onSelect={handleTokenSelect} 
              />
            ))}
          </div>
          
          {/* Loading indicator and observer target */}
          {hasMore && getCurrentPageItems().length > 0 && (
            <div 
              ref={observerTarget} 
              className="flex justify-center items-center p-4 mt-4"
            >
              {isLoadingMore ? (
                <div className="text-center">
                  <Win98Loading />
                  <p className="mt-2 text-sm">Loading more Gotchipus NFTs...</p>
                </div>
              ) : (
                <div className="h-8"></div> 
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detailed view for selected NFT
  return (
    <div className="p-6 bg-[#c0c0c0] h-full overflow-auto">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => setSelectedTokenId(null)}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm px-3 py-1 hover:bg-[#c0c0c0] flex items-center mr-2"
          >
            <ChevronLeft size={16} className="mr-1" /> Back
          </button>
          <h2 className="text-xl font-bold">Gotchipus #{selectedTokenId}</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm px-3 py-1 hover:bg-[#c0c0c0] flex items-center"
          >
            <RefreshCw size={16} className="mr-1" /> Refresh
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] flex items-center ${
            activeTab === "dashboard" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          }`}
        >
          <Image src="/icons/dashboard.png" alt="Dashboard" width={18} height={18} className="mr-2" />
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab("equip")}
          className={`px-4 py-2 border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] flex items-center ${
            activeTab === "equip" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          }`}
        >
          <Image src="/icons/equip.png" alt="Equip" width={18} height={18} className="mr-2" /> 
          Equip
        </button>
        <button 
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] flex items-center ${
            activeTab === "stats" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          }`}
        >
          <Image src="/icons/stats.png" alt="Stats" width={18} height={18} className="mr-2" />
          Stats
        </button>
        <button 
          onClick={() => setActiveTab("wallet")}
          className={`px-4 py-2 border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] flex items-center ${
            activeTab === "wallet" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          }`}
        >
          <Image src="/icons/wallet.png" alt="Wallet" width={18} height={18} className="mr-2" />
          Wallet
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <DashboardTab 
          selectedTokenId={selectedTokenId}
          pusName={pusName}
          isRenaming={isRenaming}
          newName={newName}
          setNewName={setNewName}
          setIsRenaming={setIsRenaming}
          handleRename={handleRename}
          handlePet={handlePet}
          tokenInfoMap={tokenInfoMap}
          floatAnimation={floatAnimation}
        />
      )}

      {/* Equip Tab */}
      {activeTab === "equip" && (
        <EquipTab 
          tokenId={parseInt(selectedTokenId)}
          selectedEquipSlot={selectedEquipSlot}
          handleEquipSlotClick={handleEquipSlotClick}
          handleEquipWearable={handleEquipWearable}
        />
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <StatsTab 
          selectedTokenId={selectedTokenId}
          tokenInfoMap={tokenInfoMap}
          tbaAddress={tbaAddress}
        />
      )}

      {/* Wallet Tab */}
      {activeTab === "wallet" && (
        <WalletTab 
          activeWalletTab={activeWalletTab}
          setActiveWalletTab={setActiveWalletTab}
          ids={ids}
          selectedTokenId={selectedTokenId}
          handleTokenSelect={handleTokenSelect}
          tbaAddress={tbaAddress}
        />
      )}

      {showEquipSelect && (
        <EquipSelectWindow
          onClose={handleEquipSelectClose}
          wearableBalances={wearableBalances}
          selectedType={selectedType}
          selectedTokenId={selectedTokenId}
        />
      )}
    </div>
  )
});

export default DashboardContent;