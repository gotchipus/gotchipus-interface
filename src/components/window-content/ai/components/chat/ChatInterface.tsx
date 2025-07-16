import { memo, RefObject, useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageItem } from "./MessageItem";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import { AgentCallIndicator } from "../ui/AgentCallIndicator";
import { InputArea } from "./InputArea";
import { Message } from "../../types";
import PoolInfoComponent from "../defi/PoolInfoComponent";
import MintGotchiComponent from "../game/MintGotchiComponent";
import PetGotchiComponent from "../game/PetGotchiComponent";
import SummonComponent from "../game/SummonComponent";
import SummonSuccessComponent from "../game/SummonSuccessComponent";
import WearableComponent from "../game/WearableComponent";
import CallComponent from "../game/CallComponent";
import SwapComponent from "../defi/SwapComponent";
import AddLiquidityComponent from "../defi/AddLiquidityComponent";
import RemoveLiquidityComponent from "../defi/RemoveLiquidityComponent";

interface ChatInterfaceProps {
  messages: Message[];
  onBackClick: () => void;
  chatContainerRef: RefObject<HTMLDivElement>;
  messagesEndRef: RefObject<HTMLDivElement>;
  status: "idle" | "streaming";
  onSummonSuccess?: (tokenId: string, txHash: string, pusName: string, pusStory: string) => void;
  onSummonDataReady?: (messageId: string, summonData: { tokenId: string, txHash: string, pusName: string, pusStory: string }) => void;
  onMintDataReady?: (messageId: string, mintData: { txHash: string }) => void;
  onMintSuccess?: (txHash: string) => void;
  onPetSuccess?: (tokenId: string, txHash: string) => void;
  onPetDataReady?: (messageId: string, petData: { tokenId: string, txHash: string }) => void;
  onWearableSuccess?: (tokenId: string, txHash: string) => void;
  onWearableDataReady?: (messageId: string, wearableData: { tokenId: string, txHash: string }) => void;
  onCallSuccess?: (tokenId: string, txHash: string) => void;
  onCallDataReady?: (messageId: string, callData: { tokenId: string, txHash: string }) => void;
}

