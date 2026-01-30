import { memo } from "react";
import Image from "next/image";

export const LoadingIndicator = memo(() => (
  <div className="flex justify-start gap-2.5">
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
    <div className="flex flex-col max-w-[85%] items-start">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs font-bold text-[#000080]">GOTCHIPUS</span>
      </div>
      <div className="border-2 border-[#808080] px-2.5 py-2 text-base bg-[#d4d0c8] text-[#000000] shadow-win98-inner flex items-center gap-2">
        <span className="font-medium">Thinking</span>
        <span
          className="w-1.5 h-1.5 bg-[#000080] rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-[#000080] rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-[#000080] rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  </div>
));

LoadingIndicator.displayName = "LoadingIndicator"; 