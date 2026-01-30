import { memo, RefObject, useEffect, useRef } from "react";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import { ChatMessageWrapper } from "../modern/ChatMessageWrapper";
import { Message } from "../../types";

interface ChatInterfaceProps {
  messages: Message[];
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
  onRegenerate?: (messageId: string) => void;
}

export const ChatInterface = memo(({
  messages,
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
  onRegenerate,
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
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-3">
            {visibleMessages.map((msg) => (
              <ChatMessageWrapper
                key={msg.id}
                message={msg}
                onSummonSuccess={onSummonSuccess}
                onSummonDataReady={onSummonDataReady}
                onMintSuccess={onMintSuccess}
                onMintDataReady={onMintDataReady}
                onPetSuccess={onPetSuccess}
                onPetDataReady={onPetDataReady}
                onWearableSuccess={onWearableSuccess}
                onWearableDataReady={onWearableDataReady}
                onCallSuccess={onCallSuccess}
                onCallDataReady={onCallDataReady}
                onRegenerate={msg.role === "assistant" ? () => onRegenerate?.(msg.id) : undefined}
              />
            ))}
            {status === "streaming" && !visibleMessages.some(msg => msg.role === "assistant" && msg.content && msg.content.trim() !== "") && (
              <div className="flex justify-start">
                <LoadingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
});

ChatInterface.displayName = "ChatInterface"; 