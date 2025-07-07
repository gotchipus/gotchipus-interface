import { memo } from "react";
import { cn } from "@/lib/utils";
import { MessageContent } from "./MessageContent";
import { Message } from "./types";

interface MessageItemProps {
  message: Message;
}

export const MessageItem = memo(({ message }: MessageItemProps) => {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={cn(
          "border-2 border-[#808080] shadow-win98-outer rounded-md px-5 py-3 text-base bg-white",
          isUser ? "ml-auto" : "mr-auto w-full whitespace-pre-line"
        )}
      >
        <div className="whitespace-pre-wrap">
          {isUser ? (
            message.content
          ) : (
            <MessageContent message={message} />
          )}
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem"; 