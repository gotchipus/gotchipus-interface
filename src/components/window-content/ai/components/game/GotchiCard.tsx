"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSvgLayers } from "@/hooks/useSvgLayers";
import { SvgComposer } from "@/components/gotchiSvg/SvgComposer";

interface GotchiCardProps {
  name: string;
  id?: string;
  className?: string;
  buttonName?: string;
  buttonAction?: () => void;
}

const GotchiCard = ({
  name,
  id,
  className,
  buttonName,
  buttonAction,
}: GotchiCardProps) => {
  const { layers, backgroundSvg, isLoading } = useSvgLayers(id || "");
  
  const viewBox = "0 0 80 80"; 
  const completeBackgroundSvg = backgroundSvg 
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${backgroundSvg}</svg>`
    : null;
  
  const backgroundStyle = completeBackgroundSvg
    ? { backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(completeBackgroundSvg)}")` } 
    : {};

  return (
    <Card className={cn("overflow-hidden rounded-md border-2 border-[#dfdfdf] bg-[#e0e0e0] shadow-[inset_-2px_-2px_#a0a0a0,inset_2px_2px_#fff]", className)}>
      <div className="overflow-hidden rounded-md bg-[#d4d0c8] flex items-center justify-center" style={id ? backgroundStyle : {}}>
        {id ? (
          <div className="relative flex items-center justify-center w-48 h-48">
            {isLoading ? (
              <div className="text-sm">Loading...</div>
            ) : (
              <SvgComposer layers={layers} />
            )}
          </div>
        ) : (
          <Image
            src="/not-any.png"
            alt={name}
            className="w-full object-cover transition-transform duration-300 hover:scale-105"
            width={192}
            height={192}
          />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 text-sm font-bold text-[#000080]">{name}</h3>
        {buttonName && (
          <button
            onClick={buttonAction}
            className="w-full rounded-sm py-2 font-bold text-sm border-2 border-[#b0b0b0] bg-[#c0c0c0] text-black hover:bg-[#d0d0d0] shadow-win98-outer active:shadow-win98-inner transition-all duration-75"
          >
            {buttonName}
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default GotchiCard;