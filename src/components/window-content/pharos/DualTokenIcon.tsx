'use client'

import Image from "next/image";
import React from "react";
import * as tokenImages from "../../../../assets/tokens";

interface DualTokenIconProps {
  token1: string;
  token2: string;
  size?: number;
  className?: string;
}

const DualTokenIcon: React.FC<DualTokenIconProps> = ({ token1, token2, size = 20, className = "" }) => {

  type TokenImageKey = keyof typeof tokenImages;
  
  const getTokenImage = (token: string) => {
    const tokenKey = token.toLowerCase() as TokenImageKey;
    if (tokenImages[tokenKey]) {
      return tokenImages[tokenKey];
    }
    return `/assets/tokens/${token.toLowerCase()}.png`;
  };
  
  const token1Image = getTokenImage(token1);
  const token2Image = getTokenImage(token2);

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden"
      }}
    >
      <div
        className="absolute top-0 left-0 h-full"
        style={{
          width: "50%",
          overflow: "hidden",
          borderTopLeftRadius: size,
          borderBottomLeftRadius: size
        }}
      >
        <div style={{ width: size, height: size, position: "relative" }}>
          <Image
            src={token1Image}
            alt={token1}
            width={size}
            height={size}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <div
        className="absolute top-0 right-0 h-full"
        style={{
          width: "50%",
          overflow: "hidden",
          borderTopRightRadius: size,
          borderBottomRightRadius: size
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            position: "relative",
            right: size / 2
          }}
        >
          <Image
            src={token2Image}
            alt={token2}
            width={size}
            height={size}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <div
        className="absolute top-0 left-0 w-full h-full border border-[#808080] rounded-full"
      />
    </div>
  );
};

export default DualTokenIcon;