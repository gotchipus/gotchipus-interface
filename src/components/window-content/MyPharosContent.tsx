'use client'

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import PharosGenesisPage from "./pharos/PharosGenesisPage";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { Win98Loading } from "@/components/ui/win98-loading";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useSWR from 'swr';
import FlipCard from "@/src/components/window-content/pharos/FlipCard";

interface GotchipusPreview {
  id: string;
  name: string;
  story: string;
  image: string;
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
});

const MyPharosContent = observer(() => {
  const [viewState, setViewState] = useState<"list" | "hatching" | "genesis">("list");
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
  const { walletStore, storyStore } = useStores();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const apiUrl = walletStore.isConnected && walletStore.address 
    ? `/api/tokens/pharos?owner=${walletStore.address}` 
    : null;

  const { data: filteredIds, error, isLoading: isInitialLoading, mutate } = useSWR<string[]>(apiUrl, fetcher, {
    refreshInterval: viewState === 'list' ? 3000 : 0,
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 0,
  });

  useEffect(() => {
    if (filteredIds) {
      setIds(filteredIds);
    }
  }, [filteredIds]);


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

  const createDefaultPreviews = async (pharoId: string): Promise<GotchipusPreview[]> => {
    let imageBase64Array: string[] = [];
    try {
      const imgResponse = await fetch("/api/images/draw");
      if (imgResponse.ok) {
        const imgData = await imgResponse.json();
        if (imgData && Array.isArray(imgData.img)) {
          imageBase64Array = imgData.img;
        }
      }
    } catch (error) {
      console.error("Get default preview image failed:", error);
    }
    
    return Array(5).fill(0).map((_, i) => {
      const imageData = i < imageBase64Array.length 
        ? `data:image/png;base64,${imageBase64Array[i]}`
        : `/pharos.png`;
        
      return {
        id: `${pharoId}-${i}`,
        name: `Gotchipus #${i+1}`,
        story: `*Bubble pop* Hey there! I'm Gotchipus #${i+1}, ready to join your adventures!`,
        image: imageData
      };
    });
  };

  const generateGotchipusPreviews = useCallback(async (pharoId: string) => {
    setIsGeneratingPreviews(true);
    try {

      let imageBase64Array: string[] = [];
      try {
        const imgResponse = await fetch(`/api/images/draw`);
        if (!imgResponse.ok) {
          throw new Error(`Get image failed: ${imgResponse.status}`);
        }
        const imgData = await imgResponse.json();
        if (imgData && Array.isArray(imgData.img)) {
          imageBase64Array = imgData.img;
        } else {
          imageBase64Array = Array(5).fill("/pharos.png");
        }
      } catch (imgError) {
        console.error("Get image error:", imgError);
        imageBase64Array = Array(5).fill("/pharos.png");
      }
      
      const previews = Array(5).fill(0).map((item, index) => {
        const imageData = index < imageBase64Array.length 
          ? `data:image/png;base64,${imageBase64Array[index]}`
          : `/pharos.png`;
        return  {
          id: `${pharoId}-${index}`,
          name: item.name || `Gotchipus #${index+1}`,
          story: String(item.story || "").replace(/undefined/g, '').trim(),
          image: imageData
        };
      });

      setGotchipusPreviews(previews);

    } catch (err) {
      console.error("Failed to generate previews:", err);
      const defaultPreviews = await createDefaultPreviews(pharoId);
      setGotchipusPreviews(defaultPreviews);
    } finally {
      setIsGeneratingPreviews(false);
    }
  }, []);

  useEffect(() => {
    if (viewState === "hatching" && selectedPharos) {
      generateGotchipusPreviews(selectedPharos);
    }
  }, [viewState, selectedPharos, generateGotchipusPreviews]);

  const handleSelectPreview = (index: number) => {
    if (selectedPreviewIndex === index) {
      setSelectedPreviewIndex(-1);
    } else {
      setSelectedPreviewIndex(index);
    }
    storyStore.setIsFetching(true);
  };

  const handlePharoClick = useCallback((pharoId: string) => {
    setSelectedPharos(pharoId);
    setViewState("hatching");
    setSelectedPreviewIndex(-1);
    setGotchipusPreviews([]);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedPreviewIndex >= 0 && gotchipusPreviews[selectedPreviewIndex]) {
      setViewState("genesis");
    }
  }, [selectedPreviewIndex, gotchipusPreviews]);

  const handleBack = useCallback(() => {
    setViewState("list");
  }, []);


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
        <div className="col-span-4 flex justify-center items-center p-8 bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-outer">
          Failed to load NFTs, please refresh.
        </div>
        <button onClick={() => mutate()}>Refresh</button>
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="p-6 bg-[#d4d0c8] h-full flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="mb-4">
            <Image src="/not-any.png" alt="No NFTs" width={120} height={120} />
          </div>
          <h3 className="text-xl font-bold mb-2">No NFTs Found</h3>
          <p className="text-[#000080] mb-4">You don't have any Pharos NFTs yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full scrollbar-none">
      {viewState === "list" && (
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 scrollbar-none">
            {ids && ids.length > 0 && (
              getCurrentPageItems().map((id, index) => (
                <div
                  key={id + index}
                  className="bg-[#d4d0c8] flex flex-col items-center justify-center cursor-pointer border-2 border-[#808080] shadow-win98-outer rounded-none p-3 hover:bg-[#c0c0c0]"
                  onClick={() => handlePharoClick(id)}
                >
                  <motion.div /* ... */ >
                    <Image src="/pharos.png" alt="Pharo" width={150} height={150} />
                  </motion.div>
                  <div className="text-center mt-4 font-bold">Pharos #{id}</div>
                </div>
              ))
            )}
          </div>
          
          {hasMore && getCurrentPageItems().length > 0 && (
            <div 
              ref={observerTarget} 
              className="flex justify-center items-center p-4 mt-4"
            >
              {isLoadingMore ? (
                <div className="text-center">
                  <Win98Loading text="Loading..."/>
                  <p className="mt-2 text-sm">Loading more Gotchipus NFTs...</p>
                </div>
              ) : (
                <div className="h-8"></div> 
              )}
            </div>
          )}
        </div>
      )}

      {viewState === "hatching" && (
        <div className="bg-[#c0c0c0] h-full">
          <div className="p-4">
            <div className="mb-6 bg-white border-2 border-[#808080] shadow-win98-outer p-4">
              <h3 className="text-lg font-bold mb-2">Choose Your Gotchipus</h3>
              <p className="text-sm">
                Each Pharos can summon multiple Gotchipus personalities. Select the one that resonates with you!
              </p>
            </div>

            {isGeneratingPreviews || gotchipusPreviews.length === 0 ? (
              <div className="flex justify-center items-center h-[300px] bg-white border-2 border-[#808080] shadow-win98-outer">
                <div className="text-center">
                  <Win98Loading />
                  <p className="mt-4 text-sm">Summoning Gotchipus variants, stories generated in 15 seconds...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
                  {gotchipusPreviews.map((preview, index) => (
                    <FlipCard
                      key={preview.id}
                      tokenId={index + 1}
                      image={preview.image}
                      onSelect={() => handleSelectPreview(index)}
                      isSelected={selectedPreviewIndex === index}
                    />
                  ))}
                </div>
                
                {selectedPreviewIndex >= 0 && gotchipusPreviews[selectedPreviewIndex] && (
                  <div className="border-2 border-[#808080] shadow-win98-outer bg-white p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 relative mr-3">
                        <Image 
                          src={gotchipusPreviews[selectedPreviewIndex].image}
                          alt={gotchipusPreviews[selectedPreviewIndex].name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">
                          {storyStore.isFetching ? (
                            <div className="h-4 bg-gray-300 animate-pulse rounded w-24"></div>
                          ) : (
                            storyStore.gotchiName
                          )}
                        </h3>
                        <p className="text-xs">Gotchipus for Pharos #{selectedPharos}</p>
                      </div>
                    </div>
                    
                    <div className="border border-[#808080] shadow-win98-inner bg-white p-3 text-sm">
                      {storyStore.isFetching ? (
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-300 animate-pulse rounded w-full"></div>
                          <div className="h-3 bg-gray-300 animate-pulse rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 animate-pulse rounded w-5/6"></div>
                          <div className="h-3 bg-gray-300 animate-pulse rounded w-2/3"></div>
                        </div>
                      ) : (
                        storyStore.gotchiStory
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button 
                    className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-4 py-2 flex items-center hover:bg-[#c0c0c0]"
                    onClick={handleBack}
                  >
                    <ChevronLeft size={16} className="mr-1" /> Back
                  </button>
                  
                  <button 
                    className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] px-4 py-2 flex items-center hover:bg-[#c0c0c0] ${selectedPreviewIndex < 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNext}
                    disabled={selectedPreviewIndex < 0}
                  >
                    Continue to Genesis <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {viewState === "genesis" && selectedPreviewIndex >= 0 && gotchipusPreviews[selectedPreviewIndex] && (
        <PharosGenesisPage 
          tokenId={selectedPharos as string} 
          story={storyStore.gotchiStory} 
          previewImage={gotchipusPreviews[selectedPreviewIndex].image}
          onClose={handleBack}
        />
      )}
    </div>
  );
});

export default MyPharosContent;