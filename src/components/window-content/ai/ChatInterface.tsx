import { memo, RefObject } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageItem } from "./MessageItem";
import { LoadingIndicator } from "./LoadingIndicator";
import { InputArea } from "./InputArea";
import { Message } from "./types";
import PoolInfoComponent from "./PoolInfoComponent";

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
}: ChatInterfaceProps) => {
  const visibleMessages = messages.filter((m) => m.role !== "system");

  return (
    <div className="h-full flex flex-col" ref={chatContainerRef}>
      <ChatHeader onBackClick={onBackClick} />
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex flex-col gap-6">
            {visibleMessages.map((msg) => (
              <>
                {msg.isCallTools && msg.agentIndex === 0 && msg.data && (
                  <PoolInfoComponent key={msg.id + '-pool'} data={msg.data} />
                )}
                {msg.content && msg.content.trim() && (
                  <MessageItem key={msg.id + '-text'} message={{ ...msg, isCallTools: false, agentIndex: undefined, data: undefined }} />
                )}
              </>
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