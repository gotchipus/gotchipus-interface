'use client'

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import PharosGenesisPage from "./pharos/PharosGenesisPage";
import { useContractRead, useContractReads } from "@/hooks/useContract";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { useChat } from "@ai-sdk/react";
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
  const [displayedStory, setDisplayedStory] = useState<string>("");
  const [isStoryComplete, setIsStoryComplete] = useState<boolean>(false);
  const [pharoName, setPharoName] = useState<string>("");
  const [gotchipusPreviews, setGotchipusPreviews] = useState<GotchipusPreview[]>([]);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number>(-1);
  const [isGeneratingPreviews, setIsGeneratingPreviews] = useState<boolean>(false);
  const { walletStore } = useStores();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const { messages, append, status } = useChat({
    api: "/api/chat",
    body: {
      modelName: "XAI",
      temperature: 0.8, 
      maxTokens: 1000, 
    },
    initialMessages: [
      {
        role: "system",
        content: `
          You are creating unique personalities for Gotchipus NFTs. Each Gotchipus should speak directly to their owner in FIRST PERSON, with a distinct personality and voice.
          
          When prompted with a Pharos NFT ID, generate FIVE completely different Gotchipus personalities. Each one must have a unique name, personality, appearance, and story.
          
          Follow these guidelines for EACH Gotchipus:
          1. Write in FIRST PERSON as the Gotchipus speaking to its owner
          2. Keep each story SHORT (40-70 words maximum)
          3. Include a fun GREETING or sound effect
          4. Make the Gotchipus INTRODUCE ITSELF with its name
          5. Add ONE specific personality trait or quirk
          6. Include ONE brief anecdote or skill that shows character
          7. End with a direct comment to the owner/player
          8. Make sure each of the five Gotchipus has a COMPLETELY DIFFERENT personality from the others
          9. Make them all FUN, QUIRKY and MEMORABLE
          
          Examples of writing style to follow:
          "*Bubble pop* Hey there! I'm Inkspot, the inkiest Gotchipus this side of the Rift! I collect shiny human things that sink to the bottom—got 47 spoons so far! Wanna help me find number 48? I bet you have good taste in treasures."
          
          "*Gentle hum* Greetings, light-dweller. I am Lumina. My tentacles can weave patterns that predict tomorrow's currents. Once saved an entire reef by forecasting a sudden cold front. I sense you and I will navigate many challenges together. Are you ready to see what lies beyond?"
          
          Output format must be strictly a JSON array containing exactly 5 objects:
          [
            {
              "name": "[Unique Name 1]",
              "story": "[First-person introduction 1]"
            },
            {
              "name": "[Unique Name 2]",
              "story": "[First-person introduction 2]"
            },
            ...and so on for all 5
          ]
          
          Ensure each name and personality is completely different. No additional text before or after the JSON.
        `,
        id: "system",
      },
    ],
  });

  const balance = useContractRead("balanceOf", [walletStore.address]);
  const allIds = useContractRead("allTokensOfOwner", [walletStore.address], { enabled: !!balance });

  const tokenInfos = useContractReads(
    "ownedTokenInfo",
    ids.map(id => [walletStore.address, id]),
    { enabled: ids.length > 0 }
  );

  useEffect(() => {
    if (balance !== undefined) {
      setBalances(balance as number);
    }
  }, [balance]);

  useEffect(() => {
    if (allIds) {
      setIds(allIds as string[]);
    }
  }, [allIds]);

  useEffect(() => {
    if (tokenInfos) {
      const parseResults = tokenInfos.map(info => parseGotchipusInfo(info))
        .filter(Boolean);

      const newIds: string[] = [];
      parseResults.forEach((gotchi, index) => {
        const id = ids[index];
        
        if (gotchi?.status === 0) {
          newIds.push(id);
        }
      });

      setIds(newIds);
    }
  }, [tokenInfos]);

  const processStories = useCallback(async (content: string) => {
    try {
      if (!content || typeof content !== 'string') {
        console.error('Invalid content input');
        return [];
      }

      let cleanedContent = content.trim();
      cleanedContent = cleanedContent.replace(/undefined/g, '');
      
      const jsonStartIndex = cleanedContent.indexOf('[');
      const jsonEndIndex = cleanedContent.lastIndexOf(']') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        cleanedContent = cleanedContent.substring(jsonStartIndex, jsonEndIndex);
      }
      
      try {
        const storiesData = JSON.parse(cleanedContent);

        let imageBase64Array: string[] = [];
        try {
          const imgResponse = await fetch("http://127.0.0.1:8000/images/draw");
          if (!imgResponse.ok) {
            throw new Error(`Get image failed: ${imgResponse.status}`);
          }
          
          const imgData = await imgResponse.json();
          
          if (imgData && Array.isArray(imgData.img)) {
            imageBase64Array = imgData.img;
          } else {
            console.warn("Image data format is incorrect:", imgData);
            imageBase64Array = Array(5).fill("/pharos.png");
          }
        } catch (imgError) {
          console.error("Get image error:", imgError);
          imageBase64Array = Array(5).fill("/pharos.png");
        }

        if (Array.isArray(storiesData) && storiesData.length > 0) {
          return storiesData.map((item, index) => {
            const imageData = index < imageBase64Array.length 
              ? `data:image/png;base64,${imageBase64Array[index]}`
              : `/pharos.png`;
              
            return {
              id: `preview-${index}`,
              name: item.name || `Gotchipus #${index+1}`,
              story: String(item.story || "").replace(/undefined/g, '').trim(),
              image: imageData
            };
          });
        }
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
      }
      
      return [];
    } catch (error) {
      console.error('Error in processStories:', error);
      return [];
    }
  }, []);

  const createDefaultPreviews = async (pharoId: string): Promise<GotchipusPreview[]> => {
    let imageBase64Array: string[] = [];
    try {
      const imgResponse = await fetch("http://127.0.0.1:8000/images/draw");
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
      await append({
        role: "user",
        content: `Generate five unique Gotchipus personalities for Pharos NFT #${pharoId}. Make each one completely different in personality, traits, and story.`
      });
    } catch (err) {
      console.error("Failed to generate previews:", err);
      const defaultPreviews = await createDefaultPreviews(pharoId);
      setGotchipusPreviews(defaultPreviews);
      setIsGeneratingPreviews(false);
    }
  }, [append]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant" && viewState === "hatching") {
      if (status === "ready") {
        const content = lastMessage.content;
        
        processStories(content).then(async previews => {
          if (previews && previews.length > 0) {
            setGotchipusPreviews(previews);
          } else {
            const defaultPreviews = await createDefaultPreviews(selectedPharos || "0");
            setGotchipusPreviews(defaultPreviews);
          }
          setIsGeneratingPreviews(false);
        });
      }
    }
  }, [messages, viewState, status, processStories, selectedPharos]);

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
    
    if (tokenInfos) {
      const parseResults = tokenInfos.map(info => parseGotchipusInfo(info))
        .filter(Boolean);

      const newIds: string[] = [];
      parseResults.forEach((gotchi, index) => {
        const id = ids[index];
        
        if (gotchi?.status === 0) {
          newIds.push(id);
        }
      });

      setIds(newIds);
    }
  }, [tokenInfos, ids]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 scrollbar-none">
          {balances > 0 || walletStore.isConnected ? (
            ids.map((id) => (
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
              No Pharos NFTs found in your wallet
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
                  <p className="mt-4 text-sm">Summoning Gotchipus variants...</p>
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