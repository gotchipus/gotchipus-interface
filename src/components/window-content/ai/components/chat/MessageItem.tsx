import { memo } from "react";
import { cn } from "@/lib/utils";
import { MessageContent } from "./MessageContent";
import { Message } from "../../types";

interface MessageItemProps {
  message: Message;
}

export const MessageItem = memo(({ message }: MessageItemProps) => {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={cn(
          "max-w-full",
          isUser 
            ? "ml-auto max-w-[80%]" 
            : "mr-auto w-full"
        )}
      >
        {isUser ? (
          <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-3">
            <div className="whitespace-pre-wrap leading-relaxed text-[#000000] font-medium">
              {message.content}
            </div>
          </div>
        ) : (
          <div className="border-2 border-[#808080] shadow-win98-outer bg-white rounded-sm">
            <div className="p-3 min-h-[24px]">
              <MessageContent message={message} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem"; 