export const ChatInterface = memo(({
  messages,
  onBackClick,
  chatContainerRef,
  messagesEndRef,
  status,
  onSummonSuccess,
  onSummonDataReady,
  onMintDataReady,
  onPetDataReady,
  onMintSuccess,
  onPetSuccess,
  onWearableSuccess,
  onWearableDataReady,
  onCallSuccess,
  onCallDataReady,
}: ChatInterfaceProps) => {
  const visibleMessages = messages.filter((m) => m.role !== "system");
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    visibleMessages.forEach(msg => {
      if (msg.data?.mintSuccess && msg.content === "") {
        onMintDataReady?.(msg.id, msg.data.mintSuccess);
      }
      if (msg.data?.petSuccess && msg.content === "") {
        onPetDataReady?.(msg.id, msg.data.petSuccess);
      }
      if (msg.data?.summonSuccess && msg.content === "") {
        onSummonDataReady?.(msg.id, msg.data.summonSuccess);
      }
      if (msg.data?.wearableSuccess && msg.content === "") {
        onWearableDataReady?.(msg.id, msg.data.wearableSuccess);
      }
      if (msg.data?.callSuccess && msg.content === "") {
        onCallDataReady?.(msg.id, msg.data.callSuccess);
      }
    });
  }, [messages, onMintDataReady, onPetDataReady, onSummonDataReady, onWearableDataReady, onCallDataReady]);

  useEffect(() => {
    const hasStreamingMessage = visibleMessages.some(msg => msg.isStreaming);
    
    if (hasStreamingMessage) {
      scrollIntervalRef.current = setInterval(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [visibleMessages, messagesEndRef]);

  return (
    <div className="h-full flex flex-col" ref={chatContainerRef}>
      <ChatHeader onBackClick={onBackClick} />
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-6">
            {visibleMessages.map((msg) => (
              <div key={msg.id}>
                {msg.isCallTools && msg.agentIndex === 0 && (
                  <>
                    <AgentCallIndicator agentIndex={0} />
                    {msg.data && <PoolInfoComponent data={msg.data} />}
                  </>
                )}
                {msg.isCallTools && msg.agentIndex === 1 && (
                  <>
                    <AgentCallIndicator agentIndex={1} />
                    <MessageItem message={msg} />
                  </>
                )}
                {msg.isCallTools && msg.agentIndex === 2 && (
                  <>
                    <AgentCallIndicator agentIndex={2} />
                    {!msg.data?.petSuccess && (
                      <PetGotchiComponent 
                        onPetSuccess={onPetSuccess}
                      />
                    )}
                    {msg.data?.petSuccess && msg.content && (
                      <MessageItem message={msg} />
                    )}
                  </>
                )}
                {msg.isCallTools && msg.agentIndex === 3 && (
                  <>
                    <AgentCallIndicator agentIndex={3} />
                    {!msg.data?.mintSuccess && (
                      <MintGotchiComponent 
                        onMintSuccess={onMintSuccess}
                      />
                    )}
                    {msg.data?.mintSuccess && msg.content && (
                      <MessageItem message={msg} />
                    )}
                  </>
                )}
                {msg.isCallTools && msg.agentIndex === 4 && (
                  <>
                    <AgentCallIndicator agentIndex={4} />
                    {!msg.data?.summonSuccess && (
                      <SummonComponent onSummonSuccess={onSummonSuccess} />
                    )}
                    {msg.data?.summonSuccess && msg.content && (
                      <MessageItem message={msg} />
                    )}
                  </>
                )}
                {msg.data?.summonSuccess && (
                  <SummonSuccessComponent 
                    tokenId={msg.data.summonSuccess.tokenId}
                    txHash={msg.data.summonSuccess.txHash}
                    pusName={msg.data.summonSuccess.pusName}
                    pusStory={msg.data.summonSuccess.pusStory}
                    onDataReady={() => onSummonDataReady?.(msg.id, msg.data.summonSuccess)}
                  />
                )}
                {msg.isCallTools && msg.agentIndex === 5 && (
                  <>
                    <AgentCallIndicator agentIndex={5} />
                    {!msg.data?.wearableSuccess && (
                      <WearableComponent 
                        onEquipSuccess={onWearableSuccess}
                      />
                    )}
                    {msg.data?.wearableSuccess && msg.content && (
                      <MessageItem message={msg} />
                    )}
                  </>
                )}
                {msg.isCallTools && msg.agentIndex === 6 && (
                  <>
                    <AgentCallIndicator agentIndex={6} />
                    {!msg.data?.callSuccess && (
                      <CallComponent 
                        onCallSuccess={onCallSuccess}
                      />
                    )}
                    {msg.data?.callSuccess && msg.content && (
                      <MessageItem message={msg} />
                    )}
                  </>
                )}
                {msg.isCallTools && msg.agentIndex === 7 && (
                  <>
                    <AgentCallIndicator agentIndex={7} />
                    <SwapComponent />
                  </>
                )}
                {msg.isCallTools && msg.agentIndex === 8 && (
                  <>
                    <AgentCallIndicator agentIndex={8} />
                    <AddLiquidityComponent />
                  </>
                )}
                {msg.isCallTools && msg.agentIndex === 9 && (
                  <>
                    <AgentCallIndicator agentIndex={9} />
                    <RemoveLiquidityComponent />
                  </>
                )}
                {msg.content && msg.content.trim() && !msg.isCallTools && (
                  <MessageItem message={msg} />
                )}
              </div>
            ))}
            {status === "streaming" && !visibleMessages.some(msg => msg.isLoading) && (
              <LoadingIndicator />
            )}
            <div ref={messagesEndRef} className="pb-32" />
          </div>
        </div>
      </div>
    </div>
  );
});

ChatInterface.displayName = "ChatInterface"; 