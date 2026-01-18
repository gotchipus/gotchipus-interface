'use client'

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import PharosGenesisPage from "./pharos/PharosGenesisPage";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { Win98Loading } from "@/components/ui/win98-loading";
import useSWR from 'swr';
import { useWindowMode, getGridColumns } from "@/hooks/useWindowMode";
import { dispatchWindowOpenEvent } from "@/lib/windowEvents";
import { getERC6551AccountSalt, getTraitsIndex } from "@/src/utils/contractHepler"
import { CHAIN_ID, ZERO_ADDRESS } from "@/lib/constant"
import { PUS_ADDRESS, ERC6551_ACCOUNT_IMPLEMENTATION_ADDRESS } from "@/src/app/blockchain"
import { useERC6551Read } from "@/hooks/useContract"
import GotchiSvg from "@/src/components/gotchiSvg/GotchiSvg"

interface GotchipusPreview {
  id: string;
  traitsIndex: number[];
  image: string | JSX.Element;
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
});

const MyPharosContent = observer(() => {
  const [viewState, setViewState] = useState<"list" | "genesis">("list");
  const [selectedPharos, setSelectedPharos] = useState<string | null>(null);
  const [ids, setIds] = useState<string[]>([]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [gotchipusPreviews, setGotchipusPreviews] = useState<GotchipusPreview[]>([]);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number>(-1);
  const [isGeneratingPreviews, setIsGeneratingPreviews] = useState<boolean>(false);
  const [tokenBoundAccount, setTokenBoundAccount] = useState(ZERO_ADDRESS)
  const [dna, setDna] = useState("0")
  const { walletStore, storyStore } = useStores();
  const { mode: windowMode, width: windowWidth } = useWindowMode()
  const gridCols = getGridColumns(windowWidth)

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [storyCache, setStoryCache] = useState<Record<string, { name: string; story: string }>>({});

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const salt = getERC6551AccountSalt(CHAIN_ID, Number(selectedPharos as string))

  const accountData = useERC6551Read("account", [
    ERC6551_ACCOUNT_IMPLEMENTATION_ADDRESS,
    salt,
    CHAIN_ID,
    PUS_ADDRESS,
    Number(selectedPharos as string),
  ])
  
  useEffect(() => {
    if (accountData) {
      setTokenBoundAccount(accountData as string)
      const dnaValue = salt ? BigInt(salt).toString() : "0"
      setDna(dnaValue)
    }
  }, [accountData, salt])

  const apiUrl = walletStore.isConnected && walletStore.address 
    ? `/api/tokens/pharos?owner=${walletStore.address}&includePharosInfo=false&format=simple` 
    : null;

  const { data: filteredIds, error, isLoading: isInitialLoading, mutate } = useSWR<string[]>(apiUrl, fetcher, {
    refreshInterval: viewState === 'list' ? 30000 : 0,
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (filteredIds) {
      setIds(filteredIds);
    }
  }, [filteredIds]);

  useEffect(() => {
    if (apiUrl && viewState === 'list') {
      mutate();
    }
  }, [walletStore.address, walletStore.isConnected, apiUrl, viewState, mutate]);

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

  const generateGotchipusPreviews = useCallback(async (pharoId: string) => {
    setIsGeneratingPreviews(true);
    try {

      const previews = Array(5).fill(0).map((item, index) => {
        const currentTraitsIndex = getTraitsIndex(Number(pharoId), tokenBoundAccount, `${walletStore.address}`, index);
        return  {
          id: `${pharoId}-${index}`,
          traitsIndex: currentTraitsIndex,
          image: (
            <GotchiSvg
              bgIndex={currentTraitsIndex[0]}
              bodyIndex={currentTraitsIndex[1]}
              eyeIndex={currentTraitsIndex[2]}
            />
          )
        };
      });

      setGotchipusPreviews(previews);

    } catch (err) {
      console.error("Failed to generate previews:", err);
    } finally {
      setIsGeneratingPreviews(false);
    }
  }, [tokenBoundAccount, walletStore.address]);

  useEffect(() => {
    if (viewState === "genesis" && selectedPharos && tokenBoundAccount !== ZERO_ADDRESS) {
      generateGotchipusPreviews(selectedPharos);
    }
  }, [viewState, selectedPharos, tokenBoundAccount, generateGotchipusPreviews]);

  const handleSelectPreview = (index: number) => {
    setSelectedPreviewIndex(index);
    storyStore.setIsFetching(true);
  };

  const handlePreviewSwitchInGenesis = async (index: number) => {
    setSelectedPreviewIndex(index);

    const cacheKey = `${selectedPharos}-${index}`;
    const cached = storyCache[cacheKey];

    if (cached) {
      storyStore.setGotchiName(cached.name);
      storyStore.setGotchiStory(cached.story);
      storyStore.setIsFetching(false);
      return;
    }

    storyStore.setIsFetching(true);

    try {
      const response = await fetch('/api/story/stream');

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is empty');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamBuffer = '';
      let nameExtracted = '';
      let storyExtracted = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        streamBuffer += chunk;

        if (!nameExtracted) {
          const nameMatch = streamBuffer.match(/"name":\s*"([^"]+)"/);
          if (nameMatch) {
            nameExtracted = nameMatch[1];
            storyStore.setGotchiName(nameExtracted);
          }
        }

        const storyMatch = streamBuffer.match(/"story":\s*"([^"]+)"/);
        if (storyMatch) {
          storyExtracted = storyMatch[1];
          storyStore.setGotchiStory(storyExtracted);
        }
      }

      if (!nameExtracted || !storyExtracted) {
        const finalNameMatch = streamBuffer.match(/"name":\s*"([^"]+)"/);
        const finalStoryMatch = streamBuffer.match(/"story":\s*"([^"]+)"/);

        if (finalNameMatch && !nameExtracted) {
          storyStore.setGotchiName(finalNameMatch[1]);
          nameExtracted = finalNameMatch[1];
        }
        if (finalStoryMatch) {
          storyStore.setGotchiStory(finalStoryMatch[1]);
          storyExtracted = finalStoryMatch[1];
        }
      }

      setStoryCache(prev => ({
        ...prev,
        [cacheKey]: { name: nameExtracted || `Gotchipus #${index + 1}`, story: storyExtracted || "" }
      }));

    } catch (error) {
      console.error('Failed to fetch story data:', error);
      const fallback = { name: `Gotchipus #${index + 1}`, story: "Failed to load story. Please try again." };
      storyStore.setGotchiName(fallback.name);
      storyStore.setGotchiStory(fallback.story);
      setStoryCache(prev => ({ ...prev, [cacheKey]: fallback }));
    } finally {
      storyStore.setIsFetching(false);
    }
  };

  useEffect(() => {
    if (viewState === "genesis" && selectedPharos && gotchipusPreviews.length > 0 && selectedPreviewIndex < 0) {
      handlePreviewSwitchInGenesis(0);
    }
  }, [viewState, selectedPharos, gotchipusPreviews, selectedPreviewIndex]);

  const handlePharoClick = useCallback((pharoId: string) => {
    setSelectedPharos(pharoId);
    setViewState("genesis");
    setSelectedPreviewIndex(-1);
    setGotchipusPreviews([]);
    setStoryCache({});
  }, []);

  const handleBack = useCallback(() => {
    setViewState("list");
    mutate(undefined, { revalidate: true });
  }, [mutate]);


  if (isInitialLoading) {
    return (
      <div className="p-4 h-full scrollbar-none flex justify-center items-center">
        <Win98Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 h-full scrollbar-none flex justify-center items-center">
        <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer max-w-md w-full">
          <div className="bg-[#000080] text-white px-2 py-1 flex items-center border-b-2 border-[#808080]">
            <span className="text-xs font-bold">Error</span>
          </div>
          <div className="p-6 flex flex-col items-center">
            <div className="mb-4 text-center">
              <p className="text-sm font-bold mb-2">Failed to load NFTs</p>
              <p className="text-xs text-[#808080]">An error occurred while fetching data.</p>
            </div>
            <button 
              onClick={() => mutate()}
              className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-4 py-2 text-xs font-bold hover:bg-[#c0c0c0] active:shadow-win98-inner"
            >
              Retry
            </button>
          </div>
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
            alt="No Pharos"
            width={150}
            height={150}
            className="drop-shadow-lg"
          />
        </div>

        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#000080] flex items-center gap-2 justify-center">
            Collect Your First Pharos
          </h2>
          <p className="text-sm text-[#404040]">
            You don't have any Pharos NFTs yet. Mint your first Pharos to unlock new adventures with your Gotchipus.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => dispatchWindowOpenEvent("mint")}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#000080] text-white px-6 py-3 text-sm font-bold rounded-none hover:bg-[#1a3a99] active:shadow-win98-inner transition-all"
          >
            Mint Pharos
          </button>
          <button
            onClick={() => dispatchWindowOpenEvent("dashboard")}
            className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] text-[#000080] px-6 py-3 text-sm font-bold rounded-none hover:bg-[#c0c0c0] active:shadow-win98-inner transition-all"
          >
            View Gotchipus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full scrollbar-none">
      {viewState === "list" && (
        <div className="flex flex-col h-full">
          <div className="mb-2 px-1">
            <div className="win98-group-box bg-[#c0c0c0]">
              <div className="win98-group-title text-xs font-bold text-[#000080]">Pharos Collection</div>
              <div className="text-xs text-[#808080] mt-1">
                Click on any Pharos to summon Gotchipus variants
              </div>
            </div>
          </div>
          <div className="grid gap-4 scrollbar-none" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
            {ids && ids.length > 0 && (
              getCurrentPageItems().map((id, index) => (
                <motion.div
                  key={id + index}
                  className="bg-[#c0c0c0] flex flex-col items-center justify-center cursor-pointer border-2 border-[#808080] shadow-win98-outer rounded-none p-2 hover:border-dashed hover:border-[#000080] transition-all"
                  onClick={() => handlePharoClick(id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative w-full aspect-square mb-2 bg-white/30 border-2 border-[#808080] shadow-win98-inner p-2">
                    <Image 
                      src="/pharos-summon.gif" 
                      alt="Pharos" 
                      fill
                      className="object-contain"
                      unoptimized={true} 
                    />
                  </div>
                  <div className="text-center text-xs font-bold text-[#000080] px-1 py-0.5 bg-white/30 border border-[#808080] shadow-win98-inner w-full">
                    Pharos #{id}
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          {hasMore && getCurrentPageItems().length > 0 && (
            <div 
              ref={observerTarget} 
              className="flex justify-center items-center p-4 mt-4"
            >
              {isLoadingMore ? (
                <div className="text-center bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-4">
                  <Win98Loading text="Loading..."/>
                  <p className="mt-2 text-xs">Loading more Pharos NFTs...</p>
                </div>
              ) : (
                <div className="h-8"></div> 
              )}
            </div>
          )}
        </div>
      )}

      {viewState === "genesis" && selectedPreviewIndex >= 0 && gotchipusPreviews.length > 0 && (
        <PharosGenesisPage
          tokenId={selectedPharos as string}
          gotchipusPreviews={gotchipusPreviews}
          selectedPreviewIndex={selectedPreviewIndex}
          onPreviewSelect={handlePreviewSwitchInGenesis}
          onClose={handleBack}
          tokenBoundAccount={tokenBoundAccount}
          dna={dna}
        />
      )}
    </div>
  );
});

export default MyPharosContent;