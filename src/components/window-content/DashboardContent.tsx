"use client"

import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"
import {ChevronLeft, X} from "lucide-react"
import EquipSelectWindow from "./equip/EquipSelectWindow"
import { useContractWrite, useContractRead } from "@/hooks/useContract"
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { useToast } from "@/hooks/use-toast"
import { Win98Loading } from "@/components/ui/win98-loading";
import { GotchipusInfo, EquipWearableType } from "@/lib/types";
import { DashboardTab, EquipTab, StatsTab, WalletTab } from "./Dashboard";
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32, FACE_BYTES32, MOUTH_BYTES32 } from "@/lib/constant";
import { NftCard } from "@/components/gotchiSvg/NftCard";
import { checkAndCompleteTask } from "@/src/utils/taskUtils";
import useSWR from 'swr';
import WalletConnectTBA from "./Dashboard/WalletTabContent/WalletConnectTBA";
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import { useWindowMode, getGridColumns } from "@/hooks/useWindowMode"
import { dispatchWindowOpenEvent } from "@/lib/windowEvents"

interface ListApiData {
  balance: string;
  ids: string[];
  filteredIds?: string[];
}

interface DetailsApiData {
  info: GotchipusInfo;
  tokenBoundAccount: string | null;
  tokenName: string | null;
}

const EQUIPMENT_TYPES = {
  0: BG_BYTES32,
  1: BODY_BYTES32,
  2: EYE_BYTES32,
  3: HAND_BYTES32,
  4: HEAD_BYTES32,
  5: CLOTHES_BYTES32,
  6: FACE_BYTES32,
  7: MOUTH_BYTES32,
};

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
});

