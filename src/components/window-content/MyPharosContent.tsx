'use client'

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import PharosGenesisPage from "./pharos/PharosGenesisPage";
import { useContractRead } from "@/hooks/useContract";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";

const MyPharosContent = observer(() => {
  const [viewState, setViewState] = useState<"list" | "hatching" | "genesis">("list");
  const [selectedPharo, setSelectedPharo] = useState<string | null>(null);
  const [balances, setBalances] = useState<number>(0);
  const [ids, setIds] = useState<string[]>([]);
  const [displayedStory, setDisplayedStory] = useState<string>("");
  const [isStoryComplete, setIsStoryComplete] = useState<boolean>(false);
  const { walletStore } = useStores();

  const { messages, append, status } = useChat({
    api: "/api/chat",
    body: {
      modelName: "XAI",
      temperature: 0.7,
      maxTokens: 200,
    },
    initialMessages: [
      {
        role: "system",
        content: `You are a creative assistant for generating unique background stories and names for Gotchipus NFTs.

Each Gotchipus is a bioluminescent octopus-like creature living in the mysterious Cosmic Reef — an oceanic dimension filled with starlight, ancient currents, and forgotten relics of cosmic civilizations.

Every Gotchipus has a unique set of gene traits (such as color, glow pattern, behavior instinct, and magical affinity) and an identity expressed through a vivid origin story and a memorable name.

Your task is to:

1. Invent a **unique name** that reflects the Gotchipus's personality and gene traits.
2. Write a **lore-rich story** (80-150 words) set in the Cosmic Reef, using the gene data and environmental themes.
 - The tone can be mystical, poetic, adventurous, or emotional.
 - Include how the Gotchipus interacts with its surroundings or has earned a reputation among reef dwellers.`,
        id: "system",
      },
    ],
  });

  const balance = useContractRead("balanceOf", [walletStore.address]);
  const allIds = useContractRead("allTokensOfOwner", [walletStore.address], { enabled: !!balance });

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

  const streamStory = useCallback((story: string) => {
    try {
      if (!story || typeof story !== 'string') {
        console.error('Invalid story input');
        return;
      }

      setDisplayedStory("");
      setIsStoryComplete(false);

      const words = story.split(" ");
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedStory(prev => {
            const newText = prev + (currentIndex === 0 ? "" : " ") + words[currentIndex];
            return newText;
          });
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsStoryComplete(true);
        }
      }, 50);

      return () => {
        clearInterval(interval);
      };
    } catch (error) {
      console.error('Error in streamStory:', error);
      setDisplayedStory(story);
      setIsStoryComplete(true);
    }
  }, []);

  const generateStory = useCallback(async (pharoId: string) => {
    try {
      await append({
        role: "user",
        content: `Generate a story for Pharos NFT #${pharoId}`,
      });
    } catch (err) {
      console.error("Failed to generate story:", err);
      const fallbackStory = `Pharo #${pharoId} emerged from the digital realm, its essence pulsing with ancient wisdom. As it materialized, whispers of forgotten algorithms echoed through the void, promising untold possibilities.`;
      streamStory(fallbackStory);
    }
  }, [append, streamStory]);

  useEffect(() => {
    if (viewState === "hatching") {
      console.log("hatching");
      generateStory("0");
    }
  }, [viewState, generateStory]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant" && viewState === "hatching") {
      const story = lastMessage.content;
      const cleanup = streamStory(story);
      
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [messages, viewState, streamStory]);

  const floatAnimation = {
    y: [0, -3, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const handlePharoClick = useCallback((pharoId: string) => {
    setSelectedPharo(pharoId);
    setViewState("hatching");
    setDisplayedStory("");
    setIsStoryComplete(false);
  }, []);

  const handleNext = useCallback(() => {
    setViewState("genesis");
  }, []);

  const renderStoryText = () => (
    <p className="text-slate-700 min-h-[100px] leading-relaxed whitespace-pre-wrap">
      {displayedStory}
      {!isStoryComplete && status === "streaming" && (
        <span className="inline-flex gap-1 ml-1">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
                style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
                style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
                style={{ animationDelay: "300ms" }} />
        </span>
      )}
    </p>
  );

  return (
    <div className="p-4 h-full scrollbar-none">
      {viewState === "list" && (
        <div className="grid grid-cols-4 gap-4 scrollbar-none">
          {balances > 0 ? (
            ids.map((id) => (
              <div
                key={id}
                className="bg-white flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md"
                onClick={() => handlePharoClick(id)}
              >
                <motion.div
                  className="w-48 h-48 relative flex items-center justify-center"
                  animate={floatAnimation}
                >
                  <Image src="/pharos.png" alt="Pharo" width={240} height={240} />
                </motion.div>
                <div className="text-center mt-2 text-sm">#{id}</div>
              </div>
            ))
          ) : (
            <Button onClick={() => setViewState("hatching")}>Mint</Button>
          )}
        </div>
      )}

      {viewState === "hatching" && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-full backdrop-blur-sm p-6">
            <h3 className="text-lg font-medium mb-3 text-center">
              Pharo #{selectedPharo}'s Story
            </h3>
            {renderStoryText()}
            {isStoryComplete && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a] text-black font-medium"
                >
                  Genesis
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {viewState === "genesis" && (
        <PharosGenesisPage tokenId={selectedPharo as string} />
      )}
    </div>
  );
});

export default MyPharosContent;