"use client";

import Image, { ImageProps } from 'next/image';

interface SvgIconProps extends Omit<ImageProps, 'src'> {
  svgString: string | null | undefined;
}

const SvgIcon = ({ svgString, alt, ...props }: SvgIconProps) => {
  if (!svgString) {
    return null; 
  }

  const viewBox = "0 0 80 80"; 
  const completeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${svgString}</svg>`;
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(completeSvg)}`;

  return (
    <Image
      src={dataUri}
      alt={alt || "Wearable Icon"}
      {...props}
    />
  );
};

export default SvgIcon;