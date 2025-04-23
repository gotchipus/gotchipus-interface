'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PharosGenesisPage from "./pharos/PharosGenesisPage";
import FramerPharos from "@/src/components/window-content/pharos/FramerPharos";
import { useContractRead } from "@/hooks/useContract";
import { observer } from "mobx-react-lite";

const MyPharosContent = observer(() => {
  const [viewState, setViewState] = useState<"list" | "hatching" | "genesis">("list");
  const [selectedPharo, setSelectedPharo] = useState<string | null>(null);
  const pharos = [{ id: "0" }];

  const floatAnimation = {
    y: [0, -3, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const handlePharoClick = (pharoId: string) => {
    setSelectedPharo(pharoId);
    setViewState("hatching");
    
    setTimeout(() => {
      setViewState("genesis");
    }, 3000);
  };

  return (
    <div className="p-4 h-full scrollbar-none">
      {viewState === "list" && (
        <div className="grid grid-cols-4 gap-4 scrollbar-none">
          {pharos.map((pharo) => (
            <div
              key={pharo.id}
              className="bg-white flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md"
              onClick={() => handlePharoClick(pharo.id)}
            >
              <motion.div
                className="w-48 h-48 relative flex items-center justify-center"
                animate={floatAnimation}
              >
                <Image src="/pharos.png" alt="Pharo" width={240} height={240} />
              </motion.div>
              <div className="text-center mt-2 text-sm">#{pharo.id}</div>
            </div>
          ))}
        </div>
      )}

      {viewState === "hatching" && selectedPharo && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative w-64 h-64">
            <FramerPharos 
              src="/pharos.png" 
              alt={`Pharo #${selectedPharo} hatching`}
              width={240}
              height={240}
              animationSpeed={1.5}
            />
          </div>
        </div>
      )}

      {viewState === "genesis" && (
        <PharosGenesisPage tokenId={selectedPharo as string} />
      )}
    </div>
  );
});

export default MyPharosContent;