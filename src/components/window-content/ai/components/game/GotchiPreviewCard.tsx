"use client";

import { useSvgLayers } from "@/hooks/useSvgLayers";
import { SvgComposer } from "@/components/gotchiSvg/SvgComposer";
import { cn } from "@/lib/utils";

interface GotchiPreviewCardProps {
  name: string;
  id: string;
  buttonText?: string;
  onAction?: () => void;
  className?: string;
  buttonDisabled?: boolean;
}

const GotchiPreviewCard = ({
  name,
  id,
  buttonText = "Pet",
  onAction,
  className,
  buttonDisabled = false,
}: GotchiPreviewCardProps) => {
  const { layers, backgroundSvg, isLoading } = useSvgLayers(id);
  
  const viewBox = "0 0 80 80"; 
  const completeBackgroundSvg = backgroundSvg 
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${backgroundSvg}</svg>`
    : null;
  
  const backgroundStyle = completeBackgroundSvg
    ? { backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(completeBackgroundSvg)}")` } 
    : {};

  return (
    <div className={cn("border-2 border-[#dfdfdf] bg-[#e0e0e0] shadow-[inset_-2px_-2px_#a0a0a0,inset_2px_2px_#fff] overflow-hidden", className)}>
      <div 
        className="bg-[#d4d0c8] flex items-center justify-center h-48"
        style={backgroundStyle}
      >
        {isLoading ? (
          <div className="text-sm">Loading...</div>
        ) : (
          <div className="relative flex items-center justify-center w-48 h-48">
            <SvgComposer layers={layers} />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="mb-2 text-sm font-bold text-[#000080] text-center">{name}</h3>
        <button
          onClick={onAction}
          disabled={buttonDisabled}
          className={`w-full py-2 font-bold text-sm border-2 border-[#b0b0b0] text-black transition-all duration-75 ${
            buttonDisabled 
              ? 'bg-[#a0a0a0] text-[#808080] cursor-not-allowed shadow-win98-inner' 
              : 'bg-[#c0c0c0] hover:bg-[#d0d0d0] shadow-win98-outer active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default GotchiPreviewCard;