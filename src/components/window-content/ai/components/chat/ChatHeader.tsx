import { memo } from "react";
import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  onBackClick: () => void;
}

export const ChatHeader = memo(({ onBackClick }: ChatHeaderProps) => (
  <header className="py-3 px-4">
    <div className="max-w-2xl mx-auto flex items-center justify-between border-b-2 border-[#808080] border-opacity-50 pb-3">
      <div className="text-xl font-bold text-[#222] flex items-center gap-2 select-none">
        Gotchi-1.0.1-beta
      </div>
      <button
        onClick={onBackClick}
        className="flex items-center gap-1 px-3 py-1 bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-win98-outer rounded-sm text-[#222] text-sm hover:bg-[#d0d0d0] active:shadow-win98-inner transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  </header>
));

ChatHeader.displayName = "ChatHeader"; 