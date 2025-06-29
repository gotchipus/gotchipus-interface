'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";

interface FlipCardProps {
  tokenId: number;
  image: string;
  onSelect: () => void;
  isSelected?: boolean;
  isMobile?: boolean;
}

const FlipCard = observer(({ tokenId, image, onSelect, isSelected = false, isMobile = false }: FlipCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [stage, setStage] = useState('');
  const [hasFlipped, setHasFlipped] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [displayStory, setDisplayStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursorField, setCursorField] = useState<'name' | 'story' | null>(null);
  
  const streamBufferRef = useRef('');
  const nameIndexRef = useRef(-1);
  const storyIndexRef = useRef(-1);
  const storyProgressRef = useRef(0);  
  const animationTimerRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataFetchedRef = useRef(false);  
  const { storyStore } = useStores();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, []);

  const handleClick = () => {
    if (animating) return;
    
    if (!hasFlipped) {
      setAnimating(true);
      setStage('lift');
      
      timeoutRef.current = setTimeout(() => {
        setStage('flip');
        setFlipped(true);
        setHasFlipped(true);
        
        timeoutRef.current = setTimeout(() => {
          setStage('drop');
          
          timeoutRef.current = setTimeout(() => {
            setStage('');
            setAnimating(false);
            if (onSelect) onSelect();
          }, 220);
        }, 320);
      }, 220);
      
      if (!dataFetchedRef.current) {
        fetchStoryData();
      }
    } else {
      if (onSelect) onSelect();
    }
  };

  const fetchStoryData = async () => {
    if (dataFetchedRef.current && displayName && displayStory) return;
    
    setIsLoading(true);
    streamBufferRef.current = '';
    nameIndexRef.current = -1;
    storyIndexRef.current = -1;
    storyProgressRef.current = 0;
    setCursorField('name'); 
    
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }

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

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          processStreamEnd();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        processChunk(chunk);
      }

      dataFetchedRef.current = true;
      
    } catch (err: any) {
      console.error('Error fetching story:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const processChunk = (chunk: string) => {
    streamBufferRef.current += chunk;
    
    if (nameIndexRef.current === -1) {
      const nameStart = streamBufferRef.current.indexOf('"name":');
      if (nameStart !== -1) {
        nameIndexRef.current = nameStart + 8; 
        setCursorField('name');
      }
    }
    
    if (nameIndexRef.current !== -1 && displayName.length < 100) {
      const nameText = extractValue(streamBufferRef.current, nameIndexRef.current);
      if (nameText !== null) {
        setDisplayName(nameText);
        
        const storyStart = streamBufferRef.current.indexOf('"story":', nameIndexRef.current);
        if (storyStart !== -1) {
          storyIndexRef.current = storyStart + 9; 
          setCursorField('story');
        }
      }
    }
    
    if (storyIndexRef.current !== -1) {
      const storyText = extractValue(streamBufferRef.current, storyIndexRef.current);
      if (storyText !== null) {
        setDisplayStory(storyText);
        storyProgressRef.current = storyText.length;
      }
    }

    
  };

  const processStreamEnd = () => {
    let finalName = displayName;
    let finalStory = displayStory;
    
    if (nameIndexRef.current !== -1) {
      const extractedName = extractValue(streamBufferRef.current, nameIndexRef.current);
      if (extractedName !== null) {
        finalName = extractedName;
        setDisplayName(finalName);
      }
    }
    
    if (storyIndexRef.current !== -1) {
      const extractedStory = extractValue(streamBufferRef.current, storyIndexRef.current);
      if (extractedStory !== null) {
        finalStory = extractedStory;
        
        if (displayStory.length > finalStory.length * 0.75) {
          setDisplayStory(finalStory);
        } else {
          animateText(finalStory);
        }
      }
    }

    storyStore.setGotchiName(finalName);
    storyStore.setGotchiStory(finalStory);
    storyStore.setIsFetching(false);
    setCursorField(null);
    
  };


  const extractValue = (text: string, startIndex: number): string | null => {
    if (startIndex >= text.length) {
      return null;
    }
    
    if (text[startIndex] !== '"') {
      startIndex = text.indexOf('"', startIndex);
      if (startIndex === -1) return null;
    }

    let endIndex = startIndex + 1;
    let inEscape = false;
    
    while (endIndex < text.length) {
      const char = text[endIndex];
      
      if (inEscape) {
        inEscape = false;
      } else if (char === '\\') {
        inEscape = true;
      } else if (char === '"') {
        return text.substring(startIndex + 1, endIndex)
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
      }
      
      endIndex++;
    }
    
    return text.substring(startIndex + 1)
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  };

  const animateText = (text: string) => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    
    if (text.length <= 15) {
      setDisplayStory(text);
      return;
    }
    
    let currentIndex = Math.min(storyProgressRef.current, text.length);
    
    if (currentIndex > text.length * 0.9) {
      setDisplayStory(text);
      return;
    }
    
    animationTimerRef.current = window.setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayStory(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        if (animationTimerRef.current) {
          clearInterval(animationTimerRef.current);
          animationTimerRef.current = null;
        }
      }
    }, 20);
  };

  const flipCardContainerClasses = `
    w-full h-full relative transition-transform duration-300 ease-[cubic-bezier(0.4,0.2,0.2,1)] 
    transform-style-preserve-3d flex items-center justify-center
    ${flipped ? 'rotate-y-0' : 'rotate-y-180'}
    ${stage === 'lift' || stage === 'flip' ? 'scale-110' : 'scale-100'}
  `;

  if (isMobile) {
    return (
      <div 
        className={`perspective-1000 w-32 h-48 cursor-pointer mx-auto my-2 font-['MS_Sans_Serif'] ${
          isSelected ? 'ring-2 ring-[#FAC428] ring-opacity-80' : ''
        }`}
        onClick={handleClick}
      >
        <div className={flipCardContainerClasses}>
          <div className="absolute w-full h-full backface-hidden rounded-none overflow-hidden bg-[#281586] p-1">
            <div className="w-full h-full bg-white p-1 border-2 border-[#FAC428]">
              <div className="relative z-10 flex flex-col h-full bg-white">
                <main className="flex-grow p-1 min-h-0">
                  <div className="relative w-full h-full border-2 border-t-[#5845c6] border-l-[#5845c6] border-b-[#140a43] border-r-[#140a43]">
                    <Image 
                      src={image} 
                      alt={displayName || `Gotchipus #${tokenId}`}
                      layout="fill"
                      objectFit="cover"
                      className="bg-black"
                      draggable={false}
                    />
                    {isLoading && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="animate-spin h-4 w-4 border-2 border-[#FAC428] border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </main>
              </div>
            </div>
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <Image src="/gotchi-card-back.png" alt="Card Back" layout="fill" objectFit="cover" />
          </div>
        </div>
        
        {error && (
          <div className="absolute bottom-1 left-0 right-0 bg-red-500 text-white text-xs text-center py-0.5 px-1 mx-1 rounded">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`perspective-1000 w-32 h-48 md:w-52 md:h-80 cursor-pointer mx-auto my-2.5 font-['MS_Sans_Serif'] ${
        isSelected ? 'ring-4 ring-[#FAC428] ring-opacity-80' : ''
      }`}
      onClick={handleClick}
    >
      <div className={flipCardContainerClasses}>
        <div className="absolute w-full h-full backface-hidden rounded-none overflow-hidden bg-[#281586] p-1">
          <div className="w-full h-full bg-white p-1 border-2 border-[#FAC428]">
            <div className="relative z-10 flex flex-col h-full bg-white">
              <header className="flex-shrink-0 flex items-center justify-between px-2 h-6 bg-[#281586]">
                <span className="text-xs md:text-sm font-bold text-[#FAC428] drop-shadow-[1px_1px_0_#000]">
                  #{tokenId}
                </span>
                <span className="text-xs md:text-sm font-bold text-[#FAC428] truncate drop-shadow-[1px_1px_0_#000]">
                  {displayName || (isLoading ? 'Generating...' : 'Waiting for generation')}
                </span>
              </header>

              <main className="flex-grow p-2 min-h-0">
                <div className="relative w-full h-full border-2 border-t-[#5845c6] border-l-[#5845c6] border-b-[#140a43] border-r-[#140a43] p-1">
                  <Image 
                    src={image} 
                    alt={displayName || `Gotchipus #${tokenId}`}
                    layout="fill"
                    objectFit="cover"
                    className="bg-black"
                    draggable={false}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-[#FAC428] border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
              </main>
              
              <footer className="flex-shrink-0 mx-2 mb-1 p-1.5 border-2 border-t-[#856d17] border-l-[#856d17] border-b-[#fef1cf] border-r-[#fef1cf] bg-[#FFFBEB] overflow-y-hidden">
                <div className="h-full max-h-[60px] overflow-y-auto text-xs text-black leading-tight pr-1 scrollbar-none">
                  <p className="m-0 break-words">
                    {displayStory || (isLoading ? 'Generating...' : 'Click the card to load the story')}
                    {isLoading && cursorField === 'story' && (
                      <span className="inline-block w-0.5 h-4 bg-black ml-1 animate-pulse"></span>
                    )}
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Image src="/gotchi-card-back.png" alt="Card Back" layout="fill" objectFit="cover" />
        </div>
      </div>
      
      {error && (
        <div className="absolute bottom-2 left-0 right-0 bg-red-500 text-white text-xs text-center py-1 px-2 mx-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
});

export default FlipCard;