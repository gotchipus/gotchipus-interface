"use client";

import React from "react";
import { motion } from "framer-motion";
import EnhancedGotchiSvg from "@/components/gotchiSvg/EnhancedGotchiSvg";
import { FLOAT_ANIMATION } from "../constants";

interface GotchiDisplayProps {
  wearableIndices: any;
  backgroundStyle: React.CSSProperties;
}

export const GotchiDisplay: React.FC<GotchiDisplayProps> = ({
  wearableIndices,
  backgroundStyle
}) => {
  return (
    <div
      className="border-2 border-[#808080] shadow-win98-outer rounded-sm p-8 bg-cover bg-center"
      style={{
        ...backgroundStyle,
        width: '400px',
        height: '400px',
        backgroundColor: backgroundStyle.backgroundImage ? 'transparent' : '#ffffff'
      }}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center"
        animate={FLOAT_ANIMATION}
      >
        <EnhancedGotchiSvg
          wearableIndices={wearableIndices}
          width={320}
          height={320}
        />
      </motion.div>
    </div>
  );
};
