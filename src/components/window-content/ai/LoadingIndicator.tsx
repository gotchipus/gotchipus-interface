import { memo } from "react";

export const LoadingIndicator = memo(() => (
  <div className="flex justify-start">
    <div className="max-w-[70%] border-2 border-[#808080] shadow-win98-outer rounded-md px-5 py-3 text-base bg-white text-[#222] flex items-center gap-2">
      <span
        className="w-2 h-2 bg-[#888] rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 bg-[#888] rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-2 h-2 bg-[#888] rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  </div>
));

LoadingIndicator.displayName = "LoadingIndicator"; 