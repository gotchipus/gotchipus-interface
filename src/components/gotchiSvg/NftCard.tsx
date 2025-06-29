"use client";

import { motion } from "framer-motion";
import { useSvgLayers } from "@/hooks/useSvgLayers";
import { SvgComposer } from "@/components/gotchiSvg/SvgComposer";

interface NftCardProps {
  id: string;
  onSelect: (tokenId: string) => void;
  isMobile?: boolean;
}

const floatAnimation = {
  y: [0, -3, 0],
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const NftCard = ({ id, onSelect, isMobile }: NftCardProps) => {
  const { layers, backgroundSvg, isLoading } = useSvgLayers(id);

  const viewBox = "0 0 80 80"; 

  const completeBackgroundSvg = backgroundSvg 
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${backgroundSvg}</svg>`
    : null;

  const backgroundStyle = completeBackgroundSvg
    ? { backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(completeBackgroundSvg)}")` } 
    : {};

  return (
    <div
      className={`bg-[#d4d0c8] flex flex-col items-center justify-center cursor-pointer border-2 border-[#808080] shadow-win98-inner rounded-sm hover:bg-[#c0c0c0] bg-cover bg-center transition-all duration-200 ${isMobile ? 'p-2' : 'p-3'}`}
      style={backgroundStyle} 
      onClick={() => onSelect(id.toString())}
    >
      <motion.div
        className={`relative flex items-center justify-center ${isMobile ? 'w-32 h-32' : 'w-48 h-48'}`}
        animate={floatAnimation}
      >
        {isLoading ? (
          <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>...</div>
        ) : (
          <SvgComposer layers={layers} />
        )}
      </motion.div>
    
      <div className={`text-center mt-4 font-bold bg-[#d4d0c8] bg-opacity-80 px-2 rounded backdrop-blur-sm ${isMobile ? 'text-sm' : ''}`}>#{id.toString()}</div>
    </div>
  );
};