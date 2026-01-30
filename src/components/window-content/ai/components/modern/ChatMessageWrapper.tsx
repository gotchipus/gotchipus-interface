import React from "react";
import { Message } from "../../types/types";
import { ChatMessage } from "./ChatMessage";
import { AgentCallIndicator } from "../ui/AgentCallIndicator";
import PoolInfoComponent from "../defi/PoolInfoComponent";
import PetGotchiComponent from "../game/PetGotchiComponent";
import MintGotchiComponent from "../game/MintGotchiComponent";
import SummonComponent from "../game/SummonComponent";
import WearableComponent from "../game/WearableComponent";
import CallComponent from "../game/CallComponent";
import SwapComponent from "../defi/SwapComponent";
import AddLiquidityComponent from "../defi/AddLiquidityComponent";
import RemoveLiquidityComponent from "../defi/RemoveLiquidityComponent";

interface ChatMessageWrapperProps {
  message: Message;
  onSummonSuccess?: (tokenId: string, txHash: string, pusName: string, pusStory: string) => void;
  onSummonDataReady?: (messageId: string, summonData: any) => void;
  onMintSuccess?: (txHash: string) => void;
  onMintDataReady?: (messageId: string, mintData: any) => void;
  onPetSuccess?: (tokenId: string, txHash: string) => void;
  onPetDataReady?: (messageId: string, petData: any) => void;
  onWearableSuccess?: (tokenId: string, txHash: string) => void;
  onWearableDataReady?: (messageId: string, wearableData: any) => void;
  onCallSuccess?: (tokenId: string, txHash: string) => void;
  onCallDataReady?: (messageId: string, callData: any) => void;
  onRegenerate?: () => void;
}

export const ChatMessageWrapper: React.FC<ChatMessageWrapperProps> = ({
  message,
  onSummonSuccess,
  onSummonDataReady,
  onMintSuccess,
  onMintDataReady,
  onPetSuccess,
  onPetDataReady,
  onWearableSuccess,
  onWearableDataReady,
  onCallSuccess,
  onCallDataReady,
  onRegenerate,
}) => {
  if (!message.isCallTools && message.content && message.role !== "system") {
    return (
      <ChatMessage
        role={message.role}
        content={message.content}
        timestamp={message.createdAt?.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })}
        onRegenerate={message.role === "assistant" ? onRegenerate : undefined}
      />
    );
  }

  if (message.isCallTools) {
    switch (message.agentIndex) {
      case 0:
        return (
          <>
            <AgentCallIndicator agentIndex={0} />
            {message.data && <PoolInfoComponent data={message.data} />}
          </>
        );

      case 1:
        return (
          <>
            <AgentCallIndicator agentIndex={1} />
            <ChatMessage
              role="assistant"
              content={message.content}
              timestamp={message.createdAt?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
              onRegenerate={onRegenerate}
            />
          </>
        );

      case 2:
        return (
          <>
            <AgentCallIndicator agentIndex={2} />
            {!message.data?.petSuccess && (
              <PetGotchiComponent onPetSuccess={onPetSuccess} />
            )}
            {message.data?.petSuccess && message.content && (
              <ChatMessage role="assistant" content={message.content} onRegenerate={onRegenerate} />
            )}
          </>
        );

      case 3:
        return (
          <>
            <AgentCallIndicator agentIndex={3} />
            {!message.data?.mintSuccess && (
              <MintGotchiComponent onMintSuccess={onMintSuccess} />
            )}
            {message.data?.mintSuccess && message.content && (
              <ChatMessage role="assistant" content={message.content} onRegenerate={onRegenerate} />
            )}
          </>
        );

      case 4:
        return (
          <>
            <AgentCallIndicator agentIndex={4} />
            {!message.data?.summonSuccess && (
              <SummonComponent onSummonSuccess={onSummonSuccess} />
            )}
            {message.data?.summonSuccess && message.content && (
              <ChatMessage role="assistant" content={message.content} onRegenerate={onRegenerate} />
            )}
          </>
        );

      case 5:
        return (
          <>
            <AgentCallIndicator agentIndex={5} />
            {!message.data?.wearableSuccess && (
              <WearableComponent onEquipSuccess={onWearableSuccess} />
            )}
            {message.data?.wearableSuccess && message.content && (
              <ChatMessage role="assistant" content={message.content} onRegenerate={onRegenerate} />
            )}
          </>
        );

      case 6:
        return (
          <>
            <AgentCallIndicator agentIndex={6} />
            {!message.data?.callSuccess && (
              <CallComponent onCallSuccess={onCallSuccess} />
            )}
            {message.data?.callSuccess && message.content && (
              <ChatMessage role="assistant" content={message.content} onRegenerate={onRegenerate} />
            )}
          </>
        );

      case 7:
        return (
          <>
            <AgentCallIndicator agentIndex={7} />
            <SwapComponent />
          </>
        );

      case 8:
        return (
          <>
            <AgentCallIndicator agentIndex={8} />
            <AddLiquidityComponent />
          </>
        );

      case 9:
        return (
          <>
            <AgentCallIndicator agentIndex={9} />
            <RemoveLiquidityComponent />
          </>
        );

      default:
        return message.content ? (
          <ChatMessage role="assistant" content={message.content} onRegenerate={onRegenerate} />
        ) : null;
    }
  }

  return null;
};
