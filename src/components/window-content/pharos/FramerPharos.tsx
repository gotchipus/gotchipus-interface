"use client"

import Image from "next/image";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface FramerPharosProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  autoPlay?: boolean; 
  animationSpeed?: number; 
}

const FramerPharos: React.FC<FramerPharosProps> = ({
  src,
  alt = "Hatching egg",
  width = 200,
  height = 200,
  className = "",
  autoPlay = true,
  animationSpeed = 1,
}) => {
  const controls = useAnimation();
  
  const playHatchingAnimation = async () => {
    await controls.start({
      rotate: [0, 10, -10, 15, -15, 0],
      scale: [1, 1.1, 1, 1.15, 1, 1.2, 0.9, 1.1, 1],
      y: [0, -5, 5, -10, 10, -5, 5, 0],
      transition: { 
        duration: 3.5 / animationSpeed,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop"
      }
    });
  };

  useEffect(() => {
    if (autoPlay) {
      playHatchingAnimation();
    }
    
    return () => {
      controls.stop();
    };
  }, [autoPlay, animationSpeed]); 

  const handleClick = () => {
    if (!autoPlay) {
      playHatchingAnimation();
    }
  };

  return (
    <motion.div
      animate={controls}
      className={`relative ${!autoPlay ? "cursor-pointer" : ""} ${className}`}
      style={{ width, height }}
      onClick={!autoPlay ? handleClick : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "contain" }}
        priority
      />
    </motion.div>
  );
};

export default FramerPharos;