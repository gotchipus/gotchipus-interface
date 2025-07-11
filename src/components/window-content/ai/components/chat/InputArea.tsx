import { memo } from "react";
import Image from "next/image";

interface InputAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  isDisabled: boolean;
  autoFocus?: boolean;
}

export const InputArea = memo(({
  value,
  onChange,
  onKeyDown,
  onSendMessage,
  inputRef,
  isDisabled,
  autoFocus = false,
}: InputAreaProps) => (
  <div className="w-full bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-outer p-2 flex flex-col items-center rounded-md">
    <div className="w-full bg-white border-2 border-[#808080] shadow-win98-inner rounded-sm">
      <textarea
        ref={inputRef}
        className="w-full bg-transparent text-lg text-[#222] placeholder:text-[#888] px-3 py-2 focus:outline-none min-h-[48px] max-h-40 resize-none"
        placeholder="Ask me anything..."
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={isDisabled}
        rows={1}
        autoFocus={autoFocus}
        style={{ overflowY: "auto" }}
      />
      <div className="flex w-full justify-between items-center gap-2 px-3 pb-2">
        <span className="text-xs text-[#222]">gotchi-1.0.1-beta</span>
        <button
          onClick={onSendMessage}
          disabled={isDisabled || value.trim() === ""}
          className="w-7 h-7 flex items-center justify-center text-gray-200"
        >
          <Image src="/icons/next.svg" alt="next" width={16} height={16} />
        </button>
      </div>
    </div>
  </div>
));

InputArea.displayName = "InputArea"; 