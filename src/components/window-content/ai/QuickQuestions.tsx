import { memo } from "react";
import Image from "next/image";

const QUICK_QUESTIONS = [
  "What is Gotchipus?",
  "What is Pharos?",
  "I want send PHRS to my wallet",
  "I want Pet my Gotchi",
];

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export const QuickQuestions = memo(({ onQuestionClick }: QuickQuestionsProps) => (
  <div className="flex gap-3 mt-4 flex-wrap justify-center">
    {QUICK_QUESTIONS.map((question, index) => (
      <button
        key={index}
        onClick={() => onQuestionClick(question)}
        className="flex items-center gap-2 px-5 py-2 bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-win98-outer rounded-sm text-[#222] text-base font-medium hover:bg-[#d0d0d0] active:shadow-win98-inner transition-colors"
      >
        <Image src="/icons/pharos-proof.png" alt="icon" width={16} height={16} />
        {question}
      </button>
    ))}
  </div>
));

QuickQuestions.displayName = "QuickQuestions"; 