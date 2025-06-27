import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface FlipCardProps {
  tokenId: number;
  name: string;
  image: string;
  story: string;
  onSelect: () => void;
  isSelected?: boolean;
}

const FlipCard = ({ tokenId, name, image, story, onSelect, isSelected = false }: FlipCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [stage, setStage] = useState('');
  const [hasFlipped, setHasFlipped] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    } else {
      if (onSelect) onSelect();
    }
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const flipCardContainerClasses = `
    w-full h-full relative transition-transform duration-300 ease-[cubic-bezier(0.4,0.2,0.2,1)] 
    transform-style-preserve-3d flex items-center justify-center
    ${flipped ? 'rotate-y-0' : 'rotate-y-180'}
    ${stage === 'lift' || stage === 'flip' ? 'scale-110' : 'scale-100'}
  `;

  return (
    <div 
      className={`perspective-1000 w-52 h-80 cursor-pointer mx-auto my-2.5 font-['MS_Sans_Serif'] ${
        isSelected ? 'ring-4 ring-[#FAC428] ring-opacity-80' : ''
      }`}
      onClick={handleClick}
    >
      <div className={flipCardContainerClasses}>
        
        <div className="absolute w-full h-full backface-hidden rounded-none overflow-hidden bg-[#281586] p-1">
          <div className="w-full h-full bg-white p-1 border-2 border-[#FAC428]">
            <div className="relative z-10 flex flex-col h-full bg-white">
              
              <header className="flex-shrink-0 flex items-center justify-between px-2 h-6 bg-[#281586]">
                <span className="text-sm font-bold text-[#FAC428] drop-shadow-[1px_1px_0_#000]">
                  #{tokenId}
                </span>
                <span className="text-sm font-bold text-[#FAC428] truncate drop-shadow-[1px_1px_0_#000]">
                  {name}
                </span>
              </header>

              <main className="flex-grow p-2 min-h-0">
                <div className="relative w-full h-full border-2 border-t-[#5845c6] border-l-[#5845c6] border-b-[#140a43] border-r-[#140a43] p-1">
                  <Image 
                    src={image} 
                    alt={name} 
                    layout="fill"
                    objectFit="cover"
                    className="bg-black"
                    draggable={false}
                  />
                </div>
              </main>
              
              <footer className="flex-shrink-0 mx-2 mb-1 p-1.5 border-2 border-t-[#856d17] border-l-[#856d17] border-b-[#fef1cf] border-r-[#fef1cf] bg-[#FFFBEB] overflow-y-hidden">
                <div className="h-full max-h-[60px] overflow-y-auto text-xs text-black leading-tight pr-1 scrollbar-none">
                  <p className="m-0 break-words">
                    {story}
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
    </div>
  );
};

export default FlipCard;