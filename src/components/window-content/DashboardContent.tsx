"use client"

import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"
import {ChevronLeft, X} from "lucide-react"
import EquipSelectWindow from "./equip/EquipSelectWindow"
import { useContractWrite } from "@/hooks/useContract"
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { useToast } from "@/hooks/use-toast"
import { Win98Loading } from "@/components/ui/win98-loading";
import { GotchipusInfo } from "@/lib/types";
import { DashboardTab, EquipTab, StatsTab, WalletTab } from "./Dashboard";
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32 } from "@/lib/constant";
import { NftCard } from "@/components/gotchiSvg/NftCard";
import { checkAndCompleteTask } from "@/src/utils/taskUtils";
import useSWR from 'swr';
import WalletConnectTBA from "./Dashboard/WalletTabContent/WalletConnectTBA";
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import useResponsive from "@/hooks/useResponsive"

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
  
  const { walletStore } = useStores()
  const walletAddress = walletStore.address;
  const { toast } = useToast()
  const isMobile = useResponsive()
  
  const listApiUrl = walletAddress && activeTab === null ? `/api/tokens/gotchipus?owner=${walletAddress}&includeGotchipusInfo=false` : null;

  const { data: listData, isLoading: isListLoading } = useSWR<ListApiData>(listApiUrl, fetcher, {
    refreshInterval: 10000,
    keepPreviousData: true,
    errorRetryCount: 5,
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 2000,
  });
  
  const ids = listData?.ids || [];
  const balances = parseInt(listData?.balance || '0');

  const detailsApiUrl = selectedTokenId && walletAddress 
    ? `/api/tokens/gotchipus-details?owner=${walletAddress}&tokenId=${selectedTokenId}` 
    : null; 

  const { data: detailsData } = useSWR<DetailsApiData>(detailsApiUrl, fetcher);

  useEffect(() => {
    if (detailsData) {
      setPusName(detailsData.tokenName || "");
      setTbaAddress(detailsData.tokenBoundAccount || "");
      setTokenInfoMap(detailsData.info);
    }
  }, [detailsData]);


  const {contractWrite, isConfirmed, error} = useContractWrite();

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

        const updateTask = async () => {
          await checkAndCompleteTask(walletStore.address!, 5);
        };
        updateTask();
        walletStore.setIsTaskRefreshing(true);
      }
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
      <div className={`bg-[#d4d0c8] h-full flex items-center justify-center ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center flex flex-col items-center">
          <div className={`mb-4 ${isMobile ? 'mb-2' : ''}`}>
            <Image src="/not-any.png" alt="No NFTs" width={isMobile ? 80 : 120} height={isMobile ? 80 : 120} />
          </div>
          <h3 className={`font-bold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>No Wallet Connected</h3>
          <p className={`text-[#000080] mb-4 ${isMobile ? 'text-sm' : ''}`}>Please connect your wallet to continue.</p>
          <div
            className={`text-sm flex items-center justify-center bg-[#c0c0c0] border border-[#808080] shadow-win98-outer active:shadow-inner ${isMobile ? 'h-8' : 'h-10'}`}
          >
            <CustomConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (isListLoading) {
    return (
      <div className={`bg-[#d4d0c8] h-full flex items-center justify-center ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center">
          <Win98Loading />
          <p className={`mt-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>Loading Gotchipus...</p>
        </div>
      </div>
    );
  }

  if (balances === 0) {
    return (
      <div className={`bg-[#d4d0c8] h-full flex items-center justify-center ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center flex flex-col items-center">
          <div className={`mb-4 ${isMobile ? 'mb-2' : ''}`}>
            <Image src="/not-any.png" alt="No NFTs" width={isMobile ? 80 : 120} height={isMobile ? 80 : 120} />
          </div>
          <h3 className={`font-bold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>No NFTs Found</h3>
          <p className={`text-[#000080] mb-4 ${isMobile ? 'text-sm' : ''}`}>You don't have any Gotchipus NFTs yet.</p>
          <button
            className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm hover:bg-[#c0c0c0] ${isMobile ? 'px-4 py-1 text-sm' : 'px-6 py-2'}`}
          >
            Mint a Gotchipus
          </button>
        </div>
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div className={`bg-[#d4d0c8] h-full flex items-center justify-center ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center flex flex-col items-center">
          <div className={`mb-4 ${isMobile ? 'mb-2' : ''}`}>
            <Image src="/not-any.png" alt="No NFTs" width={isMobile ? 80 : 120} height={isMobile ? 80 : 120} />
          </div>
          <h3 className={`font-bold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>No Gotchipus Found</h3>
          <p className={`text-[#000080] mb-4 ${isMobile ? 'text-sm' : ''}`}>
            {balances > 0 ? `You holder ${balances} Pharos, But you don't summon your Gotchipus yet.` : "You don't have any Gotchipus NFTs yet."}
          </p>
        </div>
      </div>
    );
  }

  if (!selectedTokenId) {
    return (
      <div className={`bg-[#c0c0c0] h-full overflow-auto ${isMobile ? 'p-3' : 'p-6'}`}>
        <div className="flex flex-col h-full">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}>
            {getCurrentPageItems().map((id: string) => (
              <NftCard 
                key={id} 
                id={id} 
                onSelect={handleTokenSelect} 
                isMobile={isMobile}
              />
            ))}
          </div>
          
          {hasMore && (
            <div ref={observerTarget} className={`flex justify-center items-center mt-4 ${isMobile ? 'p-2' : 'p-4'}`}>
              {isLoadingMore && <Win98Loading text={isMobile ? "Loading..." : "Loading more..."} />}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#c0c0c0] h-full overflow-auto ${isMobile ? 'p-3' : 'p-6'}`}>
      <div className={`flex justify-between items-center mb-6 ${isMobile ? 'mb-4' : ''}`}>
        <div className="flex items-center">
          <button 
            onClick={handleBackToList}
            className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm hover:bg-[#c0c0c0] flex items-center mr-2 ${isMobile ? 'px-2 py-0.5 text-sm' : 'px-3 py-1'}`}
          >
            <ChevronLeft size={isMobile ? 14 : 16} className={`mr-1 ${isMobile ? 'mr-0.5' : ''}`} /> Back
          </button>
          <h2 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>Gotchipus #{selectedTokenId}</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleOpenWalletConnectTBA}
            className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm hover:bg-[#c0c0c0] flex items-center ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1'}`}
          >
            <Image src="/icons/walletconnect-logo.png" alt="Wallet" width={isMobile ? 16 : 24} height={isMobile ? 16 : 24} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
            {walletStore.isWalletConnectConnected ? `Connected to ${walletStore.connectedTarget}` : 'Connect dApp'}
          </button>
        </div>
      </div>

      <div className={`flex gap-2 mb-6 ${isMobile ? 'mb-4 flex-wrap' : ''}`}>
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] flex items-center ${
            activeTab === "dashboard" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          } ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}
        >
          <Image src="/icons/dashboard.png" alt="Dashboard" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab("equip")}
          className={`border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] flex items-center ${
            activeTab === "equip" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          } ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}
        >
          <Image src="/icons/equip.png" alt="Equip" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} /> 
          Equip
        </button>
        <button 
          onClick={() => setActiveTab("stats")}
          className={`border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] flex items-center ${
            activeTab === "stats" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          } ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}
        >
          <Image src="/icons/stats.png" alt="Stats" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
          Stats
        </button>
        <button 
          onClick={() => setActiveTab("wallet")}
          className={`border-2 border-[#808080] shadow-win98-outer rounded-sm font-medium hover:bg-[#c0c0c0] flex items-center ${
            activeTab === "wallet" ? "bg-[#c0c0c0]" : "bg-[#d4d0c8]"
          } ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}
        >
          <Image src="/icons/wallet.png" alt="Wallet" width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} className={`mr-2 ${isMobile ? 'mr-1' : ''}`} />
          Wallet
        </button>
      </div>

      {/* Tab Content */}
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
          isMobile={isMobile}
        />
      )}
      
      {activeTab === "equip" && (
        <EquipTab 
          tokenId={parseInt(selectedTokenId)}
          selectedEquipSlot={selectedEquipSlot} 
          handleEquipSlotClick={handleEquipSlotClick} 
          handleEquipWearable={handleEquipWearable} 
          isMobile={isMobile}
        />
      )}
      
      {activeTab === "stats" && (
        <StatsTab tokenInfo={tokenInfoMap} isMobile={isMobile} />
      )}
      
      {activeTab === "wallet" && (
        <WalletTab 
          tokenId={selectedTokenId} 
          tbaAddress={tbaAddress} 
          activeWalletTab={activeWalletTab} 
          setActiveWalletTab={setActiveWalletTab} 
          isMobile={isMobile}
        />
      )}

      {showEquipSelect && (
        <EquipSelectWindow
          onClose={handleEquipSelectClose}
          wearableBalances={wearableBalances}
          selectedType={selectedType}
          selectedTokenId={selectedTokenId}
          isMobile={isMobile}
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
              <WalletConnectTBA tbaAddress={tbaAddress} tokenId={selectedTokenId} handleWalletConnected={handleWalletConnected} isMobile={isMobile} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default DashboardContent;