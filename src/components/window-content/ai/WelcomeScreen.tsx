import { memo } from "react";
import { InputArea } from "./InputArea";
import { QuickQuestions } from "./QuickQuestions";

interface WelcomeScreenProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  isDisabled: boolean;
  onQuestionClick: (question: string) => void;
}

export const WelcomeScreen = memo(({
  input,
  onInputChange,
  onKeyDown,
  onSendMessage,
  inputRef,
  isDisabled,
  onQuestionClick,
}: WelcomeScreenProps) => (
  <div className="h-full flex flex-col items-center justify-center pb-20">
    <div className="flex flex-col items-center mb-10">
      <div className="text-4xl font-bold text-[#222] flex items-center gap-3 select-none">
        <img src="/ai-pus.png" alt="next" className="w-10 h-10" />
        What can I help with?
      </div>
    </div>
    
    <div className="w-full max-w-2xl px-4">
      <InputArea
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        onSendMessage={onSendMessage}
        inputRef={inputRef}
        isDisabled={isDisabled}
        autoFocus={true}
      />
      <QuickQuestions onQuestionClick={onQuestionClick} />
    </div>
  </div>
));

WelcomeScreen.displayName = "WelcomeScreen"; 