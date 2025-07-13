import { memo, RefObject } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageItem } from "./MessageItem";
import { LoadingIndicator } from "../ui/LoadingIndicator";
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
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;
  onBackClick: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  chatContainerRef: RefObject<HTMLDivElement>;
  messagesEndRef: RefObject<HTMLDivElement>;
  isDisabled: boolean;
  status: "idle" | "streaming";
  onSummonSuccess?: (tokenId: string, txHash: string, pusName: string, pusStory: string) => void;
  onSummonDataReady?: (messageId: string, summonData: { tokenId: string, txHash: string, pusName: string, pusStory: string }) => void;
}

export const ChatInterface = memo(({
  messages,
  input,
  onInputChange,
  onKeyDown,
  onSendMessage,
  onBackClick,
  inputRef,
  chatContainerRef,
  messagesEndRef,
  isDisabled,
  status,
  onSummonSuccess,
  onSummonDataReady,
}: ChatInterfaceProps) => {
  const visibleMessages = messages.filter((m) => m.role !== "system");

  return (
    <div className="h-full flex flex-col" ref={chatContainerRef}>
      <ChatHeader onBackClick={onBackClick} />
      
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex flex-col gap-6">
            {visibleMessages.map((msg) => (
              <div key={msg.id}>
                {msg.isCallTools && msg.agentIndex === 0 && msg.data && (
                  <PoolInfoComponent data={msg.data} />
                )}
                {msg.isCallTools && msg.agentIndex === 1 && (
                  <MessageItem message={msg} />
                )}
                {msg.isCallTools && msg.agentIndex === 2 && (
                  <PetGotchiComponent />
                )}
                {msg.isCallTools && msg.agentIndex === 3 && (
                  <MintGotchiComponent />
                )}
                {msg.isCallTools && msg.agentIndex === 4 && (
                  <SummonComponent onSummonSuccess={onSummonSuccess} />
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
                  <WearableComponent />
                )}
                {msg.isCallTools && msg.agentIndex === 6 && (
                  <CallComponent />
                )}
                {msg.isCallTools && msg.agentIndex === 7 && (
                  <SwapComponent />
                )}
                {msg.isCallTools && msg.agentIndex === 8 && (
                  <AddLiquidityComponent />
                )}
                {msg.isCallTools && msg.agentIndex === 9 && (
                  <RemoveLiquidityComponent />
                )}
                {msg.content && msg.content.trim() && !msg.isCallTools && (
                  <MessageItem message={msg} />
                )}
              </div>
            ))}
            {status === "streaming" && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <footer className="py-4 px-4">
        <div className="max-w-2xl mx-auto">
          <InputArea
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            onSendMessage={onSendMessage}
            inputRef={inputRef}
            isDisabled={isDisabled}
          />
        </div>
      </footer>
    </div>
  );
});

ChatInterface.displayName = "ChatInterface"; 