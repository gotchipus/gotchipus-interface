
import Image from "next/image"
import { X } from "lucide-react"

interface EquipSelectWindowProps {
  onClose: () => void
  onSelect: (equipment: { name: string; icon: string }) => void
}

export default function EquipSelectWindow({ onClose, onSelect }: EquipSelectWindowProps) {

  const availableEquipments = [
    { name: "Crown", icon: "/gotchi/e1.png" },
    { name: "Glasses", icon: "/gotchi/e2.png" },
    { name: "Hat", icon: "/gotchi/e3.png" },
    { name: "Sword", icon: "/gotchi/e4.png" },
    { name: "Shield", icon: "/gotchi/e5.png" },
    { name: "Wand", icon: "/gotchi/e1.png" },
    { name: "Book", icon: "/gotchi/e2.png" },
    { name: "Potion", icon: "/gotchi/e3.png" },
    { name: "Ring", icon: "/gotchi/e4.png" },
    { name: "Amulet", icon: "/gotchi/e5.png" },
    { name: "Cape", icon: "/gotchi/e1.png" },
    { name: "Boots", icon: "/gotchi/e2.png" },
  ];

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="w-[700px] h-[500px] border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8]">
        {/* Window Header */}
        <div className="bg-[#000080] px-2 py-1 flex items-center justify-between text-white">
          <span className="text-sm">Select Equipment</span>
          <button onClick={onClose} className="hover:bg-red-500 p-0.5">
            <X size={14} />
          </button>
        </div>

        {/* Equipment Grid */}
        <div className="p-4 grid grid-cols-4 gap-4">
          {availableEquipments.map((equip, index) => (
            <div
              key={index}
              onClick={() => onSelect(equip)}
              className="flex flex-col cursor-pointer transition-all duration-200 transform hover:scale-105"
            >
              <div className="h-24 border-2 border-[#808080] shadow-win98-outer bg-gradient-to-br from-white to-[#f5f5f5] rounded-t-sm flex items-center justify-center">
                <Image src={equip.icon} alt={equip.name} width={64} height={64} />
              </div>
              <div className="border-2 border-t-0 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-b-sm p-2">
                <div className="text-sm font-medium text-center">{equip.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}