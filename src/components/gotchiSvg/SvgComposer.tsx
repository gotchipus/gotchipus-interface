"use client";

import Image from "next/image";
import { SvgLayer } from '@/hooks/useSvgLayers';

interface SvgComposerProps {
  layers: SvgLayer[];
  width?: number;
  height?: number;
}

export const SvgComposer = ({ layers, width = 180, height = 180 }: SvgComposerProps) => {
  const viewBox = "0 0 80 80"; 

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {layers.length > 0 ? (
        <svg
          width="100%"
          height="100%"
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
        >
          {layers.map((layer) => (
            <g
              key={layer.zIndex}
              className={`gotchi-${layer.svgName}`}
              dangerouslySetInnerHTML={{ __html: layer.svgString }}
            />
          ))}
        </svg>
      ) : (
        <Image src="/not-any.png" alt="No NFTs" width={120} height={120} />
      )}
    </div>
  );
};