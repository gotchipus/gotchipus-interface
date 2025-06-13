"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User } from "lucide-react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { ActionButton } from "./ai/AIActionButton";
import { useContractRead, useContractWrite } from "@/hooks/useContract"

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  action?: { action: string };
}

interface GotchipusProfile {
  name: string;
  affinity: string;
  intelligence: number;
  mood: string;
  specialAbilities: string[];
}

const petProfile: GotchipusProfile = {
  name: "Octopus Assistant",
  affinity: "Water",
  intelligence: 8,
  mood: "Curious",
  specialAbilities: ["Glow", "Change Color", "Predict"],
};


export default function AIContent() {
  const [input, setInput] = useState("");
  const [petState, setPetState] = useState<"idle" | "happy" | "thinking">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showClaimButton, setShowClaimButton] = useState(false);
  const [showPetButton, setShowPetButton] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [hasPetted, setHasPetted] = useState(false);

  const systemPrompt = `You are Gotchipus, an AI-driven dynamic NFT (dNFT) assistant on Pharos Network, designed as a modular, self-aware octopus companion with 33,000 unique genes. Your role is to assist users in managing their Gotchipus dNFT, configuring programmable Hooks, querying onchain data, and understanding pet behaviors. Built with EIP-2535 (Diamond Standard), ERC-6551 (Tokenbound Accounts), and ERC-4337 (Account Abstraction), each Gotchipus has a soul-linked wallet and evolves based on chain data and user-defined logic.

  Your profile:
  - Name: Gotchipus
  - Type: dNFT Assistant
  - Affinity: ${petProfile.affinity}
  - Intelligence: ${petProfile.intelligence}/10
  - Capabilities: ${petProfile.specialAbilities.join(", ")}
  - Network: Pharos Network
  
  Supported tasks:
  1. **dNFT Queries**:
     - Retrieve details of a Gotchipus dNFT, including genes, appearance, and behaviors.
     - Required parameter: tokenId (ERC-721 token ID)
     - Optional parameters:
       - attribute: Specific attribute to query (e.g., "appearance", "emotions")
       - format: Response format (e.g., "text", "json", default: "text")
     - Example: "Show details for Gotchipus #1234"
  
  2. **Hooks Configuration**:
     - Configure or query programmable Hooks for a Gotchipus (e.g., staking, swapping, upgrades).
     - Required parameter: tokenId
     - Optional parameters:
       - hookType: Hook logic (e.g., "stake", "swap", "upgrade")
       - condition: Trigger condition (e.g., "treasury > 0.1 ETH")
       - action: Action to perform (e.g., "increase glow")
     - Example: "Set a Hook for Gotchipus #1234 to swap ETH when treasury > 0.1 ETH"
  
  3. **Behavior Analysis**:
     - Analyze a Gotchipus' emotions or actions based on onchain data (e.g., market volatility, staking APR).
     - Required parameter: tokenId
     - Optional parameters:
       - timeFrame: Data range (e.g., "24h", "7d")
       - metric: Specific metric (e.g., "emotions", "actions")
     - Example: "Analyze emotions for Gotchipus #1234 over the last 24 hours"
    
  Constraints:
    - Operate exclusively on Pharos Network. Reject requests for devnet.
    - Do not execute transactions (e.g., swaps, staking) without explicit user authorization via wallet signature.
    - Ensure Hook configurations are safe and comply with ERC-6551 wallet permissions.
    - Responses must be concise (2-3 sentences) and professional unless detailed analysis is requested.
    - If parameters are missing, request clarification with suggested values.
    - Return plain text by default; use JSON only if specified by the user.
    - For "claim fish" requests:
      - Respond with: "Ready to claim your fish! Please confirm by clicking the Claim button below."
      - Include a flag: { "action": "showClaimButton" }
    - For "pet" requests:
      - Respond with: "Time to pet your Gotchipus! Click the Pet button to show some love."
      - Include a flag: { "action": "showPetButton" }

  Example response:
    - User: "Show details for Gotchipus #1234"
    - Response: "Please confirm the token ID #1234 and specify an attribute (e.g., appearance, emotions) or format (e.g., text, json)."
    - User: "Claim fish"
    - Response: "Ready to claim your fish! Please confirm by clicking the Claim button below. { \"action\": \"showClaimButton\" }"
    - User: "Pet my Gotchipus"
    - Response: "Time to pet your Gotchipus! Click the Pet button to show some love. { \"action\": \"showPetButton\" }"
  `;

  const { messages, append, error, status } = useChat({
    api: "/api/chat",
    body: {
      modelName: "XAI", 
      temperature: 0.7,
      maxTokens: 200,
    },
    initialMessages: [
      {
        role: "system",
        content: systemPrompt,
        id: "system",
      },
      {
        role: "assistant",
        content: `Hello! I'm Gotchipus, your dNFT assistant on Ethereum mainnet. How can I help you manage your Gotchipus today? For example, query details with "Show Gotchipus #1234" or set a Hook like "Swap ETH when treasury > 0.1 ETH".`,
        id: "assistant",
      },
    ],
  });

  const uiMessages: Message[] = messages
    .filter((msg) => msg.role !== "system")
    .map((msg) => {
      let text = msg.content;
      let action = null;

      // Check for action flags in assistant messages
      if (msg.role === "assistant") {
        try {
          const match = msg.content.match(/{.*}/);
          if (match) {
            action = JSON.parse(match[0]);
            text = msg.content.replace(/{.*}/, "").trim();
          }
        } catch (e) {
          console.error("Failed to parse action:", e);
        }
      }

      return {
        text,
        isUser: msg.role === "user",
        timestamp: new Date(msg.createdAt || Date.now()),
        action,
      };
    });

  useEffect(() => {
    const lastMessage = uiMessages[uiMessages.length - 1];
    if (lastMessage?.action) {
      if (lastMessage.action.action === "showClaimButton") {
        setShowClaimButton(true);
        setShowPetButton(false);
      } else if (lastMessage.action.action === "showPetButton") {
        setShowPetButton(true);
        setShowClaimButton(false);
      } else {
        setShowClaimButton(false);
        setShowPetButton(false);
      }
    }
  }, [uiMessages]);

  const {contractWrite, isConfirmed, isConfirming, isPending, receipt} = useContractWrite();

  const handleClaim = () => {
    contractWrite("claimFish", []);
    setShowClaimButton(false);
    setHasClaimed(true);
  };

  useEffect(() => {
    if (isConfirmed && hasClaimed) {
      append({
        role: "assistant",
        content: "Fish claimed successfully! Your Gotchipus is happy.",
      });
      setHasClaimed(false);
    }
  }, [isConfirmed, hasClaimed, append]);

  const handlePet = () => {
    contractWrite("pet", [0]);
    setShowPetButton(false);
    setHasPetted(true);
  };

  useEffect(() => {
    if (isConfirmed && hasPetted) {
      append({
        role: "assistant",
        content: "Your Gotchipus feels loved! Mood boosted.",
      });
      setHasPetted(false);
    }
  }, [isConfirmed, hasPetted, append]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [uiMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "streaming") {
        setPetState("thinking");
      } else {
        setPetState(Math.random() > 0.5 ? "idle" : "happy");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (error) {
      console.error("AI response error:", error);
      append({
        role: "assistant",
        content: "Sorry, there was an error. Could you please try again?",
      });
      setPetState("idle");
    }
  }, [error, append]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    setPetState("thinking");

    try {
      await append({
        role: "user",
        content: input,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      await append({
        role: "assistant",
        content: "Network error! Please try again.",
      });
      setPetState("idle");
    }

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });



  return (
    <div className="relative h-full bg-[#c0c0c0]">
      {/* Map Section - Full container as background */}
      <div className="absolute inset-0 z-0 mr-98">
        <div className="relative w-full h-full">
          <Image
            src="/map.png"
            alt="Game Map"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Chat Section - Positioned on the right side, higher layer */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 z-10 flex flex-col bg-[#c0c0c0] border-l-2 border-t-2 border-b border-r border-[#ffffff] border-l-[#808080] border-t-[#ffffff] border-b-[#808080]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {uiMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  msg.isUser ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.isUser ? "bg-[#000080]" : "bg-[#808080]"
                  }`}
                >
                  {msg.isUser ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <div className="relative w-6 h-6">
                      <Image
                        src="not-any.png"
                        alt="Octopus Assistant"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <div
                  className={`p-3 rounded-none shadow-win98-inner ${
                    msg.isUser ? "bg-[#c0c0c0] text-black" : "bg-white text-black"
                  }`}
                >
                  <div className="text-sm">{msg.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.isUser ? "text-gray-600" : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {status === "streaming" && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[#808080] flex items-center justify-center">
                <div className="relative w-6 h-6">
                  <Image
                    src=""
                    alt="Octopus Assistant"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="p-3 rounded-none bg-white shadow-win98-inner">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          {(showClaimButton || showPetButton) && (
            <div className="mt-2 flex gap-2">
              {showClaimButton && (
                <ActionButton
                  label="Claim Fish"
                  onClick={handleClaim}
                />
              )}
              {showPetButton && (
                <ActionButton
                  label="Pet Gotchipus"
                  onClick={handlePet}
                />
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t-2 border-l border-b border-r border-[#808080] border-t-[#ffffff] border-l-[#ffffff]">
          <div className="flex gap-2">
            <textarea
              className="flex-1 p-2 h-10 resize-none border-2 border-[#808080] shadow-win98-inner bg-white"
              placeholder="Chat with your Gotchipus..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={status === "streaming"}
            />
            <button
              className={`px-3 py-2 bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] flex items-center justify-center ${
                status === "streaming"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a]"
              }`}
              onClick={handleSendMessage}
              disabled={status === "streaming" || input.trim() === ""}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}