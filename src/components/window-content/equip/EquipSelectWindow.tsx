import { X } from "lucide-react"

interface EquipSelectWindowProps {
  onClose: () => void
  equipments: {
    name: string
    icon: string
  }[]
  onSelect: (equipment: { name: string; icon: string }) => void
}

export default function EquipSelectWindow({ onClose, equipments, onSelect }: EquipSelectWindowProps) {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="w-[700px] h-[500px] border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8]">
        {/* Window Header */}
        <div className="bg-[#000080] px-2 py-1 flex items-center justify-between text-white">
          <span className="text-sm">Select Equipment</span>
          <button onClick={onClose} className="hover:bg-red-500 p-0.5">
            <X size={14} />
          </button>
        </div>

        {/* Equipment Grid */}
        <div className="p-4 grid grid-cols-4 gap-4">
          {equipments.map((equip, index) => (
            <div
              key={index}
              onClick={() => onSelect(equip)}
              className="flex flex-col cursor-pointer transition-all duration-200 transform hover:scale-105"
            >
              <div className="h-24 border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-gradient-to-br from-white to-[#f5f5f5] rounded-t-sm flex items-center justify-center">
                <span className="text-4xl">{equip.icon}</span>
              </div>
              <div className="border-2 border-t-0 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#d4d0c8] rounded-b-sm p-2">
                <div className="text-sm font-medium text-center">{equip.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}