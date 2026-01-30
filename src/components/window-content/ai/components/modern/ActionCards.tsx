"use client"

import { FileText, Coins, Users, Code2, ChevronRight } from "lucide-react"

const actions = [
  {
    id: 1,
    icon: FileText,
    label: "Write a copy",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-700",
    question: "Help me write compelling copy for my project",
  },
  {
    id: 2,
    icon: Coins,
    label: "Token swap",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-700",
    question: "I want to swap tokens",
  },
  {
    id: 3,
    icon: Users,
    label: "Check my Gotchi",
    bgColor: "bg-green-100",
    iconColor: "text-green-700",
    question: "Show me my Gotchipus NFTs",
  },
  {
    id: 4,
    icon: Code2,
    label: "Write Hooks",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-700",
    question: "Help me write some code",
  },
]

interface ActionCardsProps {
  onQuestionClick: (question: string) => void;
  userName?: string;
}

export function ActionCards({ onQuestionClick, userName = "GOTCHI" }: ActionCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onQuestionClick(action.question)}
          className="flex items-center justify-between px-2 py-1.5 bg-[#c0c0c0] border-2 border-white border-r-[#808080] border-b-[#808080] shadow-win98-outer hover:bg-[#d4d0c8] active:border-r-white active:border-b-white active:border-l-[#808080] active:border-t-[#808080] transition-all group"
        >
          <div className="flex items-center gap-2">
            <div className={`p-1.5 ${action.bgColor}`}>
              <action.icon className={`w-4 h-4 ${action.iconColor}`} />
            </div>
            <span className="text-sm font-bold text-[#000080]">{action.label}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#808080] group-hover:text-[#000080] transition-colors" />
        </button>
      ))}
    </div>
  )
}
