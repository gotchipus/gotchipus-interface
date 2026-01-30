"use client"

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const questions = [
  { id: 1, label: "Swap 10 USDT to PHRS", question: "Swap 10 USDT to PHRS on Pharos" },
  { id: 2, label: "Bridge ETH to Pharos", question: "Bridge $10 of ETH from Ethereum to Pharos" },
  { id: 3, label: "Check my Gotchi", question: "Show me my Gotchipus NFTs" },
  { id: 4, label: "Pet my Gotchi", question: "Pet my Gotchipus to increase kinship" },
  { id: 5, label: "Summon new Gotchi", question: "Help me summon a new Gotchipus" },
]

export function QuickQuestions({ onQuestionClick }: QuickQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {questions.map((q) => (
        <button
          key={q.id}
          onClick={() => onQuestionClick(q.question)}
          className="inline-flex items-center px-2.5 py-1 bg-white border border-[#808080] hover:bg-[#e0e0e0] active:bg-[#d0d0d0] transition-all"
        >
          <span className="text-xs text-[#000080]">{q.label}</span>
        </button>
      ))}
    </div>
  )
}
