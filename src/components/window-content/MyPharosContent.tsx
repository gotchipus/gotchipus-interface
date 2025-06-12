'use client'

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import PharosGenesisPage from "./pharos/PharosGenesisPage";
import { useContractRead, useContractReads } from "@/hooks/useContract";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { Win98Loading } from "@/components/ui/win98-loading";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseGotchipusInfo } from "@/lib/types";


interface GotchipusPreview {
  id: string;
  name: string;
  story: string;
  image: string;
}

const MyPharosContent = observer(() => {
  const [viewState, setViewState] = useState<"list" | "hatching" | "genesis">("list");
  const [selectedPharos, setSelectedPharos] = useState<string | null>(null);
  const [balances, setBalances] = useState<number>(0);
  const [ids, setIds] = useState<string[]>([]);
  const [queryIds, setQueryIds] = useState<string[]>([]);
  const [accValidIds, setAccValidIds] = useState<string[]>([]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [displayedStory, setDisplayedStory] = useState<string>("");
  const [isStoryComplete, setIsStoryComplete] = useState<boolean>(false);
  const [pharoName, setPharoName] = useState<string>("");
  const [gotchipusPreviews, setGotchipusPreviews] = useState<GotchipusPreview[]>([]);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number>(-1);
  const [isGeneratingPreviews, setIsGeneratingPreviews] = useState<boolean>(false);
  const [oneCheckInfo, setOneCheckInfo] = useState<boolean>(false);
  const { walletStore } = useStores();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const {data: balance} = useContractRead("balanceOf", [walletStore.address]);
  const {data: allIds} = useContractRead("allTokensOfOwner", [walletStore.address], { enabled: !!balance });

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
    }
  }, [allIds]);

  useEffect(() => {
    if (!oneCheckInfo && tokenInfos) {

      const failedIds: string[] = [];
      const updatedAcc: string[] = [...accValidIds];

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

        if (parsed.status === 0) {
          if (!updatedAcc.includes(thisId)) {
            updatedAcc.push(thisId);
          }
        }
      }

      setAccValidIds(updatedAcc);

      if (failedIds.length > 0) {
        setQueryIds(failedIds);
        return;
      }

      setIds(updatedAcc);
      setOneCheckInfo(true);
    }
  }, [tokenInfos, queryIds, oneCheckInfo, accValidIds]);

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
      const storyResponse = await fetch(`/api/story`);
      if (!storyResponse.ok) {
        throw new Error(`Get story failed: ${storyResponse.status}`);
      }
      
      const storyData = await storyResponse.json();
      
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
      
      if (Array.isArray(storyData) && storyData.length > 0) {
        const previews = storyData.map((item, index) => {
          const imageData = index < imageBase64Array.length 
            ? `data:image/png;base64,${imageBase64Array[index]}`
            : `/pharos.png`;
          return {
            id: `${pharoId}-${index}`,
            name: item.name || `Gotchipus #${index+1}`,
            story: String(item.story || "").replace(/undefined/g, '').trim(),
            image: imageData
          };
        });
        
        setGotchipusPreviews(previews);
      } else {
        const defaultPreviews = await createDefaultPreviews(pharoId);
        setGotchipusPreviews(defaultPreviews);
      }
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
    setSelectedPreviewIndex(index);
    if (gotchipusPreviews[index]) {
      setPharoName(gotchipusPreviews[index].name);
      setDisplayedStory(gotchipusPreviews[index].story);
      setIsStoryComplete(true);
    }
  };

  const handlePharoClick = useCallback((pharoId: string) => {
    setSelectedPharos(pharoId);
    setViewState("hatching");
    setDisplayedStory("");
    setIsStoryComplete(false);
    setPharoName("");
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
    setOneCheckInfo(false);
    setQueryIds(ids);
  }, []);

  const floatAnimation = {
    y: [0, -3, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="p-4 h-full scrollbar-none">
      {viewState === "list" && (
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 scrollbar-none">
            {balances > 0 || walletStore.isConnected ? (
              getCurrentPageItems().length > 0 ? (
                getCurrentPageItems().map((id) => (
                  <div
                    key={id}
                    className="bg-[#d4d0c8] flex flex-col items-center justify-center cursor-pointer border-2 border-[#808080] shadow-win98-outer rounded-none p-3 hover:bg-[#c0c0c0]"
                    onClick={() => handlePharoClick(id.toString())}
                  >
                    <motion.div
                      className="w-48 h-48 relative flex items-center justify-center"
                      animate={floatAnimation}
                    >
                      <Image src="/pharos.png" alt="Pharo" width={150} height={150} />
                    </motion.div>
                    <div className="text-center mt-4 font-bold">Pharos #{id.toString()}</div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 flex justify-center items-center p-8 bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-outer">
                  {isGeneratingPreviews ? (
                    <div className="text-center">
                      <Win98Loading />
                      <p className="mt-4 text-sm">Loading your Pharos NFTs...</p>
                    </div>
                  ) : (
                    "No Pharos NFTs found in your wallet"
                  )}
                </div>
              )
            ) : (
              <div className="col-span-4 flex justify-center items-center p-8 bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-outer">
                No Pharos NFTs found in your wallet.
              </div>
            )}
          </div>
          
          {/* Loading indicator and observer target */}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {gotchipusPreviews.map((preview, index) => (
                    <div 
                      key={preview.id}
                      className={`bg-[#d4d0c8] border-2 ${selectedPreviewIndex === index ? 'border-[#000080]' : 'border-[#808080]'} shadow-win98-outer cursor-pointer ${selectedPreviewIndex === index ? 'bg-[#efefef]' : ''}`}
                      onClick={() => handleSelectPreview(index)}
                    >
                      <div className={`flex items-center justify-between p-1 ${selectedPreviewIndex === index ? 'bg-[#000080] text-white' : 'bg-[#d4d0c8]'}`}>
                        <span className="font-bold text-sm pl-2">{preview.name}</span>
                        {selectedPreviewIndex === index && (
                          <div className="w-4 h-4 bg-[#d4d0c8] border border-[#808080] flex items-center justify-center">
                            <span className="text-black text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3">
                        <div className="flex justify-center border border-[#808080] shadow-win98-inner bg-white p-2 mb-3">
                          <motion.div animate={floatAnimation} className="relative w-32 h-32">
                            <Image 
                              src={preview.image} 
                              alt={preview.name}
                              width={120}
                              height={120}
                              className="object-contain"
                            />
                          </motion.div>
                        </div>
                        
                        <div className="border border-[#808080] shadow-win98-inner bg-white p-2 h-[100px] overflow-y-auto text-sm">
                          {preview.story}
                        </div>
                      </div>
                    </div>
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
                        <h3 className="font-bold">{gotchipusPreviews[selectedPreviewIndex].name}</h3>
                        <p className="text-xs">Gotchipus for Pharos #{selectedPharos}</p>
                      </div>
                    </div>
                    
                    <div className="border border-[#808080] shadow-win98-inner bg-white p-3 text-sm">
                      {gotchipusPreviews[selectedPreviewIndex].story}
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
          story={gotchipusPreviews[selectedPreviewIndex].story} 
          previewImage={gotchipusPreviews[selectedPreviewIndex].image}
          onClose={handleBack}
        />
      )}
    </div>
  );
});

export default MyPharosContent;