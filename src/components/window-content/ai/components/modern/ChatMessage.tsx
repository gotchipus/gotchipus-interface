"use client"

import Image from "next/image"
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { MarkdownRenderer } from "../../markdown/MarkdownRenderer"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp?: string
  isStreaming?: boolean
  onRegenerate?: () => void
}

export function ChatMessage({ role, content, timestamp, isStreaming = false, onRegenerate }: ChatMessageProps) {
  const isUser = role === "user"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  if (!content || content.trim() === '') {
    return null
  }

  return (
    <div className={cn("flex gap-2.5 py-2.5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-[#d4d0c8] border-2 border-[#808080] flex items-center justify-center overflow-hidden">
            <Image
              src="/all-gotchi.png"
              alt="Gotchipus"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className={cn("flex flex-col max-w-[85%]", isUser ? "items-end" : "items-start")}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs font-bold text-[#000080]">
            {isUser ? "You" : "GOTCHIPUS"}
          </span>
          {timestamp && (
            <span className="text-xs text-[#808080]">{timestamp}</span>
          )}
        </div>

        <div
          className={cn(
            "border-2 border-[#808080] px-2.5 py-2 text-base leading-relaxed",
            isUser
              ? "bg-[#000080] text-white shadow-win98-inner"
              : "bg-[#d4d0c8] text-[#000000] shadow-win98-inner"
          )}
        >
          <MarkdownRenderer
            content={content}
            isStreaming={isStreaming}
          />
        </div>

        {!isUser && (
          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={handleCopy}
              className="p-1 text-[#000080] bg-[#c0c0c0] border-2 border-white border-r-[#808080] border-b-[#808080] hover:bg-[#d4d0c8] active:border-r-white active:border-b-white active:border-l-[#808080] active:border-t-[#808080]"
              title="Copy message"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button className="p-1 text-[#000080] bg-[#c0c0c0] border-2 border-white border-r-[#808080] border-b-[#808080] hover:bg-[#d4d0c8] active:border-r-white active:border-b-white active:border-l-[#808080] active:border-t-[#808080]">
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button className="p-1 text-[#000080] bg-[#c0c0c0] border-2 border-white border-r-[#808080] border-b-[#808080] hover:bg-[#d4d0c8] active:border-r-white active:border-b-white active:border-l-[#808080] active:border-t-[#808080]">
              <ThumbsDown className="w-3 h-3" />
            </button>
            <button
              onClick={onRegenerate}
              className="p-1 text-[#000080] bg-[#c0c0c0] border-2 border-white border-r-[#808080] border-b-[#808080] hover:bg-[#d4d0c8] active:border-r-white active:border-b-white active:border-l-[#808080] active:border-t-[#808080]"
              title="Regenerate response"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-[#d4d0c8] border-2 border-[#808080] flex items-center justify-center">
            <span className="text-xs font-bold text-[#000080]">U</span>
          </div>
        </div>
      )}
    </div>
  )
}