const DashboardContent = observer(() => {
  const [pusName, setPusName] = useState("")
  const [oldName, setOldName] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState("")
  const [selectedEquipSlot, setSelectedEquipSlot] = useState<number | null>(null)
  const [showEquipSelect, setShowEquipSelect] = useState(false)
  const [activeWalletTab, setActiveWalletTab] = useState<"tokens" | "nfts" | "call">("tokens")
  const [selectedTokenId, setSelectedTokenId] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"dashboard" | "equip" | "stats" | "wallet" | null>(null)
  const [tokenInfoMap, setTokenInfoMap] = useState<GotchipusInfo>({} as GotchipusInfo)
  const [tbaAddress, setTbaAddress] = useState("")

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const [wearableBalances, setWearableBalances] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [isPetWriting, setIsPetWriting] = useState<boolean>(false)
  const [showWalletConnectTBA, setShowWalletConnectTBA] = useState<boolean>(false)
  const [petSuccessTimestamp, setPetSuccessTimestamp] = useState<number>(0)
  
  const { walletStore, wearableStore } = useStores()
  const walletAddress = walletStore.address;
  const { toast } = useToast()
  const { mode: windowMode, width: windowWidth } = useWindowMode()
  const isMobileMode = windowMode === 'mobile' || (windowWidth !== null && windowWidth <= 640)
  const gridCols = Math.min(getGridColumns(windowWidth), 6) // Max 6 columns for gotchi grid

  const listApiUrl = walletAddress && activeTab === null ? `/api/tokens/gotchipus?owner=${walletAddress}&includeGotchipusInfo=false` : null;

  const { data: listData, isLoading: isListLoading, mutate: mutateListData } = useSWR<ListApiData>(listApiUrl, fetcher, {
    refreshInterval: 30000,
    keepPreviousData: true,
    errorRetryCount: 5,
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
  });
  
  const ids = listData?.ids || [];
  const balances = parseInt(listData?.balance || '0');

  const detailsApiUrl = selectedTokenId && walletAddress 
    ? `/api/tokens/gotchipus-details?owner=${walletAddress}&tokenId=${selectedTokenId}` 
    : null; 

  const { data: detailsData, mutate: mutateDetailsData } = useSWR<DetailsApiData>(detailsApiUrl, fetcher);
  
  useEffect(() => {
    if (selectedTokenId) {
      setPusName("");
      setTbaAddress("");
      setTokenInfoMap({} as GotchipusInfo);
    }
  }, [selectedTokenId]);
  
  useEffect(() => {
    if (detailsData) {
      setPusName(detailsData.tokenName || "");
      setTbaAddress(detailsData.tokenBoundAccount || "");
      setTokenInfoMap(detailsData.info);
      if (detailsData.tokenBoundAccount && selectedTokenId) {
        walletStore.setTokenBoundAccount(selectedTokenId, detailsData.tokenBoundAccount);
      }
    }
  }, [detailsData, selectedTokenId, walletStore]);

  useEffect(() => {
    if (listApiUrl && !selectedTokenId) {
      mutateListData();
    }
  }, [walletAddress, listApiUrl, selectedTokenId, mutateListData]);

  const {contractWrite, isConfirmed, error} = useContractWrite();

  const { data: wearableTypeInfos, isLoading: isLoadingWearables, error: wearablesError, refetch: refetchWearables } = useContractRead(
    "getAllEquipWearableType",
    selectedTokenId ? [selectedTokenId] : undefined,
    { enabled: !!selectedTokenId }
  ) as { data: EquipWearableType[] | undefined; isLoading: boolean; error: Error | null; refetch: () => void };

  const handlePet = () => {
    if (!selectedTokenId) return;
    setIsPetWriting(true);
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

      if (isPetWriting) {
        setIsPetWriting(false);
        setPetSuccessTimestamp(Date.now());

        // Refresh token info data after petting
        if (mutateDetailsData) {
          mutateDetailsData();
        }

        const updateTask = async () => {
          await checkAndCompleteTask(walletStore.address!, 5);
        };
        updateTask();
        walletStore.setIsTaskRefreshing(true);
      }
    }
  }, [isConfirmed, isPetWriting, mutateDetailsData, walletStore]);


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
    if (isConfirmed && isRenaming) {
      setIsRenaming(false);
      
      // Refresh token info data after renaming
      if (mutateDetailsData) {
        mutateDetailsData();
      }
      
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })
    }
  }, [isConfirmed, isRenaming, mutateDetailsData]);

  useEffect(() => {
    if (error && isRenaming) {
      setIsRenaming(false);
      setPusName(oldName);
      toast({
        title: "Transaction Cancelled",
        description: "Transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, isRenaming]);

  useEffect(() => {
    if (error && isPetWriting) {
      setIsPetWriting(false);
      toast({
        title: "Transaction Cancelled",
        description: "Transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, isPetWriting]);

  // Refresh wearable data when wearableStore.isRefreshing is true
  useEffect(() => {
    if (wearableStore.isRefreshing && selectedTokenId && refetchWearables) {
      refetchWearables();
      // Reset the refresh flag after a short delay to allow the refetch to complete
      setTimeout(() => {
        wearableStore.setIsRefreshing(false);
      }, 1000);
    }
  }, [wearableStore.isRefreshing, selectedTokenId, refetchWearables, wearableStore]);

  const handleEquipSlotClick = (index: number) => {
    setSelectedEquipSlot(index === selectedEquipSlot ? null : index)
    setSelectedType(EQUIPMENT_TYPES[index as keyof typeof EQUIPMENT_TYPES])
    setShowEquipSelect(true)
  };
  
  const handleEquipSelectClose = () => {
    setShowEquipSelect(false);
    setSelectedEquipSlot(null);
  };

  const handleWalletConnectTBAClose = () => {
    setShowWalletConnectTBA(false);
  };

  const handleWalletConnected = (isConnected: boolean, target: string) => {
    if (!isConnected) {
      setShowWalletConnectTBA(false);
    }
  };

  const handleOpenWalletConnectTBA = () => {
    setShowWalletConnectTBA(true);
  };

  const handleEquipWearable = (ids: string[]) => {
    setWearableBalances(ids);
  };

  const handleTokenSelect = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setActiveTab("dashboard");
  };

  const handleBackToList = () => {
    setSelectedTokenId("");
    setCurrentPage(1);
    mutateListData(undefined, { revalidate: true });
  };
  

  const itemsPerPage = 12;
  const hasMore = (currentPage * itemsPerPage) < ids.length;

  const loadMoreItems = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prevPage => prevPage + 1);
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMore]);

  const getCurrentPageItems = useCallback(() => {
    return ids.slice(0, currentPage * itemsPerPage);
  }, [ids, currentPage, itemsPerPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => { if (target) observer.unobserve(target) };
  }, [hasMore, isLoadingMore, loadMoreItems]);


  if (!walletAddress) {
    return (
      <div className="p-4 h-full scrollbar-none flex justify-center items-center">
        <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer max-w-md w-full">
          <div className="bg-[#000080] text-white px-2 py-1 flex items-center border-b-2 border-[#808080]">
            <span className="text-xs font-bold">Wallet Connection Required</span>
          </div>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="mb-4">
              <Image src="/not-any.png" alt="No Wallet" width={80} height={80} />
            </div>
            <h3 className="text-lg font-bold mb-2">No Wallet Connected</h3>
            <p className="text-sm text-[#000080] mb-4">Please connect your wallet to view your Gotchipus collection.</p>
            <div className="mt-2">
              <CustomConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isListLoading) {
    return (
      <div className="p-4 h-full scrollbar-none flex justify-center items-center">
        <Win98Loading />
      </div>
    );
  }

  if (balances === 0) {
    return (
      <div className="p-4 h-full scrollbar-none flex flex-col items-center justify-center gap-6">
        <div className="flex-shrink-0">
          <Image
            src="/not-any.png"
            alt="No Pharos"
            width={150}
            height={150}
            className="drop-shadow-lg"
          />
        </div>

        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#000080] flex items-center gap-2 justify-center">
            Start Your Journey
          </h2>
          <p className="text-sm text-[#404040]">
            You need to own Pharos NFTs to summon and manage Gotchipus. Get started by visiting the Pharos collection.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => dispatchWindowOpenEvent("pharos")}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#000080] text-white px-6 py-3 text-sm font-bold rounded-none hover:bg-[#1a3a99] active:shadow-win98-inner transition-all"
          >
            Go to My Pharos
          </button>
          <button
            onClick={() => dispatchWindowOpenEvent("mint")}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] text-[#000080] px-6 py-3 text-sm font-bold rounded-none hover:bg-[#c0c0c0] active:shadow-win98-inner transition-all"
          >
            Mint Pharos
          </button>
        </div>
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="p-4 h-full scrollbar-none flex flex-col items-center justify-center gap-6">
        <div className="flex-shrink-0">
          <Image
            src="/not-any.png"
            alt="No Gotchipus"
            width={150}
            height={150}
            className="drop-shadow-lg"
          />
        </div>

        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#000080] flex items-center gap-2 justify-center">
            Ready to Summon?
          </h2>
          <p className="text-sm text-[#404040]">
            {balances > 0
              ? `You hold ${balances} Pharos, but you haven't summoned your Gotchipus yet. Head to the Pharos collection to begin the summoning ritual.`
              : "You don't have any Gotchipus NFTs yet. Get started by visiting the Pharos collection."}
          </p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => dispatchWindowOpenEvent("pharos")}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#000080] text-white px-6 py-3 text-sm font-bold rounded-none hover:bg-[#1a3a99] active:shadow-win98-inner transition-all"
          >
            Go to Pharos
          </button>
          <button
            onClick={() => dispatchWindowOpenEvent("mint")}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] text-[#000080] px-6 py-3 text-sm font-bold rounded-none hover:bg-[#c0c0c0] active:shadow-win98-inner transition-all"
          >
            Learn More
          </button>
        </div>
      </div>
    );
  }

  if (!selectedTokenId) {
    return (
      <div className="p-4 h-full scrollbar-none">
        <div className="flex flex-col h-full">
          <div className="mb-2 px-1">
            <div className="win98-group-box bg-[#c0c0c0]">
              <div className="win98-group-title text-xs font-bold text-[#000080]">Gotchipus Collection</div>
              <div className="text-xs text-[#808080] mt-1">
                Click on any Gotchipus to view details
              </div>
            </div>
          </div>
          <div className={`grid scrollbar-none ${isMobileMode ? 'gap-2' : 'gap-4'}`} style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
            {getCurrentPageItems().map((id: string) => (
              <NftCard
                key={id}
                id={id}
                onSelect={handleTokenSelect}
                isMobile={isMobileMode}
              />
            ))}
          </div>
          
          {hasMore && getCurrentPageItems().length > 0 && (
            <div 
              ref={observerTarget} 
              className="flex justify-center items-center p-4 mt-4"
            >
              {isLoadingMore ? (
                <div className="text-center bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-4">
                  <Win98Loading text="Loading..."/>
                  <p className="mt-2 text-xs">Loading more Gotchipus NFTs...</p>
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

  return (
    <div className="p-4 h-full scrollbar-none">
      <div className={`flex justify-between items-center mb-4 ${isMobileMode ? 'mb-3 flex-wrap gap-2' : ''}`}>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleBackToList}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-none hover:bg-[#c0c0c0] active:shadow-win98-inner flex items-center justify-center text-xs font-bold px-4 py-2"
          >
            <ChevronLeft size={14} className="mr-1" /> 
            Back
          </button>
          <div className="text-center text-sm font-bold text-[#000080] px-3 py-1 bg-white border border-[#808080] shadow-win98-inner">
            Gotchipus #{selectedTokenId}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleOpenWalletConnectTBA}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-none hover:bg-[#c0c0c0] active:shadow-win98-inner flex items-center justify-center text-xs font-bold px-3 py-1.5"
          >
            <Image src="/icons/walletconnect-logo.png" alt="Wallet" width={16} height={16} className="mr-1.5" />
            {walletStore.isWalletConnectConnected ? `Connected` : 'Connect dApp'}
          </button>
        </div>
      </div>

      <div className={`flex gap-2 mb-4 ${isMobileMode ? 'mb-3 flex-wrap' : ''}`}>
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`border-2 border-[#808080] shadow-win98-outer rounded-none font-bold text-xs hover:bg-[#c0c0c0] active:shadow-win98-inner flex items-center justify-center ${
            activeTab === "dashboard" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          } px-4 py-2`}
        >
          <Image src="/icons/dashboard.png" alt="Dashboard" width={16} height={16} className="mr-1.5" />
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab("equip")}
          className={`border-2 border-[#808080] shadow-win98-outer rounded-none font-bold text-xs hover:bg-[#c0c0c0] active:shadow-win98-inner flex items-center justify-center ${
            activeTab === "equip" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          } px-4 py-2`}
        >
          <Image src="/icons/equip.png" alt="Equip" width={16} height={16} className="mr-1.5" /> 
          Equip
        </button>
        <button 
          onClick={() => setActiveTab("stats")}
          className={`border-2 border-[#808080] shadow-win98-outer rounded-none font-bold text-xs hover:bg-[#c0c0c0] active:shadow-win98-inner flex items-center justify-center ${
            activeTab === "stats" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          } px-4 py-2`}
        >
          <Image src="/icons/stats.png" alt="Stats" width={16} height={16} className="mr-1.5" />
          Stats
        </button>
        <button 
          onClick={() => setActiveTab("wallet")}
          className={`border-2 border-[#808080] shadow-win98-outer rounded-none font-bold text-xs hover:bg-[#c0c0c0] active:shadow-win98-inner flex items-center justify-center ${
            activeTab === "wallet" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          } px-4 py-2`}
        >
          <Image src="/icons/wallet.png" alt="Wallet" width={16} height={16} className="mr-1.5" />
          Wallet
        </button>
      </div>

      {activeTab === "dashboard" && (
        <DashboardTab 
          selectedTokenId={selectedTokenId}
          tokenInfo={tokenInfoMap} 
          pusName={pusName} 
          newName={newName} 
          setNewName={setNewName} 
          isRenaming={isRenaming} 
          setIsRenaming={setIsRenaming} 
          handleRename={handleRename} 
          handlePet={handlePet} 
          isPetWriting={isPetWriting}
          isMobile={isMobileMode}
          petSuccessTimestamp={petSuccessTimestamp}
          wearableTypeInfos={wearableTypeInfos}
          isLoadingWearables={isLoadingWearables}
          wearablesError={wearablesError}
        />
      )}
      
      {activeTab === "equip" && (
        <EquipTab 
          tokenId={parseInt(selectedTokenId)}
          selectedEquipSlot={selectedEquipSlot} 
          handleEquipSlotClick={handleEquipSlotClick} 
          handleEquipWearable={handleEquipWearable} 
          isMobile={isMobileMode}
          wearableTypeInfos={wearableTypeInfos}
          isLoadingWearables={isLoadingWearables}
          wearablesError={wearablesError}
        />
      )}
      
      {activeTab === "stats" && (
        <StatsTab tokenInfo={tokenInfoMap} tokenId={selectedTokenId} isMobile={isMobileMode} />
      )}
      
      {activeTab === "wallet" && (
        <WalletTab 
          tokenId={selectedTokenId} 
          tbaAddress={tbaAddress} 
          activeWalletTab={activeWalletTab} 
          setActiveWalletTab={setActiveWalletTab} 
          isMobile={isMobileMode}
        />
      )}

      {showEquipSelect && (
        <EquipSelectWindow
          onClose={handleEquipSelectClose}
          wearableBalances={wearableBalances}
          selectedType={selectedType}
          selectedTokenId={selectedTokenId}
          isMobile={isMobileMode}
        />
      )}

      {showWalletConnectTBA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="border-b-2 border-[#808080] bg-[#000080] text-white p-2 flex justify-between items-center">
              {walletStore.isWalletConnectConnected ? (
                <div className="flex items-center">
                  <Image src="/icons/walletconnect-logo.png" alt="Wallet" width={24} height={24} className="mr-2" />
                  <span className="font-bold">Connected to {walletStore.connectedTarget}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Image src="/icons/walletconnect-logo.png" alt="Wallet" width={24} height={24} className="mr-2" />
                  <span className="font-bold">Connect dApp</span>
                </div>
              )}
              <button 
                onClick={handleWalletConnectTBAClose}
                className="w-6 h-6 bg-[#c0c0c0] border border-[#808080] shadow-win98-outer flex items-center justify-center hover:bg-[#d4d0c8]"
              >
                <X size={16} className="text-black" />
              </button>
            </div>
            <div className="p-4">
              <WalletConnectTBA tbaAddress={tbaAddress} tokenId={selectedTokenId} handleWalletConnected={handleWalletConnected} isMobile={isMobileMode} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default DashboardContent;