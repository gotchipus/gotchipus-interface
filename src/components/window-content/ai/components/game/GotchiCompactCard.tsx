"use client";

import { useSvgLayers } from "@/hooks/useSvgLayers";
import { SvgComposer } from "@/components/gotchiSvg/SvgComposer";
import { cn } from "@/lib/utils";

interface GotchiCompactCardProps {
  name: string;
  id: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const GotchiCompactCard = ({
  name,
  id,
  isSelected,
  onClick,
  className,
}: GotchiCompactCardProps) => {
  const { layers, backgroundSvg, isLoading } = useSvgLayers(id);
  
  const viewBox = "0 0 80 80"; 
  const completeBackgroundSvg = backgroundSvg 
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${backgroundSvg}</svg>`
    : null;
  
  const backgroundStyle = completeBackgroundSvg
    ? { backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(completeBackgroundSvg)}")` } 
    : {};

  return (
    <button
      className={cn(
        "w-full p-2 border-2 bg-[#c0c0c0] hover:bg-[#d0d0d0] transition-all duration-75 flex items-center gap-2",
        isSelected 
          ? "border-[#0078d4] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]" 
          : "border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff]",
        className
      )}
      onClick={(e) => {
        onClick?.();
      }}
    >
      <div 
        className="w-12 h-12 bg-[#d4d0c8] flex items-center justify-center flex-shrink-0 border border-[#808080]"
        style={backgroundStyle}
      >
        {isLoading ? (
          <div className="text-xs">...</div>
        ) : (
          <div className="w-full h-full flex items-center justify-center scale-75">
            <SvgComposer layers={layers} />
          </div>
        )}
      </div>
      
      <span className="text-xs font-bold text-[#000080] truncate flex-1 text-left">{name}</span>
    </button>
  );
};

export default GotchiCompactCard;