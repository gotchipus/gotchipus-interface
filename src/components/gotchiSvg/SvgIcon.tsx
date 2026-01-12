"use client";

import Image, { ImageProps } from 'next/image';

interface SvgIconProps extends Omit<ImageProps, 'src'> {
  svgString?: string | null | undefined;
  imagePath?: string | null | undefined;
}

const SvgIcon = ({ svgString, imagePath, alt, ...props }: SvgIconProps) => {
  if (imagePath) {
    // Use original path - Next.js Image component and browsers will handle URL encoding automatically
    // The middleware will handle any URL-encoded direct access requests
    return (
      <Image
        src={imagePath}
        alt={alt || "Wearable Icon"}
        unoptimized={true}
        {...props}
      />
    );
  }

  if (svgString) {
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
  }

  return null;
};

export default SvgIcon;