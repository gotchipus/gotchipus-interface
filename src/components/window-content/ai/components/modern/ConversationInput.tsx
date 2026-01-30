"use client"

import React from "react"
import { Send } from "lucide-react"

interface ConversationInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export function ConversationInput({
  value,
  onChange,
  onKeyDown,
  onSend,
  inputRef,
  isLoading,
  autoFocus = true
}: ConversationInputProps) {
  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSend();
    }
  };

  return (
    <div className="bg-[#c0c0c0]">
      <div className="w-full">
        <div className="relative border-2 border-[#808080] shadow-win98-inner bg-white overflow-hidden">
          <div className="relative flex items-start gap-2 p-2">
            <textarea
              ref={inputRef}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder="what can i do for you?"
              className="flex-1 bg-transparent text-[#000000] text-base resize-none outline-none h-[72px] placeholder:text-[#808080] leading-relaxed scrollbar-none"
              rows={3}
              disabled={isLoading}
              autoFocus={autoFocus}
            />

            <button
              onClick={handleSubmit}
              disabled={!value.trim() || isLoading}
              className="flex-shrink-0 p-2 bg-[#000080] text-white border-2 border-white border-r-[#000000] border-b-[#000000] hover:bg-[#0000a0] active:border-r-white active:border-b-white active:border-l-[#000000] active:border-t-[#000000] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
