"use client"

import { useState } from "react"
import { PenLine, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  onNewChat: () => void;
  chatHistory?: Array<{ id: string; title: string; timestamp: Date }>;
  onSelectChat?: (chatId: string) => void;
  currentChatId?: string;
}

export function ChatSidebar({
  onNewChat,
  chatHistory = [],
  onSelectChat,
  currentChatId
}: ChatSidebarProps) {
  const [activeChat, setActiveChat] = useState<string | undefined>(currentChatId);

  const handleChatClick = (chatId: string) => {
    setActiveChat(chatId);
    onSelectChat?.(chatId);
  };

  const handleNewChat = () => {
    setActiveChat(undefined);
    onNewChat();
  };

  return (
    <aside className="flex flex-col h-full w-[240px] border-r-2 border-[#808080] bg-[#c0c0c0]">
      <div className="flex items-center py-4 px-4">
        <span className="font-semibold whitespace-nowrap text-[#000080]">GOTCHIPUS</span>
      </div>

      <div className="mb-4 px-3">
        <button
          onClick={handleNewChat}
          className="flex items-center justify-between w-full text-sm border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] transition-colors bg-[#d4d0c8] text-[#000080] px-3 py-2.5"
        >
          <div className="flex items-center gap-2">
            <PenLine className="w-4 h-4" />
            <span>New Chat</span>
          </div>
          <span className="text-xs text-[#808080]">Cmd K</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <p className="text-xs mb-2 px-2 text-[#808080]">Recent</p>
        <div className="space-y-1">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 text-sm transition-colors group border border-transparent",
                activeChat === chat.id
                  ? "bg-white border-[#000080] text-[#000080]"
                  : "text-[#000080] hover:bg-[#d4d0c8]"
              )}
            >
              <span className="truncate">{chat.title}</span>
              {activeChat === chat.id && (
                <MoreHorizontal className="w-4 h-4 text-[#808080] opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
