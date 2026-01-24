import { memo, useState, useEffect } from "react";
import Image from "next/image";

interface AgentInfo {
  name: string;
  image: string;
  description: string;
}

const AGENT_CONFIG: Record<number, AgentInfo> = {
  0: {
    name: "Pool Analyzer",
    image: "/all-gotchi.png",
    description: "Analyzing pool data"
  },
  1: {
    name: "General Assistant",
    image: "/all-gotchi.png", 
    description: "Processing your request"
  },
  2: {
    name: "Pet Agent",
    image: "/all-gotchi.png",
    description: "Pet your Gotchi"
  },
  3: {
    name: "Mint Agent", 
    image: "/all-gotchi.png",
    description: "Mint Pharos NFT"
  },
  4: {
    name: "Summon Agent",
    image: "/all-gotchi.png", 
    description: "Summon new Gotchipus"
  },
  5: {
    name: "Wearable Agent",
    image: "/all-gotchi.png",
    description: "Managing wearables"
  },
  6: {
    name: "Call Agent",
    image: "/all-gotchi.png",
    description: "Making contract calls"
  },
  7: {
    name: "Swap Agent",
    image: "/all-gotchi.png",
    description: "Token swapping"
  },
  8: {
    name: "Liquidity Agent",
    image: "/all-gotchi.png",
    description: "Adding liquidity"
  },
  9: {
    name: "Liquidity Agent", 
    image: "/all-gotchi.png",
    description: "Removing liquidity"
  }
};

interface AgentCallIndicatorProps {
  agentIndex: number;
}

export const AgentCallIndicator = memo(({ agentIndex }: AgentCallIndicatorProps) => {
  const agent = AGENT_CONFIG[agentIndex] || AGENT_CONFIG[1]; // fallback to general
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-start mb-4">
      <div 
        className={`w-full border-2 border-[#808080] shadow-win98-outer rounded-md px-4 py-3 text-base bg-white text-[#222] transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-8'
        }`}
      >
        <div className="flex items-center gap-3">
          <div 
            className={`w-8 h-8 relative rounded-full overflow-hidden border border-[#ccc] bg-[#f0f0f0] flex items-center justify-center transition-all duration-700 ease-out ${
              isVisible 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 -translate-x-4 scale-75'
            }`}
          >
            <Image
              src={agent.image}
              alt={agent.name}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <div 
            className={`transition-all duration-600 ease-out delay-150 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-6'
            }`}
          >
            <div className="text-sm font-semibold text-[#000080]">{agent.name}</div>
            <div className="text-xs text-[#666]">{agent.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

AgentCallIndicator.displayName = "AgentCallIndicator";